import * as dotenv from 'dotenv';
import { Logger, LogLevel } from '@nestjs/common';
import { LogDefines } from '../defines/LogDefines';
import { LOG_LEVELS } from '@nestjs/common';


/**
 * #########################################################
 * 
 * Classe di gestione della configurazione dell'applicativo
 * 
 * 
 * 
 */
export class AppConfig {

    private readonly logger = new Logger("AppConfig");

    // classe singleton
    private static instance: AppConfig;

    public static ENV_PROD: string = "production";
    public static ENV_DEV:  string = "development";
    public static ENV_STAG: string = "staging";
    public static ENV_TEST: string = "test";    

    

    /**
     * ----------------------------------------------------------
     * Il costruttore è privato per mantenere la classe singleton
     * 
     * per ottenere l'istanza si usa getInstance()
     */
    private constructor() {
        this.loadEnv();
    };
    
    /**
     * ----------------------------------------------------------
     * @returns 
     */
    static getInstance(): AppConfig {
        AppConfig.instance = AppConfig.instance || new AppConfig();
        return AppConfig.instance;
    }

    /**
     * ----------------------------------------------------------
     * @returns 
     */
    public getEnvType(): string {
        return process.env.NODE_ENV != null ? process.env.NODE_ENV : AppConfig.ENV_PROD;
    }

    /**
     * ----------------------------------------------------------
     * 
     * Carica l'environment per SVILUPPO o PRODUZIONE
     * 
     */
    public loadEnv(): void {

        console.info(`LOADING ENV ... ${process.env.NODE_ENV} base dir ${process.cwd()}` );

        if (process.env.NODE_ENV && process.env.NODE_ENV == AppConfig.ENV_DEV || process.env.NODE_ENV == AppConfig.ENV_TEST) {
            console.info("... DEV !");
            
            dotenv.config({ path: "./src/config/config_dev.env" });
        }
        else if (process.env.NODE_ENV && process.env.NODE_ENV == AppConfig.ENV_STAG ) {
            console.info("... STAG !");
            dotenv.config({ path: "./src/config/config_stag.env" });
        }
        else {
            console.info("... PROD !");
            dotenv.config({ path: "./src/config/config_prod.env" });
        }
    }

    /**
     * ----------------------------------------------------------
     * @returns jw token espire time in minutes
     */
    public getJwtExpireTime(): number {        
        return process.env.JWT_EXPIRE_TIME ? parseInt(process.env.JWT_EXPIRE_TIME) : 600;        
    }

    /**
     * ----------------------------------------------------------
     * @returns 
     */
    public getJwtSecret(): string {    
        //this.logger.debug("getJwtSecret "+process.env.JWT_SECRET.toString());
        return process.env.JWT_SECRET ? process.env.JWT_SECRET.toString() : "EMPTYSECRET";
    }

    /**
     * ----------------------------------------------------------
     * @returns 
     */
    public getNodePort(): number {
        return process.env.NODE_PORT ? parseInt(process.env.NODE_PORT) : 3000;
    }

    /**
     * ----------------------------------------------------------
     * @returns 
     */
    public getDbPort(): number {
        return process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
    }

    /**
     * ----------------------------------------------------------
     * @returns 
     */
    public getDbSchema(): string {
        return process.env.DB_SCHEMA ? process.env.DB_SCHEMA : 'todo_db';
    }

    /**
     * ----------------------------------------------------------
     * @returns 
     */
    public getDbUser(): string {
        return process.env.DB_USER ? process.env.DB_USER : 'todouser';
    }

    /**
     * ----------------------------------------------------------
     * @returns 
     */
    public getDbPassword(): string {
        return process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'todopwd';
    }

    /**
     * ----------------------------------------------------------
     * @returns 
     */
    public getDbHost(): string {
        return process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
    }

    /**
     * ----------------------------------------------------------
     * @returns 
     */
    public getDebugStatus(): boolean {
        return process.env.CONF_DEBUG != null ? Boolean(process.env.CONF_DEBUG) : false;
    }

    /**
     * ----------------------------------------------------------
     * @returns 
     */
    public getTimeZone(): string {
        return  process.env.TIMEZONE != null ?  process.env.TIMEZONE : Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    /**
     * ----------------------------------------------------------
     * @returns Global pagination limit for APIs
     */
    public getDefaultApiLimit(): number {
        return process.env.API_LIMIT ? parseInt(process.env.API_LIMIT) : 10;
    }

    /**
     * ----------------------------------------------------------
     * @returns Log level 
     * 
     * LOG_LEVEL_CRITICAL 5
     * LOG_LEVEL_ERROR    4
     * LOG_LEVEL_WARN     3
     * LOG_LEVEL_INFO     2
     * LOG_LEVEL_DEBUG    1
     */
    public getLogLevel():  number  {
        var logLevel : number = process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL) : 2;        

        if ( logLevel < LogDefines.LOG_LEVEL_DEBUG || logLevel > LogDefines.LOG_LEVEL_CRITICAL ) {
            logLevel = LogDefines.LOG_LEVEL_INFO;
        }

        return logLevel;

    }

    /**
     * ----------------------------------------------------------
     * Restituisce la lista dei loglevels correntemente attivi
     * @returns 
     */
    public getActiveLogLevels(): LogLevel[] {
        const logLevel = this.getLogLevel();

        var result : LogLevel[] = [];

        for ( let i : number = logLevel; i< LOG_LEVELS.length; i++ ) {
            result.push(LOG_LEVELS[i]);
        }

        return result;
    }


};

