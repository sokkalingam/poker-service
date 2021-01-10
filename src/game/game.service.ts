import { Injectable } from '@nestjs/common';
import { TableService } from '../table/table.service';
import { GameUtils } from './game.utils';
import { AccountService } from '../account/account.service';
import { RoundStatus } from '../model/RoundStatus';
import { WaitUtils } from '../utils/WaitUtils';
import { AccountUtils } from '../account/account.utils';
import { TableUtils } from '../table/table.utils';
import { Table } from '../model/Table';
import { DealerService } from '../dealer/DealerService';
import { Server, Socket } from 'socket.io';
import { DealerUtils } from '../dealer/dealer.utils';
import { Game } from '../model/Game';
import { PlayerService } from '../player/player.service';

@Injectable()
export class GameService {

  constructor(private readonly tableService: TableService,
              private readonly accountService: AccountService,
              private readonly dealerService: DealerService,
              private readonly playerService: PlayerService) {
  }

  async startGame(input: { tableId: string }, server: Server) {
    let table = this.tableService.getTable(input.tableId);
    await GameService._setupGame(table);
    GameService._handleBlinds(table)
    this._dealCards(table, server)
  }

  private static async _setupGame(table: Table) {
    TableUtils.validateTableForGameStart(table);
    table.game = GameUtils.getNewGame();
    GameUtils.addEligiblePlayersToGame(table);
    await WaitUtils.wait(3000);
  }

  private static _handleBlinds(table: Table) {
    GameUtils.pickBlinds(table.game)
    AccountUtils.makeBlindsPay(table)
  }

  private _dealCards(table: Table, server: Server) {
    let game = table.game
    GameUtils.validateGameForProgress(game)
    let dealtCards = this.dealerService.deal(game.players.length);
    game.gameCards = dealtCards.tableCards
    game.roundStatus = RoundStatus.CardsDealt
    DealerUtils.dealCardsToPlayers(game.players, dealtCards.allPlayerCards)
    GameUtils.sendGameUpdatesToAll(table, server);
  }

  acceptPlayerInputs(game: Game) {
    let indexOfSB = game.players.indexOf(game.smallBlind)
    for (let i = indexOfSB; i < game.players.length + indexOfSB; i++) {
      let currentPlayer = game.players[i]
      this.playerService.getFromPlayerSocketMap(currentPlayer.id).emit("needInput", "Send the available input options")
    }
  }

  playerInput(item1, item2) {

  }



}