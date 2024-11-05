import * as admin from 'firebase-admin';
import { Injectable, OnModuleInit } from '@nestjs/common';

type NotificationType =
  | 'chat'
  | 'group_chat'
  | 'friend_request'
  | 'friend_accept';

interface BaseNotification {
  type: NotificationType;
  senderId: number;
  receiverId: number;
  status: 'read' | 'unread';
  timestamp?: any;
  content: string;
}

interface ChatNotification extends BaseNotification {
  type: 'chat';
  chatId: number;
  message: string;
}

interface GroupChatNotification extends BaseNotification {
  type: 'group_chat';
  chatId: number;
  groupId: number;
  groupName: string;
  message: string;
}

interface FriendRequestNotification extends BaseNotification {
  type: 'friend_request';
  requestId: number;
}

interface FriendAcceptNotification extends BaseNotification {
  type: 'friend_accept';
  friendshipId: number;
}

type NotificationData =
  | ChatNotification
  | GroupChatNotification
  | FriendRequestNotification
  | FriendAcceptNotification;

@Injectable()
export class FirebaseService implements OnModuleInit {
  private db: admin.database.Database;

  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProviderX509CertUrl:
          process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
      } as admin.ServiceAccount),
      databaseURL: process.env.FIREBASE_REALTIME_DB_URL,
    });
    this.db = admin.database();
  }

  async addNotification(notificationData: NotificationData) {
    const notificationId = `notif_${Date.now()}`;
    return this.db
      .ref(`notifications/${notificationData.receiverId}/${notificationId}`)
      .set({
        ...notificationData,
        timestamp: admin.database.ServerValue.TIMESTAMP,
      });
  }

  async addChatNotification(
    senderId: number,
    receiverId: number,
    chatId: number,
    message: string,
  ) {
    const notification: ChatNotification = {
      type: 'chat',
      senderId,
      receiverId,
      chatId,
      message,
      content: message,
      status: 'unread',
    };

    return this.addNotification(notification);
  }

  async addGroupChatNotification(
    senderId: number,
    receiverId: number,
    chatId: number,
    groupId: number,
    groupName: string,
    message: string,
  ) {
    const notification: GroupChatNotification = {
      type: 'group_chat',
      senderId,
      receiverId,
      chatId,
      groupId,
      groupName,
      message,
      content: `New message in ${groupName}`,
      status: 'unread',
    };

    return this.addNotification(notification);
  }

  async addFriendRequestNotification(
    senderId: number,
    receiverId: number,
    requestId: number,
    senderName: string,
  ) {
    const notification: FriendRequestNotification = {
      type: 'friend_request',
      senderId,
      receiverId,
      requestId,
      content: `${senderName} sent you a friend request`,
      status: 'unread',
    };

    return this.addNotification(notification);
  }

  async addFriendAcceptNotification(
    senderId: number,
    receiverId: number,
    friendshipId: number,
    senderName: string,
  ) {
    const notification: FriendAcceptNotification = {
      type: 'friend_accept',
      senderId,
      receiverId,
      friendshipId,
      content: `${senderName} accepted your friend request`,
      status: 'unread',
    };

    return this.addNotification(notification);
  }

  async sendBrowserNotification(
    token: string,
    title: string,
    body: string,
    data: Record<string, any> = {},
  ) {
    const stringifiedData = Object.keys(data).reduce(
      (acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      },
      {} as Record<string, string>,
    );

    const message = {
      notification: {
        title,
        body,
      },
      data: stringifiedData,
      token,
      webpush: {
        notification: {
          icon: '/notification-icon.png',
          badge: '/badge-icon.png',
          vibrate: [100, 50, 100],
          requireInteraction: true,
          actions: [
            {
              action: 'view',
              title: 'View',
            },
          ],
        },
        fcmOptions: {
          link: data.clickAction ? data.clickAction : '/',
        },
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      if (
        error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered'
      ) {
        const userId = data.userId ? parseInt(data.userId) : null;
        if (userId) {
          await this.removeFcmToken(userId);
        }
      }
      throw error;
    }
  }

  async saveFcmToken(userId: number, token: string) {
    const userRef = this.db.ref(`users/${userId}`);
    await userRef.child('fcmToken').set(token);
  }

  async getFcmToken(userId: number): Promise<string | null> {
    const userRef = this.db.ref(`users/${userId}`);
    const snapshot = await userRef.child('fcmToken').once('value');
    return snapshot.val();
  }

  private async removeFcmToken(userId: number) {
    try {
      const userRef = this.db.ref(`users/${userId}`);
      await userRef.child('fcmToken').remove();
    } catch (error) {
      console.error('Error removing FCM token:', error);
    }
  }

  async markNotificationAsRead(userId: number, notificationId: string) {
    return this.db
      .ref(`notifications/${userId}/${notificationId}/status`)
      .set('read');
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    const snapshot = await this.db
      .ref(`notifications/${userId}`)
      .orderByChild('status')
      .equalTo('unread')
      .once('value');

    return snapshot.numChildren();
  }

  async deleteNotification(userId: number, notificationId: string) {
    return this.db.ref(`notifications/${userId}/${notificationId}`).remove();
  }

  async deleteAllNotifications(userId: number) {
    return this.db.ref(`notifications/${userId}`).remove();
  }

  async getOrCreateFirebaseUid(userId: number): Promise<string> {
    try {
      const userRef = this.db.ref(`users/${userId}`);
      const snapshot = await userRef.child('firebaseUid').once('value');
      const existingUid = snapshot.val();
      if (existingUid) {
        return existingUid;
      }
      const newUid = `user_${userId}`;
      await userRef.child('firebaseUid').set(newUid);
      return newUid;
    } catch (error) {
      console.error('Error getting or creating Firebase UID:', error);
      throw error;
    }
  }
}
