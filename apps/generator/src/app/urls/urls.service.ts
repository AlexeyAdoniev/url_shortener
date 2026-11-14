import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { DatabaseError } from 'pg';
import type { CreateUrlTask } from 'url-constants';
import { generateShortId } from './short-id.generator.js';
import { UrlsRepository } from './urls.repository.js';

const MAX_GENERATION_ATTEMPTS = 10;

@Injectable()
export class UrlsService {
  constructor(private readonly urlsRepository: UrlsRepository) {}

  async create(input: CreateUrlTask): Promise<{ shortId: string }> {
    const expiresAt = input.expireMs
      ? new Date(Date.now() + input.expireMs)
      : null;

    if (input.alias) {
      await this.insert(input.alias, input.original, expiresAt, false);
      return { shortId: input.alias };
    }

    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
      const shortId = generateShortId();

      if (await this.insert(shortId, input.original, expiresAt, true)) {
        return { shortId };
      }
    }

    throw new Error('Could not allocate a unique short ID');
  }

  private async insert(
    shortId: string,
    original: string,
    expiresAt: Date | null,
    shouldRetryOnCollision: boolean,
  ): Promise<boolean> {
    try {
      await this.urlsRepository.insert({ shortId, original, expiresAt });
      return true;
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        if (shouldRetryOnCollision) {
          return false;
        }
        throw new RpcException({ code: 'ALIAS_CONFLICT', message: 'alias is already in use' });
      }
      throw error;
    }
  }
}

function isUniqueViolation(error: unknown): error is DatabaseError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  );
}
