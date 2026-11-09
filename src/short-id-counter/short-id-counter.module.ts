import { Global, Module } from '@nestjs/common';
import { ShortIdCounterService } from './short-id-counter.service.js';

@Global()
@Module({
  providers: [ShortIdCounterService],
  exports: [ShortIdCounterService],
})
export class ShortIdCounterModule {}
