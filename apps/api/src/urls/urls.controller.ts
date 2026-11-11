import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import {  isShortId } from './create-url.dto.js';
import { UrlsService } from './urls.service.js';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}



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
