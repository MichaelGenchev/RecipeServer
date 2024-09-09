import { Request, Response, NextFunction} from 'express';
import {ApiError} from '../utils/ApiError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && {stack: err.stack }),
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: 'Invalid token',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: 'Token expired',
        });
    }

    return res.status(500).json({
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
}