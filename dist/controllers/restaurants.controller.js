'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _restaurants = require('../models/restaurants.model');

var _restaurants2 = _interopRequireDefault(_restaurants);

var _appLogger = require('../core/logger/app-logger');

var _appLogger2 = _interopRequireDefault(_appLogger);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _mongodb = require('mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = {};

controller.read = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var restaurants;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return _restaurants2.default.read({}, {
                            restaurant_id: 1,
                            name: 1,
                            borough: 1,
                            address: 1,
                            owner: 1,
                            cuisine: 1
                        });

                    case 3:
                        restaurants = _context.sent;

                        _appLogger2.default.info('sending all restaurants...');
                        res.render('index', {
                            restaurants: restaurants,
                            username: req.session.username
                        });
                        _context.next = 12;
                        break;

                    case 8:
                        _context.prev = 8;
                        _context.t0 = _context['catch'](0);

                        _appLogger2.default.error('Error in getting restaurants- ' + _context.t0);
                        res.send('Got error in getAll');

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 8]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

controller.readDetail = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, type) {
        var restaurant;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return _restaurants2.default.read({
                            _id: new _mongodb.ObjectID(req.params.id)
                        });

                    case 3:
                        restaurant = _context2.sent;

                        _appLogger2.default.info('sending all restaurants...');
                        if (type == 'edit') {
                            res.render('rtForm', {
                                restaurant: restaurant[0],
                                type: 'edit'
                            });
                        } else {
                            res.render('detailRt', {
                                restaurant: restaurant[0]
                            });
                        }
                        _context2.next = 12;
                        break;

                    case 8:
                        _context2.prev = 8;
                        _context2.t0 = _context2['catch'](0);

                        _appLogger2.default.error('Error in getting restaurants- ' + _context2.t0);
                        res.render('detailRt', {
                            restaurant: {}
                        });

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[0, 8]]);
    }));

    return function (_x3, _x4, _x5) {
        return _ref2.apply(this, arguments);
    };
}();

controller.readApi = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res) {
        var param1, param2, options, restaurants;
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.prev = 0;
                        param1 = req.params.param1;
                        param2 = req.params.param2;

                        if (!(['name', 'borough', 'cuisine'].indexOf(param1) < 0)) {
                            _context3.next = 5;
                            break;
                        }

                        return _context3.abrupt('return', res.sendStatus(404));

                    case 5:
                        options = (0, _defineProperty3.default)({}, param1, param2);
                        _context3.next = 8;
                        return _restaurants2.default.read(options);

                    case 8:
                        restaurants = _context3.sent;

                        _appLogger2.default.info('sending all restaurants...');
                        res.send(restaurants);
                        _context3.next = 17;
                        break;

                    case 13:
                        _context3.prev = 13;
                        _context3.t0 = _context3['catch'](0);

                        _appLogger2.default.error('Error in getting restaurants- ' + _context3.t0);
                        res.send('Got error in getAll');

                    case 17:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined, [[0, 13]]);
    }));

    return function (_x6, _x7) {
        return _ref3.apply(this, arguments);
    };
}();

controller.addRestaurantApi = function (req, res) {
    new _promise2.default(function (resolve, reject) {
        addRtFlow(req, resolve, reject, true, res);
    }).then(function (data) {
        res.send({
            status: 'ok',
            _id: data.insertedIds[0]
        });
    }).catch(function (err) {
        _appLogger2.default.error('Error in creating restaurants - ' + err);
        res.send({
            status: 'failed',
            message: 'Error in creating restaurants - ' + err
        });
    });
};

controller.addRestaurant = function (req, res) {
    new _promise2.default(function (resolve, reject) {
        addRtFlow(req, resolve, reject, false, res);
    }).then(function (data) {
        res.redirect('/restaurant/display/' + data.ops[0]._id);
    }).catch(function (err) {
        _appLogger2.default.error('Error in adding restaurants - ' + err);
        res.send(alertMsg('Error in adding restaurants - ' + err));
    });
};

var getFormData = function getFormData(req, isApi, res) {
    var name = req.body.name;
    var cuisine = req.body.cuisine;
    var borough = req.body.borough;
    var street = void 0;
    var building = void 0;
    var zipcode = void 0;
    var gpsLon = void 0;
    var gpsLat = void 0;
    var owner = void 0;
    var photo = void 0;
    if (isApi) {
        if (req.body.address) {
            street = req.body.address.street || '';
            building = req.body.address.building || '';
            zipcode = req.body.address.zipcode || '';
            gpsLon = req.body.address.coord.longtitude || '';
            gpsLat = req.body.address.coord.latitude || '';
        } else {
            street = '';
            building = '';
            zipcode = '';
            gpsLon = '';
            gpsLat = '';
        }
        owner = req.body.owner || 'root';
        photo = req.body.photo || {};
    } else {
        street = req.body.street;
        building = req.body.building;
        zipcode = req.body.zipcode;
        gpsLon = req.body.longtitude;
        gpsLat = req.body.latitude;
        owner = req.session.username || 'root';
        photo = getPhoto(req, res);
    }
    var errMsg = ' is not defined';
    _assert2.default.notEqual(name, undefined, 'name' + errMsg);
    _assert2.default.notEqual(owner, undefined, 'owner' + errMsg);

    var restaurantToAdd = {
        name: name,
        cuisine: cuisine,
        borough: borough,
        address: {
            street: street,
            building: building,
            zipcode: zipcode,
            coord: {
                longtitude: gpsLon,
                latitude: gpsLat
            }
        },
        photo: photo,
        owner: owner,
        created_at: new Date()
    };
    return restaurantToAdd;
};

