const express = require('express');
const router = express.Router();
const {sendMailFromAdmin} = require('../../controllers/admin/sendMail')
router.post('/',sendMailFromAdmin)
module.exports = router