const passport = require('passport');
const User = require('../models/User');

// Menyimpan ID user ke dalam sesi setelah login berhasil
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Mengambil data user dari database berdasarkan ID yang tersimpan di sesi
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
