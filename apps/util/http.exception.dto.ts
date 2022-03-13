import { HttpStatus } from '@nestjs/common';
import { IsEnum, IsISO8601, IsNumber, IsString } from 'class-validator';

/**
 * This particular class only exists in order for us to generate
 * Swagger docs and should not ever be used in the application.
 * @deprecated Use HttpException from '@nestjs/common' instead!
 */
export class HttpException {
  /**
   * A standard HTTP Code.
   * @example 500
   */
  @IsNumber()
  @IsEnum(HttpStatus)
  statusCode: HttpStatus;

  /**
   * An error message. Usually a standard one.
   * @example "Internal server error"
   */
  @IsString()
  message: string;

  /**
   * A standard ISO8601 date string with a timezone.
   * @example "2022-03-13T12:09:26.878Z"
   */
  @IsISO8601()
  timestamp: string;

  /**
   * API path that was requested.
   * @example "/private/start"
   */
  @IsString()
  path: string;
}
