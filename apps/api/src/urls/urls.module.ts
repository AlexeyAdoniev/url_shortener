import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UrlsController } from './urls.controller.js';
import { UrlsRepository } from './urls.repository.js';
import { UrlsService } from './urls.service.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'URL_TASKS',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'url-api',
            brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
          },
          producerOnlyMode: true,
          producer: { allowAutoTopicCreation: false },
        },
      },
    ]),
  ],
  controllers: [UrlsController],
  providers: [UrlsRepository, UrlsService],
})
export class UrlsModule {}
