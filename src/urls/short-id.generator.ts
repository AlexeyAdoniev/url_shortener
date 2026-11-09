import { randomInt } from 'node:crypto';

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const MAX_ID_SPACE = ALPHABET.length ** 6;

export function generateShortId(): string {
  let value = randomInt(0, MAX_ID_SPACE);
  let shortId = '';

  do {
    shortId = ALPHABET[value % ALPHABET.length] + shortId;
    value = Math.floor(value / ALPHABET.length);
  } while (value > 0);

  return shortId;
}
