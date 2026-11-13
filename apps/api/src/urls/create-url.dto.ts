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
import { BASE62_PATTERN, MAX_SHORT_ID_LENGTH } from 'url-constants';

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