var getPhoto = function getPhoto(req, res) {
    var photo = {};
    if (req.files && req.files.rtPhoto) {
        photo = req.files.rtPhoto;
        var fileName = photo.name,
            type = photo.mimetype;
        if (!type.includes('image')) return res.send(alertMsg('Failed to create restaurant- invalid mime-type ' + type));
        var uploadPath = global.rootPath + '/public/images/' + req.body.name + '.' + type.replace('image/', '');
        photo.mv(uploadPath, function (err) {
            if (err) return res.send(alertMsg('Failed to create restaurant- ' + err));
        });
        photo['uploadPath'] = uploadPath;
    }
    // if(Object.keys().length == 0
    return photo;
};

var addRtFlow = function () {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, resolve, reject, isApi, res) {
        var formData, savedRestaurant;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        formData = getFormData(req, isApi, res);

                        formData['grades'] = [];
                        // formData['photo']=getPhoto(req)
                        _context4.next = 4;
                        return _restaurants2.default.addRestaurant(formData, reject);

                    case 4:
                        savedRestaurant = _context4.sent;

                        resolve(savedRestaurant);

                    case 6:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function addRtFlow(_x8, _x9, _x10, _x11, _x12) {
        return _ref4.apply(this, arguments);
    };
}();

controller.rateRestaurant = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(req, res) {
        var id, rate, rateRestaurant;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        id = req.params.id;
                        rate = req.body.rate;
                        _context5.prev = 2;
                        _context5.next = 5;
                        return _restaurants2.default.rateRestaurant({
                            _id: new _mongodb.ObjectID(id)
                        }, {
                            $push: {
                                grades: {
                                    user: req.session.username,
                                    score: rate
                                }
                            }
                        }, req.session.username);

                    case 5:
                        rateRestaurant = _context5.sent;

                        _appLogger2.default.info('Rated Restaurant- ' + rateRestaurant);
                        res.redirect('/restaurant/display/' + id);
                        _context5.next = 14;
                        break;

                    case 10:
                        _context5.prev = 10;
                        _context5.t0 = _context5['catch'](2);

                        _appLogger2.default.error('Failed to rate restaurant- ' + _context5.t0);
                        res.send(alertMsg('Failed to rate restaurant- ' + _context5.t0));

                    case 14:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined, [[2, 10]]);
    }));

    return function (_x13, _x14) {
        return _ref5.apply(this, arguments);
    };
}();

controller.editRestaurant = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res) {
        var id, formData, editedRestaurant;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        id = req.params.id;
                        formData = getFormData(req, false, res);
                        _context6.prev = 2;
                        _context6.next = 5;
                        return _restaurants2.default.editRestaurant({
                            _id: new _mongodb.ObjectID(id)
                        }, formData, req.session.username);

                    case 5:
                        editedRestaurant = _context6.sent;

                        _appLogger2.default.info('Edited Restaurant- ' + editedRestaurant);
                        res.redirect('/restaurant/display/' + id);
                        _context6.next = 14;
                        break;

                    case 10:
                        _context6.prev = 10;
                        _context6.t0 = _context6['catch'](2);

                        _appLogger2.default.error('Failed to edit restaurant- ' + _context6.t0);
                        res.send(alertMsg('Failed to edit restaurant- ' + _context6.t0));

                    case 14:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined, [[2, 10]]);
    }));

    return function (_x15, _x16) {
        return _ref6.apply(this, arguments);
    };
}();

controller.deleteRestaurant = function () {
    var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(req, res) {
        var id, owner, removedRestaurant;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        id = req.params.id;
                        owner = req.session.username;
                        _context7.prev = 2;
                        _context7.next = 5;
                        return _restaurants2.default.removeRestaurant(new _mongodb.ObjectID(id), owner);

                    case 5:
                        removedRestaurant = _context7.sent;

                        _appLogger2.default.info('Deleted Restaurant- ' + removedRestaurant);
                        res.redirect('/restaurant');
                        _context7.next = 14;
                        break;

                    case 10:
                        _context7.prev = 10;
                        _context7.t0 = _context7['catch'](2);

                        _appLogger2.default.error('Failed to delete restaurant- ' + _context7.t0);
                        res.send(alertMsg('Failed to delete restaurant- ' + _context7.t0));

                    case 14:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined, [[2, 10]]);
    }));

    return function (_x17, _x18) {
        return _ref7.apply(this, arguments);
    };
}();

var alertMsg = function alertMsg(msg) {
    return '<script>alert("' + msg + '");window.history.back()</script>';
};

exports.default = controller;