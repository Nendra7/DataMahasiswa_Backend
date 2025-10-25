const pool = require('../config/db');

module.exports = {
    //GET /api/data_siswa
    getAll: async (req, res, next) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM siswa ORDER BY kode_siswa DESC');
            res.json(rows);
        } catch (err) {
            next(err);
        }
    },

    //GET /api/data_siswa/:kode_siswa
    getById: async (req, res, next) => {
        try {
            const kode_siswa = parseInt(req.params.kode_siswa, 10);
            const [rows] = await pool.execute('SELECT * FROM siswa WHERE kode_siswa = ?', [kode_siswa]);
            if (rows.length === 0) return res.status(404).json({ message: 'Data siswa tidak ditemukan' });
            res.json(rows[0]);
        } catch (err) {
            next(err);
        }
    },

    //POST /api/data_siswa
    create: async (req, res, next) => {
        try {
            const { nama_siswa, alamat_siswa, tgl_siswa,jurusan_siswa } = req.body;
            const [result] = await pool.execute('INSERT INTO siswa (nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa) VALUES (?, ?, ?, ?)', [nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa]);
            res.status(201).json({ kode_siswa: result.kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa });
        } catch (err) {
            next(err);  
        }
    },

    //PUT /api/data_siswa/:kode_siswa
    update: async (req, res, next) => {
        try {
            const kode_siswa = parseInt(req.params.kode_siswa, 10);
            const { nama_siswa, alamat_siswa, tgl_siswa,jurusan_siswa } = req.body;

            const fields = [];
            const values = [];
            if (nama_siswa !== undefined) fields.push('nama_siswa = ?'), values.push(nama_siswa);
            if (alamat_siswa !== undefined) fields.push('alamat_siswa = ?'), values.push(alamat_siswa);
            if (tgl_siswa !== undefined) fields.push('tgl_siswa = ?'), values.push(tgl_siswa);
            if (jurusan_siswa !== undefined) fields.push('jurusan_siswa = ?'), values.push(jurusan_siswa)
            if (fields.length === 0) return res.status(400).json({ message: 'Tidak ada data untuk diupdate' });

            values.push(kode_siswa); //untuk WHERE kode_siswa = ?
            const sql = `UPDATE siswa SET ${fields.join(', ')} WHERE kode_siswa = ?`;
            const [result] = await pool.execute(sql, values);

            if(result.affectedRows === 0) return res.status(404).json({ message: 'Data siswa tidak ditemukan' });
            res.json({ message: 'Data siswa berhasil diperbarui' });
        } catch (err) {
            next(err);
        }
    },
   
    //DELETE /api/data_siswa/:id
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