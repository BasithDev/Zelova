const announcementTemp = require('../../models/announcementTemplate');
const statusCodes = require('../../config/statusCodes');

const getAnnounceTemp = async (req, res) => {
    try {
        const announceTemp = await announcementTemp.find();
        return res.status(statusCodes.OK).json(announceTemp);
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const createAnnounceTemp = async (req, res) => {
    try {
        const {...data} = req.body
        const announceTemp = await announcementTemp.create(data);
        return res.status(statusCodes.OK).json(announceTemp);
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const deleteAnnounceTemp = async (req, res) => {
    try {
        const { id } = req.params;
        const announceTemp = await announcementTemp.findByIdAndDelete(id);
        return res.status(statusCodes.OK).json(announceTemp);
    } catch (error) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

module.exports = {
    getAnnounceTemp,
    createAnnounceTemp,
    deleteAnnounceTemp,
};