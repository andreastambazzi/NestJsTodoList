
import { Module } from '@nestjs/common';
import { UserService } from '../services/UserService';


@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
