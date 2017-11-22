'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _users = require('../models/users.model');

var _users2 = _interopRequireDefault(_users);

var _appLogger = require('../core/logger/app-logger');

var _appLogger2 = _interopRequireDefault(_appLogger);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _mongodb = require('mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var controller = {};

controller.login = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
        var username, password, loginResult;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        username = req.body.username;
                        password = req.body.password;
                        _context.prev = 2;
                        _context.next = 5;
                        return _users2.default.read({
                            username: username
                        });

                    case 5:
                        loginResult = _context.sent;

                        if (!(loginResult.length <= 0)) {
                            _context.next = 8;
                            break;
                        }

                        throw 'user not found';

                    case 8:
                        if (!(loginResult[0].password != password)) {
                            _context.next = 10;
                            break;
                        }

                        throw 'incorrect password';

                    case 10:
                        _appLogger2.default.info('logging in...');
                        req.session.username = username;
                        global.userSet.add(username);
                        res.redirect(req.get('referer'));
                        _context.next = 19;
                        break;

                    case 16:
                        _context.prev = 16;
                        _context.t0 = _context['catch'](2);

                        res.send(alertMsg('Fail to login - ' + _context.t0));

                    case 19:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[2, 16]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

controller.register = function () {
    var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
        var username, password, confirm_password, registerResult;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        username = req.body.username;
                        password = req.body.password;
                        confirm_password = req.body['confirm-password'];
                        _context2.prev = 3;

                        if (!(password != confirm_password)) {
                            _context2.next = 6;
                            break;
                        }

                        throw 'Password not equals to confirm password';

                    case 6:
                        _context2.next = 8;
                        return _users2.default.add({ username: username, password: password });

                    case 8:
                        registerResult = _context2.sent;

                        _appLogger2.default.info('logging in...');
                        res.send('<script>alert("Register Success");window.history.back()</script>');
                        _context2.next = 16;
                        break;

                    case 13:
                        _context2.prev = 13;
                        _context2.t0 = _context2['catch'](3);

                        res.send(alertMsg('Fail to register - ' + _context2.t0));

                    case 16:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[3, 13]]);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var alertMsg = function alertMsg(msg) {
    return '<script>alert("' + msg + '");window.history.back()</script>';
};

exports.default = controller;