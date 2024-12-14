import { Column, Entity, Index, OneToMany } from "typeorm";
import { UplawBaseEntity } from "./base.entity";
import { EventType } from "../enums/eventType.enum";
import { Transaction } from "./transaction.entity";

export class Issuance {
    @Column({type: "varchar", nullable: false})
    contact!: string;
}

export class Exercise {
    @Column({type: "varchar", nullable: false})
    contact!: string;
}

export class Transfer {
    @Column({type: "varchar", nullable: false})
    seller: string;
  
    @Column({type: "varchar", nullable: false})
    transferee: string;
}

export type EventData = Issuance | Exercise | Transfer;

@Entity()
export class Event extends UplawBaseEntity {
    @Index()
    @Column({ type: "timestamp", nullable: true })
    date!: string;
  
    @Index()
    @Column({ type: "enum", enum: EventType, nullable: false })
    type!: EventType;

    @Column({type: "varchar", nullable: false})
    stock!: string;

    @Column({type: "integer", nullable: false})
    quantity!: number;

    @Column({type: "float", nullable: false})
    unitPrice!: number;

    @Column({type: "json", nullable: false})
    data: EventData

    @OneToMany(() => Transaction, (x) => x.event)
    transactions: Transaction[]
}