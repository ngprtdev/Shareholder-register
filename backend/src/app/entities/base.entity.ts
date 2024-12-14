import {
    BaseEntity,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    VersionColumn,
  } from "typeorm";
  import { v4 } from "uuid";
  
  export abstract class UplawBaseEntity extends BaseEntity {
    protected constructor() {
      super();
      this.id = v4();
    }
  
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;
  
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;
  
    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt?: Date;
  }
  