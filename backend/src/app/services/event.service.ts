import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventDTO } from '../dto/event.dto';
import { Event } from '../entities/event.entity';
import { TransactionService } from './transaction.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @Inject(forwardRef(() => TransactionService)) private readonly transactionService: TransactionService
  ) {}
  
  async create(dto: EventDTO): Promise<Event> {
    throw new Error('Method not implemented.');
  }

  async getAll(): Promise<Event[]> {
    throw new Error('Method not implemented.');
  }

  async get(id: string): Promise<Event> {
    throw new Error('Method not implemented.');
  }

  async update(id: string, dto: EventDTO): Promise<Event> {
    throw new Error('Method not implemented.');
  }

  async delete(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
