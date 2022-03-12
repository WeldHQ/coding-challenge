import { IsDefined, IsIn, IsNotEmpty, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class WorkerConfigDto {

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    @IsIn(['IQAIR_DAILY', 'MOCK'])
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