import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
<<<<<<< HEAD
=======
  Request,
>>>>>>> main
  ParseIntPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create_event.dto';
import { UpdateEventDto } from './dto/update_event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
<<<<<<< HEAD
import { Roles } from 'src/auth/guards/decorators/roles.decorator';
=======
import { Roles } from 'src/auth/decorators/roles.decorator';
>>>>>>> main

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

<<<<<<< HEAD
  // 🟢 Public APIs
=======
>>>>>>> main
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

<<<<<<< HEAD
  // 🔐 Admin APIs
=======
>>>>>>> main
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/events')
  getAll() {
    return this.eventsService.getAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/events')
<<<<<<< HEAD
  create(@Body() dto: CreateEventDto) {
    const eventData = {
      ...dto,
      date: new Date(dto.date),
    };
    return this.eventsService.create(eventData);
=======
  create(@Request() req, @Body() dto: CreateEventDto) {
    // const eventData = {
    //   ...dto,
    //   date: new Date(dto.date),
    // };
    // console.log(dto);
    // console.log(eventData);
    const adminId = req.user.userId;
    return this.eventsService.create(adminId, dto);
>>>>>>> main
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('admin/events/:id')
<<<<<<< HEAD
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEventDto) {
    const updatedData = {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
    };

    return this.eventsService.update(id, updatedData);
  }

=======
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
>>>>>>> main
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/events/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.delete(id);
  }
}
