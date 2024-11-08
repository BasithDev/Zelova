const vendorRequest = require('../../models/vendorRequest');

exports.getVendorApplications = async (req, res) => {
    try {
        const applications = await vendorRequest.find()
            .populate('userId', 'email fullname profilePhoto')
            .lean();
        const formattedApplications = applications.map(app => ({
            ...app,
            user: app.userId,
        }));

        res.status(200).json(formattedApplications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching vendor applications' });
    }
};
