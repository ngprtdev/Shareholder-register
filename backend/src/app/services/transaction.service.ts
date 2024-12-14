import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TransactionDTO } from "../dto/transaction.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "../entities/transaction.entity";

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>
    ) {}

    async create(dto: TransactionDTO): Promise<Transaction> {
        throw new Error("Method not implemented.");
    }

    async getAll(): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }

    async getByContact(): Promise<Transaction[]> {
        throw new Error("Method not implemented.");
    }
}