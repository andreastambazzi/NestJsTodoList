
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from './UserService';
import { AuthUtils } from '../utils/authUtils';
import { UserDto } from '../models/dto/UserDto';
import { AppConfig } from './appConfig';
import { AuthDto } from '../models/dto/AuthDto';

/**
 * ############################################################################
 * 
 * Classe descrittore della business logic per la gestione dell'autenticazione
 * utente
 * 
 */
@Injectable()
export class AuthService {

  private readonly logger = new Logger("AuthService");
  private readonly appConfig = AppConfig.getInstance();

  constructor(
    private userService: UserService    
  ) {
    this.logger.localInstance.setLogLevels( this.appConfig.getActiveLogLevels() );
  }

  /**
   * ---------------------------------------------------------------------------------
   * @param username 
   * @param password 
   * @returns 
   */
  async signIn(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findOneByUsername(username,password);
      if ( user == null || user.id == null  ) {
        throw new UnauthorizedException();
      }
      
      return {"authToken": AuthUtils.jwtGenrator( AuthDto.getFromDbIsrance(user,true) ) };
  
    }
    catch ( error ) {
      this.logger.error("signIn "+error);
      throw new UnauthorizedException();
    }
    
  }

}
