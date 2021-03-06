import path from "path"

let config = {}

config.logFileDir = path.join(__dirname, '../../log')
config.logFileName = 'app.log'
config.dbHost = process.env.dbHost || 'ds153015.mlab.com'
config.dbPort = process.env.dbPort || '53015'
config.dbName = process.env.dbName || 's381f-mongo'
config.dbUser = process.env.dbUser || 'dbuser'
config.dbPassword = process.env.dbPassword || 'P%40ssw0rd'
config.serverPort = process.env.PORT || 3000

export default config