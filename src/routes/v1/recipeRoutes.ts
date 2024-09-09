import { Router } from 'express';
import { AuthMiddleware } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validateRequest';
import {Logger} from '../../utils/logger';
import { RecipeService } from '../../services/recipeService';
import { RecipeController } from '../../controllers/recipeController';
import { UserService } from '../../services/userService';
import { updateRecipeSchema, saveRecipeSchema } from '../../utils/validationSchemas';



const router = Router();
const logger = new Logger();
const recipeService = new RecipeService(logger)
const userService = new UserService(logger)
const recipeController = new RecipeController(recipeService)
const authMiddleware = new AuthMiddleware(userService, logger)

// router.post('/generate', authMiddleware.authenticate, validateRequest(generateRecipeSchema), recipeController.generateRecipe);
router.get('/:id', authMiddleware.authenticate, recipeController.getRecipe);
router.get('/', authMiddleware.authenticate, recipeController.getAllRecipes);
router.post('/', authMiddleware.authenticate, validateRequest(saveRecipeSchema), recipeController.saveRecipe);
router.put('/:id', authMiddleware.authenticate, validateRequest(updateRecipeSchema), recipeController.updateRecipe);
router.delete('/:id', authMiddleware.authenticate, recipeController.deleteRecipe);
router.get('/search', authMiddleware.authenticate, recipeController.searchRecipes);


export default router;