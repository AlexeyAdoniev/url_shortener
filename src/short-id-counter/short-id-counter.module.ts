import { Global, Module } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module.js';
import { RedisService } from '../redis/redis.service.js';
import { BATCH_SIZE, COUNTER_KEY } from './counter.constants.js';
import { ShortIdCounterService } from './short-id-counter.service.js';



@Global()
@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: ShortIdCounterService,
      inject: [RedisService],
      useFactory: async (redis: RedisService) => {
        // Awaiting this command ensures Redis is ready before this provider is
        // available to services that depend on it.
        const endExclusive = await redis.incrby(COUNTER_KEY, BATCH_SIZE);
        console.log(endExclusive, 'endExclusive');
        const startValue = endExclusive - BATCH_SIZE;
        console.log(startValue, 'startValue');
        return new ShortIdCounterService(startValue, endExclusive);
      },
    },
  ],
  exports: [ShortIdCounterService],
})
export class ShortIdCounterModule {}
