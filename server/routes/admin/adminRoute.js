const express = require('express');
const router = express.Router();
const {getAdminById} = require('../../controllers/admin/adminController')
router.get('/',getAdminById)
module.exports = router