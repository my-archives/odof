/**
 * Class
 * @author cfddream@gmail.com
 *
 * Thanks to:
 *
 *  - https://github.com/mootools/prime/blob/master/prime/index.js
 *  - https://github.com/mitsuhiko/classy/blob/master/classy.js
 *  - https://github.com/ded/klass/blob/master/klass.js
 *  - https://github.com/documentcloud/backbone/blob/master/backbone.js
 *  - https://github.com/alipay/arale/blob/master/lib/class/src/class.js
 *
 * Test:
 *
 *  - http://jsperf.com/odof-class
 *
 */
!function (context) {

  context['Class'] = Class;

  function Class(o) {
    if (!(this instanceof Class) && isFunction(o)) {
      return classy(o);
    }
  }

  Class.create = function (parent, protoProps) {
    if (!isFunction(parent)) {
      protoProps = parent;
      parent = null;
    }
    protoProps || (protoProps = {});
    parent || (parent = protoProps.Extends || Class);
    return createClass(parent, protoProps);
  };

  Class.extend = function (protoProps, classProps) {
    return createClass(this, protoProps, classProps);
  };

  // Helpers
  // -------

  function classy(o) {
    o.extend = Class.extend;
    o.implement = implement;
    return o;
  }

  function createClass(parent, protoProps, staticProps, parentProtos, protos) {
    parentProtos = parent.prototype;

    function subclass() {
      parent.apply(this, arguments);

      // Only call initialize in self constructor.
      if (this.constructor === subclass && this.initialize) {
          this.initialize.apply(this, arguments);
          this.initialized = true;
      }
    }

    // Inherit class (static) properties from parent.
    if (parent !== Class) mixin(subclass, parent);

    subclass.Extends = parent;

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    protos = createProto(parentProtos);

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) mixin(protos, protoProps);

    subclass.prototype = protos;

    // Add static properties to the constructor function, if supplied.
    if (staticProps) mixin(subclass, staticProps);

    // Set a convenience property in case the parent's prototype is needed later.
    subclass.superclass = parentProtos;

    // Correctly set subclass's `prototype.constructor`.
    subclass.prototype.constructor = subclass;

    return classy(subclass);
  }

  // Shared empty constructor function to aid in prototype-chain creation.
  function ctor() {}

  // See: http://jsperf.com/object-create-vs-new-ctor
  var createProto = Object.__proto__ ?
    function (proto) {
      return { __proto__: proto };
    } :
    function (proto) {
      ctor.prototype = proto;
      return new ctor();
    };

  function implement(properties) {
    var key, value, proto = this.prototype;
    for (key in properties) proto[key] = properties[key];
  }

  function mixin(r, s) {
    var k;
    for (k in s) r[k] = s[k];
  }

  var toString = Object.prototype.toString;

  function isFunction(f) {
    return toString.call(f) === '[object Function]';
  }

}(this);
