import { Request, Response} from 'express';
import {IUserService,UserService} from '../services/userService';
import {asyncHandler} from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { User, UserInput } from '../types/user';

interface AuthenticatedRequest extends Request {
    user?: User;
}

export class UserController {

    constructor(private userService: IUserService) {}

    register = asyncHandler(async (req: Request<{}, {}, UserInput>, res: Response) => {
        const user = await this.userService.createUser(req.body);
        res.status(201).json(user);
    });

    login = asyncHandler(async (req: Request<{}, {}, {email: string, password: string}>, res: Response) => {
        const {email, password } = req.body;
        const token = await this.userService.loginUser(email, password);
        res.json( { token });
    });

    getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        if (!req.user || !req.user.id) {
            throw new ApiError(401, 'Unauthorized');
        }

        const user = await this.userService.getUserById(req.user.id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.json(user);
    });

    updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        if (!req.user || !req.user.id) {
            throw new ApiError(401, 'Unauthorized');
        }
        const updatedUser = await this.userService.updateUser(req.user.id, req.body);
        res.json(updatedUser)
    });
}
