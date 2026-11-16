const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = [
        // Images
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      
        // Vidéos
        "video/mp4",
        "video/webm",
        "video/quicktime", // .mov
        "video/x-msvideo", // .avi
      
        // Documents
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    if (!allowed.includes(file.mimetype)) {
        return cb(new Error("Format de fichier invalide. Seuls les images, vidéos et PDF sont acceptés."));
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // Augmenté à 50 Mo pour prendre en compte les vidéos
    },
});

module.exports = upload;