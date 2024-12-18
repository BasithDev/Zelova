const User = require('../../models/user');
const Order = require('../../models/orders');
const Restaurants = require('../../models/restaurant');
const statusCodes = require('../../config/statusCodes');
const getUserId  = require('../../helpers/userIdHelper');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const getAdminById = async (req, res, next) => {
    const token = req.cookies.admin_token;
    const id = getUserId(token, process.env.JWT_ADMIN_SECRET);
    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(statusCodes.NOT_FOUND).json({
                status: "Failed",
                message: "User not found"
            });
        }

        res.status(statusCodes.OK).json(user);
    } catch (error) {
        error.statusCode = statusCodes.INTERNAL_SERVER_ERROR;
        error.message = "Error retrieving user";
        next(error);
    }
};

const getReports = async (req, res, next) => {
    try {
        const { type, getBy, startDate, endDate } = req.query; // startDate and endDate are for custom date range
        let matchStage = {};
        
        // Determine the date range based on getBy
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        switch (getBy) {
            case 'today':
                matchStage = {
                    createdAt: { $gte: startOfToday }
                };
                break;

            case 'week':
                matchStage = {
                    createdAt: { $gte: startOfWeek }
                };
                break;

            case 'month':
                matchStage = {
                    createdAt: { $gte: startOfMonth }
                };
                break;

            case 'year':
                matchStage = {
                    createdAt: { $gte: startOfYear }
                };
                break;

            case 'custom':
                if (!startDate || !endDate) {
                    return res.status(400).json({ error: "Start date and end date are required for custom range." });
                }
                matchStage = {
                    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
                };
                break;

            default:
                return res.status(400).json({ error: "Invalid getBy parameter." });
        }

        let data;

        switch (type) {
            case 'order':
                data = await Order.aggregate([
                    { $match: matchStage },
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format: getBy === 'month' || getBy === 'year' ? "%Y-%m" : "%Y-%m-%d",
                                    date: "$createdAt"
                                }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { _id: 1 } }
                ]);
                break;

            case 'user':
                data = await User.aggregate([
                    { $match: matchStage },
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format: getBy === 'month' || getBy === 'year' ? "%Y-%m" : "%Y-%m-%d",
                                    date: "$createdAt"
                                }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { _id: 1 } }
                ]);
                break;

            case 'sales':
                data = await Order.aggregate([
                    { $match: matchStage },
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format: getBy === 'month' || getBy === 'year' ? "%Y-%m" : "%Y-%m-%d",
                                    date: "$createdAt"
                                }
                            },
                            sales: { $sum: "$billDetails.finalAmount" }
                        }
                    },
                    { $sort: { _id: 1 } }
                ]);
                break;

            case 'profit':
                data = await Order.aggregate([
                    { $match: matchStage },
                    {
                        $group: {
                            _id: {
                                $dateToString: {
                                    format: getBy === 'month' || getBy === 'year' ? "%Y-%m" : "%Y-%m-%d",
                                    date: "$createdAt"
                                }
                            },
                            profit: { 
                                $sum: {
                                    $add: [
                                        { $ifNull: ["$billDetails.platformFee", 0] },
                                        { $multiply: [0.2, { $ifNull: ["$billDetails.deliveryFee", 0] }] }
                                    ]
                                }
                            }
                        }
                    },
                    { $sort: { _id: 1 } }
                ]);
                break;

            default:
                return res.status(400).json({ error: "Invalid type specified" });
        }

        const formattedData = data
            .filter(item => item._id !== null)
            .map(item => ({
                date: item._id,
                count: item.count || 0,
                sales: item.sales || 0,
                profit: item.profit || 0
            }));


        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error retrieving reports:', error);
        next(error);
    }
};

