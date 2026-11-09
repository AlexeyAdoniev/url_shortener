import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { DatabaseError } from 'pg';
import { RedisService } from '../redis/redis.service.js';
import { ShortIdCounterService } from '../short-id-counter/short-id-counter.service.js';
import { type CreateUrlDto } from './create-url.dto.js';
import { UrlsRepository } from './urls.repository.js';
import e from 'express';
import { BATCH_SIZE_OVERFLOW_ERROR, COUNTER_KEY } from '../short-id-counter/counter.constants.js';

@Injectable()
export class UrlsService {
  constructor(
    private readonly urlsRepository: UrlsRepository,
    private readonly redis: RedisService,
    private readonly shortIdCounter: ShortIdCounterService,
  ) {}

  async create(input: CreateUrlDto): Promise<{ shortId: string }> {
    const expiresAt = input.expireMs ? new Date(Date.now() + input.expireMs) : null;

    if (input.alias) {
      if (await this.urlsRepository.exists(input.alias)) {
        throw new ConflictException('alias is already in use');
      }
      await this.insert(input.alias, input.original, expiresAt, false);
      return { shortId: input.alias };
    }


      try {
        const shortId = this.shortIdCounter.next();
        if (await this.insert(shortId, input.original, expiresAt, true)) {
          return { shortId };
        }
      } catch (error: unknown) {
        if (error instanceof Error && e.name === BATCH_SIZE_OVERFLOW_ERROR) {
        
        }
      }
     
    

    throw new InternalServerErrorException('Could not allocate a unique short ID');
  }

  async findOriginal(shortId: string): Promise<string | null> {
    const record = await this.urlsRepository.findActive(shortId);
    return record?.original ?? null;
  }

  private async insert(
    shortId: string,
    original: string,
    expiresAt: Date | null,
    retryOnCollision: boolean,
  ): Promise<boolean> {
    try {
      await this.urlsRepository.insert({ shortId, original, expiresAt });
      return true;
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        if (retryOnCollision) {
          return false;
        }
        throw new ConflictException('alias is already in use');
      }
      throw error;
    }
  }
}

function isUniqueViolation(error: unknown): error is DatabaseError {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}
