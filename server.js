require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const travelRoutes = require('./routes/travelRoutes'); // Menggunakan rute travel

// Inisialisasi Passport (diperlukan untuk manajemen sesi)
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Pastikan folder uploads ada saat aplikasi dimulai
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis dari folder 'uploads'
app.use('/uploads', express.static(uploadsDir));

// Express Session untuk menyimpan status login
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true jika di production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // Berlaku 1 hari
    }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/travels', travelRoutes); // Menggunakan endpoint /api/travels

// Root route handler
app.get('/', (req, res) => {
    res.send('Travel API is running! 🚀');
});


// Memulai server dan mengecek koneksi database
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    sequelize.authenticate()
        .then(() => console.log('Database connection has been established successfully.'))
        .catch(err => console.error('Unable to connect to the database:', err));
});
