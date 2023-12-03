import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ReqUser } from 'src/common';
import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private eventService: EventService) {}

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) eventId: number) {
    return this.eventService.getOne(eventId);
  }

  @Get()
  getAll(@ReqUser('id') userId: number) {
    return this.eventService.getAll(userId);
  }

  @Post('create')
  create(@ReqUser('id') userId: number, @Body() dto: CreateEventDto) {
    return this.eventService.create(userId, dto);
  }
}