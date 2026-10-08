import { Module } from '@nestjs/common';
import { RgService } from './rg.service.js';
import { RgController } from './rg.controller.js';

@Module({
  controllers: [RgController],
  providers: [RgService],
})
export class RgModule {}
