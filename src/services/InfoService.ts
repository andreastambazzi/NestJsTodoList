import { Injectable } from '@nestjs/common';
import { InfoDto } from '../models/dto/InfoDto';

@Injectable()
export class InfoService {
  getInfo(): InfoDto {
    return new InfoDto('Nest js test project');
  }
  
}
