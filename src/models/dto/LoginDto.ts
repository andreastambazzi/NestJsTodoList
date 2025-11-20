import { ApiProperty } from '@nestjs/swagger';
import { DbDefines } from '../../defines/DbDefines';
import { ApiErrorsDefines } from '../../defines/ApiErrorsDefines';
import { Length, IsEmail, IsStrongPassword, IsNumber, IsOptional, MinLength } from 'class-validator';


/**
 * ############################################################################
 * 
 *  Classe descrittore del modello Login per il trasferimento dati
 * 
 */
export class LoginDto {
  
  @ApiProperty({
    description: "nome utente",
    example: "CiccioFrizzo"
  })
  @Length(1, DbDefines.DB_USERS_USERNAME_MAX_LEN , { message: ApiErrorsDefines.ERR_INVALID_USERNAME })
  public username: string | null;

  @ApiProperty({
    description: "password utente",
    example: "Abcd1234!"
  })
  @Length( DbDefines.DB_USERS_PASSWORD_MIN_LEN, DbDefines.DB_USERS_PASSWORD_MAX_LEN)
  @MinLength(DbDefines.DB_USERS_PASSWORD_MIN_LEN)
  public password: string | null;
  
  constructor(username?: string, password?: string) {
    this.username = username !== undefined ? username : null ;
    this.password = password !== undefined ? password : null ; 
  }

  public toString() : string {
    return "{ username: "+this.username+"\npassword: "+this.password+"\n }";
  }
}
