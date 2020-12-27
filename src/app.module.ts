import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeckService } from './Deck/DeckService';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DeckService],
})
export class AppModule {}
