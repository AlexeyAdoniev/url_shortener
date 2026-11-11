import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service.js';
import { UrlsController } from './urls.controller.js';
import { UrlsRepository } from './urls.repository.js';


@Module({
  controllers: [UrlsController],
  providers: [UrlsService, UrlsRepository],
})
export class UrlsModule {}
