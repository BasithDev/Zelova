const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const path = require('path')
const connetDB = require('./config/db')

const authRouter = require('./routes/auth/authRoutes')
const userReqVendorRouter = require('./routes/user/reqVendorRoute')
const adminManageRouter = require('./routes/admin/manageRoutes')
const userRouter = require('./routes/user/userRoute')
const adminRouter = require('./routes/admin/adminRoute')

const passport = require('passport');

require('dotenv').config()

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localhost:5173","https://api.cloudinary.com"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}))
connetDB()
const port = process.env.PORT

app.use(passport.initialize())

app.use('/api/auth',authRouter)
app.use('/api/user/req-vendor',userReqVendorRouter)
app.use('/api/admin/manage',adminManageRouter)
app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.listen(port, () => console.log(`Server is listening on port ${port}!`))