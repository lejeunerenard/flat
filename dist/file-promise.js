'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeFile = writeFile;
exports.readFile = readFile;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function writeFile(path, data) {
  return new Promise(function (resolve, reject) {
    _fs2.default.writeFile(path, data, function (err) {
      if (err) {
        return reject(err);
      }

      resolve(path);
    });
  });
}
function readFile(file, encoding) {
  return new Promise(function (resolve, reject) {
    _fs2.default.readFile(file, encoding, function (err, data) {
      if (err) {
        return reject(err);
      }

      resolve(data);
    });
  });
}