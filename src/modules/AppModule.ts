import { Module } from '@nestjs/common';
import { InfoController } from '../controllers/InfoController';
import { InfoService } from '../services/InfoService';
import { AuthController } from '../controllers/AuthController';
import { UserService } from '../services/UserService';
import { DatabaseModule } from './DatabaseModule';
import { userProviders } from '../providers/UserProviders';
import { UserController } from '../controllers/UserController';
import { AuthService } from '../services/AuthService';
import { todoProviders } from '../providers/TodoProviders';
import { ToDoController } from '../controllers/ToDoController';
import { TodoService } from '../services/TodoService';


@Module({
  imports: [
    DatabaseModule    
  ],
  
  controllers: [
    InfoController,
    AuthController,
    UserController,
    ToDoController
  ],
  
  providers: [
    InfoService,
    UserService,
    AuthService,
    TodoService,
    ...userProviders,
    ...todoProviders
  ],
})
export class AppModule {}
