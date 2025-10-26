const pool = require('../config/db');

// Fungsi bantu: ubah tanggal dari "DD-MM-YYYY" ke "YYYY-MM-DD"
function toMySQLDate(dateStr) {
    if (!dateStr) return null;

    // Cek apakah format sudah "YYYY-MM-DD"
    if (dateStr.includes('-') && dateStr.indexOf('-') === 4) {
        return dateStr;
    }

    // Jika formatnya "DD-MM-YYYY"
    const [dd, mm, yyyy] = dateStr.split("-");
    return `${yyyy}-${mm}-${dd}`;
}

// Fungsi bantu: format tanggal jadi "DD-MM-YYYY" untuk ditampilkan
function formatDate(date) {
    if (!date) return null;
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy}`;
}

module.exports = {
    // GET /api/data_siswa
    getAll: async (req, res, next) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM siswa ORDER BY kode_siswa DESC');

            // Format tanggal agar ditampilkan sebagai DD-MM-YYYY
            const formattedRows = rows.map(row => ({
                ...row,
                tgl_siswa: formatDate(row.tgl_siswa),
                createdAt: formatDate(row.createdAt),
                updatedAt: formatDate(row.updatedAt),
            }));

            res.json(formattedRows);
        } catch (err) {
            next(err);
        }
    },

    // GET /api/data_siswa/:kode_siswa
    getById: async (req, res, next) => {
        try {
            const kode_siswa = parseInt(req.params.kode_siswa, 10);
            const [rows] = await pool.execute('SELECT * FROM siswa WHERE kode_siswa = ?', [kode_siswa]);
            if (rows.length === 0) return res.status(404).json({ message: 'Data siswa tidak ditemukan' });

            const row = rows[0];
            const formattedRow = {
                ...row,
                tgl_siswa: formatDate(row.tgl_siswa),
                createdAt: formatDate(row.createdAt),
                updatedAt: formatDate(row.updatedAt),
            };

            res.json(formattedRow);
        } catch (err) {
            next(err);
        }
    },

    // POST /api/data_siswa
    create: async (req, res, next) => {
        try {
            const { nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;
            const mysqlDate = toMySQLDate(tgl_siswa);

            const [result] = await pool.execute(
                'INSERT INTO siswa (nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa) VALUES (?, ?, ?, ?)',
                [nama_siswa, alamat_siswa, mysqlDate, jurusan_siswa]
            );

            res.status(201).json({
                kode_siswa: result.insertId,
                nama_siswa,
                alamat_siswa,
                tgl_siswa: formatDate(mysqlDate),
                jurusan_siswa,
            });
        } catch (err) {
            next(err);
        }
    },

    // PUT /api/data_siswa/:kode_siswa
    update: async (req, res, next) => {
        try {
            const kode_siswa = parseInt(req.params.kode_siswa, 10);
            let { nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;

            // Jika ada tgl_siswa, ubah ke format MySQL
            if (tgl_siswa) tgl_siswa = toMySQLDate(tgl_siswa);

            const fields = [];
            const values = [];

            if (nama_siswa !== undefined) fields.push('nama_siswa = ?'), values.push(nama_siswa);
            if (alamat_siswa !== undefined) fields.push('alamat_siswa = ?'), values.push(alamat_siswa);
            if (tgl_siswa !== undefined) fields.push('tgl_siswa = ?'), values.push(tgl_siswa);
            if (jurusan_siswa !== undefined) fields.push('jurusan_siswa = ?'), values.push(jurusan_siswa);

            if (fields.length === 0) return res.status(400).json({ message: 'Tidak ada data untuk diupdate' });

            values.push(kode_siswa);
            const sql = `UPDATE siswa SET ${fields.join(', ')} WHERE kode_siswa = ?`;
            const [result] = await pool.execute(sql, values);

            if (result.affectedRows === 0) return res.status(404).json({ message: 'Data siswa tidak ditemukan' });

            res.json({ message: 'Data siswa berhasil diperbarui' });
        } catch (err) {
            next(err);
        }
    },

    // DELETE /api/data_siswa/:kode_siswa
    delete: async (req, res, next) => {
        try {
            const kode_siswa = parseInt(req.params.kode_siswa, 10);
            const [result] = await pool.execute('DELETE FROM siswa WHERE kode_siswa = ?', [kode_siswa]);
            if (result.affectedRows === 0) return res.status(404).json({ message: 'Data siswa tidak ditemukan' });
            res.json({ message: 'Data siswa berhasil dihapus' });
        } catch (err) {
            next(err);
        }
    },
};
