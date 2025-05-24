import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { EventEntity } from './entities/event.entity';
import { BlacklistToken } from 'src/auth/entities/blackListToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity, BlacklistToken])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService, TypeOrmModule.forFeature([EventEntity])],
})
export class EventsModule {}
