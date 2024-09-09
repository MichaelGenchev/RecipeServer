import app from './config/app';


import { connectDB } from './config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.log('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();