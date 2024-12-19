import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EventDTO } from '../dto/event.dto';
import { Event } from '../entities/event.entity';
import { EventType } from '../enums/eventType.enum';
import { TransactionService } from './transaction.service';
import { TransactionType } from '../enums/transactionType.enum';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) {}

  private readonly eventToTransactionTypeMap: Record<
    EventType,
    TransactionType
  > = {
    [EventType.EMISSION]: TransactionType.CREDIT,
    [EventType.EXERCICE]: TransactionType.DEBIT,
    [EventType.TRANSFERT]: TransactionType.DEBIT,
  };

  async create(dto: EventDTO): Promise<Event> {
    const { type, ...otherFields } = dto;

    if (!(type in this.eventToTransactionTypeMap)) {
      throw new Error(`Invalid EventType: ${type}`);
    }

    const transactionType = this.eventToTransactionTypeMap[type];

    const eventData = this.extractEventData(dto);

    const event = this.eventRepository.create({
      ...otherFields,
      type,
      data: eventData,
    });
    await this.eventRepository.save(event);

    await this.transactionService.create(
      {
        date: dto.date,
        type: transactionType,
        contact: dto.contact || dto.seller || '',
        stock: dto.stock,
        quantity: dto.quantity,
      },
      event,
    );

    if (type === EventType.TRANSFERT && dto.transferee) {
      await this.transactionService.createMirrorTransaction(
        {
          date: dto.date,
          type: TransactionType.DEBIT,
          contact: dto.seller!,
          stock: dto.stock,
          quantity: dto.quantity,
        },
        dto.transferee,
        event,
      );
    } else if (type === EventType.EXERCICE && dto.contact) {
      await this.transactionService.createMirrorTransaction(
        {
          date: dto.date,
          type: TransactionType.DEBIT,
          contact: dto.contact,
          stock: 'Actions',
          quantity: dto.quantity,
        },
        dto.contact,
        event,
      );
    }

    return event;
  }

  private extractEventData(dto: EventDTO): Event['data'] {
    switch (dto.type) {
      case EventType.EMISSION:
      case EventType.EXERCICE:
        return { contact: dto.contact! };
      case EventType.TRANSFERT:
        return { seller: dto.seller!, transferee: dto.transferee! };
      default:
        throw new Error(`Unhandled EventType: ${dto.type}`);
    }
  }

  async getAll(): Promise<Event[]> {
    try {
      const events = await this.eventRepository.find();

      events.forEach((event) => {
        const utcDate = new Date(event.date);
        const utcPlusOneDate = new Date(utcDate.getTime() + 3600000);

        event.date = utcPlusOneDate.toISOString();
      });

      return events;
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  async update(id: string, dto: EventDTO): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new Error(`Event with ID ${id} not found.`);
    }

    const updatedEventData = this.extractEventData(dto);

    event.type = dto.type;
    event.date = dto.date;
    event.data = updatedEventData;
    event.stock = dto.stock;
    event.quantity = dto.quantity;
    event.unitPrice = dto.unitPrice;

    await this.eventRepository.save(event);

    return event;
  }

  async delete(id: string): Promise<void> {
    try {
      const eventToDelete = await this.eventRepository.findOne({
        where: { id },
      });
      if (!eventToDelete) {
        throw new Error(`Event with ID ${id} not found`);
      }

      await this.eventRepository.remove(eventToDelete);

      console.log(`Event with ID ${id} has been deleted`);
    } catch (error) {
      console.error('Failed to delete event:', error);
      throw new Error(`Error deleting event: ${error.message}`);
    }
  }
}
