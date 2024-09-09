// types/recipe.ts

export interface Recipe {
    id: number;
    userId: number;
    name: string;
    ingredients: Ingredient[];
    instructions: string[];
    nutritionalInfo: NutritionalInfo;
    createdAt: Date;
    updatedAt: Date;
}

export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
}

export interface NutritionalInfo {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface RecipeInput {
    ingredients: string[];
    dietaryPreferences: string[];
    nutritionalGoals: Partial<NutritionalInfo>;
}

export type RecipeUpdate = Partial<Pick<Recipe, 'name' | 'ingredients' | 'instructions' | 'nutritionalInfo'>>;

export interface RecipeSearchParams {
    query: string;
    page: number;
    limit: number;
}

export interface PaginatedRecipeResponse {
    recipes: Recipe[];
    total: number;
    page: number;
    limit: number;
}