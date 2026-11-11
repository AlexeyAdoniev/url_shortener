import {  Injectable } from '@nestjs/common';
import { UrlsRepository } from './urls.repository.js';

@Injectable()
export class UrlsService {
  constructor(private readonly urlsRepository: UrlsRepository) {}

  async findOriginal(shortId: string): Promise<string | null> {
    const record = await this.urlsRepository.findActive(shortId);
    return record?.original ?? null;
  }

}

