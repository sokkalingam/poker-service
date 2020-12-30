import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Param } from '@nestjs/common';

@WebSocketGateway()
export class WebSocketService {
  @WebSocketServer()
  server: Server;

  socketMap = new Map<string, Socket>()

  @SubscribeMessage('event')
  async identity(@MessageBody() data, @ConnectedSocket() client: Socket, @Param() params): Promise<any> {
    this.socketMap.set(data.id, client)
    console.log("Event received! " + new Date(), data)
    this.sendMessage("eventUpdates", data.id, client)
    return "ACK events"
  }

  @SubscribeMessage('message')
  async subscribeToMessage(@MessageBody() data, @ConnectedSocket() client: Socket, @Param() params): Promise<any> {
    this.socketMap.set(data.id, client)
    console.log("Message received! " + new Date(), data)
    this.sendMessage("messageUpdates", data.id, client)
    return "ACK message"
  }

  async sendMessage(event: string, id: number, socket: Socket) {
    setTimeout(() => socket.emit(event, "Update for " + event + " to "+ id + " at " + new Date()), 1000)
  }

  sendMessages() {
    setTimeout(() => {
      for (let [id, socket] of this.socketMap) {
        console.log(`Sending welcome message to ${id}`)
        socket.emit(`events`, `Hey socket ${id}, welcome! ${new Date()}`)
      }
    }, 1000)
  }
}