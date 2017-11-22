"use strict";

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _appLogger = require("./core/logger/app-logger");

var _appLogger2 = _interopRequireDefault(_appLogger);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _config = require("./core/config/config.dev");

var _config2 = _interopRequireDefault(_config);

var _route = require("./routes/route");

var _route2 = _interopRequireDefault(_route);

var _connect = require("./db/connect");

var _connect2 = _interopRequireDefault(_connect);

var _serveFavicon = require("serve-favicon");

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _expressFileupload = require("express-fileupload");

var _expressFileupload2 = _interopRequireDefault(_expressFileupload);

var _cookieSession = require("cookie-session");

var _cookieSession2 = _interopRequireDefault(_cookieSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = _config2.default.serverPort;
_appLogger2.default.stream = {
    write: function write(message, encoding) {
        _appLogger2.default.info(message);
    }
};
global.rootPath = __dirname;

(0, _connect2.default)();
global.userSet = new _set2.default();
var app = (0, _express2.default)();
app.use((0, _compression2.default)());
app.use((0, _cors2.default)());
app.use((0, _cookieSession2.default)({
    name: 'session',
    keys: ['s381f'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use(_bodyParser2.default.json({
    limit: '50mb'
}));
app.use(_bodyParser2.default.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use((0, _expressFileupload2.default)({
    limits: { fileSize: 50 * 1024 * 1024 }
}));
app.use((0, _morgan2.default)("dev", {
    "stream": _appLogger2.default.stream
}));
app.use((0, _serveFavicon2.default)(_path2.default.join(__dirname, 'public', 'favicon.ico')));
app.set('view engine', 'ejs');
app.set('views', _path2.default.join(__dirname, 'views'));
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));
app.use('/', _route2.default);

app.listen(port, function () {
    _appLogger2.default.info('server started - ', port);
});