import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeckService } from './Deck/DeckService';
import { WebSocketService } from './websocket/Websocket.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DeckService, WebSocketService],
})
export class AppModule {}
