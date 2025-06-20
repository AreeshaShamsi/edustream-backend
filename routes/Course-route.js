import express from 'express';
import multer from 'multer'; // Add multer for handling file uploads
import Course from '../models/Course.js';

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Save with timestamp to avoid name clashes
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// ✅ Create Course with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Parse chapters as JSON if it's a string
    let chapters = [];
    if (req.body.chapters) {
      try {
        chapters = JSON.parse(req.body.chapters); // Convert to array
      } catch (err) {
        return res.status(400).json({ message: 'Invalid chapters format' });
      }
    }

    // Prepare course data
    const newCourse = new Course({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      youtubeLink: req.body.youtubeLink,
      chapters: chapters, // Save chapters as array
      image: req.file ? req.file.path : null, // Image path from multer
      createdAt: new Date(),
    });

    // Save course to database
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully!', course: newCourse });
  } catch (err) {
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
});

// ✅ Get all Courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching courses', error: err.message });
  }
});

// ✅ Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching course', error: err.message });
  }
});

export default router;
