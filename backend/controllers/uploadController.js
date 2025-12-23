export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.file;
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

    return res.json({
      success: true,
      data: {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `${baseUrl}/uploads/${file.filename}`,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

    const uploadedFiles = req.files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${baseUrl}/uploads/${file.filename}`,
    }));

    return res.json({ success: true, count: uploadedFiles.length, data: uploadedFiles });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
