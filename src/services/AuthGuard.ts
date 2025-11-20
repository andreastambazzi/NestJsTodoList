
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUtils } from '../utils/authUtils';
import { AppConfig } from './appConfig';
import { UserService } from './UserService';
import { UserDto } from '../models/dto/UserDto';
import { AuthDto } from '../models/dto/AuthDto';
import { UserDb } from '../models/db/UserDb';

/**
 * ################################################################
 * 
 *  Classe gestione Autenticazione/Autorizzazione
 * 
 */
@Injectable()
export class AuthGuard implements CanActivate {

    /**
     * ---------------------------------------------------------------------------
     */
    private readonly logger = new Logger("AuthGuard");
    private readonly appConfig = AppConfig.getInstance();
    
    constructor(
        private userService: UserService
    ) {
        this.logger.localInstance.setLogLevels( this.appConfig.getActiveLogLevels() );
    }

    /**
     * ---------------------------------------------------------------------------
     * @param context 
     * @returns 
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.getTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {

            var payload = AuthUtils.authenticationVerify(request);

            if ( payload.data ) {
                var decoded = AuthDto.parseFromRawObject(payload.data);
                var user : UserDb = await this.userService.findOneById(decoded.id);

                if ( user != null && user.id == decoded.id ) {
                    request['user'] = UserDto.getFromDbIsrance(user);
                    return true;
                }            
            }
            
            return false;

        } 
        catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    /**
     * ---------------------------------------------------------------------------
     * @param request 
     * @returns 
     */
    private getTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
