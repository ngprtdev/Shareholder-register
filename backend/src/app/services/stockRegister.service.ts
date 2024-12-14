import { forwardRef, Inject } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { StockRegisterResponse } from "../responses/stockRegister.response";

export class StockRegisterService {
    constructor(
        @Inject(forwardRef(() => TransactionService)) private readonly transactionService: TransactionService
    ) {}

    async get(): Promise<StockRegisterResponse[]> {
        throw new Error("Method not implemented.");
    }
}