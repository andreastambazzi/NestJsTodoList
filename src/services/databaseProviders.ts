import { Sequelize } from 'sequelize-typescript';
import { UserDb } from "../models/db/UserDb";
import { TodoDb } from "../models/db/TodoDb";
import { AppConfig } from "./AppConfig";
import { LogDefines } from '../defines/LogDefines';

const appConfig:  AppConfig = AppConfig.getInstance();

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {

      const sequelize = new Sequelize( 
        appConfig.getDbSchema(),
        appConfig.getDbUser(),
        appConfig.getDbPassword(),
        {
            host: appConfig.getDbHost(),
            port: appConfig.getDbPort(),
            dialect: 'mysql',
            dialectOptions: {
                ssl: process.env.DB_SSL == "true"
            },
            logging: appConfig.getDebugStatus() && ( appConfig.getLogLevel() === LogDefines.LOG_LEVEL_DEBUG ),
            pool: {
                max: 20,
                min: 0,
                acquire: 30000,
                idle: 10000,
            }
        });

      sequelize.addModels([UserDb,TodoDb]);

      await sequelize.sync({ 
                    //force: true , 
                    alter: appConfig.getEnvType() == AppConfig.ENV_DEV
                });
                
      return sequelize;
    },
  },
];