import {
  forwardRef,
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CaptableResponse } from '../responses/captable.response';
import { TransactionService } from './transaction.service';

@Injectable()
export class CaptableService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}

  async get(captable: any[]): Promise<CaptableResponse[]> {
    const validatedResults: CaptableResponse[] = [];

    for (const item of captable) {
      if (typeof item.contact !== 'string') {
        throw new BadRequestException('contact must be a string');
      }
      if (!Array.isArray(item.titles)) {
        throw new BadRequestException('titles should be included in an array');
      }
      if (
        typeof item.FDQuantity !== 'number' ||
        typeof item.NFDQuantity !== 'number'
      ) {
        throw new BadRequestException(
          'FDQuantity and NFDQuantity must be numbers',
        );
      }

      for (const title of item.titles) {
        if (typeof title.name !== 'string') {
          throw new BadRequestException('Name must be a string');
        }
        if (typeof title.quantity !== 'number') {
          throw new BadRequestException('Quantity must be a number');
        }
      }

      validatedResults.push({
        contact: item.contact,
        titles: item.titles,
        FDQuantity: item.FDQuantity,
        NFDQuantity: item.NFDQuantity,
      });
    }

    return validatedResults;
  }
}
