import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module.js';
import { DocumentsModule } from './modules/documents/documents.module.js';

@Module({
  imports: [UsersModule, DocumentsModule],
})
export class AppModule {}
