import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

export interface UrlRecord {
  shortId: string;
  original: string;
  expiresAt: Date | null;
}

@Injectable()
export class UrlsRepository {
  constructor(private readonly database: DatabaseService) {}

  async insert(record: UrlRecord): Promise<void> {
    await this.database.query(
      `INSERT INTO urls (short_id, original_url, expires_at)
       VALUES ($1, $2, $3)`,
      [record.shortId, record.original, record.expiresAt],
    );
  }

}
