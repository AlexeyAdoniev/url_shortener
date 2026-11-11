import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { DatabaseError } from 'pg';
import { type CreateUrlDto } from './create-url.dto.js';
import { generateShortId } from './short-id.generator.js';
import { UrlsRepository } from './urls.repository.js';

const MAX_GENERATION_ATTEMPTS = 10;

@Injectable()
export class UrlsService {
  constructor(private readonly urlsRepository: UrlsRepository) {}

  async create(input: CreateUrlDto): Promise<{ shortId: string }> {
    const expiresAt = input.expireMs ? new Date(Date.now() + input.expireMs) : null;

    if (input.alias) {
    // TODO
    //   if (await this.urlsRepository.exists(input.alias)) {
    //     throw new ConflictException('alias is already in use');
    //   }
      await this.insert(input.alias, input.original, expiresAt, false);
      return { shortId: input.alias };
    }

    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
      const shortId = generateShortId();

      //TODO
    //   if (await this.urlsRepository.exists(shortId)) {
    //     continue;
    //   }

      if (await this.insert(shortId, input.original, expiresAt, true)) {
        return { shortId };
      }
    }

    throw new InternalServerErrorException('Could not allocate a unique short ID');
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
