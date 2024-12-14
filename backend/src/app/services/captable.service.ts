import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CaptableResponse } from "../responses/captable.response";
import { TransactionService } from "./transaction.service";

@Injectable()
export class CaptableService {
    constructor(
        @Inject(forwardRef(() => TransactionService)) private readonly transactionService: TransactionService
    ) {}

    async get(): Promise<CaptableResponse[]> {
        throw new Error("Method not implemented.");
    }
}