const express = require('express');
const router = express.Router();

const data_siswaController = require('../controllers/data_siswaController');

//routes

router.get('/', data_siswaController.getAll); 
router.get('/:kode_siswa', data_siswaController.getById); 
router.post('/', data_siswaController.create); 
router.put('/:kode_siswa', data_siswaController.update);
router.delete('/:kode_siswa', data_siswaController.delete); 

module.exports = router;