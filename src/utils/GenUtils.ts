
/**
 * #############################################################################
 *  
 *  Libreria di utility generiche
 * 
 */

import * as crypto from 'crypto';
import moment from 'moment';
import 'moment-timezone';
import { AppConfig } from "../services/appConfig";


/**
 * ---------------------------------------------------------------------------
 * @field data content 
 * @field error true error false ok
 */
export type ObjectElaborationResultType = {
  data: any,
  currentPage: number,
  totalPages: number,  
  error: boolean
};

/**
 * ---------------------------------------------------------------------------
 * Tipo che definisce l'oggetto di risposta alle chiamate api
 */
export type HttpResultType = {
  result: 'ok' | 'ko',
  message?: any | undefined,
  data?: any | undefined,
  currentPage: number,
  totalPages: number,
}

export default class GenUtils {

  /**
   * ---------------------------------------------------------------------------
   * Genera un json object di risposta d'errore 
   * 
   * @param {*} error 
   * @param {*} data 
   * @returns 
   */
  public static generateErrorObject(error: any, data: any): HttpResultType {
    let obj: HttpResultType = {
      result: 'ko',
      message: error,
      currentPage :0,
      totalPages : 0,
      data: data !== undefined && data!== null ? data : undefined,
    };

    return obj
  }

  /**
   * ---------------------------------------------------------------------------
   * Genera un json object di risposta 
   * 
   * @param {*} data 
   * @param {*} currentPage 
   * @param {*} totalPages 
   * @returns 
   */
  public static generateSuccessObject(data: any, currentPage?: number, totalPages?: number) : HttpResultType {
    return {
      result: 'ok',
      message: undefined,
      data: data,
      currentPage: currentPage,
      totalPages: totalPages,
    };
  }

  /**
   * ---------------------------------------------------------------------------
   * @param {integer} length 
   * @returns 
   */
  public static generateRandomOtp(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (let i = 0; i < length; i++) { 
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  /**
   * ---------------------------------------------------------------------------
   * @param {integer} length 
   * @returns 
   */
  public static generateRandomString(length: number) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) { 
      text += possible.charAt(Math.floor(Math.random() * possible.length)) ;
    }

    return text;
  }

  /**
   * ---------------------------------------------------------------------------
   * @param {*} stringToClean 
   * @returns 
   */
  public static replaceAcctented(stringToClean: string) {

    const translate: any = {
      ä: "a",
      ö: "o",
      ü: "u",
      Ä: "A",
      Ö: "O",
      Ü: "U",
      è: "e",
      é: "e",
      ò: "o",
      à: "a",
      ù: "u",
      ì: "i",
      Ì: "i"
    };

    const translateRe = /[òàùèéìöäüÖÄÜÌ]/g;

    return stringToClean.replace( translateRe, (match) => {
      return translate[match];
    });

  }

  /**
   * ---------------------------------------------------------------------------
   * @param value 
   * @returns 
   */
  public static toBoolean(value: string): boolean {
    return Boolean(value);
  };

  /**
   * --------------------------------------------------------------------------
   * Returns an error message object
   * 
   * - data: (any) The error Object to return;
   * 
   */
  public static errorObjectCostructor(data: any): ObjectElaborationResultType {
    return {
      'data': data,
      'error': true,
      'currentPage': 0,
      'totalPages': 0
    };
  }

  /**
   * --------------------------------------------------------------------------
   * Returns a success message object
   * 
   * - data: (any) The success Object to return;
   * 
   */
  public static successObjectCostructor(data: any, currentPage?:number, totalPages?:number): ObjectElaborationResultType {

    return {
      'data': data,
      'error': false,
      'currentPage': currentPage ? currentPage : 0 ,
      'totalPages': totalPages ? totalPages : 0
    };

  }

  /**
   * --------------------------------------------------------------------------
   * @param milliseconds 
   */
  public static async sleep(milliseconds: number) : Promise<void> {
    await new Promise(resolve => setTimeout(resolve, milliseconds ));
  }


  /**
   * ---------------------------------------------------------------------------
   * Parsa la data assumendo che sia espressa in utc aggiungendogli lo spiazzamento 
   * della time zone specificata nel file di configurazione dell'app
   * 
   *  Esempio:    
   *  getAppMoment('2025-04-02 15:34:47.0');
   * 
   *  il risultato è una data con utc offset +2
   *    
   *  "2025-04-02T17:34:47+02:00"
   * 
   * @param {*} date 
   * @returns 
   */
  public static getAppMoment(date?: string | undefined) : moment.Moment {
    moment.tz.setDefault( AppConfig.getInstance().getTimeZone() );
    return moment(date);
  }

  /**
   * ---------------------------------------------------------------------------
   * Parsa la data assumendo che sia espressa in utc aggiungendogli lo spiazzamento 
   * della time zone specifica dell'environment di nodejs
   * 
   *  Esempio:    
   *  getTzMoment('2025-04-01 15:40:57.0');
   * 
   *  il risultato è una data con utc offset +2
   *    
   *  "2025-04-01T17:40:57+02:00"
   * 
   * @param {*} date 
   * @returns 
   */
  public static getTzMoment(date?: string | undefined) : moment.Moment {
    moment.tz.setDefault( AppConfig.getInstance().getTimeZone() );
    return moment.parseZone(date);
  }

  /**
   * ---------------------------------------------------------------------------
   * Parsa la data assumendo che sia nella zona utc
   * 
   * Esempio: 
   *  getUtcMoment('2016-01-01T23:35:01');
   *  getUtcMoment('2025-04-01 15:40:57.0');
   * 
   *  il risultato è una data con utc offset a 0
   * 
   *  "2016-01-01T23:35:01+00:00"
   *  "2025-04-01T15:40:57.000Z"
   * 
   * @param date 
   * @returns 
   */
  public static getUtcMoment(date?: string | undefined) : moment.Moment {
    return moment.utc(date);
  }


  /**
   * ---------------------------------------------------------------------------
   * @param payload 
   * @returns 
   */
  public static getHashMd5(payload: string) {
    const hash = crypto.createHash('md5');
    hash.update(payload, 'utf8');
    return hash.digest('hex');
  }

};
