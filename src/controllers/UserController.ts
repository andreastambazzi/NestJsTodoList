import { Controller, Get, Post, Body, Res, HttpStatus, Logger, ValidationPipe, Param, Query, UseGuards, Headers, Req, Delete } from '@nestjs/common';
import { Response } from 'express'; 
import { UserDto } from '../models/dto/UserDto';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from '../services/UserService';
import { UserDb } from '../models/db/UserDb';
import GenUtils from '../utils/genUtils';
import { AppConfig } from '../services/appConfig';
import { AuthGuard } from '../services/AuthGuard';


/**
 * ############################################################################
 * 
 *  Controller per la gestione dei dati utente
 *  
 */
@Controller("user")
export class UserController {

  private readonly logger = new Logger("UserController");  
  private readonly appConfig = AppConfig.getInstance();

  /**
   * ---------------------------------------------------------------------------------
   * @param userService 
   */
  constructor( 
    private userService: UserService    
  ) {
    this.logger.localInstance.setLogLevels( this.appConfig.getActiveLogLevels() );
  }


  /**
   * ---------------------------------------------------------------------------------
   * @param user 
   * @returns 
   */    
  @UseGuards(AuthGuard)
  @Get('getUserProfile')
  @ApiOperation({ summary: 'Restituisce i dati del profilo utente correntemente logato' })
  async getUserProfile(
      @Headers('Authorization') authorizationHeader: string,  
      @Res() res: Response, 
      @Req() req: Request  
    ): Promise<void> {
         
    var user : UserDto = req['user'];

    try {              
      var userResp : UserDb = await this.userService.findOneById(user.id);
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


  /**
   * ---------------------------------------------------------------------------------
   * @param user 
   * @returns 
   */    
  @UseGuards(AuthGuard)
  @Delete('deleteUserProfile')
  @ApiOperation({ summary: 'Archivia il profilo dell\'utente correntemente logato' })
  async deleteUserProfile(
    @Headers('Authorization') authorizationHeader: string,  
    @Res() res: Response, 
    @Req() req: Request  
  ): Promise<void> {
         
    var user : UserDto = req['user'];

    try {              
      var result : boolean = await this.userService.delete(user.id);
      res.status(HttpStatus.OK).json( 
        GenUtils.generateSuccessObject(
          result
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