const User = require('../../models/user');
const Order = require('../../models/orders');
const statusCodes = require('../../config/statusCodes');
const getUserId  = require('../../helpers/getUserId');
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
        
        // Title based on time range
        const titlePrefix = timeRange === 'week' 
            ? 'Weekly'
            : timeRange === 'month'
            ? 'Monthly'
            : timeRange === 'year'
            ? 'Yearly'
            : timeRange === 'today'
            ? 'Daily'
            : 'Custom Period';
            
        // Center align all content
        const pageWidth = doc.page.width;
        const centerX = pageWidth / 2;
        
        doc
            .fontSize(24)
            .text(`Zelova ${titlePrefix} Analytics Report`, { align: 'center' })
            .moveDown();
            
        // Report details
        doc.fontSize(16)
            .text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)}s Report`, { align: 'center' })
            .moveDown();
            
        // Only show date range for custom timeRange
        if (timeRange === 'custom') {
            doc.fontSize(12)
               .text(`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`, { align: 'center' })
               .moveDown();
        }

        // Section title for data table
        doc.fontSize(14)
            .text('Detailed Data and chart', { align: 'left', indent: 50 })
            .moveDown();

        // Create table header
        const tableTop = doc.y + 10;
        const tableWidth = 350; // Fixed table width
        const tableLeft = (pageWidth - tableWidth) / 2; // Center the table
        const colWidth = tableWidth / 2;
        const rowHeight = 30;
        const textPadding = 10;
        
        // Draw table header with background
        doc
            .fillColor('#2f71f5')
            .rect(tableLeft, tableTop, tableWidth, rowHeight)
            .fill()
            .fillColor('#ffffff')  // Changed to white color for header text
            .fontSize(12)
            .text('Date', tableLeft + textPadding, tableTop + textPadding)
            .text(reportType.charAt(0).toUpperCase() + reportType.slice(1), 
                tableLeft + colWidth + textPadding, 
                tableTop + textPadding);
        
        let currentTop = tableTop + rowHeight;
        
        // Draw table rows with alternating background
        reportData.forEach((data, index) => {
            // Check if we need to start a new page
            if (currentTop > doc.page.height - 100) {
                doc.addPage();
                currentTop = 50;
            }

            // Alternate row background
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
            
            // Add cell text
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

        // Add some space after table
        doc.moveDown(2);

        // Add chart image if provided
        if (chartImage) {
            const imageBuffer = Buffer.from(chartImage.split(',')[1], 'base64');
            // Calculate dimensions to center the chart
            const chartWidth = 550;
            const chartLeft = (pageWidth - chartWidth) / 2;
            
            doc.image(imageBuffer, chartLeft, doc.y, {
                width: chartWidth,
                align: 'center'
            });
        }
        
        // Finalize PDF file
        doc.end();
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF report' });
    }
};

const exportReportExcel = async (req, res) => {
    try {
        const { reportData, reportType, timeRange, dateRange } = req.body;
        
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');
        
        // Add headers
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: reportType.charAt(0).toUpperCase() + reportType.slice(1), key: 'value', width: 15 }
        ];
        
        // Add data
        reportData.forEach(data => {
            worksheet.addRow({
                date: data.date,
                value: reportType === 'profit' || reportType === 'sales' 
                    ? Number(data[reportType]).toFixed(2)
                    : data.count
            });
        });
        
        // Add title and metadata
        worksheet.insertRow(1, [`Zelova ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`]);
        worksheet.insertRow(2, [`Time Range: ${timeRange}`]);
        worksheet.insertRow(3, [`Date Range: ${dateRange.startDate} to ${dateRange.endDate}`]);
        worksheet.insertRow(4, []); // Empty row for spacing
        
        // Set filename
        const timestamp = Date.now();
        const fileName = `zelova_${reportType}_report_${new Date().toISOString().split('T')[0]}_${timestamp}.xlsx`;
        
        // Set headers
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        
        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).json({ message: 'Error generating Excel report' });
    }
};

module.exports = { 
    getAdminById, 
    getReports, 
    exportReportPDF, 
    exportReportExcel 
};