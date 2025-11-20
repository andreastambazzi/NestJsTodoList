
import { UserDb } from "../models/db/UserDb";

export const userProviders = [
  {
    provide: 'USER_REPOSITORY',
    useValue: UserDb,
  }   
];
