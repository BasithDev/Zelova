const zcoin = require('../../models/zcoin');
const user = require('../../models/user');
const statusCodes = require('../../config/statusCodes');
const getUserId = require('../../helpers/userIdHelper')

const getZcoinsData = async (req, res, next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const userCoinsData = await zcoin.findOne({ userId }).populate({
            path: 'lastSentUserIds',
            select: 'fullname email profilePicture'
        });
        
        if (!userCoinsData) {
            return res.status(statusCodes.OK).json({ balance: 0 });
        }
        
        res.status(statusCodes.OK).json({ zcoins:userCoinsData });    
    } catch (error) {
        console.error(error);
        next(error)
    }
}

const searchUsers = async (req, res ,next) => {
    try {
        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);
        const { searchQuery } = req.query;
        const users = await user.find({
            $and: [
                {
                    $or: [
                        { fullname: { $regex: searchQuery, $options: 'i' } },
                        { email: { $regex: searchQuery, $options: 'i' } }
                    ]
                },
                { isAdmin: { $ne: true } },
                { _id: { $ne: userId } }
            ]
        }).select('fullname email profilePicture');
        res.status(statusCodes.OK).json({ users });
    } catch (error) {
        console.error(error);
            next(error)
    }
}

const sendZcoins = async (req, res ,next) => {
    const { amountNum , receiverId } = req.body;
    const amount = amountNum;
    try {
        if (!amount || amount <= 0 || isNaN(amount)) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const token = req.cookies.user_token;
        if (!token) {
            return res.status(statusCodes.UNAUTHORIZED).json({ message: 'Not authorized' });
        }
        const userId = getUserId(token, process.env.JWT_SECRET);

        const userCoins = await zcoin.findOne({ userId });

        if (userCoins.balance < amount) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: 'Insufficient balance' });
        }

        const receiverConfirmed = await user.exists({ _id: receiverId });
        if (!receiverConfirmed) {
            return res.status(statusCodes.BAD_REQUEST).json({ message: 'Receiver not found' });
        }

        let receiver = await zcoin.findOne({ userId: receiverId });
        if (!receiver) {
            receiver = new zcoin({ userId: receiverId, balance: 0 }); 
            await receiver.save();
        }

        receiver.balance += amount;
        userCoins.balance -= amount;
        if (!userCoins.lastSentUserIds.includes(receiverId)) {
            userCoins.lastSentUserIds.push(receiverId);
        }
        await receiver.save();
        await userCoins.save();
        res.status(statusCodes.OK).json({ message: 'Zcoins sent successfully' });
    } catch (error) {
        console.error(error);
        next(error)
    }
}

module.exports = {
    getZcoinsData,
    sendZcoins,
    searchUsers
}