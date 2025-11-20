import { Controller, Get } from '@nestjs/common';
import { InfoService } from '../services/InfoService';
import { InfoDto } from '../models/dto/InfoDto';

@Controller("info")
export class InfoController {
  constructor(private readonly appService: InfoService) {}

  @Get('/')
  getInfo(): InfoDto {
    return this.appService.getInfo();
  }
    
}
