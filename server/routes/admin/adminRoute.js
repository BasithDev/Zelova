const express = require('express');
const router = express.Router();
const {verifyToken} = require('../../middlewares/authValidator')
const {getAdminById} = require('../../controllers/admin/adminController')
router.get('/',verifyToken('admin'),getAdminById)
module.exports = router