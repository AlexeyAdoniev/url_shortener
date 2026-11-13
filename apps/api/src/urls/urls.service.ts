import { Injectable } from '@nestjs/common';
import { UrlsRepository } from './urls.repository.js';

@Injectable()
export class UrlsService {
  constructor(private readonly urlsRepository: UrlsRepository) {}

  async exists(shortId: string): Promise<boolean> {
    console.log(shortId, ` shortId`);
    return this.urlsRepository.exists(shortId);
  }

  async findOriginal(shortId: string): Promise<string | null> {
    const record = await this.urlsRepository.findActive(shortId);
    return record?.original ?? null;
  }
}
