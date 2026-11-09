import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {BATCH_SIZE_OVERFLOW_ERROR} from './counter.constants.js'

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const MAX_SHORT_ID_COUNT =  ALPHABET.length ** 6;


class BatchSizeOverflowError extends Error {
  constructor() {
    super();
    this.name = BATCH_SIZE_OVERFLOW_ERROR;
  }
}


/**
 * Application-wide sequence for automatically assigned short IDs.
 *
 * Nest providers are singletons by default, so each application instance shares
 * this counter across all requests.
 */
@Injectable()
export class ShortIdCounterService {
  private nextValue = 0;



  constructor(initValue: number, public readonly batchSize: number = 100) {
    this.nextValue = initValue
  }


  next(): string {
    if (this.nextValue >= MAX_SHORT_ID_COUNT) {
      throw new InternalServerErrorException('Short ID space is exhausted');
    }

    if (this.nextValue  >= this.batchSize) {
      throw new BatchSizeOverflowError();
    } 

    const value = this.nextValue;
    this.nextValue += 1;
    return encodeBase62(value);
  }
}

function encodeBase62(value1: number): string {
  let value = value1;
  let shortId = '';

  do {
    shortId = ALPHABET[value % ALPHABET.length] + shortId;
    value = Math.floor(value / ALPHABET.length);
  } while (value > 0);

  return shortId;
}
