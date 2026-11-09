import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { UrlsModule } from './urls/urls.module.js';

@Module({
  imports: [DatabaseModule, UrlsModule],
})
export class AppModule {}
