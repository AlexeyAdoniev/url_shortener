import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type { DatabaseError } from 'pg';
import { lastValueFrom, type Observable } from 'rxjs';
import { URL_AVAILABILITY_CLIENT } from '../grpc.options.js';
import { type CreateUrlDto } from './create-url.dto.js';
import { generateShortId } from './short-id.generator.js';
import { UrlsRepository } from './urls.repository.js';

const MAX_GENERATION_ATTEMPTS = 10;

interface UrlAvailabilityService {
  checkShortId(input: { shortId: string }): Observable<{ exists: boolean }>;
}

@Injectable()
export class UrlsService implements OnModuleInit {
  private urlAvailabilityService!: UrlAvailabilityService;

  constructor(
    @Inject(URL_AVAILABILITY_CLIENT)
    private readonly urlAvailabilityClient: ClientGrpc,
    private readonly urlsRepository: UrlsRepository,
  ) {}

  onModuleInit(): void {
    this.urlAvailabilityService =
      this.urlAvailabilityClient.getService<UrlAvailabilityService>(
        'UrlAvailability',
      );
  }

  async create(input: CreateUrlDto): Promise<{ shortId: string }> {
    const expiresAt = input.expireMs
      ? new Date(Date.now() + input.expireMs)
      : null;

    if (input.alias) {
      if (await this.shortIdExists(input.alias)) {
        throw new ConflictException('alias is already in use');
      }
      await this.insert(input.alias, input.original, expiresAt, false);
      return { shortId: input.alias };
    }

    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
      const shortId = generateShortId();

      if (await this.shortIdExists(shortId)) {
        continue;
      }

      if (await this.insert(shortId, input.original, expiresAt, true)) {
        return { shortId };
      }
    }

    throw new InternalServerErrorException(
      'Could not allocate a unique short ID',
    );
  }

  private async shortIdExists(shortId: string): Promise<boolean> {
    const response = await lastValueFrom(
      this.urlAvailabilityService.checkShortId({ shortId }),
    );
    return response.exists;
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
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  );
}
