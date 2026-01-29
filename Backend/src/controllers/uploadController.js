import Student from '../models/student.model.js';
import cloudinary from '../utils/cloudinary.js';

export const uploadProfileImage = async (req, res, next) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'profile_images',
    });
    const studentId = req.user._id;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { profilePicture: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      user: updatedStudent,
    });
  } catch (err) {
    next(err);
  }
};
