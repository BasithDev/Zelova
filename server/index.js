const express = require('express')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const path = require('path')
const connetDB = require('./config/db')

const userAuthRoutes = require('./routes/user/authRoutes');
const adminAuthRoutes = require('./routes/admin/authRoutes');
const adminMangaeRoutes = require('./routes/admin/manageRoutes')

require('dotenv').config()

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}))
connetDB()
const port = process.env.PORT

app.use('/api/user/auth',userAuthRoutes)
app.use('/api/admin/auth',adminAuthRoutes)
app.use('/api/admin/manage',adminMangaeRoutes)

app.listen(port, () => console.log(`Server is listening on port ${port}!`))