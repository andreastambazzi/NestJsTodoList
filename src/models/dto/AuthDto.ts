import { ApiProperty } from '@nestjs/swagger';
import { UserDb } from '../db/UserDb';
import { validateSync, Length, IsEmail, IsPhoneNumber, IsBoolean, IsStrongPassword, minLength, IsNumber, IsOptional, MinLength } from 'class-validator';
import { DbDefines } from '../../defines/DbDefines';
import { ApiErrorsDefines } from '../../defines/ApiErrorsDefines';

/**
 * ############################################################################
 * 
 *  Classe descrittore del modello Autenticazione per il trasferimento dati
 * 
 */
export class AuthDto {

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public id: number | null;
  
  @ApiProperty()
  @Length(1, DbDefines.DB_USERS_USERNAME_MAX_LEN , { message: ApiErrorsDefines.ERR_INVALID_USERNAME })
  public username: string | null;

  @ApiProperty()
  @Length( DbDefines.DB_USERS_PASSWORD_MIN_LEN, DbDefines.DB_USERS_PASSWORD_MAX_LEN)
  @MinLength(DbDefines.DB_USERS_PASSWORD_MIN_LEN)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }, 
    { message: ApiErrorsDefines.ERR_INVALID_PASSWORD }
  )
  public password: string | null;

    
  /**
   * ---------------------------------------------------------------------------------
   * @param id 
   * @param username 
   * @param password    
   */
  constructor(id?: number, username?: string, password?: string ) {
    this.username = username !== undefined ? username : null ;
    this.password = password !== undefined ? password : null ;
    this.id = id !== undefined ? id : null;    
  }

  /**
   * ---------------------------------------------------------------------------------
   * Genera un modello utilizzabile per l'interazione con il database sulla tabella 
   * utenti convertendo i dati dall'oggetto corrente
   *    
   * @returns 
   */
  public getUserDbIstance() : UserDb {
    var user : UserDb = new UserDb();
    user.username = this.username;
    user.password = this.password;    
    return user;
  }

  /**
   * ---------------------------------------------------------------------------------
   * Genera un modello dto convertendo i dati dall'oggetto user recuperato dal 
   * database
   * 
   * @param user 
   * @param showClearpwd 
   * @returns 
   * 
   */
  public static getFromDbIsrance( user: UserDb, showClearpwd?: boolean) : AuthDto {
    return new AuthDto(
      user.id,
      user.username,
      showClearpwd != undefined && showClearpwd ? user.password : "********",       
    );
  }


  /**
   * ---------------------------------------------------------------------------------
   * Genera un modello dto convertendo i dati dall'oggetto user recuperato dal 
   * database
   * 
   * @param user 
   * @param showClearpwd 
   * @returns 
   * 
   */
  public static parseFromRawObject( payload: any) : AuthDto {
    return new AuthDto(
      payload.id,
      payload.username,
      payload.password
    );
  }

  /**
   * ---------------------------------------------------------------------------------
   * @returns 
   */
  public toString() : string {
    return "{ id:"+this.id+" username:"+this.username+" password:"+this.password+" }";
  }
    

}