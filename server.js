import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

// Importing express-async-errors to handle async errors
import 'express-async-errors';

import morgan from 'morgan';

// Import database connection function
import connectDB from './db/connect.js';

// Import Routers
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';

// Import Middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/authenticate.js';

// Deployment specific imports
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Security Packages
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// Cookie Parser
import cookieParser from 'cookie-parser';

// CORS package
import cors from 'cors';

// Enable trust proxy for reverse proxies (e.g., Nginx, Heroku)
app.set('trust proxy', 1); // Trust the first proxy

// Use morgan logger only in development environment
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Resolving the directory name from the URL of the file
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve static files from the React app in production
app.use(express.static(path.resolve(__dirname, './client/build')));

// Parsing JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Applying security middleware
app.use(helmet());
app.use(mongoSanitize());

// Applying CORS middleware
app.use(cors({
  origin: 'https://job-client1.onrender.com', // Replace with your frontend URL
  credentials: true, // Allow cookies and credentials from client
}));

// Basic route to test API
app.get('/api/v1', (req, res) => {
  res.send('Hello');
});

// Routing
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// Serve the frontend application in production
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

// Applying middleware to handle not found and error scenarios
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Setting the port
const port = process.env.PORT || 4000;

// Function to start the server
const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => { 
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

// Start the server
start();
