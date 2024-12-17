const express = require('express');
const router = express.Router();
const {sendMailFromAdmin,getAnnouncementStatus,sendAnnouncement} = require('../../controllers/admin/emailSendingController')
router.post('/',sendMailFromAdmin)
router.post('/announcement',sendAnnouncement)
router.get('/announcement/status/:jobId',getAnnouncementStatus)
module.exports = router