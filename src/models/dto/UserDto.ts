import { ApiProperty } from '@nestjs/swagger';
import { UserDb } from '../db/UserDb';
import { Length, IsEmail, IsStrongPassword, IsNumber, IsOptional, MinLength } from 'class-validator';
import { DbDefines } from '../../defines/DbDefines';
import { ApiErrorsDefines } from '../../defines/ApiErrorsDefines';

/**
 * ############################################################################
 * 
 *  Classe descrittore del modello User per il trasferimento dati
 * 
 */
export class UserDto {

  @ApiProperty({    
    example: 1
  })
  @IsOptional()
  @IsNumber()
  public id: number | null;
  
  @ApiProperty({    
    example: "SuperFrizzo"
  })
  @Length(1, DbDefines.DB_USERS_USERNAME_MAX_LEN , { message: ApiErrorsDefines.ERR_INVALID_USERNAME })
  public username: string | null;

  @ApiProperty({    
    example: "ApritiSesamo1!"
  })
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

  @ApiProperty({    
    example: "Ciccio"
  })
  @IsOptional()
  @Length(1, DbDefines.DB_USERS_FIRSTNAME_MAX_LEN , { message: ApiErrorsDefines.ERR_INVALID_FIRSTNAME })
  public firstname: string | null; 

  @ApiProperty({    
    example: "Frizzo"
  })
  @IsOptional()
  @Length(1, DbDefines.DB_USERS_LASTNAME_MAX_LEN , { message: ApiErrorsDefines.ERR_INVALID_LASTNAME })  
  public lastname: string | null ;

  @ApiProperty({    
    example: "super.frizzo@gmail.com"
  })
  @IsEmail()
  @Length(1, DbDefines.DB_USERS_EMAIL_MAX_LEN , { message: ApiErrorsDefines.ERR_INVALID_EMAIL })  
  public email: string | null;
  
  /**
   * ---------------------------------------------------------------------------------
   * @param id 
   * @param username 
   * @param password 
   * @param firstname 
   * @param lastname 
   * @param email 
   */
  constructor(id?: number, username?: string, password?: string, firstname?: string, lastname?: string, email?: string) {
    this.username = username !== undefined ? username : null ;
    this.password = password !== undefined ? password : null ;
    this.id = id !== undefined ? id : null;
    this.firstname = firstname !== undefined ? firstname : null;
    this.lastname = lastname !== undefined ? lastname : null;
    this.email = email !== undefined ? email : null;  
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
    user.firstname = this.firstname;
    user.lastname = this.lastname;
    user.email = this.email;

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
  public static getFromDbIsrance( user: UserDb, showClearpwd?: boolean) : UserDto {
    return new UserDto(
      user.id,
      user.username,
      showClearpwd != undefined && showClearpwd ? user.password : "********", 
      user.firstname,
      user.lastname,
      user.email      
    );
  }
    

}
