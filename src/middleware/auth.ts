import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { IUserService } from '../services/userService';
import { User } from '../types/user';
import { Logger } from '../utils/logger';

interface AuthenticatedRequest extends Request {
    user?: User;
}

export class AuthMiddleware {
    constructor(
        private userService: IUserService,
        private logger: Logger
    ) {}

    authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                throw new ApiError(401, 'Authentication required');
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
            const user = await this.userService.getUserById(decoded.id);

            if (!user) {
                throw new ApiError(401, 'User not found');
            }

            req.user = user;
            next();
        } catch (error) {
            this.logger.error('Authentication error', error);
            next(new ApiError(401, 'Please authenticate'));
        }
    };
}