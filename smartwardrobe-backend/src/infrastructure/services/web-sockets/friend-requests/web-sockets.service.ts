import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts';
import { FriendRequestsEntity } from 'src/core/entities/friend-request/friend-requests.entity';
import { WebSocketGatewayService } from './websocket.gateway.service';

@Injectable()
export class WebSocketService implements OnModuleInit {
  private lastChecked = new Date();
  private readonly logger = new Logger(WebSocketService.name);

  constructor(
    private readonly dataService: IDataServices,
    private readonly websocketGateway: WebSocketGatewayService,
  ) {}

  onModuleInit() {
    // this.startPollingForChanges();
  }

  /**
   * Starts polling the database for changes every 20 seconds.
   */
  private startPollingForChanges(): void {
    setInterval(async () => {
      try {
        const newRequests =
          await this.dataService.friendRequests.pollForChanges(
            this.lastChecked,
            'createdAt',
          );

        const updatedRequests =
          await this.dataService.friendRequests.pollForChanges(
            this.lastChecked,
            'updatedAt',
          );

        if (newRequests.length > 0) {
          this.logger.debug('New friend requests detected:', newRequests);
          this.notifyReceiverOfNewRequests(newRequests);
        }

        if (updatedRequests.length > 0) {
          this.logger.debug(
            'Updated friend requests detected:',
            updatedRequests,
          );
          this.notifySenderOnRequestAccepted(updatedRequests);
        }

        this.lastChecked = new Date();
      } catch (error) {
        this.logger.error('Error polling for changes:', error);
      }
    }, 20000);
  }

  /**
   * Notifies the receiver of new friend requests.
   */
  private notifyReceiverOfNewRequests(
    newRequests: FriendRequestsEntity[],
  ): void {
    newRequests.forEach((request) => {
      const { receiverId } = request;
      this.logger.log(
        `Notifying receiver ${receiverId} of new friend request`,
        request,
      );
      this.emitToUser(receiverId, 'newFriendRequest', request);
    });
  }

  /**
   * Notifies the sender when the friend request is accepted by the receiver.
   */
  private notifySenderOnRequestAccepted(
    updatedRequests: FriendRequestsEntity[],
  ): void {
    updatedRequests.forEach((request) => {
      if (request.status === 'accepted') {
        const { senderId } = request;
        this.logger.log(
          `Notifying sender ${senderId} that friend request was accepted`,
          request,
        );
        this.emitToUser(senderId, 'friendRequestAccepted', request);
      }
    });
  }

  /**
   * Emits a message to a specific user by userId.
   */
  private emitToUser(userId: number, event: string, payload: any): void {
    this.websocketGateway.emitToUser(userId, event, payload);
  }
}
