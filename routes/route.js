import express from "express"
import restaurantController from "../controllers/restaurants.controller"
import userController from "../controllers/users.controller"


const router = express.Router()
const rtUrl = '/restaurant',
    apiUrl = '/api'

router.get('/', (req, res) => {
    authen(req, res, () => {
        res.redirect(rtUrl)
    })
})

router.post('/', (req, res) => {
    userController.login(req, res)
})

router.post('/register', (req, res) => {
    userController.register(req, res)
})

router.get('/logout', (req, res) => {
    global.userSet.delete(req.session.username)
    res.clearCookie("session")
    res.clearCookie("session.sig")
    res.redirect('/')
})

router.get(rtUrl, (req, res) => {
    authen(req, res, () => {
        restaurantController.read(req, res)
    })
})

//create restaurant form
router.get(rtUrl + '/new', (req, res) => {
    authen(req, res, () => {
        res.render('rtForm', {
            restaurant: {
                name: '',
                cuisine: '',
                borough: '',
                address: {
                    street: '',
                    building: '',
                    zipcode: '',
                    coord: {
                        latitude: '',
                        longtitude: ''
                    }
                },
                photo: {},
            },
            type: 'create'
        })
    })
})

router.get(rtUrl + '/edit/:id', (req, res) => {
    authen(req, res, () => {
        if(req.query.owner!=req.session.username)res.send(alertMsg('No Permission'))
        restaurantController.readDetail(req, res, 'edit')
    })
})

router.post(rtUrl + '/edit/:id', (req, res) => {
    authen(req, res, () => {
        restaurantController.editRestaurant(req, res)
    })
})

router.get(rtUrl + '/display/:id', (req, res) => {
    authen(req, res, () => {
        restaurantController.readDetail(req, res)
    })
})

router.get(apiUrl + rtUrl + '/read/:param1/:param2', (req, res) => {
    authen(req, res, () => {
        restaurantController.readApi(req, res)
    })
})

router.post(apiUrl + rtUrl + '/create', (req, res) => {
    authen(req, res, () => {
        restaurantController.addRestaurantApi(req, res)
    })
})

router.post(rtUrl, (req, res) => {
    authen(req, res, () => {
        restaurantController.addRestaurant(req, res)
    })
})

router.post(rtUrl + '/rate/:id', (req, res) => {
    authen(req, res, () => {
        restaurantController.rateRestaurant(req, res)
    })
})

router.get(rtUrl + '/delete/:id', (req, res) => {
    authen(req, res, () => {
        restaurantController.deleteRestaurant(req, res)
    })
})

const authen = (req, res, callback) => {
    if (global.userSet.has(req.session.username)) {
        callback()
    } else {
        res.render('userForm')
    }
}

const alertMsg = (msg) => {
    return '<script>alert("' + msg + '");window.history.back()</script>'
}

export default router