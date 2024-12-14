import { Module } from '@nestjs/common';
import { CaptableController } from './controllers/captable.controller';
import { EventController } from './controllers/event.controller';
import { StockRegisterController } from './controllers/stockRegister.controller';
import { CaptableService } from './services/captable.service';
import { EventService } from './services/event.service';
import { StockRegisterService } from './services/stockRegister.service';
import { TransactionService } from './services/transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Transaction } from './entities/transaction.entity';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOSTNAME.toString().trim(),
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [Event, Transaction],
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Event, Transaction]),
  ],
  controllers: [CaptableController, EventController, StockRegisterController],
  providers: [
    TransactionService,
    CaptableService,
    EventService,
    StockRegisterService,
  ],
  exports: [TransactionService],
})
export class AppModule {}
