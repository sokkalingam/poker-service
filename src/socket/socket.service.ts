import {
  ConnectedSocket,
  MessageBody, OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Param } from '@nestjs/common';
import { Player } from '../model/Player';
import { SocketUtils } from './socket.utils';
import { Table } from '../model/Table';

@WebSocketGateway({namespace: 'socket'})
export class SocketService implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  socketMap = new Map<string, Socket>()

  constructor() {
  }

  handleConnection(client: any, ...args: any[]) {
    console.log("SocketService::OnConnect " + SocketUtils.getPlayer(client))
    client.emit('test', {
      name: "Adarsh",
      age: 25,
      players: [{isSmallBlind: true, cashInHand: 500, lastPlayed: "FOLD"}, {isSmallBlind: false, cashInHand: 1500, lastPlayed: "CHECK"}],
      inProgress: true,
      nestedObject: {
        nestedName: "Joseph",
        nestedAge: 15
      }
    })
  }

  @SubscribeMessage('event')
  async identity(@MessageBody() data, @ConnectedSocket() client: Socket, @Param() params): Promise<string> {
    this.socketMap.set(data.id, client)
    console.log("Event received! " + new Date(), data)
    this.sendMessage("eventUpdate", data.id, client)
    return "Your input to event was received! " + data
  }

  @SubscribeMessage('message')
  async subscribeToMessage(@MessageBody() data, @ConnectedSocket() client: Socket, @Param() params): Promise<string> {
    this.socketMap.set(data.id, client)
    console.log("Message received! " + new Date(), data)
    this.sendMessage("messageUpdate", data.id, client)
    return "Your input to message was received! " + data
  }

  sendMessage(event: string, id: number, socket: Socket) {
    setTimeout(() => socket.emit(event, {name: "Kobe"}), 1000)
  }

  sendMessages() {
    setTimeout(() => {
      for (let [id, socket] of this.socketMap) {
        console.log(`Sending welcome message to ${id}`)
        socket.emit(`event`, `Hey socket ${id}, welcome! ${new Date()}`)
      }
    }, 1000)
  }
}