"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _restaurants = require("../controllers/restaurants.controller");

var _restaurants2 = _interopRequireDefault(_restaurants);

var _users = require("../controllers/users.controller");

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var rtUrl = '/restaurant',
    apiUrl = '/api';

router.get('/', function (req, res) {
    authen(req, res, function () {
        res.redirect(rtUrl);
    });
});

router.post('/', function (req, res) {
    _users2.default.login(req, res);
});

router.post('/register', function (req, res) {
    _users2.default.register(req, res);
});

router.get('/logout', function (req, res) {
    global.userSet.delete(req.session.username);
    res.clearCookie("session");
    res.clearCookie("session.sig");
    res.redirect('/');
});

router.get(rtUrl, function (req, res) {
    authen(req, res, function () {
        _restaurants2.default.read(req, res);
    });
});

//create restaurant form
router.get(rtUrl + '/new', function (req, res) {
    authen(req, res, function () {
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
                photo: {}
            },
            type: 'create'
        });
    });
});

router.get(rtUrl + '/edit/:id', function (req, res) {
    authen(req, res, function () {
        if (req.query.owner != req.session.username) res.send(alertMsg('No Permission'));
        _restaurants2.default.readDetail(req, res, 'edit');
    });
});

router.post(rtUrl + '/edit/:id', function (req, res) {
    authen(req, res, function () {
        _restaurants2.default.editRestaurant(req, res);
    });
});

router.get(rtUrl + '/display/:id', function (req, res) {
    authen(req, res, function () {
        _restaurants2.default.readDetail(req, res);
    });
});

router.get(apiUrl + rtUrl + '/read/:param1/:param2', function (req, res) {
    authen(req, res, function () {
        _restaurants2.default.readApi(req, res);
    });
});

router.post(apiUrl + rtUrl + '/create', function (req, res) {
    authen(req, res, function () {
        _restaurants2.default.addRestaurantApi(req, res);
    });
});

router.post(rtUrl, function (req, res) {
    authen(req, res, function () {
        _restaurants2.default.addRestaurant(req, res);
    });
});

router.post(rtUrl + '/rate/:id', function (req, res) {
    authen(req, res, function () {
        _restaurants2.default.rateRestaurant(req, res);
    });
});

router.get(rtUrl + '/delete/:id', function (req, res) {
    authen(req, res, function () {
        _restaurants2.default.deleteRestaurant(req, res);
    });
});

var authen = function authen(req, res, callback) {
    if (global.userSet.has(req.session.username)) {
        callback();
    } else {
        res.render('userForm');
    }
};

var alertMsg = function alertMsg(msg) {
    return '<script>alert("' + msg + '");window.history.back()</script>';
};

exports.default = router;