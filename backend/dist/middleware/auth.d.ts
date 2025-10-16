import { Request, Response, NextFunction } from 'express';
import { IAdmin } from '../models/Admin';
export interface AuthRequest extends Request {
    admin?: IAdmin;
}
export declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
