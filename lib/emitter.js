/**
 * Emitter
 * @author cfddream@gmail.com
 *
 * Thanks to:
 *
 *  - https://github.com/documentcloud/backbone/blob/master/backbone.js
 *  - https://github.com/joyent/node/blob/master/lib/events.js
 *  - https://github.com/alipay/arale/blob/master/lib/events/src/events.js
 *
 * Test:
 *
 *  - http://jsperf.com/odof-events-test/4
 */
!function (context) {

  context['Emitter'] = Emitter;

  var EVENT_SPLITTER = /\s+/
    , keys = Object.keys || function (o) {
        var r = [], p;
        for (p in o) {
          if (o.hasOwnProperty(p)) {
            r[r.length] = p;
          }
        }
        return r;
      };

  function Emitter() {}

  Emitter.prototype.on = function (events, fn, ctx) {
    var callbacks, event, list, i;
    if (!fn) return this;
    events = events.split(EVENT_SPLITTER);

    callbacks = this.__callbacks || (this.__callbacks = {});

    while ((event = events.shift())) {
      list = callbacks[event] || (callbacks[event] = []);
      fn.__context = ctx;
      list[list.length] = fn;
    }

    return this;
  };

  Emitter.prototype.once = function (events, fn, ctx) {
    var callbacks, event, list;
    if (!fn) return this;
    events = events.split(EVENT_SPLITTER);

    callbacks = this.__callbacks || (this.__callbacks = {});

    while ((event = events.shift())) {
      list = callbacks[event] || (callbacks[event] = []);
      fn.__once = true;
      fn.__context = ctx;
      list[list.length] = fn;
    }

    return this;
  };

  Emitter.prototype.off = function (events, fn, ctx) {
    var callbacks, event, list, i, cb;
    if (!(callbacks = this.__callbacks)) return this;
    if (!(events || fn || ctx)) {
      delete this.__callbacks;
      return this;
    }

    events = events.split(EVENT_SPLITTER) || keys(callbacks);

    while ((event = events.shift())) {
      list = callbacks[event];
      if (!list) continue;

      if (!(fn || ctx)) {
        delete callbacks[event];
        continue;
      }

      i = list.length - 1;
      for (; i; --i) {
        cb = list[i];
        if (!(fn && cb !== fn || ctx && cb.__context !== ctx)) {
          list.splice(i, 1);
        }
      }
    }

    return this;
  };

  Emitter.prototype.emit = function (events) {
    var callbacks, event, all, list, i, len, rest = [], args, cb;
    if (!(callbacks = this.__callbacks)) return this;

    events = events.split(EVENT_SPLITTER);

    for (i = arguments.length - 1; i; --i) {
      rest[i - 1] = arguments[i];
    }

    while ((event = events.shift())) {
      if ((list = callbacks[event])) {
        for (i = 0, len = list.length; i < len; ++i) {
          cb = list[i];
          cb.__once && list.splice(i, 1) && (len--) && (i--);
          cb.apply(cb.__context || this, rest);
        }
      }

      if ((all = callbacks.all)) {
        args = [event].concat(rest);
        for (i = 0, len = all.length; i < len; ++i) {
          cb = all[i];
          cb.apply(cb.__context || this, args);
        }
      }
    }

    return this;
  };

}(this);
