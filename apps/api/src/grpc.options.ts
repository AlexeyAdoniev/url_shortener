import { join } from 'node:path';
import { Transport, type MicroserviceOptions } from '@nestjs/microservices';

const PROTO_PATH = join(import.meta.dirname, './proto/urls.proto') ;



export const grpcOptions: MicroserviceOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'urlshortener',
    protoPath: PROTO_PATH,
    url: process.env.GRPC_BIND_URL ?? '0.0.0.0:5000',
  },
};
