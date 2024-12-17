const express = require('express');
const router = express.Router();

const { 
    IgnoreIssue, 
    getIssues, 
    refundUser, 
    resolveIssue, 
    getOrderDetails
} = require('../../controllers/admin/userIssuesManagement')

router.get('/', getIssues)
router.delete('/ignore', IgnoreIssue)
router.put('/refund', refundUser)
router.delete('/resolve', resolveIssue)
router.get('/getOrderDetails/:orderId', getOrderDetails)

module.exports = router;