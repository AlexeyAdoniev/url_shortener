import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';

// Nest's Kafka transport uses the directly installed kafkajs runtime dependency.
import { AppModule } from './app/app.module.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'url-generator',
          brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
        },
        consumer: {
          groupId: 'url-generator',
          allowAutoTopicCreation: false,
        },
        subscribe: { fromBeginning: true },
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
  Logger.log('Listening for URL creation tasks', 'Generator');
}

await bootstrap();
