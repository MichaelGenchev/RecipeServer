import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(6),
        dietaryPreferences: z.array(z.string()).optional(),
    }),
});


export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});


export const updateProfileSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(50).optional(),
        email: z.string().email().optional(),
        dietaryPreferences: z.array(z.string()).optional(),
    }),
});


export const saveRecipeSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(100),
        ingredients: z.array(
            z.object({
                name: z.string().min(1).max(100),
                amount: z.number().positive(),
                unit: z.string().min(1).max(20)
            })
        ).min(1),
        instructions: z.array(z.string().min(1).max(500)).min(1),
        nutritionalInfo: z.object({
            calories: z.number().nonnegative(),
            protein: z.number().nonnegative(),
            carbs: z.number().nonnegative(),
            fat: z.number().nonnegative()
        })
    })
});

export const updateRecipeSchema = z.object({
    body: z.object({
        name: z.string().min(1).max(100).optional(),
        ingredients: z.array(
            z.object({
                name: z.string().min(1).max(100),
                amount: z.number().positive(),
                unit: z.string().min(1).max(20)
            })
        ).min(1).optional(),
        instructions: z.array(z.string().min(1).max(500)).min(1).optional(),
        nutritionalInfo: z.object({
            calories: z.number().nonnegative(),
            protein: z.number().nonnegative(),
            carbs: z.number().nonnegative(),
            fat: z.number().nonnegative()
        }).optional()
    })
});