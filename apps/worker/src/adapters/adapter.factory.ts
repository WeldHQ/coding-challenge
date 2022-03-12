import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { IQAirAdapter } from "./iqair.adapter";
import { WorkerConfigDto } from "../worker.config.dto";

@Injectable()
export class AdapterFactory {

    constructor(private readonly httpService: HttpService) { }

    create(streamDescription: WorkerConfigDto) {
        return new IQAirAdapter(streamDescription, this.httpService)
    }
}