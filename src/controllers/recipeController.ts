import { Request, Response } from 'express';
import { IRecipeService } from '../services/recipeService';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { RecipeInput, RecipeUpdate } from '../types/recipe';


export class RecipeController {

    constructor(private recipeService: IRecipeService) {}

    // generateRecipe = asyncHandler(async (req: Request<{}, {}, RecipeInput>, res: Response) => {
    //     const userId =(req as any).user.id;
    //     const recipe = await this.recipeService.generateRecipe(userId, req.body);
    //     res.status(201).json(recipe);
    // });

    getRecipe = asyncHandler(async (req: Request, res: Response) => {
        const recipe = await this.recipeService.getRecipeById(parseInt(req.params.id, 10));
        if (!recipe) {
            throw new ApiError(404, 'Recipe not found');
        }
        res.json(recipe);
    });

    getAllRecipes = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const page = parseInt(req.query.page as string, 10) || 1
        const limit = parseInt(req.query.limit as string, 10) || 10
        const {recipes, total } = await this.recipeService.getAllRecipes(userId, page, limit)
        res.json({recipes, total, page, limit})
    });

    saveRecipe = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const recipe = await this.recipeService.saveRecipe(userId, req.body);
        res.status(201).json(recipe)
    });

    updateRecipe = asyncHandler(async (req: Request, res: Response )=> {
        const userId = (req as any).user.id;
        const recipe = await this.recipeService.updateRecipe(parseInt(req.params.id, 10), userId, req.body);
        res.json(recipe);
    });

    deleteRecipe = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        await this.recipeService.deleteRecipe(parseInt(req.params.id, 10), userId);
        res.status(204).send();
    });

    searchRecipes = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user.id;
        const query = req.query.q as string;
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const { recipes, total } = await this.recipeService.searchRecipes(userId, query, page, limit);
        res.json({recipes, total, page, limit});
    });
}