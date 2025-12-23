import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import app from './app';
import connectDB from './config/db';

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Elite Motion API Server                              ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                               ║
║   Port: ${PORT}                                              ║
║   API: http://localhost:${PORT}/api                          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
