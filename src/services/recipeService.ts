import { Recipe, RecipeInput, RecipeUpdate } from '../types/recipe';
import { pool } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { Logger } from '../utils/logger';
// import { AIService } from './aiService';


export interface IRecipeService {
    // generateRecipe(userId: number, input: RecipeInput): Promise<Recipe>;
    getRecipeById(id: number): Promise<Recipe | null>;
    getAllRecipes(userId: number, page: number, limit: number): Promise<{ recipes: Recipe[], total: number }>;
    saveRecipe(userId: number, recipe: Recipe): Promise<Recipe>;
    updateRecipe(id: number, userId: number, updateData: RecipeUpdate): Promise<Recipe>;
    deleteRecipe(id: number, userId: number): Promise<void>;
    searchRecipes(userId: number, query: string, page: number, limit: number): Promise<{ recipes: Recipe[], total: number }>;
}


export class RecipeService implements IRecipeService {
    constructor(
        private logger: Logger,
        // private aiService: AIService
    ) { }

    // async generateRecipe(userId: number, input: RecipeInput): Promise<Recipe> {
    //     try {
    //         const generatedRecipe = await this.aiService.generateRecipe(input);
    //         const savedRecipe = await this.saveRecipe(userId, generatedRecipe);
    //         this.logger.info(`Recipe generated and saved: ${savedRecipe.id}`);
    //         return savedRecipe;
    //     } catch (error) {
    //         this.logger.error('Error generating recipe', error);
    //         throw new ApiError(500, 'Error generating recipe');
    //     }
    // }

    async getRecipeById(id: number): Promise<Recipe | null> {
        const result = await pool.query<Recipe>(
            'SELECT * FROM recipes WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    };

    async getAllRecipes(userId: number, page: number, limit: number): Promise<{ recipes: Recipe[], total: number }> {
        const offset = (page - 1) * limit;
        const recipesResult = await pool.query<Recipe>(
            'SELECT * FROM recipes WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [userId, limit, offset]
        );

        const totalResult = await pool.query<{ count: string }>(
            'SELECT COUNT(*) FROM recipes WHERE user_id = $1',
            [userId]
        );

        return {
            recipes: recipesResult.rows,
            total: parseInt(totalResult.rows[0].count, 10)
        };
    }

    async saveRecipe(userId: number, recipe: Recipe): Promise<Recipe> {
        const { name, ingredients, instructions, nutritionalInfo } = recipe;
        const result = await pool.query<Recipe>(
            'INSERT INTO recipes (user_id, name, ingredients, instructions, nutritional_info) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, name, JSON.stringify(ingredients), JSON.stringify(instructions), JSON.stringify(nutritionalInfo)]
        );
        this.logger.info(`Recipe saved: ${result.rows[0].id}`);
        return result.rows[0];
    }

    async updateRecipe(id: number, userId: number, updateData: RecipeUpdate): Promise<Recipe> {
        const { name, ingredients, instructions, nutritionalInfo } = updateData;
        const result = await pool.query<Recipe>(
            'UPDATE recipes SET name = COALESCE($1, name), ingredients = COALESCE($2, ingredients), instructions = COALESCE($3, instructions), nutritional_info = COALESCE($4, nutritional_info) WHERE id = $5 AND user_id = $6 RETURNING *',
            [name, JSON.stringify(ingredients), JSON.stringify(instructions), JSON.stringify(nutritionalInfo), id, userId]
        );
        if (result.rowCount === 0) {
            throw new ApiError(404, 'Recipe not found or user not authorized');
        }
        this.logger.info(`Recipe updated: ${id}`);
        return result.rows[0];
    }

    async deleteRecipe(id: number, userId: number): Promise<void> {
        const result = await pool.query(
            'DELETE FROM recipes WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        if (result.rowCount === 0) {
            throw new ApiError(404, 'Recipe not found or user not authorized');
        }
        this.logger.info(`Recipe deleted: ${id}`);
    }

    async searchRecipes(userId: number, query: string, page: number, limit: number): Promise<{ recipes: Recipe[], total: number }> {
        const offset = (page - 1) * limit;
        const searchQuery = `%${query}%`;
        const recipesResult = await pool.query<Recipe>(
            'SELECT * FROM recipes WHERE user_id = $1 AND (name ILIKE $2 OR ingredients::text ILIKE $2) ORDER BY created_at DESC LIMIT $3 OFFSET $4',
            [userId, searchQuery, limit, offset]
        );
        const totalResult = await pool.query<{ count: string }>(
            'SELECT COUNT(*) FROM recipes WHERE user_id = $1 AND (name ILIKE $2 OR ingredients::text ILIKE $2)',
            [userId, searchQuery]
        );
        return {
            recipes: recipesResult.rows,
            total: parseInt(totalResult.rows[0].count, 10)
        };

    };
}