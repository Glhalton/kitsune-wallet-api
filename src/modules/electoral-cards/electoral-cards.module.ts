import { Module } from '@nestjs/common';
import { ElectoralCardsService } from './electoral-cards.service.js';
import { ElectoralCardsController } from './electoral-cards.controller.js';

@Module({
  controllers: [ElectoralCardsController],
  providers: [ElectoralCardsService],
})
export class ElectoralCardsModule {}
