import { Router } from 'express';
import { UserController } from '../../controllers/userController';
import {UserService} from '../../services/userService';
import { AuthMiddleware } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import { registerSchema, loginSchema, updateProfileSchema } from '../../utils/validationSchemas';
import {Logger} from '../../utils/logger';

const router = Router();
const logger = new Logger();
const userService = new UserService(logger)
const userController = new UserController(userService)
const authMiddleware = new AuthMiddleware(userService, logger)
router.post('/register', validateRequest(registerSchema), userController.register);
router.post('/login', validateRequest(loginSchema), userController.login);
router.get('/profile', authMiddleware.authenticate, userController.getProfile);
router.put('/profile', authMiddleware.authenticate, validateRequest(updateProfileSchema), userController.updateProfile);

export default router;