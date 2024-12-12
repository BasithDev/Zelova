const express = require('express');
const router = express.Router();
const {getAdminById, getReports,exportReportExcel,exportReportPDF} = require('../../controllers/admin/adminController')
router.get('/',getAdminById)
router.get('/reports',getReports) 
router.post('/reports/export/pdf', exportReportPDF);
router.post('/reports/export/excel', exportReportExcel);
module.exports = router