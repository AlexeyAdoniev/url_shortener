export const MAX_SHORT_ID_LENGTH = 6;
export const BASE62_PATTERN = /^[0-9A-Za-z]+$/;

export const CREATE_URL_TOPIC = 'urls.create';

export interface CreateUrlTask {
  original: string;
  alias?: string;
  expireMs?: number;
}
