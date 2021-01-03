import {
  ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { TableService } from './table.service';
import { Body } from '@nestjs/common';
import { TableRequest } from '../model/TableRequest';
import { Player } from '../model/Player';
import { SocketUtils } from '../socket/socket.utils';
import { Server, Socket } from 'socket.io';
import { PlayerService } from '../player/player.service';
import _ from 'lodash';

@WebSocketGateway({ namespace: "table" })
export class TableGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  constructor(private readonly tableService: TableService,
              private readonly playerService: PlayerService) {
  }

  afterInit(server: Server) {
    console.log("Table Gateway Server is initialized")
  }

  handleConnection(client: Socket, ...args: any[]) {
    if (!TableGateway._hasPlayerInfo(client)) {
      client.emit('exception', "Cannot accept socket connection - query data does not contain id")
      client.disconnect(true)
    } else {
      console.log(`TableGateway::OnConnect: ${JSON.stringify(SocketUtils.getPlayer(client))}`, new Date())
      TableGateway.ping(client)
      client.on('disconnecting', () => this._handleDisconnect(client))
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`TableGateway::OnDisconnect: ${JSON.stringify(SocketUtils.getPlayer(client))}`, new Date())
  }

  @SubscribeMessage("host")
  getNewTable(@Body() body: TableRequest, @ConnectedSocket() client: Socket) {
    console.log("Table Host Request", body)
    try {
      return this.tableService.getNewTable(body, client, this.server)
    } catch (e) {
      return SocketUtils.getException(e)
    }
  }

  @SubscribeMessage("join")
  joinTable(@Body() input: { tableId: string }, @ConnectedSocket() client: Socket) {
    try {
      return this.tableService.joinTable(input, client, this.server)
    } catch (e) {
      return SocketUtils.getException(e)
    }
  }

  @SubscribeMessage("leave")
  leaveTable(@ConnectedSocket() client: Socket) {
    try {
      return this.tableService.leaveTable(client, this.server)
    } catch (e) {
      return SocketUtils.getException(e)
    }
  }

  private _handleDisconnect(client: Socket) {
    this.tableService.leaveTable(client, this.server)
  }

  private static _hasPlayerInfo(client: Socket): boolean {
    let playerId = client.handshake.query?.id
    let playerName = client.handshake.query?.name
    if (!playerId || !playerName) return false
    SocketUtils.setPlayer(client, {id: playerId, name: playerName})
    return true
  }

  private static ping(client: Socket) {
    setInterval(() => client.emit('ping'), 10000)
  }

}