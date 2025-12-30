const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

require('dotenv').config(); // To load environment variables from .env file

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Function to handle the stream upload to Cloudinary
const streamUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Create a write stream to Cloudinary
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    // Use streamifier to convert file buffer to a readable stream and pipe it to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// @route   POST /api/upload
// @desc    Upload an image
// @access  Public (or protected, depending on middleware)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Check if a file was uploaded by Multer
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Call the streamUpload function with the file buffer from Multer
    const result = await streamUpload(req.file.buffer);

    // Respond with the uploaded image URL
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
