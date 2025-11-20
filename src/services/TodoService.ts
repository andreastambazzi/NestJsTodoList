import { Inject, Injectable, Logger } from '@nestjs/common';
import { TodoDto } from '../models/dto/TodoDto';
import { UserDb } from '../models/db/UserDb';
import { TodoDb } from '../models/db/TodoDb';
import { AppConfig } from './appConfig';
import { Transaction } from 'sequelize';
import { ApiErrorsDefines } from '../defines/ApiErrorsDefines';
import { Op } from 'sequelize';


/**
 * ############################################################################
 * 
 * Classe descrittore della business logic per la gestione delle operazioni 
 * sui todo
 * 
 */
@Injectable()
export class TodoService {
    
    private readonly logger = new Logger("TodoService");
    private readonly appConfig = AppConfig.getInstance();
    
    /**
     * ---------------------------------------------------------------------------------
     * @param user 
     */
    constructor(
        @Inject('USER_REPOSITORY')    
        private user: typeof UserDb,
        @Inject('TODO_REPOSITORY')  
        private todo: typeof TodoDb,
        @Inject('SEQUELIZE') private readonly sequelize 
    ) {
        this.logger.localInstance.setLogLevels( this.appConfig.getActiveLogLevels() );    
    }

    /**
     * ---------------------------------------------------------------------------------
     * tenta la creazione di un nuovo todo, se non ci riesce solleva un'eccezione
     * @param todoData 
     * @returns Todo or null in caso d'errore
     */     
    async create(todoData: TodoDto, userId: number): Promise<TodoDb> {
        var todo : TodoDb;
        
        if ( todoData != null  ) {     
            
            var t : Transaction = await this.sequelize.transaction();
    
            try {
                var user : UserDb = await this.user.findOne({
                    where: { 
                        [Op.and] : [
                            { id: userId },
                            { archived: 0 }
                        ]  
                    },
                    transaction: t            
                });
        
                if ( user == null || user.id == null ) {
                    throw ApiErrorsDefines.ERR_USER_NOT_FOUND;
                }
                                        
                todo = await this.todo.create(
                    {
                        title: todoData.title,
                        description: todoData.description,
                        completed: todoData.completed,
                        archived: false,  
                        userId: user.id
                    },
                    { transaction: t}
                );
        
                if ( todo == null ) {          
                    throw ApiErrorsDefines.ERR_TODO_CREATE_ERROR;
                }
        
                t.commit();
                return todo;
            
            }
            catch(error) {
                t.rollback();
                throw error;
            }
        }
        else {
            throw ApiErrorsDefines.ERR_MISSING_TODO_DATA;
        }
    }


    /**
     * ---------------------------------------------------------------------------------
     * recupera tutti i todo dell'utente con id @userId
     * @param todoData 
     * @param userId 
     * @returns 
     */
    async findAll(userId: number): Promise<TodoDb[]> {

        var result : TodoDb[] = [];
        var t      : Transaction = await this.sequelize.transaction();

        try {
            var user : UserDb = await this.user.findOne({
                where: { 
                    [Op.and] : [
                        { id: userId },
                        { archived: 0 }
                    ]  
                },
                transaction: t            
            });
    
            if ( user == null || user.id == null ) {
                throw ApiErrorsDefines.ERR_USER_NOT_FOUND;
            }
                                    
            result = await this.todo.findAll(
                {
                    where : { 
                        [Op.and] : [ 
                            { userId : user.id } ,
                            { archived : 0 }
                        ] 
                    },
                    transaction: t
                }                    
            );
                    
            t.commit();
            return  result;
        
        }
        catch(error) {
            t.rollback();
            throw error;
        }
      
        
    }

    /**
     * ---------------------------------------------------------------------------------
     * recupera tutti il dettaglio del todo con @id dell'utente con id @userId
     * @param id 
     * @param userId
     * @returns 
     */
    async findOne(id: number, userId: number): Promise<TodoDb> {
        var result : TodoDb;
        var t      : Transaction = await this.sequelize.transaction();

        try {
            var user : UserDb = await this.user.findOne({
                where: { 
                    [Op.and] : [
                        { id: userId },
                        { archived: 0 }
                    ]  
                },
                transaction: t            
            });
    
            if ( user == null || user.id == null ) {
                throw ApiErrorsDefines.ERR_USER_NOT_FOUND;
            }
                                    
            result = await this.todo.findOne(
                {
                    where : { 
                        [Op.and] : [ 
                            { userId : user.id } ,
                            { id: id },
                            { archived : 0 }
                        ] 
                    },
                    transaction: t
                }                    
            );

            if ( result == null || result == undefined) {
                throw ApiErrorsDefines.ERR_TODO_NOT_FOUND;
            }
                    
            t.commit();
            return  result;
        
        }
        catch(error) {
            t.rollback();
            throw error;
        }
    }

    /**
     * ---------------------------------------------------------------------------------
     * aggiorna i dati del todo id @id appartenente all'utente @userId con la struttura dati @todoData 
     * @param id 
     * @param todoData 
     * @param userId 
     * @returns 
     */
    async update(id: number, todoData: TodoDto, userId: number): Promise<TodoDb> {

        var todo : TodoDb;
        
        if ( todoData != null  ) {     
            
            var t : Transaction = await this.sequelize.transaction();
    
            try {
                var user : UserDb = await this.user.findOne({
                    where: { 
                        [Op.and] : [
                            { id: userId },
                            { archived: 0 }
                        ]  
                    },
                    transaction: t            
                });
        
                if ( user == null || user.id == null ) {
                    throw ApiErrorsDefines.ERR_USER_NOT_FOUND;
                }

                todo = await this.todo.findOne({
                    where: { 
                        [Op.and] : [
                            { id: id},
                            { userId: userId },
                            { archived: 0 }
                        ]  
                    },
                    transaction: t            
                });
        
                if ( todo == null || todo.id == null ) {
                    throw ApiErrorsDefines.ERR_TODO_NOT_FOUND;
                }
                                        
                todo.title = todoData.title;
                todo.description = todoData.description;
                todo.completed = todoData.completed;
        
                await todo.save({ transaction: t});

                t.commit();
                return todo;
            
            }
            catch(error) {
                t.rollback();
                throw error;
            }
        }
        else {
            throw ApiErrorsDefines.ERR_MISSING_TODO_DATA;
        }
    }

    /**
     * ---------------------------------------------------------------------------------
     * Archivia il todo id @id appartenente all'utente @userId 
     * @param id 
     * @param userId
     */
    async archive(id: number, userId: number): Promise<boolean> {
        var todo : TodoDb;                            
        var t : Transaction = await this.sequelize.transaction();

        try {
            var user : UserDb = await this.user.findOne({
                where: { 
                    [Op.and] : [
                        { id: userId },
                        { archived: 0 }
                    ]  
                },
                transaction: t            
            });
    
            if ( user == null || user.id == null ) {
                throw ApiErrorsDefines.ERR_USER_NOT_FOUND;
            }

            todo = await this.todo.findOne({
                where: { 
                    [Op.and] : [
                        { id: id},
                        { userId: userId },
                        { archived: 0 }
                    ]  
                },
                transaction: t            
            });
    
            if ( todo == null || todo.id == null ) {
                throw ApiErrorsDefines.ERR_TODO_NOT_FOUND;
            }
                                    
            todo.archived = true;                
            await todo.save({ transaction: t});

            t.commit();
            return true;
        
        }
        catch(error) {
            t.rollback();
            throw error;
        }
       
    }
    
}