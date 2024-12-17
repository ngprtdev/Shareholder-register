import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionDTO } from '../dto/transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../enums/transactionType.enum';
import { Event } from '../entities/event.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(dto: TransactionDTO, event: Event): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...dto,
      event,
    });
    return this.transactionRepository.save(transaction);
  }

  async createMirrorTransaction(
    originalTransaction: TransactionDTO,
    contact: string,
    event: Event,
  ): Promise<Transaction> {
    const mirrorTransaction = this.transactionRepository.create({
      date: originalTransaction.date,
      type: TransactionType.CREDIT,
      contact,
      stock: originalTransaction.stock,
      quantity: originalTransaction.quantity,
      event,
    });
    return this.transactionRepository.save(mirrorTransaction);
  }

  async getAll(): Promise<Transaction[]> {
    throw new Error('Method not implemented.');
  }

  async getByContact(): Promise<Transaction[]> {
    throw new Error('Method not implemented.');
  }
}
