const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const filePath = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'Image uploaded successfully',
    image: filePath
  });
});

module.exports = router;
