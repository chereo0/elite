import fs from 'fs';
import path from 'path';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const file = req.file;
    
    // Read file and convert to base64 data URI
    const filePath = path.resolve(file.path);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');
    const mimeType = file.mimetype;
    const dataUri = `data:${mimeType};base64,${base64Data}`;
    
    // Clean up the temp file
    fs.unlinkSync(filePath);

    return res.json({
      success: true,
      data: {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: dataUri, // Return base64 data URI instead of file URL
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const uploadedFiles = req.files.map((file) => {
      // Read file and convert to base64 data URI
      const filePath = path.resolve(file.path);
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString('base64');
      const mimeType = file.mimetype;
      const dataUri = `data:${mimeType};base64,${base64Data}`;
      
      // Clean up the temp file
      fs.unlinkSync(filePath);
      
      return {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: dataUri, // Return base64 data URI instead of file URL
      };
    });

    return res.json({ success: true, count: uploadedFiles.length, data: uploadedFiles });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
