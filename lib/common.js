/*!
 * https://github.com/cfddream/odof
 * License MIT
 *
 * Refer:
 *  - http://wiki.commonjs.org/wiki/CommonJS
 *  - http://wiki.commonjs.org/wiki/Modules/1.1.1
 *  - https://github.com/joyent/node/blob/master/lib/module.js
 *  - https://github.com/seajs/seajs
 *  - https://github.com/tobie/modulr-node
 */
!function (context) {

  context['define']   = define;

  function define(id, deps, factory) {
    var argsLen = arguments.length;

    // define(factory)
    if (argsLen === 1) {
      factory = id;
      id = undefined;
    }
    // define(id || deps, factory);
    else if (argsLen === 2) {
      factory = deps;
      deps = undefined;
    }

    var mod = new Modules(id, deps, factory);
    __cache[id] = mod;
  }

  // 不对外提供此接口
  function require(id) {
    var module = __cache[id];
    if (module) {
      return module.exports;
    }
  }

  function Module(id, deps, factory) {
    this.id = id;
    // dependencies
    this.deps = deps;

    // lazy eval
    // http://calendar.perfplanet.com/2011/lazy-evaluation-of-commonjs-modules/
    if (typeof factory === 'string') {
      factory = new Function('require', 'exports', 'module', factory);
    }
    this.factory = factory;

    this.exports = {};
    this.filename = null;
  }

  var __cache = Module.__cache = {};

}(this);
