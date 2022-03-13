import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { AllowedAdapters } from '../worker/src/adapters/adapter.factory';

export class StreamDescriptionDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEnum(AllowedAdapters)
  readonly adapter: AllowedAdapters;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(10000)
  readonly interval: number;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(3000)
  readonly timeout: number;

  readonly config?: any;

  constructor(
    adapter: AllowedAdapters,
    interval: number,
    timeout: number,
    config?: any,
  ) {
    this.adapter = adapter;
    this.interval = interval;
    this.timeout = timeout;
    this.config = config;
  }
}
