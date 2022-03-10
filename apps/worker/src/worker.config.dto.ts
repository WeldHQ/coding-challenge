import { IsDefined, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsPositive, Min } from "class-validator";

export class WorkerConfigDto {
    @IsIn(['IQAIR_DAILY'])
    readonly adapter: string

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(10000)
    readonly interval: number

    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(3000)
    readonly timeout: number

    constructor(adapter: string, interval: number, timeout: number) {
        this.adapter = adapter
        this.interval = interval
        this.timeout = timeout
    }

}