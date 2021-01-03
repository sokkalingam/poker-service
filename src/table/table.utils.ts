import _ from 'lodash';
import { TableConfig } from './table.config';
import { Table } from '../model/Table';
import { TableRequest } from '../model/TableRequest';
import { Player } from '../model/Player';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { PlayerStatus } from '../model/PlayerStatus';

export class TableUtils {

  static generateTableId(map: Map<string, Table>): string {
    let id = _.random(TableConfig.TABLE_ID_LOWER_BOUND, TableConfig.TABLE_ID_UPPER_BOUND).toString()
    if (!map.has(id)) {
      return id
    }
    console.log(`Table ${id} is already taken, regenerating a new table id`)
    return this.generateTableId(map)
  }

  static getNewTable(input: TableRequest, id: string): Table {
    return new Table(id, input)
  }

  static addPlayerToTable(table: Table, player: Player) {
    if (!table)
      throw new BadRequestException(`Cannot join table ${table.id} - it does not exist`)
    if (table.players.length >= table.maxPlayersCount) {
      throw new ForbiddenException(`Table ${table.id} has reached max capacity, could not add player ${player.id}`)
    }
    let playerFromTable = this.getPlayerFromTable(table, player.id)
    if (!playerFromTable) {
      player.status = PlayerStatus.Active
      table.players.push(player)
    } else {
      playerFromTable.status = PlayerStatus.Active
    }
  }

  static markPlayerAsInactive(table: Table, playerId: string) {
    let player = TableUtils.getPlayerFromTable(table, playerId)
    if (player) {
      player.status = PlayerStatus.Inactive
    }
  }

  static isPlayerInTable(table: Table, playerId: string): boolean {
    return table?.players.find((pl) => pl.id === playerId) !== undefined
  }

  static getPlayerFromTable(table: Table, playerId: string): Player {
    return table?.players.find((pl) => pl.id === playerId)
  }

  static getRoomName(tableId: string): string {
    return "table-" + tableId
  }

  static removeTableIfEmpty(table: Table, tableMap: Map<string, Table>) {
    if (table && (table.players.length === 0 || table.players.filter(pl => pl.status === PlayerStatus.Active).length === 0)) {
      tableMap.delete(table.id)
      console.log(`Removed empty/inactive table ${table.id}`)
    }
  }
}