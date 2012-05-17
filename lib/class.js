/**
 * Class
 * @author cfddream@gmail.com
 *
 * Thanks to:
 *
 *  - https://github.com/mootools/prime/blob/master/prime/index.js
 *  - https://github.com/mitsuhiko/classy/blob/master/classy.js
 *  - https://github.com/ded/klass/blob/master/klass.js
 *  - https://github.com/alipay/arale/blob/master/lib/class/src/class.js
 *
 * Test:
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
    var child = createClass(parent, protoProps);
    child.Extends = parent;
    return child;
  };

  Class.extend = function (protoProps, classProps) {
    var child = createClass(this, protoProps, classProps);
    child.Extends = this;
    return child;
  };

  // Helpers
  // -------

  function classy(o) {
    o.extend = Class.extend;
    o.implement = implement;
    o.statics = statics;
    return o;
  }

  function createClass(parent, protoProps, staticProps, parentProtos, protos) {
    parentProtos = parent.prototype;

    function child() {
      parent.apply(this, arguments);

      // Only call initialize in self constructor.
      if (this.constructor === child && this.initialize) {
          this.initialize.apply(this, arguments);
      }
    }

    // Inherit class (static) properties from parent.
    if (parent !== Class) mixin(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    protos = createProto(parentProtos);

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) mixin(protos, protoProps);

    child.prototype = protos;

    // Add static properties to the constructor function, if supplied.
    if (staticProps) mixin(child, staticProps);

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parentProtos;

    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    return classy(child);
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

  function isFunction(f) {
    return typeof f === 'function';
  }

}(this);
