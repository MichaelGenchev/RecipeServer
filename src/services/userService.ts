import { User, UserInput, UserUpdate } from '../types/user';
import { query, pool } from '../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { Logger } from '../utils/logger';

export interface IUserService {
    createUser(userData: UserInput): Promise<User | null>;
    loginUser(email: string, password: string): Promise<string>;
    getUserById(id: number): Promise<User | null>;
    updateUser(id: number, userData: UserUpdate): Promise<User | null>;
}

export class UserService implements IUserService {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    async createUser(userData: UserInput): Promise<User | null> {
        const { username, email, password, dietaryPreferences } = userData;

        const hashedPassword = await bcrypt.hash(password, 10);

        const client = await pool.connect();
        try {
            await client.query('BEGIN')

            const userResult = await client.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
                [username, email, hashedPassword]
            );
            const user = userResult.rows[0];

            if (dietaryPreferences && dietaryPreferences.length > 0) {
                const preferenceValues = dietaryPreferences.map(pref => `('${pref}')`).join(',');
                await client.query(`
                    INSERT INTO dietary_preferences (name)
                    VALUES ${preferenceValues}
                    ON CONFLICT (name) DO NOTHING
                `);
                const prefIds = await client.query(`
                    SELECT id FROM dietary_preferences WHERE name = ANY($1)
                `, [dietaryPreferences]);

                const userPrefValues = prefIds.rows.map((row: { id: any; }) => `(${user.id}, ${row.id})`).join(',');
                await client.query(`
                    INSERT INTO user_dietary_preferences (user_id, preference_id)
                    VALUES ${userPrefValues}
                `);
            }

            await client.query('COMMIT');
            this.logger.info(`User created: ${user.id}`);
            return this.getUserById(user.id)
        } catch (error) {
            await client.query('ROLLBACK');
            throw error
        } finally {
            client.release()
        }
    }

    async loginUser(email: string, password: string): Promise<string> {
        const result = await pool.query<User>('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new ApiError(401, 'Invalid email or password');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1d',
        });
        this.logger.info(`User logged in: ${user.id}`)
        return token;
    }

    async getUserById(id: number): Promise<User | null> {
        const userResult = await pool.query<User & { dietary_preferences: string[] }>(`
            SELECT u.*, array_agg(dp.name) as dietary_preferences
            FROM users u
            LEFT JOIN user_dietary_preferences udp ON u.id = udp.user_id
            LEFT JOIN dietary_preferences dp ON udp.preference_id = dp.id
            WHERE u.id = $1
            GROUP BY u.id
        `, [id]);

        return userResult.rows[0] || null;
    }

    async updateUser(id: number, userData: UserUpdate): Promise<User | null> {
        const { username, email, dietaryPreferences } = userData;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Update user info
            await client.query(
                'UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email) WHERE id = $3',
                [username, email, id]
            );

            // Update dietary preferences
            if (dietaryPreferences) {
                // Remove existing preferences
                await client.query('DELETE FROM user_dietary_preferences WHERE user_id = $1', [id]);

                // Insert new preferences
                const preferenceValues = dietaryPreferences.map(pref => `('${pref}')`).join(',');
                await client.query(`
                    INSERT INTO dietary_preferences (name)
                    VALUES ${preferenceValues}
                    ON CONFLICT (name) DO NOTHING
                    `);

                const prefIds = await client.query(`
                    SELECT id FROM dietary_preferences WHERE name = ANY($1)
                `, [dietaryPreferences]);

                const userPrefValues = prefIds.rows.map((row: { id: any; }) => `(${id}, ${row.id})`).join(',');
                await client.query(`
                    INSERT INTO user_dietary_preferences (user_id, preference_id)
                    VALUES ${userPrefValues}
                `);
            }
            await client.query('COMMIT');
            this.logger.info(`User updated: ${id}`);
            return this.getUserById(id);
        } catch (error) {
            await client.query('ROLLBACK');
            this.logger.error('Error updating user', error)
            throw new ApiError(500, 'Error updating user');
        } finally {
            client.release();
        }
    }
}