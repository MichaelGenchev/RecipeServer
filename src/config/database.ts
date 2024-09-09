import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config()

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


export const connectDB = async (): Promise<void> => {
    try {
        await pool.connect();
        console.log('Database connected successfully');

    }catch (err) {
        console.log('Database connection failed: ', err);
        process.exit(1);
    }
};

export const query = async (text: string, params: any[]): Promise<QueryResult> => {
    return pool.query(text, params);
};