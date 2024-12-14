import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UplawBaseEntity } from "./base.entity";
import { TransactionType } from "../enums/transactionType.enum";
import { Event } from "./event.entity";

@Entity()
export class Transaction extends UplawBaseEntity {
    @Index()
    @Column({ type: "timestamp", nullable: true })
    date!: string;
  
    @Index()
    @Column({ type: "enum", enum: TransactionType, nullable: false })
    type!: TransactionType;

    @Column({type: "varchar", nullable: false})
    contact!: string;

    @Column({type: "varchar", nullable: false})
    stock!: string;

    @Column({type: "integer", nullable: false})
    quantity!: number;

    @JoinColumn({ name: "event_id" })
    @ManyToOne(() => Event, (x) => x.transactions, {
        onDelete: "CASCADE",
        nullable: true,
    })
    event: Event;
}