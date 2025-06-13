import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Filebase S3-compatible config
const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: 'https://s3.filebase.com',
  credentials: {
    accessKeyId: process.env.FILEBASE_ACCESS_KEY,
    secretAccessKey: process.env.FILEBASE_SECRET_KEY,
  },
});

const BUCKET = process.env.FILEBASE_BUCKET;

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    const fileName = `${Date.now()}_${req.file.originalname}`;
    const params = {
      Bucket: BUCKET,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    const url = `https://${BUCKET}.s3.filebase.com/${fileName}`;
    res.json({ url });
  } catch (err) {
    console.error('Filebase upload error:', err);
    res.status(500).json({ error: 'Upload failed.' });
  }
});

export default router;