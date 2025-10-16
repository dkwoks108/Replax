import { Request, Response, NextFunction } from 'express';
import { IAdmin } from '../models/Admin';
export interface JwtPayload {
    id: string;
    iat: number;
    exp: number;
}
export interface AuthRequest extends Request {
    admin?: IAdmin;
    token?: string;
}
export declare const auth: (req: AuthRequest, _res: Response, next: NextFunction) => Promise<void>;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
