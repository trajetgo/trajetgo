const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

async function testCloudinaryConnection() {
  try {
    const result = await cloudinary.api.ping();
    console.log('Connection successful:', result);
    return true;
  } catch (error) {
    console.error('Connection failed:', error.message);
    return false;
  }
}

testCloudinaryConnection();

module.exports = cloudinary;