const Travel = require('../models/Travel');
const fs = require('fs');
const path = require('path');

const fullUrl = (travel) => ({
    ...travel.toJSON(),
    imageId: `${process.env.APP_URL}${travel.imageId}`
});

// READ All
exports.getAllTravels = async (req, res) => {
    try {
        const travels = await Travel.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(travels.map(fullUrl));
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
};

// READ Mine
exports.getMyTravels = async (req, res) => {
     try {
        const travels = await Travel.findAll({ 
            where: { userId: req.user.googleId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(travels.map(fullUrl));
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
};

// CREATE
exports.createTravel = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Gambar wajib diisi' });

        const { judulPerjalanan, cerita } = req.body;
        const imagePath = `/uploads/${req.file.filename}`;

        const newTravel = await Travel.create({
            judulPerjalanan,
            cerita,
            imageId: imagePath,
            userId: req.user.googleId
        });
        res.status(201).json(fullUrl(newTravel));
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
};

// DELETE
exports.deleteTravel = async (req, res) => {
    try {
        const travel = await Travel.findByPk(req.params.id);
        if (!travel) return res.status(404).json({ message: 'Not found' });
        if (travel.userId !== req.user.googleId) return res.status(403).json({ message: 'Forbidden' });

        const localPath = path.join(__dirname, '..', travel.imageId);
        fs.unlink(localPath, (err) => {
            if (err) console.error(`Gagal menghapus file: ${localPath}`, err);
        });

        await travel.destroy();
        res.status(200).json({ message: 'Travel story berhasil dihapus' });
    } catch (err) { res.status(500).json({ message: 'Server Error' }); }
};
