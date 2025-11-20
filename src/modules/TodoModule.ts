
import { Module } from '@nestjs/common';
import { TodoService } from '../services/TodoService';


@Module({
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}
