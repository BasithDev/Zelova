const express = require('express');
const router = express.Router();

const { 
    IgnoreIssue, 
    getIssues, 
    refundUser, 
    resolveIssue 
} = require('../../controllers/admin/UserIssuesMng')

router.get('/', getIssues)
router.delete('/ignore', IgnoreIssue)
router.put('/refund', refundUser)
router.delete('/resolve', resolveIssue)

module.exports = router;