
import { TodoDb } from "../models/db/TodoDb";

export const todoProviders = [
  {
    provide: 'TODO_REPOSITORY',
    useValue: TodoDb,
  }   
];
