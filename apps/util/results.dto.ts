import { IsDefined, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class ResultsDto {

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  readonly adapter: string

  @IsDefined()
  @IsNotEmpty()
  readonly payload: PayloadInterface

  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly timestamp: Number

  constructor(adapter: string, payload: Payload) {
    this.adapter = adapter
    this.payload = payload
    this.timestamp = Math.floor(Date.now() / 1000)
  }

}

interface PayloadInterface {
  id: string
  filename: string
  rawData?: object
}

export class Payload implements PayloadInterface {

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public id: string

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  public filename: string

  public rawData?: object

  constructor(id: string, filename: string, rawData?: object) {
    this.id = id
    this.filename = filename
    if (rawData) { this.rawData = rawData }
  }

}