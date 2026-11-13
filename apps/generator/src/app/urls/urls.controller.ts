import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  KafkaRetriableException,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { CREATE_URL_TOPIC, type CreateUrlTask } from 'url-constants';
import { UrlsService } from './urls.service.js';

@Controller()
export class UrlsController {
  private readonly logger = new Logger(UrlsController.name);

  constructor(private readonly urlsService: UrlsService) {}

  @EventPattern<string>(CREATE_URL_TOPIC)
  async create(@Payload() task: CreateUrlTask): Promise<void> {
    try {
      const { shortId } = await this.urlsService.create(task);
      this.logger.log(`Created short URL: ${shortId}`);
    } catch (error: unknown) {
      if (error instanceof RpcException) {
        this.logger.error(error.message);
        return;
      }
      throw new KafkaRetriableException(
        error instanceof Error ? error : String(error),
      );
    }
  }
}
