import { Controller, Get } from "@nestjs/common";
import { StockRegisterService } from "../services/stockRegister.service";
import { StockRegisterResponse } from "../responses/stockRegister.response";

@Controller("register/")
export class StockRegisterController {
    constructor(
        private readonly stockRegisterService: StockRegisterService
    ) {}

    @Get()
    async get(): Promise<StockRegisterResponse[]> {
        return await this.stockRegisterService.get()
    }
}