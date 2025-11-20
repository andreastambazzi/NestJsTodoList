
import { Module } from '@nestjs/common';
import { UsersModule } from './UserModule';
import { AuthService } from '../services/AuthService';
import { AuthController } from '../controllers/AuthController';

@Module({
  imports: [
    UsersModule    
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
