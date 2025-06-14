const express = require('express');
const router = express.Router();
const { logout, getCurrentUser, verifyToken } = require('../controllers/authController');

// Rute utama untuk klien (Android/iOS) memverifikasi token dan login
// Endpoint: POST /auth/google/verify-token
router.post('/google/verify-token', verifyToken);

// Rute untuk mendapatkan data pengguna yang sedang login (berdasarkan sesi cookie)
// Endpoint: GET /auth/me
router.get('/me', getCurrentUser);

// Rute untuk logout dan menghancurkan sesi
// Endpoint: POST /auth/logout
router.post('/logout', logout);

module.exports = router;
