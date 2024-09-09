export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    dietaryPreferences: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type UserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UserUpdate = Partial<Omit<UserInput, 'password'>>;