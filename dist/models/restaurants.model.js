'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RestaurantsModel = {};

RestaurantsModel.read = function (options1, options2) {
    return global.rt.find(options1, options2).toArray();
};

RestaurantsModel.addRestaurant = function (restaurantToAdd, reject) {
    return new _promise2.default(function (resolve, reject) {
        global.rt.find({
            name: restaurantToAdd.name
        }).limit(1).toArray(function (err, data) {
            resolve(data);
        });
    }).then(function (data) {
        if (data.length > 0) return reject('duplicate restaurant name');
        return global.rt.count();
    }).then(function (count) {
        if (typeof count == 'undefined') return;
        restaurantToAdd['restaurant_id'] = count + 1;
        return global.rt.insert(restaurantToAdd);
    });
};

RestaurantsModel.editRestaurant = function (options1, options2, owner) {
    return new _promise2.default(function (resolve, reject) {
        global.rt.find(options1).limit(1).toArray(function (err, data) {
            resolve(data);
        });
    }).then(function (data) {
        if (data[0].owner != owner) throw 'No Permission';
        var docToUpdate = (0, _extends3.default)({}, data[0], options2);
        return global.rt.update(options1, docToUpdate, {
            upsert: true
        });
    });
};

RestaurantsModel.rateRestaurant = function (options1, options2, owner) {
    return new _promise2.default(function (resolve, reject) {
        global.rt.find(options1).limit(1).toArray(function (err, data) {
            resolve(data);
        });
    }).then(function (data) {
        return data[0].grades.map(function (grade) {
            // if(grade.user==owner)throw ('You have already rated the restaurant')
            if (grade.user == owner) {
                return global.rt.update(options1, {
                    $pull: {
                        grades: {
                            user: owner
                        }
                    }
                });
            }
        });
    }).then(function (data) {
        return global.rt.update(options1, options2);
    });
};

RestaurantsModel.removeRestaurant = function (id, owner) {
    return new _promise2.default(function (resolve, reject) {
        global.rt.find({
            _id: id
        }).limit(1).toArray(function (err, data) {
            resolve(data);
        });
    }).then(function (data) {
        if (data[0].owner != owner) throw 'No Permission';
        return global.rt.remove({
            _id: id
        });
    });
};

exports.default = RestaurantsModel;