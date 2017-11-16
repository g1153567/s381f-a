import User from '../models/users.model'
import logger from '../core/logger/app-logger'
import assert from 'assert'
import bcrypt from 'bcrypt'
import {
    ObjectID
} from 'mongodb'
const controller = {}

controller.login = async(req, res) => {
    let username = req.body.username
    let password = req.body.password
    try {
        const loginResult = await User.read({
            username: username
        })
        if(loginResult.length<=0)throw ('user not found')
        if(loginResult[0].password!=password) throw ('incorrect password')
        logger.info('logging in...')
        req.session.username=username
        global.userSet.add(username)
        res.redirect(req.get('referer'))
    } catch (err) {
        res.send(alertMsg('Fail to login - '+ err))
    }
}

controller.register = async(req, res) => {
    let username = req.body.username
    let password = req.body.password
    let confirm_password = req.body['confirm-password']
    try {
        if(password!=confirm_password)throw ('Password not equals to confirm password')
        const registerResult = await User.add({username: username,password:password})
        logger.info('logging in...')
        res.send('<script>alert("Register Success");window.history.back()</script>')
    } catch (err) {
        res.send(alertMsg('Fail to register - '+err))
    }
}

const alertMsg = (msg) => {
    return '<script>alert("' + msg + '");window.history.back()</script>'
}

export default controller