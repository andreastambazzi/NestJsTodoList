import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserDb } from '../models/db/UserDb';
import { Op, Transaction } from 'sequelize';
import { UserDto } from '../models/dto/UserDto';
import * as crypto from 'crypto';
import { ApiErrorsDefines } from '../defines/ApiErrorsDefines';
import { AppConfig } from './appConfig';
import GenUtils from '../utils/genUtils';


/**
 * ############################################################################
 * 
 * Classe descrittore della business logic per la gestione delle operazioni 
 * sui dati utente
 * 
 */
@Injectable()
export class UserService {

  private readonly logger = new Logger("UserService");
  private readonly appConfig = AppConfig.getInstance();

  /**
   * ---------------------------------------------------------------------------------
   * @param user 
   */
  constructor(
    @Inject('USER_REPOSITORY')    
    private user: typeof UserDb,
    @Inject('SEQUELIZE') private readonly sequelize 
  ) {

    this.logger.localInstance.setLogLevels( this.appConfig.getActiveLogLevels() );

  }

  /**
   * ---------------------------------------------------------------------------------
   * @returns 
   */
  async findAll(): Promise<UserDb[]> {
    return this.user.findAll();
  }

  /**
   * ---------------------------------------------------------------------------------
   * tenta la creazione di un nuovo utente, se non ci riesce solleva un'eccezione
   * @param userData 
   * @returns User or null in caso d'errore
   */    
  async create(userData: UserDto): Promise<UserDb> {    

    var user : UserDb;

    if ( userData != null  ) {     
      
      var t : Transaction = await this.sequelize.transaction();

      try {        
        user = await this.user.findOne({
            where: { 
              [Op.and] : [
                { 
                  [Op.or] : [ 
                    { username: userData.username },
                    { email: userData.email } 
                  ],
                },
                { archived: 0 }
              ]  
            },
            transaction: t            
          },        
        );

        if ( user != null  ) {          
          throw ApiErrorsDefines.ERR_USER_ALREADY_EXIST;
        }

        
        userData.password = GenUtils.getHashMd5(userData.password);

        user = await this.user.create({
            username: userData.username,
            password: userData.password,
            firstname: userData.firstname,
            lastname: userData.lastname,
            email: userData.email
          },
          { transaction: t}
        );

        if ( user == null ) {          
          throw ApiErrorsDefines.ERR_USER_CREATE_ERROR;
        }

        t.commit();
        return user;
        
      }
      catch(error) {
        t.rollback();
        throw error;
      }
    }
    else {
      throw ApiErrorsDefines.ERR_MISSING_USER_DATA;
    }

  }

  /**
   * ---------------------------------------------------------------------------------
   * Recupera il profilo utente
   * @param userId 
   * @returns 
   */
  async delete(userId: number) : Promise<boolean> {    

    var user : UserDb;
    var result : boolean = false;

    var t : Transaction = await this.sequelize.transaction();

    try {
      user = await this.user.findOne({
        where: { [Op.and] : [{ id: userId } , {archived: 0}]  },
        transaction: t
      });

      if ( user == null || user.id != userId ) {
        t.rollback();
        return false;
      }

      user.archived = true;

      await user.save({transaction: t});

      t.commit();
      result = true;

    }
    catch( error ) {
      t.rollback();
      throw error;
    }
    

    return result;

  }



  /**
   * ---------------------------------------------------------------------------------
   * Recupera il profilo utente
   * @param userId 
   * @returns 
   */
  async findOneById(userId: number) : Promise<UserDb> {    

    var user : UserDb;

    //this.logger.debug("userId: "+userId );

    user = await this.user.findOne({
      where: { [Op.and] : [{ id: userId } , {archived: 0}]  }
    });

    if ( user == null || user.id != userId ) {     
      throw ApiErrorsDefines.ERR_MISSING_USER_DATA;
    }

    return user;

  }


  /**
   * ---------------------------------------------------------------------------------
   * Recupera il profilo utente
   * @param userId 
   * @returns 
   */
  async findOneByUsername(username: string, password: string) : Promise<UserDb> {    

    this.logger.debug("@findOneByUsername username:"+username+" password:"+password );

    var user : UserDb;

    if ( password == null || password == undefined ) {
      throw ApiErrorsDefines.ERR_INVALID_PASSWORD
    }
    
    password = GenUtils.getHashMd5(password);
    
    user = await this.user.findOne({
      where: { [Op.and] : [{ username: username, password:  password } , {archived: 0}]  }
    });

    if ( user == null || user.id == null  ) {
      throw ApiErrorsDefines.ERR_USER_NOT_FOUND;
    }

    return user;

  }
  
}
