import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { CreateUrlDto } from './create-url.dto.js';
import { UrlsService } from './urls.service.js';

import { BASE62_PATTERN, MAX_SHORT_ID_LENGTH } from 'url-constants';

export function isShortId(value: string): boolean {
  return (
    value.length > 0 &&
    value.length <= MAX_SHORT_ID_LENGTH &&
    BASE62_PATTERN.test(value)
  );
}

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls')
  @HttpCode(202)
  async create(@Body() body: CreateUrlDto): Promise<void> {
    await this.urlsService.create(body);
  }

  @Get(':shortId')
  async redirect(
    @Param('shortId') shortId: string,
    @Res() response: Response,
  ): Promise<void> {
    if (!isShortId(shortId)) {
      throw new NotFoundException();
    }

    const original = await this.urlsService.findOriginal(shortId);
    if (!original) {
      throw new NotFoundException();
    }

    response.redirect(302, original);
  }
}
