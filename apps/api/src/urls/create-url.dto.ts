
const MAX_SHORT_ID_LENGTH = 6;
const BASE62_PATTERN = /^[0-9A-Za-z]+$/;


export function isShortId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_SHORT_ID_LENGTH && BASE62_PATTERN.test(value);
}
