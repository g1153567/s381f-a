'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UsersModel = {};

UsersModel.read = function (options1) {
    return global.user.find(options1).toArray();
};

UsersModel.add = function (options1, reject) {
    return new _promise2.default(function (resolve, reject) {
        global.user.find({
            username: options1.username
        }).limit(1).toArray(function (err, data) {
            resolve(data);
        });
    }).then(function (data) {
        if (data.length > 0) throw 'duplicate user';
        return global.user.insert(options1);
    });
};

exports.default = UsersModel;