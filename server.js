require('dotenv').config(); // load env variables

const express = require('express');
const cors = require('cors'); // ✅ tambahkan ini
const app = express();

// ✅ aktifkan CORS (biarkan semua origin, atau atur sesuai kebutuhan)
app.use(cors({
    origin: 'http://localhost:5173', // atau '*' untuk semua origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// middleware
app.use(express.json()); // for parsing application/json

// Routes
const data_siswaRoutes = require('./routes/data_siswaRoutes');

// mount routes
app.use('/api/data_siswa', data_siswaRoutes);

// basic error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error!' });
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server berjalan pada port ${PORT}`);
});

module.exports = app; // Export app for testing purposes

