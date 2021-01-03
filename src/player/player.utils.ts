import { Player } from '../model/Player';

export class PlayerUtils {

  static isPlayerValid(player: Player): boolean {
    return (player != null) && (player.id != null) && (player.name != null)
  }

}