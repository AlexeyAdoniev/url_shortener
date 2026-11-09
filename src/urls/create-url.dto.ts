import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const MAX_SHORT_ID_LENGTH = 6;
const BASE62_PATTERN = /^[0-9A-Za-z]+$/;
const MAX_EXPIRATION_MS = 8_000_000_000_000_000;

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  original!: string;

  @IsOptional()
  @IsString()
  @Matches(BASE62_PATTERN)
  @MaxLength(MAX_SHORT_ID_LENGTH)
  alias?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_EXPIRATION_MS)
  expireMs?: number;
}

export function isShortId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_SHORT_ID_LENGTH && BASE62_PATTERN.test(value);
}
