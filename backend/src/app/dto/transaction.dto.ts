import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TransactionType } from "../enums/transactionType.enum";

export class TransactionDTO {
    @IsNotEmpty()
    @IsDateString()
    date!: string;

    @IsNotEmpty()
    @IsEnum(TransactionType)
    type!: TransactionType;

    @IsNotEmpty()
    @IsString()
    contact!: string;

    @IsNotEmpty()
    @IsString()
    stock!: string;

    @IsNotEmpty()
    @IsNumber()
    quantity!: number;
}