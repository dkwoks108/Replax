import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
interface RegisterAdminBody {
    name: string;
    email: string;
    password: string;
}
interface LoginAdminBody {
    email: string;
    password: string;
}
export declare const registerAdmin: (req: Request<{}, {}, RegisterAdminBody>, res: Response) => Promise<void>;
export declare const loginAdmin: (req: Request<{}, {}, LoginAdminBody>, res: Response) => Promise<void>;
export declare const getAdminProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const logoutAdmin: (_req: Request, res: Response) => Promise<void>;
export {};
