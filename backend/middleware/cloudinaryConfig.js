/* A middleware method for intercepting image files sent from a frontend form, uploading it to Cloudinary,
    and providing the image URL to the route function handler */

// GENERAL IMPORTS
const cloudinary = require("cloudinary").v2; // Cloudinary's official SDK (Allow destination access)
const { CloudinaryStorage } = require("multer-storage-cloudinary"); // (Link to Cloudinary cloud)
const multer = require("multer"); // For capturing the file stream from the incoming request, and saving it

// CREATING CLOUDINARY CONFIG FILE FOR ACCESSING THIS APP's CLOUDINARY SERVER
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATING THE "storage" INSTANCE, SO THAT MULTER KNOW WHERE TO STORE THE CAPTURED FILE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // Use to be allowed access
  params: {
    folder: "constellation_logos", // The destination Cloudinary folder
    allowed_formats: ["jpg", "png", "jpeg"], // The allowed image format
  },
});

// THE "upload" MIDDLEWARE METHOD, THAT EXTRACTS THE IMAGE USING "multer" AND STORES IT IN THE CLOUD
//    (BY DEFAULT "multer" STORES IMAGES LOCALLY, BUT WE CHANGE THAT USING THE "storage" FIELD)
const upload = multer({ storage: storage });

module.exports = upload;
