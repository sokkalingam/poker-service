import { Server, Socket } from 'socket.io';
import _ from 'lodash';
import { Player } from '../model/Player';
import { PlayerService } from '../player/player.service';

export class SocketUtils {

  static getException(e): { event: string, data: string } {
    let response = { event: "exception", data: e.response || e.message }
    console.error(response)
    return response
  }

  static setTableId(client: Socket, tableId: string) {
    _.set(client, ["conn", "data", "tableId"], tableId)
  }

  static getTableId(client: Socket): string {
    return _.get(client, ["conn", "data", "tableId"])
  }

  static setPlayer(client: Socket, player: Player) {
    return _.set(client, ["conn", "data", "player"], player)
  }

  static getPlayer(client: Socket): Player {
    return _.get(client, ["conn", "data", "player"])
  }

  static getSocketId(client: Socket): string {
    return _.get(client, ["conn", "id"])
  }

  static handleConnection(client: Socket, playerService: PlayerService) {
    if (!SocketUtils._checkPlayerInfo(client)) {
      client.emit('exception', "Cannot accept socket connection - query data does not contain id")
      client.disconnect(true)
    } else {
      let player = SocketUtils.getPlayer(client)
      playerService.addToPlayerSocketMap(player.id, client)
      console.log(`OnConnect: ${JSON.stringify(player)}`, new Date())
      SocketUtils.keepAlive(client)
    }
  }

  private static _checkPlayerInfo(client: Socket): boolean {
    let playerId = client.handshake.query?.id
    let playerName = client.handshake.query?.name
    if (!playerId) return false
    SocketUtils.setPlayer(client, new Player(playerId, playerName))
    return true
  }

  private static keepAlive(client: Socket) {
    setInterval(() => client.emit('ping'), 10000)
  }
}