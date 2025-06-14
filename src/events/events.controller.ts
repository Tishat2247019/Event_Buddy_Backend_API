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
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create_event.dto';
import { UpdateEventDto } from './dto/update_event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { EventEntity } from './entities/event.entity';
import { PublicEventDto } from './dto/public_event_details.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EventPhoto } from './entities/event_photo.entity';

@ApiTags('Events')
@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('events/upcoming')
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiResponse({
    status: 200,
    description: 'Upcoming events list returned',
    type: [EventEntity],
  })
  getUpcoming() {
    return this.eventsService.getUpcoming();
  }

  @Get('events/previous')
  @ApiOperation({ summary: 'Get past events' })
  @ApiResponse({
    status: 200,
    description: 'Previous events list returned',
    type: [EventEntity],
  })
  getPrevious() {
    return this.eventsService.getPrevious();
  }

  @Get('events/search')
  @ApiOperation({ summary: 'Search events by name or description (public)' })
  @ApiResponse({
    status: 200,
    description: 'List of events matching search query',
    type: [PublicEventDto],
  })
  searchEvents(@Query('q') q: string) {
    return this.eventsService.searchEvents(q);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get details of a single event by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Event found',
    type: EventEntity,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  getEvent(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findById(id);
  }

  @Get('events/:id/stats')
  @ApiOperation({ summary: 'Get stats for a specific event' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Event stats returned' })
  getEventStats(@Param('id') id: number) {
    return this.eventsService.getEventStats(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Get('admin/events')
  @ApiOperation({ summary: 'Get all events (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All events returned',
    type: [EventEntity],
  })
  getAllAdmin() {
    return this.eventsService.getAllEventsAdmin();
  }

  @Get('public/events')
  @ApiOperation({ summary: 'Get all events (Public)' })
  @ApiResponse({
    status: 200,
    description: 'All public events returned',
    type: [PublicEventDto],
  })
  getAllPublic(): Promise<PublicEventDto[]> {
    return this.eventsService.getAllEventsPublic();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Post('admin/events')
  @ApiOperation({ summary: 'Create a new event (Admin only)' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: EventEntity,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Request() req, @Body() dto: CreateEventDto) {
    const adminId = req.user.userId;
    // console.log(adminId);
    return this.eventsService.create(adminId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Patch('admin/events/:id')
  @ApiOperation({ summary: 'Update an existing event (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: EventEntity,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEventDto,
  ) {
    const adminId = req.user.userId;
    return this.eventsService.update(id, adminId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @Delete('admin/events/:id')
  @ApiOperation({ summary: 'Delete an event (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.delete(id);
  }

  @Post('admin/:eventId/photos')
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/events',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `event-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a photo for an event (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Photo uploaded successfully',
    type: EventPhoto,
  })
  @ApiParam({ name: 'eventId', type: Number })
  async uploadPhoto(
    @Param('eventId', ParseIntPipe) eventId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const path = `uploads/events/${file.filename}`;
    return this.eventsService.addPhoto(eventId, path);
  }
}
