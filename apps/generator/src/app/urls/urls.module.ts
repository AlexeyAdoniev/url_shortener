import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { urlAvailabilityClientOptions } from '../grpc.options.js';
import { UrlsService } from './urls.service.js';
import { UrlsController } from './urls.controller.js';
import { UrlsRepository } from './urls.repository.js';

@Module({
  imports: [ClientsModule.register([urlAvailabilityClientOptions])],
  controllers: [UrlsController],
  providers: [UrlsService, UrlsRepository],
})
export class UrlsModule {}
