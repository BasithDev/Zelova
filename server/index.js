const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const path = require('path')
const connetDB = require('./config/db')
const compression = require('compression');

const authRouter = require('./routes/auth/authRoutes')
const userReqVendorRouter = require('./routes/user/reqVendorRoute')
const userRouter = require('./routes/user/userRoute')
const restaurantListing = require('./routes/user/restaurantListing')
const cartRouter = require('./routes/user/cartMngRoute')
const userCouponRouter = require('./routes/user/reedemCouponRoute')
const orderRouter = require('./routes/user/ordersMngRoute')
const zcoinRouter = require('./routes/user/zcoinRoute')
const favoriteRouter = require('./routes/user/favoriteMngRoute')

const adminManageRouter = require('./routes/admin/manageRoutes')
const adminRouter = require('./routes/admin/adminRoute')
const adminCouponRouter = require('./routes/admin/couponMngRoute')
const sendMailRouter = require('./routes/admin/sendMail')

const venodrRouter = require('./routes/vendor/restaurantRoute')
const offerRouter = require('./routes/vendor/offerMng')
const categoriesRouter = require('./routes/vendor/categoriesMng')
const productMngRouter = require('./routes/vendor/productMng')
const vendorOrderRouter = require('./routes/vendor/orderMngRoute')

const suppliesRoutes = require('./routes/user/supplies');

const passport = require('passport');
const errorMiddleware = require('./middlewares/errorMiddleware')

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

app.use('/api/admin/manage',adminManageRouter)
app.use('/api/admin',adminRouter)
app.use('/api/admin/coupon',adminCouponRouter)
app.use('/api/admin/send-mail',sendMailRouter)

app.use('/api/vendor',venodrRouter)
app.use('/api/vendor',categoriesRouter)
app.use('/api/vendor',productMngRouter)
app.use('/api/vendor/offer',offerRouter)
app.use('/api/vendor/orders',vendorOrderRouter)

app.use(errorMiddleware);

app.listen(port, () => console.log(`Server is listening on port ${port}!`))