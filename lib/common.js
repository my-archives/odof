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
 *  - http://www.page.ca/~wes/CommonJS/modules-2.0-draft8/commonjs%20modules%202.0-8(2).pdf
 */
!function (context) {

  context.define = define;

  /**
   * define a module
   * @api public
   */
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

    var module = new Module(id, deps, factory);
    if (id) {
      __cache[id] = module;
    // anonymous function 先简单处理匿名方法
    } else {
      factory.call(module, _require, module.exports, module);
    }
  }

  // AMD
  define.amd = { jQuery: true };

  /**
   * 不对外提供此接口
   * Accepts a module identifier.
   * @param {String} id    module.id
   */
  function _require(id) {
    var module = __cache[id];

    if (!module) {
      return null;
    }

    if (!module.exports) {
      _initExports(module);
    }

    return module.exports;
  }

  function _initExports(module, context) {
    var factory = module.factory, result;

    delete module.factory;

    result = factory(_require, module.exports = {}, module);

    if (result) {
      module.exports = result;
    }
  }

  function Module(id, deps, factory) {
    this.id = id;

    this.uri = undefined;
    // dependencies
    //this.deps = deps || [];
    this.deps = deps;

    // lazy eval
    // http://calendar.perfplanet.com/2011/lazy-evaluation-of-commonjs-modules/
    if (typeof factory === 'string') {
      factory = new Function('require', 'exports', 'module', factory);
    }
    this.factory = factory;

    this.exports = undefined;
    this.filename = null;
    // 暂时赋值为 undefined
    this.parent = undefined;
    // 后面要异步加载
    this.loaded = false;
  }

  Module.prototype.constructor = Module;

  var __cache = Module.__cache = {};

}(this);
