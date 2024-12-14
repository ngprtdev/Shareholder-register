import { EventType } from "../enums/eventType.enum";
import { TransactionType } from "../enums/transactionType.enum";

export class StockRegisterResponse {
    date!: string;

    debtor?: string;

    creditor?: string;

    transactionType!: TransactionType;

    eventType!: EventType;

    stock!: string;

    quantity!: string;
}