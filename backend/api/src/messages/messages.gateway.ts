import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: '/messages',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map of userId -> socketId for online users
  private connectedUsers: Map<string, string> = new Map();

  constructor(
    private messagesService: MessagesService,
    private jwtService: JwtService,
  ) { }

  async handleConnection(client: Socket) {
    try {
      // Extract JWT token from handshake
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      // Store user connection
      this.connectedUsers.set(userId, client.id);
      client.data.userId = userId;

      console.log(`User ${userId} connected to messages (socket: ${client.id})`);

      // Notify user of successful connection
      client.emit('connected', { userId });
    } catch (error) {
      console.error('Connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected from messages`);
    }
  }

  @SubscribeMessage('message.send')
  async handleSendMessage(
    @MessageBody() data: { receiverId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const senderId = client.data.userId;

      if (!senderId) {
        client.emit('error', { message: 'Unauthorized' });
        return;
      }

      // Save message to database
      const message = await this.messagesService.sendMessage(senderId, {
        receiverId: data.receiverId,
        content: data.content,
      });

      // Send confirmation to sender
      client.emit('message.sent', message);

      // Send message to receiver if online
      const receiverSocketId = this.connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('message.receive', message);
      }

      return { success: true, message };
    } catch (error) {
      client.emit('error', { message: error.message });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('message.typing')
  handleTyping(
    @MessageBody() data: { receiverId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.userId;
    const receiverSocketId = this.connectedUsers.get(data.receiverId);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('message.typing', {
        userId: senderId,
        isTyping: data.isTyping,
      });
    }
  }

  @SubscribeMessage('message.read')
  handleMessageRead(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // Emit read receipt
    client.emit('message.read.confirm', { messageId: data.messageId });
  }
}
