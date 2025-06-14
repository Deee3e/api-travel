/**
 * Middleware untuk memastikan pengguna sudah login sebelum mengakses sebuah rute.
 * Jika pengguna sudah login (sesi valid), request akan dilanjutkan.
 * Jika tidak, akan mengirim error 401 Unauthorized.
 */
module.exports = {
    ensureAuth: function (req, res, next) {
        // req.isAuthenticated() adalah fungsi dari Passport
        // yang akan bernilai true jika sesi pengguna valid.
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.status(401).json({ message: 'Akses ditolak: Silakan login terlebih dahulu.' });
        }
    }
};
