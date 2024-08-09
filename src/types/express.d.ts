// src/types/express.d.ts
import { IUser } from '../models/userModel';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser | null;
  }
}
