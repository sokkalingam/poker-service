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
import { GameService } from '../game/game.service';

@WebSocketGateway({ namespace: "table" })
export class TableGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  constructor(private readonly tableService: TableService,
              private readonly playerService: PlayerService,
              private readonly gameService: GameService) {
  }

  afterInit(server: Server) {
    console.log("Table Gateway Server is initialized")
  }

  handleConnection(client: Socket, ...args: any[]) {
    SocketUtils.handleConnection(client, this.playerService);
    client.on('disconnecting', () => this._handleDisconnect(client, this.playerService))
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

  @SubscribeMessage("startGame")
  startGame(@Body() input: { tableId: string }) {
    this.gameService.startGame(input, this.server)
  }

  @SubscribeMessage("gameInput")
  gameInput(@Body() input: {}, client: Socket) {
    this.gameService.playerInput(input, client)
  }

  private _handleDisconnect(client: Socket, playerService: PlayerService) {
    this.tableService.leaveTable(client, this.server)
    this.playerService.removeFromPlayerSocketMap(SocketUtils.getPlayer(client).id)
  }

}