import { ConflictException, GatewayTimeoutException, Inject, Injectable, ServiceUnavailableException, type OnModuleInit } from '@nestjs/common';
import type { ClientKafkaProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { CREATE_URL_TOPIC, type CreateUrlTask } from 'url-constants';
import { UrlsRepository } from './urls.repository.js';

@Injectable()
export class UrlsService implements OnModuleInit {
  constructor(
    private readonly urlsRepository: UrlsRepository,
    @Inject('URL_TASKS') private readonly client: ClientKafkaProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    this.client.subscribeToResponseOf(CREATE_URL_TOPIC);
    await this.client.connect();
  }

  async create(task: CreateUrlTask): Promise<{ shortId: string }> {
    try {
      return await firstValueFrom(
        this.client.send<{ shortId: string }, CreateUrlTask>(CREATE_URL_TOPIC, task).pipe(
          timeout(10_000),
        ),
      );
    } catch (error: unknown) {
      if (error instanceof TimeoutError) {
        throw new GatewayTimeoutException('URL creation timed out');
      }
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ALIAS_CONFLICT') {
        throw new ConflictException('alias is already in use');
      }
      throw new ServiceUnavailableException('URL creation failed');
    }
  }

  async findOriginal(shortId: string): Promise<string | null> {
    const record = await this.urlsRepository.findActive(shortId);
    return record?.original ?? null;
  }
}
