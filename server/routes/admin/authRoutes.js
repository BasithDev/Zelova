const express = require('express');
const router = express.Router();
const {loginAdmin,logoutAdmin} = require('../../controllers/admin/authController')
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
module.exports = router;