import { fileURLToPath } from 'node:url';
import { Transport, type ClientProviderOptions } from '@nestjs/microservices';

const PROTO_PATH = fileURLToPath(
  new URL('../proto/urls.proto', import.meta.url),
);

export const URL_AVAILABILITY_CLIENT = 'URL_AVAILABILITY_CLIENT';

export const urlAvailabilityClientOptions: ClientProviderOptions = {
  name: URL_AVAILABILITY_CLIENT,
  transport: Transport.GRPC,
  options: {
    package: 'urlshortener',
    protoPath: PROTO_PATH,
    url: process.env.API_GRPC_URL ?? 'localhost:5000',
  },
};
