describe('Common.js', function () {

  describe('#define', function () {

    it('注册模块a', function () {
      define('a', function (require, exports, module) {
        exports.a = 1;
      });

      define('b', function (require, exports, module) {
        exports.b = 2;
      });

      define('c', 'exports.c = 3');

      define(function (require, exports, module) {
        var a = require('a');
        var b = require('b');
        var c = require('c');
        console.dir(a);
        console.dir(b);
        console.log(a.a + b.b + c.c);
      });


    });

  });

});