const exportReportPDF = async (req, res) => {
    try {
        const { reportData, chartImage, reportType, timeRange, dateRange } = req.body;
        
        const doc = new PDFDocument();
        const timestamp = Date.now();
        const fileName = `${reportType}_report_${new Date().toISOString().split('T')[0]}_${timestamp}.pdf`;
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        
        doc.pipe(res);
        
        const titlePrefix = timeRange === 'week' 
            ? 'Weekly'
            : timeRange === 'month'
            ? 'Monthly'
            : timeRange === 'year'
            ? 'Yearly'
            : timeRange === 'today'
            ? 'Daily'
            : 'Custom Period';
            
        const pageWidth = doc.page.width;
        
        doc
            .fontSize(24)
            .text(`Zelova ${titlePrefix} Analytics Report`, { align: 'center' })
            .moveDown();
            
        doc.fontSize(16)
            .text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)}s Report`, { align: 'center' })
            .moveDown();
            
        if (timeRange === 'custom') {
            doc.fontSize(12)
               .text(`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`, { align: 'center' })
               .moveDown();
        }

        doc.fontSize(14)
            .text('Detailed Data and chart', { align: 'left', indent: 50 })
            .moveDown();

        const tableTop = doc.y + 10;
        const tableWidth = 350; 
        const tableLeft = (pageWidth - tableWidth) / 2; 
        const colWidth = tableWidth / 2;
        const rowHeight = 30;
        const textPadding = 10;
        
        doc
            .fillColor('#2f71f5')
            .rect(tableLeft, tableTop, tableWidth, rowHeight)
            .fill()
            .fillColor('#ffffff')  
            .fontSize(12)
            .text('Date', tableLeft + textPadding, tableTop + textPadding)
            .text(reportType.charAt(0).toUpperCase() + reportType.slice(1), 
                tableLeft + colWidth + textPadding, 
                tableTop + textPadding);
        
        let currentTop = tableTop + rowHeight;
        
        reportData.forEach((data, index) => {
            if (currentTop > doc.page.height - 100) {
                doc.addPage();
                currentTop = 50;
            }

            if (index % 2 === 0) {
                doc
                    .fillColor('#ffffff')
                    .rect(tableLeft, currentTop, tableWidth, rowHeight)
                    .fill();
            } else {
                doc
                    .fillColor('#f9fafb')
                    .rect(tableLeft, currentTop, tableWidth, rowHeight)
                    .fill();
            }
            doc
                .strokeColor('#e5e7eb')
                .lineWidth(1)
                .rect(tableLeft, currentTop, tableWidth, rowHeight)
                .stroke();
            
            doc
                .fillColor('#000000')
                .fontSize(10)
                .text(data.date, 
                    tableLeft + textPadding, 
                    currentTop + textPadding)
                .text(
                    reportType === 'profit' || reportType === 'sales'
                        ? '₹' + Number(data[reportType]).toFixed(2)
                        : data.count.toString(),
                    tableLeft + colWidth + textPadding,
                    currentTop + textPadding
                );
            
            currentTop += rowHeight;
        });

        doc.moveDown(2);

        if (chartImage) {
            const imageBuffer = Buffer.from(chartImage.split(',')[1], 'base64');
            const chartWidth = 550;
            const chartLeft = (pageWidth - chartWidth) / 2;
            
            doc.image(imageBuffer, chartLeft, doc.y, {
                width: chartWidth,
                align: 'center'
            });
        }
        
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF report' });
    }
};

const exportReportExcel = async (req, res) => {
    try {
        const { reportData, reportType, timeRange, dateRange } = req.body;
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: reportType.charAt(0).toUpperCase() + reportType.slice(1), key: 'value', width: 15 }
        ];
        
        reportData.forEach(data => {
            worksheet.addRow({
                date: data.date,
                value: reportType === 'profit' || reportType === 'sales' 
                    ? Number(data[reportType]).toFixed(2)
                    : data.count
            });
        });
        
        worksheet.insertRow(1, [`Zelova ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`]);
        worksheet.insertRow(2, [`Time Range: ${timeRange}`]);
        worksheet.insertRow(3, [`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`]);
        worksheet.insertRow(4, []);
        const timestamp = Date.now();
        const fileName = `zelova_${reportType}_report_${new Date().toISOString().split('T')[0]}_${timestamp}.xlsx`;
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'Error generating Excel report' });
    }
};

const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurants.find().populate('vendorId', 'fullname email phoneNumber')
        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error retrieving restaurants:', error);
        res.status(500).json({ message: 'Error retrieving restaurants' });
    }
};

const blockUnblockRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurants.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        restaurant.isActive = !restaurant.isActive;
        await restaurant.save();
        res.status(200).json({ message: 'Restaurant updated successfully' });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ message: 'Error updating restaurant' });
    }
};

const getDashboardData = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalSales = await Order.aggregate([
            { $match: { status: 'ORDER ACCEPTED' } },  
            { $group: { _id: null, totalAmount: { $sum: "$billDetails.finalAmount" } } },
            { $project: { _id: 0, totalEarnings: { $round: ["$totalAmount", 2] } } }
        ]);
        const totalProfit = await Order.aggregate([
            { $match: { status: 'ORDER ACCEPTED' } },  
            { $group: { _id: null, totalAmount: { $sum: { $add: [{ $ifNull: ["$billDetails.platformFee", 0] }, { $multiply: [0.2, { $ifNull: ["$billDetails.deliveryFee", 0] }] }] } } } },
            { $project: { _id: 0, totalEarnings: { $round: ["$totalAmount", 2] } } }
        ]);
        const totalRestaurants = await Restaurants.countDocuments();
        res.status(200).json({
            totalRestaurants,
            totalUsers,
            totalOrders,
            totalSales: totalSales[0]?.totalEarnings || 0,
            totalProfit: totalProfit[0]?.totalEarnings || 0,
        });
    } catch (error) {
        console.error('Error retrieving dashboard data:', error);
        res.status(500).json({ message: 'Error retrieving dashboard data' });
    }
};

module.exports = { 
    getAdminById, 
    getReports, 
    exportReportPDF, 
    exportReportExcel,
    getRestaurants,
    blockUnblockRestaurant,
    getDashboardData
};