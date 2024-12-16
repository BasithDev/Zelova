const express = require('express');
const router = express.Router();

const {createAnnounceTemp,deleteAnnounceTemp,getAnnounceTemp} = require('../../controllers/admin/announcementTempController')

router.post('/add',createAnnounceTemp)
router.delete('/delete/:id',deleteAnnounceTemp)
router.get('/',getAnnounceTemp)

module.exports = router;