import { Controller, Get, Post, Body, Res, HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { Response } from 'express'; 
import { UserDto } from '../models/dto/UserDto';
import { LoginDto } from '../models/dto/LoginDto';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from '../services/UserService';
import { UserDb } from '../models/db/UserDb';
import GenUtils from '../utils/genUtils';
import { AppConfig } from '../services/appConfig';
import { AuthService } from '../services/AuthService';


/**
 * ############################################################################
 * 
 *  Controller per la gestione dell'autenticazione e della registrazione 
 *  utente
 *  
 */
@Controller("auth")
export class AuthController {

  private readonly logger = new Logger("AuthController");
  private readonly appConfig = AppConfig.getInstance();

  /**
   * ---------------------------------------------------------------------------------
   * @param userService 
   */
  constructor(     
    private authService: AuthService,
    private userService: UserService,
  ) {

    this.logger.localInstance.setLogLevels( this.appConfig.getActiveLogLevels() );

  }

  
  /**
   * ---------------------------------------------------------------------------------
   * Api di autenticazione al servizio
   * Esegue il login utente e restituisce i dati del profilo
   * @returns 
   */
  @Post('login')
  @ApiOperation({ summary: 'Esegue il login utente e restituisce i dati del profilo' })
  getInfo(
    @Body(new ValidationPipe()) login: LoginDto
  ): Promise<any> {    
    return this.authService.signIn(login.username, login.password);
  }

  
  /**
   * ---------------------------------------------------------------------------------
   * @param user 
   * @returns 
   */    
  @Post('registerUser')
  @ApiOperation({ summary: 'Effettua la registrazione di un nuovo utente' })
  async registerUser(
    @Body(new ValidationPipe()) user: UserDto, 
    @Res() res: Response 
  ): Promise<void> {

    try {      
      var userResp : UserDb = await this.userService.create(user);
      res.status(HttpStatus.OK).json( 
        GenUtils.generateSuccessObject(
          UserDto.getFromDbIsrance(userResp, false) 
        )
      );      
    }
    catch( error ) {

      this.logger.error(error.toString());

      res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: error        
      });
    }

  }
    

}