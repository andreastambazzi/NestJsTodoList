import { sign as jwtSign , verify as jwtVerify } from 'jsonwebtoken';
import { AppConfig } from "../services/appConfig";
import { Logger, UnauthorizedException } from '@nestjs/common';


const config : AppConfig = AppConfig.getInstance();
const logger : Logger = new Logger("AuthUtils");



/**
 * ################################################################
 * 
 *  Classe Utility helper per la gestione Autenticazione/Autorizzazione
 * 
 */
export class AuthUtils {
  
  /**
   * ---------------------------------------------------------------------------
   * 
   */
  constructor() { }

  /**
   * ---------------------------------------------------------------------------
   * Genera un token jwt per i dati passati  
   * 
   * @param data 
   */
  public static jwtGenrator(data: any) : string{
    let token : string = jwtSign(
      {
        exp: Math.floor(Date.now() / 1000) + (60 * config.getJwtExpireTime() ), // expireTime in minutes 
        data: data
      }, 
      config.getJwtSecret()      
    )

    return token;
  }

  /**
   * ---------------------------------------------------------------------------
   *  funzione di verifica dell'autenticazione utenti dal token jwt
   * 
   * @param {*} req 
   * @returns 
   */
  public static authenticationVerify(req: any) : any {
    
    let token = req.header('Authorization')

    if (token) {

      try {
        var decoded = jwtVerify(
          token.replace('Bearer ', ''), 
          config.getJwtSecret()          
        );

        return decoded;
      }
      catch(error) {
        logger.error('authVerify '+error);
        throw new UnauthorizedException();  
      }
    } 
    else {      
      logger.error('authVerify missing token');
      throw new UnauthorizedException();
    }
      
  };

  /**
   * ---------------------------------------------------------------------------
   *  funzione di autorizzazione utenti
   * 
   * @param {*} appName Nome applicazione su cui testare l'autorizzazione 
   *  dell'utente corrente
   * @returns function(req: any, res: any, next: any): any
   */
  public static authorizationVerify(appName: string ) {
    
    
  };

}
