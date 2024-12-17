const express = require('express');
const router = express.Router();
const { getVendorReports, exportVendorReportPDF, exportVendorReportExcel, getVendorDashboardData } = require('../../controllers/vendor/vendorDashboardController');

router.get('/reports', getVendorReports);
router.post('/reports/export/pdf', exportVendorReportPDF);
router.post('/reports/export/excel', exportVendorReportExcel);
router.get('/',getVendorDashboardData)

module.exports = router;
