import {
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import {
  AdapterType,
  AdapterTypes,
} from '../worker/src/adapters/adapterType.enum';

export class StreamDescriptionDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsIn(AdapterTypes.getAll())
  readonly adapter: AdapterType;

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
    adapter: AdapterType,
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
