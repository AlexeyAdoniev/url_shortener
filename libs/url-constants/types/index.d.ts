export declare const MAX_SHORT_ID_LENGTH: number;
export declare const BASE62_PATTERN: RegExp;
export declare const CREATE_URL_TOPIC: string;
export interface CreateUrlTask {
  original: string;
  alias?: string;
  expireMs?: number;
}
