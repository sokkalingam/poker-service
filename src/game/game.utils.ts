import { Game } from '../model/Game';
import _ from 'lodash';
import { Table } from '../model/Table';
import { RoundStatus } from '../model/RoundStatus';
import { PlayerStatus } from '../model/PlayerStatus';
import { BadRequestException } from '@nestjs/common';
import { Server } from 'socket.io';
import { TableUtils } from '../table/table.utils';
import { Player } from '../model/Player';

export class GameUtils {

  static getNewGame(): Game {
    let id = _.random(1000, 99999)
    let game = new Game()
    game.id = id.toString()
    game.roundStatus = RoundStatus.NotStarted
    return game
  }

  /**
   * Add active players with cash in hand for at least the big blind amount
   * @param table
   */
  static addEligiblePlayersToGame(table: Table) {
    table.game.players = table.players.filter((player) => player.status === PlayerStatus.Active && player.cashInHand >= table.bigBlind)
  }

  static pickBlinds(game: Game) {
    // small blind
    let sbIdx = _.random(game.players.length - 1)
    game.smallBlind = game.players[sbIdx]
    // big blind
    let bbIdx = sbIdx + 1
    bbIdx = bbIdx >= game.players.length ? 0 : bbIdx
    game.bigBlind = game.players[bbIdx]
  }

  static validateGameForProgress(game: Game) {
    if (!game)
      throw new BadRequestException("Game does not exist")
    if (game.roundStatus != RoundStatus.BlindsPaid)
      throw new BadRequestException("Cannot progress game, previous steps are done")
  }

  static sendGameUpdatesToAll(table: Table, server: Server) {
    let roomName = TableUtils.getRoomName(table.id)
    server.emit(roomName).emit("gameUpdates", table)
  }

}