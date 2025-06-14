const multer = require('multer');
const path = require('path');

/**
 * Konfigurasi Multer untuk menangani upload file gambar.
 * File akan disimpan ke folder 'uploads/' di server dengan nama unik.
 */

// Konfigurasi penyimpanan di disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder tujuan penyimpanan file
    },
    filename: function (req, file, cb) {
        // Membuat nama file yang unik untuk menghindari konflik nama
        // Contoh: image-1718360400000-123456789.png
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter untuk memastikan hanya file gambar yang diunggah
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        // Menolak file jika bukan gambar
        cb(new Error('Bukan gambar! Tolong unggah hanya gambar.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024 // Batas ukuran file 5MB
    }
});

module.exports = upload;
