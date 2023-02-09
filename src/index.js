const path = require('path')
require('dotenv').config({ path: 'local.env' })
const express = require('express')
const engine = require('express-handlebars')
const app = express()

const router = require('./router')
const db = require('./app/config/connectDB')
const CronController = require('./util/cron');

// cron
CronController.startCronJob()

//gioi han nhan du lieu vaf nhan du lieu
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))

//template engine
app.engine('.hbs', engine.engine({
    extname: '.hbs',
}))

app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '//resourses//views//'))

app.use(express.static(path.join(__dirname, 'public')))

db.connect()
router(app)

app.listen(process.env.PORT, () => {
    console.log(`start port ${process.env.PORT}`)
})