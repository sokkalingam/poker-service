import { BadRequestException, Injectable } from '@nestjs/common';
import { Player } from '../model/Player';
import { PlayerUtils } from './player.utils';
import { Table } from '../model/Table';
import { Socket } from 'socket.io';
import { SocketUtils } from '../socket/socket.utils';

@Injectable()
export class PlayerService {

  playerMap: Map<string, Player>

  constructor() {
    this.playerMap = new Map<string, Player>()
  }

  getNewPlayer(input: {id: string, name: string}, client: Socket): Player {
    if (!input.id || !input.name)
      throw new BadRequestException("Need Player 'id' and 'name'")
    let player = new Player(input.id, input.name)
    this.playerMap.set(player.id, player)
    console.log("NewPlayerCreated", player)
    return player
  }

  getPlayerFromMap(playerId: string): Player {
    return this.playerMap.get(playerId)
  }

  removePlayer(playerId: string): boolean {
    return this.playerMap.delete(playerId)
  }
}