import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import dataRoutes from './routes/dataRoutes.js';
import { syncDataFromGovAPI } from './controllers/dataController.js';

// Load env variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();


app.use(cors()); 
// Enable parsing of JSON request bodies
app.use(express.json());

// --- API Routes ---

app.use('/api/data', dataRoutes);

// --- Database Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); 
  }
};

// --- Server Startup ---
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
 
    console.log('Performing initial data sync from data.gov.in...');
    // We'll sync for a specific state and year as per the project brief
    syncDataFromGovAPI('UTTAR PRADESH', '2024-2025'); 
  });
});
