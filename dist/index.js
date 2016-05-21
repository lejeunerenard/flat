'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _remarkable = require('remarkable');

var _remarkable2 = _interopRequireDefault(_remarkable);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _defined = require('defined');

var _defined2 = _interopRequireDefault(_defined);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var md = new _remarkable2.default();

var Flat = function () {
  function Flat() {
    var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Flat);

    var rootDir = (0, _defined2.default)(opt.rootDir, process.cwd());
    var contentDir = (0, _defined2.default)(opt.contentDir, 'content');
    contentDir = _path2.default.join(rootDir, contentDir);
    var publicDir = (0, _defined2.default)(opt.publicDir, 'public');
    publicDir = _path2.default.join(rootDir, publicDir);

    (0, _objectAssign2.default)(this, {
      rootDir: rootDir,
      contentDir: contentDir,
      publicDir: publicDir
    });
  }

  _createClass(Flat, [{
    key: 'getContent',
    value: function getContent() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _fs2.default.readdir(_this.contentDir, function (err, files) {
          if (err) {
            return reject(err);
          }

          files = files.map(function (file) {
            return _path2.default.join(_this.contentDir, file);
          });

          resolve(files);
        });
      });
    }
  }, {
    key: 'processFiles',
    value: function processFiles(contents) {
      var _this2 = this;

      var mdDones = contents.map(function (content) {
        return new Promise(function (resolve, reject) {
          var name = _path2.default.parse(content).name;

          _fs2.default.readFile(content, 'utf8', function (err, markdown) {
            if (err) {
              return reject(err);
            }

            var html = md.render(markdown);
            var compiledPath = _path2.default.join(_this2.publicDir, 'content', name + '.html');

            _fs2.default.writeFile(compiledPath, html, function (err) {
              if (err) {
                return reject(err);
              }

              resolve(compiledPath);
            });
          });
        });
      });

      return Promise.all(mdDones);
    }
  }, {
    key: 'build',
    value: function build() {
      return this.getContent().then(this.processFiles.bind(this));
    }
  }]);

  return Flat;
}();

exports.default = Flat;
