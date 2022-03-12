import { Logger } from "@nestjs/common"
import { AxiosErrorTransformer } from "apps/util/axios.error.transformer"
import { StreamDescriptionDto } from "apps/util/streamDescription.dto"
import { ObservableInput } from "rxjs"

export abstract class Adapter {

    readonly name: string
    readonly timeout: number
    protected readonly logger: Logger

    constructor(streamDescription: StreamDescriptionDto) {
        this.name = streamDescription.adapter
        this.timeout = streamDescription.timeout
    }

    protected transformAxiosError(error, outputTransfomer = JSON.stringify): ObservableInput<any> {
        return AxiosErrorTransformer.transform(this.logger, error, outputTransfomer)
    }
}