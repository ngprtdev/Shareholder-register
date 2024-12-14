import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { Event } from '../entities/event.entity';
import { EventDTO } from '../dto/event.dto';

@Controller("events/")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(
    @Body() dto: EventDTO
  ): Promise<Event> {
    return await this.eventService.create(dto)
  }

  @Get()
  async getAll(): Promise<Event[]> {
    return await this.eventService.getAll()
  }

  @Get(":id")
  async get(
    @Param("id", new ParseUUIDPipe()) id: string
  ): Promise<Event> {
    return await this.eventService.get(id)
  }

  @Put(":id")
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: EventDTO
  ): Promise<Event> {
    return await this.eventService.update(id, dto)
  }

  @Delete(":id")
  async delete(
    @Param("id", new ParseUUIDPipe()) id: string
  ): Promise<any> {
    return await this.eventService.delete(id);
  }
}
