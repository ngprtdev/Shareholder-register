import { forwardRef, Inject } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { StockRegisterResponse } from '../responses/stockRegister.response';

export class StockRegisterService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}

  async get(): Promise<StockRegisterResponse[]> {
    const transactions = await this.transactionService.getAll();

    const responses: StockRegisterResponse[] = transactions.map(
      (transaction) => {
        const event = transaction.event;

        if (!event) {
          throw new Error(
            `Transaction avec l'ID ${transaction.id} n'est pas associée à un événement.`,
          );
        }

        return {
          id: transaction.id,
          date: transaction.date,
          debtor:
            transaction.type === 'DEBIT' ? transaction.contact : undefined,
          creditor:
            transaction.type === 'CREDIT' ? transaction.contact : undefined,
          transactionType: transaction.type,
          eventType: event.type,
          stock: transaction.stock,
          quantity: transaction.quantity.toString(),
        };
      },
    );

    return responses;
  }
}
