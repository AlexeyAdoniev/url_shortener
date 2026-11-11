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



  async findActive(shortId: string): Promise<UrlRecord | null> {
    const result = await this.database.query<UrlRecord>(
      `SELECT short_id AS "shortId", original_url AS original, expires_at AS "expiresAt"
       FROM urls
       WHERE short_id = $1 AND (expires_at IS NULL OR expires_at > NOW())`,
      [shortId],
    );
    return result.rows[0] ?? null;
  }
}
