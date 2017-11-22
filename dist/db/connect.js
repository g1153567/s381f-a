'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _appLogger = require('../core/logger/app-logger');

var _appLogger2 = _interopRequireDefault(_appLogger);

var _config = require('../core/config/config.dev');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connectToDb = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var dbHost, dbPort, dbName, dbUser, dbPassword;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        dbHost = _config2.default.dbHost;
                        dbPort = _config2.default.dbPort;
                        dbName = _config2.default.dbName;
                        dbUser = _config2.default.dbUser;
                        dbPassword = _config2.default.dbPassword;
                        _context.prev = 5;
                        _context.next = 8;
                        return _mongodb2.default.connect('mongodb://' + dbUser + ':' + dbPassword + '@' + dbHost + ':' + dbPort + '/' + dbName);

                    case 8:
                        global.db = _context.sent;

                        global.rt = global.db.collection('restaurants');
                        global.user = global.db.collection('users');
                        _appLogger2.default.info('Connected to mongo!!!');
                        _context.next = 17;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](5);

                        _appLogger2.default.error('Could not connect to MongoDB');

                    case 17:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[5, 14]]);
    }));

    return function connectToDb() {
        return _ref.apply(this, arguments);
    };
}();

exports.default = connectToDb;