import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { RedisModule } from './redis/redis.module.js';
import { ShortIdCounterModule } from './short-id-counter/short-id-counter.module.js';
import { UrlsModule } from './urls/urls.module.js';

@Module({
  imports: [DatabaseModule, RedisModule, ShortIdCounterModule, UrlsModule],
})
export class AppModule {}
