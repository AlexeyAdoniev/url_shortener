import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UrlsService } from './urls.service.js';
import { CreateUrlDto } from './create-url.dto.js';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}


    @Post('urls')
    @HttpCode(200)
    async create(@Body() body: CreateUrlDto): Promise<{ shortId: string }> {
      return this.urlsService.create(body);
    }
}
