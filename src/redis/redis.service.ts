import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor() {
    const connectionString = process.env.REDIS_URL;
    if (!connectionString) {
      throw new Error('REDIS_URL must be set');
    }

    this.client = new Redis(connectionString);
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  set(key: string, value: string): Promise<'OK' | null> {
    return this.client.set(key, value);
  }

  incrby(key: string, amount: number): Promise<number> {
    return this.client.incrby(key, amount);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
