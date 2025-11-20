
/**
 * ############################################################################
 * Contiene la lista delle definizioni dei codici di errore restituibili 
 * dalle api
 */
export class ApiErrorsDefines {

    // Users api errors
    public static ERR_MISSING_USER_DATA  : string = 'ERR_MISSING_USER_DATA';
    public static ERR_USER_ALREADY_EXIST : string = 'ERR_USER_ALREADY_EXIST';
    public static ERR_USER_CREATE_ERROR  : string = 'ERR_USER_CREATE_ERROR';
    public static ERR_USER_NOT_FOUND     : string = 'ERR_USER_NOT_FOUND';
    public static ERR_INVALID_USERNAME   : string = 'ERR_INVALID_USERNAME';
    public static ERR_INVALID_FIRSTNAME  : string = 'ERR_INVALID_FIRSTNAME';
    public static ERR_INVALID_LASTNAME   : string = 'ERR_INVALID_LASTNAME';
    public static ERR_INVALID_EMAIL      : string = 'ERR_INVALID_EMAIL';
    public static ERR_INVALID_PASSWORD   : string = 'ERR_INVALID_PASSWORD';

    // todo api errors
    public static ERR_TODO_CREATE_ERROR : string = 'ERR_TODO_CREATE_ERROR';
    public static ERR_MISSING_TODO_DATA : string = 'ERR_MISSING_TODO_DATA';
    public static ERR_INVALID_TITLE     : string = 'ERR_INVALID_TITLE';
    public static ERR_TODO_NOT_FOUND    : string = 'ERR_TODO_NOT_FOUND';
}