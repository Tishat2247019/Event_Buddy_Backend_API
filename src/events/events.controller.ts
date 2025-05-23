import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create_event.dto';
import { UpdateEventDto } from './dto/update_event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/decorators/roles.decorator';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // 🟢 Public APIs
  @Get('events/upcoming')
  getUpcoming() {
    return this.eventsService.getUpcoming();
  }

  @Get('events/previous')
  getPrevious() {
    return this.eventsService.getPrevious();
  }

  @Get('events/:id')
  getEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findById(id);
  }

  // 🔐 Admin APIs
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/events')
  getAll() {
    return this.eventsService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/events')
  create(@Body() dto: CreateEventDto) {
    // const eventData = {
    //   ...dto,
    //   date: new Date(dto.date),
    // };
    // console.log(dto);
    // console.log(eventData);
    return this.eventsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/events/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    const updatedData = {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
    };

    return this.eventsService.update(id, updatedData);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/events/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.delete(id);
  }
}
