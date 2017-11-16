import Restaurant from '../models/restaurants.model'
import logger from '../core/logger/app-logger'
import assert from 'assert'
import {
    ObjectID
} from 'mongodb'
const controller = {}

controller.read = async(req, res) => {
    try {
        const restaurants = await Restaurant.read({}, {
            restaurant_id: 1,
            name: 1
        })
        logger.info('sending all restaurants...')
        res.render('index', {
            restaurants: restaurants,
            username: req.session.username
        })
    } catch (err) {
        logger.error('Error in getting restaurants- ' + err)
        res.send('Got error in getAll')
    }
}

controller.readDetail = async(req, res, type) => {
    try {
        const restaurant = await Restaurant.read({
            _id: new ObjectID(req.params.id)
        })
        logger.info('sending all restaurants...')
        if (type == 'edit') {
            res.render('rtForm', {
                restaurant: restaurant[0],
                type: 'edit'
            })
        } else {
            res.render('detailRt', {
                restaurant: restaurant[0]
            })
        }
    } catch (err) {
        logger.error('Error in getting restaurants- ' + err)
        res.render('detailRt', {
            restaurant: {}
        })
    }
}

controller.readApi = async(req, res) => {
    try {
        var param1 = req.params.param1
        var param2 = req.params.param2
        if ((['name', 'borough', 'cuisine'].indexOf(param1)) < 0) return res.sendStatus(404)
        var options = {
            [param1]: param2
        }
        const restaurants = await Restaurant.read(options)
        logger.info('sending all restaurants...')
        res.send(restaurants)
    } catch (err) {
        logger.error('Error in getting restaurants- ' + err)
        res.send('Got error in getAll')
    }
}

controller.addRestaurantApi = (req, res) => {
    new Promise((resolve, reject) => {
        addRtFlow(req, resolve, reject)
    }).then((data) => {
        res.send({
            status: 'ok',
            _id: data.insertedIds[0]
        })
    }).catch((err) => {
        logger.error('Error in getting restaurants - ' + err)
        res.send({
            status: 'failed',
            message: 'Error in getting restaurants - ' + err
        })
    })
}

controller.addRestaurant = (req, res) => {
    new Promise((resolve, reject) => {
        addRtFlow(req, resolve, reject)
    }).then((data) => {
        res.redirect('/restaurant/display/' + data.ops[0]._id)
    }).catch((err) => {
        logger.error('Error in adding restaurants - ' + err)
        res.send(alertMsg('Error in adding restaurants - ' + err))
    })
}

const getFormData = (req) => {
    // const restaurant_id = req.body.restaurant_id
    const name = req.body.name
    const cuisine = req.body.cuisine
    const borough = req.body.borough
    const street = req.body.street
    const building = req.body.building
    const zipcode = req.body.zipcode
    const gpsLon = req.body.longtitude
    const gpsLat = req.body.latitude
    // const photo = req.body.photo
    const owner = req.session.username || 'root'
    const errMsg = ' is not defined'
    const photo = getPhoto(req)
    assert.notEqual(name, undefined, 'name' + errMsg)
    assert.notEqual(owner, undefined, 'owner' + errMsg)

    let restaurantToAdd = {
        name,
        cuisine,
        borough,
        address: {
            street,
            building,
            zipcode,
            coord: {
                longtitude: gpsLon,
                latitude: gpsLat
            }
        },
        photo,
        owner: owner,
        created_at: new Date()
    }
    return restaurantToAdd
}

const getPhoto = (req) => {
    var photo = {}
    if (req.files && req.files.rtPhoto) {
        photo = req.files.rtPhoto
        var fileName = photo.name,
            type = photo.mimetype
        const uploadPath = global.rootPath + '/public/images/' + req.body.name + '.' + type.replace('image/', '')
        photo.mv(uploadPath, function (err) {
            if (err)
                return res.status(500).send(err)
        })
        photo['uploadPath'] = uploadPath
    }
    return photo
}

const addRtFlow = async(req, resolve, reject) => {
    let formData = getFormData(req)
    formData['grades'] = []
    // formData['photo']=getPhoto(req)
    const savedRestaurant = await Restaurant.addRestaurant(formData, reject)
    resolve(savedRestaurant)
}

controller.rateRestaurant = async(req, res) => {
    let id = req.params.id
    let rate = req.body.rate
    try {
        const rateRestaurant = await Restaurant.rateRestaurant({
            _id: new ObjectID(id)
        }, {
            $push: {
                grades: {
                    user: req.session.username,
                    score: rate
                }
            }
        },req.session.username)
        logger.info('Rated Restaurant- ' + rateRestaurant)
        res.redirect('/restaurant/display/' + id)
    } catch (err) {
        logger.error('Failed to rate restaurant- ' + err)
        res.send(alertMsg('Failed to rate restaurant- ' + err))
    }
}

controller.editRestaurant = async(req, res) => {
    let id = req.params.id
    let formData = getFormData(req)
    try {
        const editedRestaurant = await Restaurant.editRestaurant({
            _id: new ObjectID(id)
        }, formData,req.session.username)
        logger.info('Edited Restaurant- ' + editedRestaurant)
        res.redirect('/restaurant/display/' + id)
    } catch (err) {
        logger.error('Failed to edit restaurant- ' + err)
        res.send(alertMsg('Failed to edit restaurant- ' + err))
    }
}

controller.deleteRestaurant = async(req, res) => {
    let id = req.params.id
    const owner = req.session.username
    try {
        const removedRestaurant = await Restaurant.removeRestaurant(new ObjectID(id), owner)
        logger.info('Deleted Restaurant- ' + removedRestaurant)
        res.redirect('/restaurant')
    } catch (err) {
        logger.error('Failed to delete restaurant- ' + err)
        res.send(alertMsg('Failed to delete restaurant- ' + err))
    }
}


const alertMsg = (msg) => {
    return '<script>alert("' + msg + '");window.history.back()</script>'
}

export default controller