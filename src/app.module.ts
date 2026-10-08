import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module.js';
import { DocumentsModule } from './modules/documents/documents.module.js';
import { DocumentTypesModule } from './modules/document-types/document-types.module.js';
import { DocumentFilesModule } from './modules/document-files/document-files.module.js';
import { RgModule } from './modules/rg/rg.module.js';
import { CnhModule } from './modules/cnh/cnh.module.js';
import { ElectoralCardsModule } from './modules/electoral-cards/electoral-cards.module.js';
import { PrismaModule } from './database/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    DocumentsModule,
    DocumentTypesModule,
    DocumentFilesModule,
    RgModule,
    CnhModule,
    ElectoralCardsModule,
    AuthModule,
  ],
})
export class AppModule {}
