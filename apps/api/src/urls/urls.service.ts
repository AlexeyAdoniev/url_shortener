import { Inject, Injectable, type OnModuleInit } from '@nestjs/common';
import type { ClientKafkaProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CREATE_URL_TOPIC, type CreateUrlTask } from 'url-constants';
import { UrlsRepository } from './urls.repository.js';

@Injectable()
export class UrlsService implements OnModuleInit {
  constructor(
    private readonly urlsRepository: UrlsRepository,
    @Inject('URL_TASKS') private readonly client: ClientKafkaProxy,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async create(task: CreateUrlTask): Promise<void> {
    await firstValueFrom(this.client.emit(CREATE_URL_TOPIC, task));
  }

  async findOriginal(shortId: string): Promise<string | null> {
    const record = await this.urlsRepository.findActive(shortId);
    return record?.original ?? null;
  }
}
