const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

// Inisialisasi Google Auth Client dengan Client ID server Anda dari .env
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Memverifikasi ID Token dari Google yang dikirim oleh klien,
 * kemudian membuat user baru jika belum ada, dan memulai sesi login.
 */
exports.verifyToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'ID Token tidak ditemukan.' });
    }

    try {
        // Verifikasi token ke server Google
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
        // Ini akan menghasilkan cookie sesi yang dikirim kembali ke klien
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

/**
 * Mengakhiri sesi pengguna (logout).
 */
exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ message: 'Gagal logout.' });
        }
        // Hancurkan sesi di server
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Gagal menghapus sesi.' });
            }
            // Bersihkan cookie sesi dari browser/klien
            res.clearCookie('connect.sid'); 
            return res.status(200).json({ message: 'Logout berhasil' });
        });
    });
};

/**
 * Mendapatkan data pengguna yang sedang login berdasarkan sesi cookie.
 */
exports.getCurrentUser = (req, res) => {
    // req.user disediakan oleh Passport jika sesi valid
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ message: 'Tidak terautentikasi' });
    }
};
