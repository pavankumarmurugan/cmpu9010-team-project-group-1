import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.token as string;
      if (!token) {
        throw new UnauthorizedException('Token is required');
      }

      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      client.data.user = user;
      console.log(`User connected: ${user.data.userId}`);
    } catch (error) {
      console.error('Connection error:', error.message);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    const { userId } = client.data.user.data;
    client.join(roomId + userId);
    client.emit('joined_room', roomId + userId);
  }

  sendPrivateUpdate(userId: string, data: any) {
    this.server.to(userId).emit('privateUpdate', data);
  }

  sendMessageToRoom(roomId: string, message: any) {
    this.server.to('defaultRoom' + roomId).emit('roomMessage', message);
  }
}
