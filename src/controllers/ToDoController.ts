import { Controller, Get, Post, Put, Delete, Body, Param, Res, ValidationPipe, Req, Logger, HttpStatus, UseGuards, Query, Headers } from '@nestjs/common';
import { Response } from 'express'; 
import { TodoService } from '../services/TodoService';
import { TodoDto } from '../models/dto/TodoDto';
import { ApiOperation } from '@nestjs/swagger';
import { UserDto } from '../models/dto/UserDto';
import { AppConfig } from '../services/appConfig';
import { UserService } from '../services/UserService';
import { TodoDb } from '../models/db/TodoDb';
import GenUtils from '../utils/genUtils';
import { AuthGuard } from '../services/AuthGuard';

/**
 * ############################################################################
 * 
 *  Controller per la gestione dei dati utente
 *  
 */
@Controller('todo')
export class ToDoController {

    private readonly logger = new Logger("ToDoController");  
    private readonly appConfig = AppConfig.getInstance();

    /**
     * ---------------------------------------------------------------------------------
     * @param todoService 
     * @param userService 
     */
    constructor(
        private readonly todoService: TodoService,
        private readonly userService: UserService,
    ) {
        this.logger.localInstance.setLogLevels( this.appConfig.getActiveLogLevels() );
    }

    /**
     * ---------------------------------------------------------------------------------
     * @param todo 
     * @param res 
     * @param req 
     */
    @UseGuards(AuthGuard)    
    @ApiOperation({ summary: 'Effettua la creazione di un nuovo todo' })
    @Post('createTodo')
    async createTodo(
            @Headers('Authorization') authorizationHeader: string,  
            @Body(new ValidationPipe()) todo: TodoDto, 
            @Res() res: Response,
            @Req() req: Request  
        ) {  

        var user : UserDto = req['user'];

        try {              
            var todoResp : TodoDb = await this.todoService.create(todo,user.id);
            
            res.status(HttpStatus.OK).json( 
                GenUtils.generateSuccessObject(
                    TodoDto.getFromDbIsrance(todoResp) 
                )
            );      
        }
        catch( error ) {
            this.logger.error(error.toString());
            res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error        
            });
        }

    }

    /**
     * ---------------------------------------------------------------------------------
     * @param res 
     * @param req 
     */
    @UseGuards(AuthGuard)    
    @ApiOperation({ summary: 'Recupera la lista di tutti i todo  dell\'utente' })
    @Get('getTodoList')
    async findAll(
        @Headers('Authorization') authorizationHeader: string,  
        @Res() res: Response,
        @Req() req: Request  
    ) {
         var user : UserDto = req['user'];

        try {              
            var todoResp : TodoDb[] = await this.todoService.findAll(user.id);
            var todoList : TodoDto[] = [];

            todoResp.map( ( todo ) => {
                todoList.push(TodoDto.getFromDbIsrance(todo))
            });
            
            res.status(HttpStatus.OK).json(                 
                GenUtils.generateSuccessObject(todoList)
            );      
        }
        catch( error ) {
            this.logger.error(error.toString());
            res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error        
            });
        }
    }

    /**
     * ---------------------------------------------------------------------------------
     * @param id 
     * @returns 
     */
    @UseGuards(AuthGuard)   
    @ApiOperation({ summary: 'Recupera il singolo todo tramite id' })
    @Get('getTodo')    
    async getTodo(
        @Headers('Authorization') authorizationHeader: string,  
        @Query('id') id: number,
        @Res() res: Response,
        @Req() req: Request  
    ) {
        var user : UserDto = req['user'];

        try {              
            var todoResp : TodoDb = await this.todoService.findOne(id, user.id);
            var todo     : TodoDto = TodoDto.getFromDbIsrance(todoResp);
            res.status(HttpStatus.OK).json(                 
                GenUtils.generateSuccessObject(todo)
            );      
        }
        catch( error ) {
            this.logger.error(error.toString());
            res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error        
            });
        }
    }

    /**
     * ---------------------------------------------------------------------------------
     * @param id 
     * @param updateTodoDto 
     * @returns 
     */
    @UseGuards(AuthGuard)   
    @ApiOperation({ summary: 'Aggiorna i dati del todo' })
    @Put('updateTodo')
    async update(
        @Headers('Authorization') authorizationHeader: string,  
        @Query('id') id: number, 
        @Body(new ValidationPipe()) todo: TodoDto, 
        @Res() res: Response,
        @Req() req: Request  
    ) {
        var user : UserDto = req['user'];

        try {              
            var todoResp : TodoDb = await this.todoService.update(id, todo, user.id);
            var todo     : TodoDto = TodoDto.getFromDbIsrance(todoResp);
            res.status(HttpStatus.OK).json(                 
                GenUtils.generateSuccessObject(todo)
            );      
        }
        catch( error ) {
            this.logger.error(error.toString());
            res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error        
            });
        }
    }

    /**
     * ---------------------------------------------------------------------------------
     * @param id 
     * @returns 
     */
    @UseGuards(AuthGuard)   
    @ApiOperation({ summary: 'Archivia il todo' })
    @Delete('deleteTodo')
    async deleteTodo(
        @Headers('Authorization') authorizationHeader: string,  
        @Query('id') id: number,
        @Res() res: Response,
        @Req() req: Request  
    ) {
        var user : UserDto = req['user'];

        try {              
            var resp : boolean = await this.todoService.archive(id, user.id);
            res.status(HttpStatus.OK).json(                 
                GenUtils.generateSuccessObject(resp)
            );      
        }
        catch( error ) {
            this.logger.error(error.toString());
            res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: error        
            });
        }
    }
    
}