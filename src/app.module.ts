import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module.js';
import { DocumentsModule } from './modules/documents/documents.module.js';
import { DocumentTypesModule } from './modules/document-types/document-types.module.js';

@Module({
  imports: [UsersModule, DocumentsModule, DocumentTypesModule],
})
export class AppModule {}
