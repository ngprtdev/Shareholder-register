import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, Min, ValidateIf } from "class-validator";
import { EventType } from "../enums/eventType.enum";

export class EventDTO {
    @IsNotEmpty()
    @IsEnum(EventType)
    type!: EventType;

    @IsNotEmpty()
    @IsDateString()
    date!: string;

    @IsNotEmpty()
    @IsString()
    stock!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity!: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    unitPrice!: number

    @ValidateIf((o: EventDTO) => [EventType.EMISSION, EventType.EXERCICE].includes(o.type))
    @IsNotEmpty()
    @IsString()
    contact: string

    @ValidateIf((o: EventDTO) => o.type === EventType.TRANSFERT)
    @IsNotEmpty()
    @IsString()
    seller: string

    @ValidateIf((o: EventDTO) => o.type === EventType.TRANSFERT)
    @IsNotEmpty()
    @IsString()
    transferee: string
}