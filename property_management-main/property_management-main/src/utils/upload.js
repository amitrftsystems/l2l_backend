import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../configs/cloudinaryConfig.js";

// configuring the cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "real-estate", // folder name in cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "mp4", "avi", "pdf", "doc"],
    resource_type: "auto", // Auto-detect image or videos
  },
});

const upload = multer({ storage });

// export const uploadPropertyFiles = upload.fields([
//   { name: "images", maxCount: 10 },
//   { name: "videos", maxCount: 5 },
//   {name: "layoutPlan", maxtCount: 5},
//   {name: "agentProfilePicture", maxCount: 1}
// ]);

export default upload;
