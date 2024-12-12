const express = require('express');
const router = express.Router();
const {getAdminById, getReports,exportReportExcel,exportReportPDF,getRestaurants,blockUnblockRestaurant} = require('../../controllers/admin/adminController')
router.get('/',getAdminById)
router.get('/reports',getReports) 
router.post('/reports/export/pdf', exportReportPDF);
router.post('/reports/export/excel', exportReportExcel);
router.get('/restaurants',getRestaurants)
router.patch('/restaurant/block-unblock/:id',blockUnblockRestaurant)
module.exports = router