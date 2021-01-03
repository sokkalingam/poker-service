import { Server, Socket } from 'socket.io';
import _ from 'lodash';
import { Player } from '../model/Player';

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

  static setPlayer(client: Socket, player: { id: string, name: string }) {
    return _.set(client, ["conn", "data", "player"], player)
  }

  static getPlayer(client: Socket): Player {
    return _.get(client, ["conn", "data", "player"])
  }

  static getSocketId(client: Socket): string {
    return _.get(client, ["conn", "id"])
  }
}