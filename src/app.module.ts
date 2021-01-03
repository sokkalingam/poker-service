import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeckService } from './deck/DeckService';
import { SocketService } from './socket/socket.service';
import { TableService } from './table/table.service';
import { TableGateway } from './table/table.gateway';
import { PlayerService } from './player/player.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DeckService, SocketService, TableService, PlayerService, TableGateway],
})
export class AppModule {}
