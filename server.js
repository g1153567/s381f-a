import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import logger from './core/logger/app-logger'
import morgan from 'morgan'
import config from './core/config/config.dev'
import route from './routes/route'
import connectToDb from './db/connect'
import path from 'path'
import compression from 'compression'
import fileUpload from 'express-fileupload'
import cookieSession from 'cookie-session'

const port = config.serverPort
logger.stream = {
    write: function (message, encoding) {
        logger.info(message)
    }
}
global.rootPath=__dirname

connectToDb()
global.userSet=new Set()
const app = express()
app.use(compression())
app.use(cors())
app.use(cookieSession({
    name: 'session',
    keys: ['s381f'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }))
app.use(bodyParser.json({
    limit: '50mb'
}))
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}))
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  }))
app.use(morgan("dev", {
    "stream": logger.stream
}))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', route)

app.listen(port, () => {
    logger.info('server started - ', port)
})