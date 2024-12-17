const express = require('express');
const router = express.Router();

const {createAnnounceTemp,deleteAnnounceTemp,getAnnounceTemp} = require('../../controllers/admin/announcementTemplateController')

router.post('/add',createAnnounceTemp)
router.delete('/delete/:id',deleteAnnounceTemp)
router.get('/',getAnnounceTemp)

module.exports = router;