const express = require('express');
const router = express.Router(); // Baris ini yang mungkin hilang

// Impor controller dan middleware yang diperlukan
const { getAllTravels, getMyTravels, createTravel, deleteTravel } = require('../controllers/travelController');
const { ensureAuth } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/uploadMiddleware');

// Rute publik untuk melihat semua cerita
// Endpoint: GET /api/travels/
router.get('/', getAllTravels);

// --- Rute yang membutuhkan login ---

// Mendapatkan cerita perjalanan milik pengguna yang sedang login
// Endpoint: GET /api/travels/mine
router.get('/mine', ensureAuth, getMyTravels);

// Membuat cerita perjalanan baru
// Endpoint: POST /api/travels/
router.post('/', ensureAuth, upload.single('image'), createTravel);

// Menghapus cerita perjalanan
// Endpoint: DELETE /api/travels/:id
router.delete('/:id', ensureAuth, deleteTravel);


// Baris ini mengekspor router agar bisa digunakan di server.js
module.exports = router;
