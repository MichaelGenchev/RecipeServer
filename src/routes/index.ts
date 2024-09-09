import { Router } from 'express';
import userRoutes from './v1/userRoutes';
import recipeRoutes from './v1/recipeRoutes';


const router = Router();

router.use('/users', userRoutes);
router.use('/recipes', recipeRoutes);

export default router;