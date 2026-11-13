import { Module } from '@nestjs/common';
import { UrlsModule } from './urls/urls.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [DatabaseModule, UrlsModule],
})
export class AppModule {}
