import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

const whitelist = process.env.WHITELISTED_ORIGINS
  ? process.env.WHITELISTED_ORIGINS.split(',').map((origin) => origin.trim())
  : [];

@WebSocketGateway({
  cors: {
    origin: whitelist,
    credentials: true,
  },
})
export class WebSocketGatewayService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(WebSocketGatewayService.name);

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChatRoom')
  handleJoinChatRoom(
    @MessageBody() data: { roomId: string; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId } = data;
    client.join(roomId);
    this.logger.log(`User ${userId} joined chat room: ${roomId}`);
  }

  @SubscribeMessage('joinNotificationRoom')
  handleJoinNotificationRoom(
    @MessageBody() data: { userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;
    const notificationRoom = `user_${userId}`;
    client.join(notificationRoom);
    this.logger.log(
      `User ${userId} joined notification room: ${notificationRoom}`,
    );
  }

  /**
   * Handle user joining a group chat room.
   * Group chat rooms are identified by `group_{groupId}`.
   */
  @SubscribeMessage('joinGroupRoom')
  handleJoinGroupRoom(
    @MessageBody() data: { groupId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `group_${data.groupId}`;
    client.join(room);
    this.logger.log(`User ${data.userId} joined group room: ${room}`);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() data: { roomId: string; userId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, userId, message } = data;
    this.logger.log(
      `User ${userId} sent message to room ${roomId}: ${message}`,
    );

    this.emitToChatRoom(roomId, 'newMessage', { userId, message });
  }

  /**
   * Emits an event to a specific user by userId (for notifications).
   */
  emitToUser(userId: number, event: string, payload: any): void {
    this.server.to(`user_${userId}`).emit(event, payload);
  }

  /**
   * Emits an event to a specific one-on-one chat room by roomId.
   */
  emitToChatRoom(roomId: string, event: string, payload: any): void {
    this.server.to(roomId).emit(event, payload);
  }

  /**
   * Emits an event to a specific group by groupId.
   */
  emitToGroup(groupId: number, event: string, payload: any): void {
    this.server.to(`group_${groupId}`).emit(event, payload);
  }
}
