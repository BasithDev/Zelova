const mongoose = require("mongoose");

const announcementTemplateSchema = new mongoose.Schema({
    templateName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("AnnouncementTemplate", announcementTemplateSchema);