import { TodoDb } from "../db/TodoDb";
import { ApiProperty } from '@nestjs/swagger';
import { Length, IsEmail, IsStrongPassword, IsNumber, IsOptional, MinLength, IsBoolean } from 'class-validator';
import { ApiErrorsDefines } from "../../defines/ApiErrorsDefines";
import { DbDefines } from "../../defines/DbDefines";

/**
 * ############################################################################
 * 
 *  Classe descrittore del modello Todo per il trasferimento dati
 * 
 */
export class TodoDto {
    
    @IsOptional()
    @IsNumber()    
    id: number;

    @ApiProperty({ example: "Razionalizzare" })
    @Length(1, DbDefines.DB_TODO_TITLE_MAX_LEN , { message: ApiErrorsDefines.ERR_INVALID_TITLE })
    title: string;

    @ApiProperty({ example: "Controllare e razionalizzare il codice del nuovo modulo" })
    @Length(10)
    description: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    completed: boolean;

    constructor(id: number, title: string, description: string, completed: boolean) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = completed;        
    }

    /**
       * ---------------------------------------------------------------------------------
       * Genera un modello dto convertendo i dati dall'oggetto todo recuperato dal 
       * database
       * 
       * @param todo 
       * @param showClearpwd 
       * @returns 
       * 
       */
      public static getFromDbIsrance( todo: TodoDb) : TodoDto {
        return new TodoDto(
          todo.id,
          todo.title,          
          todo.description,
          todo.completed            
        );
      }
}
