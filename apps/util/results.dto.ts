import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  AdapterType,
  AdapterTypes,
} from '../worker/src/adapters/adapterType.enum';

export class Payload {
  /**
   * Payload's unique identifier
   * @example "e79a48ee-4bc7-4738-9d69-4d8c567d6ad9"
   */
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public id: string;

  /**
   * An S3 storage reference path to the file containing the raw data.
   * @example "results/iqair/e79a48ee-4bc7-4738-9d69-4d8c567d6ad9.json"
   */
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public filename: string;

  /**
   * A temporary interface used to transmit the raw data in place of the S3 based filename property.
   * @deprecated Superseded by the filename property.
   * @example { anyData: 1234567 }
   */
  public rawData?: Record<string, unknown>;

  constructor(id: string, filename: string, rawData?: Record<string, unknown>) {
    this.id = id;
    this.filename = filename;
    if (rawData) {
      this.rawData = rawData;
    }
  }
}
export class ResultsDto {
  /**
   * An unique name for the data-stream adapter type.
   * @example "IQAIR_DAILY"
   */
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @IsEnum(AdapterTypes.getAll())
  readonly adapter: AdapterType;

  /**
   * A standardized envelope used for communicating the lcoation of the raw data.
   */
  @IsDefined()
  @IsNotEmpty()
  readonly payload: Payload;

  /**
   * Timestamp representing the time of creation of this object.
   */
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly timestamp: number = Math.floor(Date.now() / 1000);

  constructor(adapter: AdapterType, payload: Payload) {
    this.adapter = adapter;
    this.payload = payload;
  }
}
