import { Controller, Get } from "@nestjs/common";
import { CaptableService } from "../services/captable.service";
import { CaptableResponse } from "../responses/captable.response";

@Controller("captable/")
export class CaptableController {
    constructor(
        private readonly captableService: CaptableService
    ) {}

    @Get()
    async get(): Promise<CaptableResponse[]> {
        return await this.captableService.get()
    }
}