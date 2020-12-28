import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Param } from '@nestjs/common';

@WebSocketGateway()
export class WebSocketService {
  @WebSocketServer()
  server: Server;

  socketMap = new Map<string, Socket>()

  @SubscribeMessage('events')
  async identity(@MessageBody() data, @ConnectedSocket() client: Socket, @Param() params): Promise<any> {
    console.log(`New subscription ${data.id}`)
    this.socketMap.set(data.id, client)
    this.sendMessages()
  }

  sendMessages() {
    setTimeout(() => {
      for (let [id, socket] of this.socketMap) {
        console.log(`Sending welcome message to ${id}`)
        socket.emit(`events/${id}`, `Hey socket ${id}, welcome! ${new Date()}`)
      }
    }, 1000)
  }
}