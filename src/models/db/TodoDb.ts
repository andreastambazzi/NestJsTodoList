import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { UserDb } from './UserDb'; 
import { DbDefines } from '../../defines/DbDefines';

@Table({
  tableName: DbDefines.DB_TODO_TABLE,
})

/**
 * ############################################################################
 * 
 *  Classe descrittore del modello Todo per la base dati
 * 
 */
export class TodoDb extends Model<TodoDb> {

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  })
  id: number;

  @Column({
    type: DataType.STRING(DbDefines.DB_TODO_TITLE_MAX_LEN),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT(),
    allowNull: false,
  })
  description: string;

  @Index({unique: false})
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  completed: boolean;

  @Index({ unique: false })
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  archived: boolean;


  @ForeignKey(() => UserDb)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;


  @BelongsTo(() => UserDb)
  user: UserDb;
}