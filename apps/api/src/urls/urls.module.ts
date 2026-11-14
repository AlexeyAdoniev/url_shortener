import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

// Nest's Kafka transport uses the directly installed kafkajs runtime dependency.
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
          consumer: {
            groupId: 'url-api',
            allowAutoTopicCreation: false,
          },
          producer: { allowAutoTopicCreation: false },
        },
      },
    ]),
  ],
  controllers: [UrlsController],
  providers: [UrlsRepository, UrlsService],
})
export class UrlsModule {}
