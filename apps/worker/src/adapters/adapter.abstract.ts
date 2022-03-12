import { HttpService } from "@nestjs/axios"
import { Logger } from "@nestjs/common"
import { AxiosErrorTransformer } from "apps/util/axios.error.transformer"
import { ObservableInput } from "rxjs"
import { WorkerConfigDto } from "../worker.config.dto"

export abstract class Adapter {

    readonly name: string
    readonly timeout: number
    protected readonly logger: Logger
    protected readonly httpService: HttpService

    constructor(streamDescription: WorkerConfigDto, httpService: HttpService) {
        this.name = streamDescription.adapter
        this.timeout = streamDescription.timeout
        this.httpService = httpService
    }

    protected transformAxiosError(error, outputTransfomer = JSON.stringify): ObservableInput<any> {
        return AxiosErrorTransformer.transform(this.logger, error, outputTransfomer)
    }
}