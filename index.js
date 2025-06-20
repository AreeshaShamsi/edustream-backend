import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import geminiRouter from './routes/gemini.js';
import fileUploadRouter from './routes/file-upload.js';
import courseRouter from './routes/Course-route.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI;

// ✅ MongoDB connection
mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use('/api/gemini', geminiRouter);
app.use('/api/file-upload', fileUploadRouter);
app.use('/api/courses', courseRouter);


// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('Gemini API Server is running.');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
