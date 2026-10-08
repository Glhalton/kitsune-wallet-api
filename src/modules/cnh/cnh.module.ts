import { Module } from '@nestjs/common';
import { CnhService } from './cnh.service.js';
import { CnhController } from './cnh.controller.js';

@Module({
  controllers: [CnhController],
  providers: [CnhService],
})
export class CnhModule {}
