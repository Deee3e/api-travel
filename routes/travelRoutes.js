const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

// Inisialisasi Google Auth Client dengan Client ID server Anda
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Memverifikasi token dari klien (Android)
exports.verifyToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'ID Token tidak ditemukan.' });
    }

    try {
        // Verifikasi token menggunakan library Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const googleId = payload['sub'];

        // Mencari user di database, atau membuat user baru jika tidak ada
        let user = await User.findOne({ where: { googleId: googleId } });
        if (!user) {
            user = await User.create({
                googleId: googleId,
                displayName: payload['name'],
                email: payload['email'],
                image: payload['picture'],
            });
        }
        
        // Membuat sesi login untuk pengguna menggunakan Passport
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Gagal membuat sesi.' });
            }
            // Kirim data user sebagai konfirmasi login berhasil
            return res.status(200).json(user);
        });

    } catch (error) {
        console.error("Error verifikasi token:", error);
        return res.status(401).json({ message: 'Login gagal: Token tidak valid atau kedaluwarsa.' });
    }
};

// Logout pengguna
exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ message: 'Gagal logout.' });
        }
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Gagal menghapus sesi.' });
            }
            res.clearCookie('connect.sid'); // Hapus cookie sesi dari browser/klien
            return res.status(200).json({ message: 'Logout berhasil' });
        });
    });
};

// Mendapatkan data user yang sedang login
exports.getCurrentUser = (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ message: 'Tidak terautentikasi' });
    }
};

module.exports = router;