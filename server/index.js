const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const path = require('path')
const connetDB = require('./config/databaseConnectionConfig')
const compression = require('compression');

const authRouter = require('./routes/auth/authenticationRoutes')
const userReqVendorRouter = require('./routes/user/vendorRequestRoutes')
const userRouter = require('./routes/user/userRoutes')
const restaurantListing = require('./routes/user/restaurantListingsRoutes')
const cartRouter = require('./routes/user/cartManagementRoutes')
const userCouponRouter = require('./routes/user/redeemCouponRoutes')
const orderRouter = require('./routes/user/ordersManagementRoutes')
const zcoinRouter = require('./routes/user/zcoinRoutes')
const favoriteRouter = require('./routes/user/favoritesManagementRoutes')
const searchRoutes = require('./routes/user/searchRoutes')

const adminManageRouter = require('./routes/admin/adminManagementRoutes')
const adminRouter = require('./routes/admin/adminRoutes')
const adminCouponRouter = require('./routes/admin/couponManagementRoutes')
const sendMailRouter = require('./routes/admin/emailSendingRoutes')
const userIssuesRouter = require('./routes/admin/userIssuesManagementRoutes')
const announcementTempRouter = require('./routes/admin/announcementTemplateRoutes')

const venodrRouter = require('./routes/vendor/vendorRestaurantRoute')
const offerRouter = require('./routes/vendor/vendorOffersRoute')
const categoriesRouter = require('./routes/vendor/vendorCategoriesRoute')
const productMngRouter = require('./routes/vendor/vendorProductsRoute')
const vendorOrderRouter = require('./routes/vendor/vendorOrdersRoute') 
const vendorDashboardRouter = require('./routes/vendor/vendorDashboardRoute')

const suppliesRoutes = require('./routes/user/suppliesRoutes');

const passport = require('passport');
const errorMiddleware = require('./middlewares/errorHandlingMiddleware')
const { protectApi } = require('./middlewares/authenticationValidatorMiddleware')

require('dotenv').config()

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use(cors({
    origin: ["http://localhost:5173","https://api.cloudinary.com"],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true
}))

connetDB()
const port = process.env.PORT

app.use(passport.initialize())

// Apply API protection to all /api routes
app.use('/api', protectApi);

app.use('/api/auth',authRouter)
app.use('/api/user/req-vendor',userReqVendorRouter)
app.use('/api/user',userRouter)
app.use('/api/user',restaurantListing)
app.use('/api/user/cart',cartRouter)
app.use('/api/user/coupons',userCouponRouter)
app.use('/api/user/orders',orderRouter)
app.use('/api/user/zcoins',zcoinRouter)
app.use('/api/user/favourites',favoriteRouter)
app.use('/api/user/supplies', suppliesRoutes);
app.use('/api/user/search', searchRoutes);

app.use('/api/admin/manage',adminManageRouter)
app.use('/api/admin',adminRouter)
app.use('/api/admin/coupon',adminCouponRouter)
app.use('/api/admin/send-mail',sendMailRouter)
app.use('/api/admin/user-issues',userIssuesRouter)
app.use('/api/admin/announcement-temp',announcementTempRouter)

app.use('/api/vendor',venodrRouter)
app.use('/api/vendor',categoriesRouter)
app.use('/api/vendor',productMngRouter)
app.use('/api/vendor/offer',offerRouter)
app.use('/api/vendor/orders',vendorOrderRouter)
app.use('/api/vendor/dashboard',vendorDashboardRouter)

app.use(errorMiddleware); 

const server = app.listen(port, () => console.log(`Server is listening on port ${port}!`));

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please use a different port.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});