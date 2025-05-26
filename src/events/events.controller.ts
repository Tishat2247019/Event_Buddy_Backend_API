import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create_event.dto';
import { UpdateEventDto } from './dto/update_event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

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

  @Get('events/:id/stats')
  getEventStats(@Param('id') id: number) {
    return this.eventsService.getEventStats(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/events')
  getAll() {
    return this.eventsService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/events')
  create(@Request() req, @Body() dto: CreateEventDto) {
    // const eventData = {
    //   ...dto,
    //   date: new Date(dto.date),
    // };
    // console.log(dto);
    // console.log(eventData);
    const adminId = req.user.userId;
    return this.eventsService.create(adminId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/events/:id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventDto,
  ) {
    const adminId = req.user.userId;
    // const updatedData = {
    //   ...dto,
    //   date: dto.date ? new Date(dto.date) : undefined,
    // };

    return this.eventsService.update(id, adminId, dto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/events/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.delete(id);
  }
}
