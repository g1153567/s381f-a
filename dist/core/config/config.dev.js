'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = {};

config.logFileDir = _path2.default.join(__dirname, '../../log');
config.logFileName = 'app.log';
config.dbHost = process.env.dbHost || 'ds153015.mlab.com';
config.dbPort = process.env.dbPort || '53015';
config.dbName = process.env.dbName || 's381f-mongo';
config.dbUser = process.env.dbUser || 'dbuser';
config.dbPassword = process.env.dbPassword || 'P%40ssw0rd';
config.serverPort = process.env.PORT || 3000;

exports.default = config;