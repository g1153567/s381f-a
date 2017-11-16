import MongoClient from 'mongodb'
import logger from '../core/logger/app-logger'
import config from '../core/config/config.dev'

const connectToDb = async () => {
    let dbHost = config.dbHost
    let dbPort = config.dbPort
    let dbName = config.dbName
    let dbUser = config.dbUser
    let dbPassword = config.dbPassword
    try {
        global.db = await MongoClient.connect(`mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`)
        global.rt=global.db.collection('restaurants')
        global.user=global.db.collection('users')
        logger.info('Connected to mongo!!!')
    }
    catch (err) {
        logger.error('Could not connect to MongoDB')
    }
}

export default connectToDb