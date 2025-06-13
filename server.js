import express from 'express';
import cors from 'cors';
import geminiRouter from './routes/gemini.js';
import fileUploadRouter from './routes/file-upload.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/gemini', geminiRouter);
app.use('/api/file-upload', fileUploadRouter);

app.get('/', (req, res) => {
  res.send('Gemini API Server is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
