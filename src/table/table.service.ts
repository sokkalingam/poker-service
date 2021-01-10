import { Injectable, NotFoundException } from '@nestjs/common';
import { Table } from '../model/Table';
import { TableUtils } from './table.utils';
import { Player } from '../model/Player';
import { Server, Socket } from 'socket.io';
import { TableRequest } from '../model/TableRequest';
import { SocketService } from '../socket/socket.service';
import { PlayerService } from '../player/player.service';
import { SocketUtils } from '../socket/socket.utils';
import { PlayerStatus } from '../model/PlayerStatus';

@Injectable()
export class TableService {

  // TODO: use an external cache service to keep ids centralized
  tableMap: Map<string, Table>

  constructor(private readonly socketService: SocketService,
              private readonly playerService: PlayerService) {
    this.tableMap = new Map<string, Table>()
  }

  getTable(tableId: string): Table {
    return this.tableMap.get(tableId);
  }

  getNewTable(input: TableRequest, client: Socket, server: Server): { tableId: string } {
    let tableId = TableUtils.generateTableId(this.tableMap)
    tableId = "100"
    let table = TableUtils.getNewTable(input, tableId)
    this.tableMap.set(tableId, table)
    table.hostedBy = SocketUtils.getPlayer(client)
    console.log("Table created", tableId)
    this.joinTable({tableId: tableId }, client, server)
    return { tableId: tableId }
  }

  joinTable(input: { tableId: string }, client: Socket, server: Server): string {
    this.validateInputs(input)
    let table = this.tableMap.get(input.tableId)
    let newPlayer = SocketUtils.getPlayer(client)
    TableUtils.setupPlayer(table, newPlayer)
    SocketUtils.setTableId(client, table.id)
    console.log(`Player ${newPlayer.name} joined table ${table.id}`)
    TableService._joinRoom(table, client, server)
    table.players.filter(pl => pl.status === PlayerStatus.Active).forEach((pl) => console.log(pl.name))
    return "Joined Table " + input.tableId
  }

  leaveTable(client: Socket, server: Server): string {
    let player = SocketUtils.getPlayer(client)
    let tableId = SocketUtils.getTableId(client)
    if (!tableId) return // Player had never joined any table
    let table = this.tableMap.get(tableId);
    TableUtils.markPlayerAsInactive(table, player.id)
    TableUtils.removeTableIfEmpty(table, this.tableMap)
    TableService._leaveRoom(table, client, server)
    console.log(`Player ${player?.name} left table ${tableId}`)
    return `Player ${player?.name} left the table ${table?.id}`
  }

  validateInputs(input: { tableId: string }) {
    if (!this.tableMap.has(input.tableId)) {
      throw new NotFoundException("Could not find table with id " + input.tableId)
    }
  }

  private static _joinRoom(table: Table, client: Socket, server: Server) {
    let room = TableUtils.getRoomName(table.id)
    client.join(room)
    server.to(room).emit("waitingRoom", { "players": table.players })
  }

  private static _leaveRoom(table: Table, client: Socket, server: Server) {
    let room = TableUtils.getRoomName(table.id)
    client.leave(room)
    server.to(room).emit("waitingRoom", { "players": table.players })
  }

}