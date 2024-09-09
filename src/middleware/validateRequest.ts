import { Request, Response, NextFunction, query } from 'express';
import { AnyZodObject } from 'zod';
import { ApiError } from '../utils/ApiError';


export const validateRequest = (schema: AnyZodObject) => 
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }catch(error) {
            return next(new ApiError(400, 'Invalid request data'));
        }
    };