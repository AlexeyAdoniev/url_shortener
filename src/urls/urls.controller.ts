import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreateUrlDto, isShortId } from './create-url.dto.js';
import { UrlsService } from './urls.service.js';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls')
  @HttpCode(200)
  async create(@Body() body: CreateUrlDto): Promise<{ shortId: string }> {
    console.log('1');
    return this.urlsService.create(body);
  }

   @Get('health')
  async health(): Promise<string> {
    return '200'
  }

  @Get(':shortId')
  async redirect(@Param('shortId') shortId: string, @Res() response: Response): Promise<void> {
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
