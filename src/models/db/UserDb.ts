
import { Table, Column, Model, DataType, HasMany, Index } from 'sequelize-typescript';
import { TodoDb } from './TodoDb'; // Importa il modello Todo
import { DbDefines } from '../../defines/DbDefines';

@Table({
  tableName: DbDefines.DB_USERS_TABLE,
})

/**
 * ############################################################################
 * 
 *  Classe descrittore del modello User per la base dati
 * 
 */
export class UserDb extends Model<UserDb> {

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Index({unique: false})
  @Column({
    type: DataType.STRING(DbDefines.DB_USERS_USERNAME_MAX_LEN),
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING(DbDefines.DB_USERS_PASSWORD_MAX_LEN),
    allowNull: false,
  })
  password: string;
  
  @Column({
    type: DataType.STRING(DbDefines.DB_USERS_FIRSTNAME_MAX_LEN),
    allowNull: true,    
  })
  firstname: string;

  @Column({
    type: DataType.STRING(DbDefines.DB_USERS_LASTNAME_MAX_LEN),
    allowNull: true,    
  })
  lastname: string;

  @Index({unique: false})
  @Column({
    type: DataType.STRING(DbDefines.DB_USERS_EMAIL_MAX_LEN),
    allowNull: false,
  })
  email: string;

  @Index({unique: false})
  @Column({
    type: DataType.BOOLEAN(),
    allowNull: false,
    defaultValue: false,
  })
  archived: boolean;

  // Associazione: un utente ha molti todo
  @HasMany(() => TodoDb)
  todos: TodoDb[];
}
