/**
 * Events
 * @author cfddream@gmail.com
 *
 * Thanks to:
 *
 *  - https://github.com/documentcloud/backbone/blob/master/backbone.js
 *  - https://github.com/joyent/node/blob/master/lib/events.js
 *  - https://github.com/alipay/arale/blob/master/lib/events/src/events.js
 */

var hasOwn = function (o, p) {
      return Object.prototype.hasOwnProperty.call(o, p);
    }
    // NOTE: https://developer.mozilla.org/en/ECMAScript_DontEnum_attribute
  , keys = Object.keys || function (o) {
      var result = [], p;
      for (p in o) {
        if (hasOwn(o, p)) {
          result[result.length] = p;
        }
      }
      return result;
    }
  , EVENT_SPLITTER = /\s+/;

function Events() {}

Events.prototype.on = function (events, callback, context) {
  var cache, event, list, i;
  if (!callback) return this;
  events = events.split(EVENT_SPLITTER);

  cache = this._events || (this._events = {});
  i = events.length;

  for (; i--; events.length = i) { // i -= 1; while (event = events.shift())
    event = events[i];
    list = cache[event] || (cache[event] = []);

    // like list.push(callback, context)
    // http://jsperf.com/multi-push-vs-pus-multi/3
    callback.__context = context;
    list[list.length] = callback;
  }

  return this;
};

Events.prototype.off = function (events, callback, context) {
  var cache, event, list, i, j;

  if (!(cache = this._events)) return this;
  if (!(events || callback || context)) {
    delete this._events;
    return this;
  }

  events = events ? events.split(EVENT_SPLITTER) : keys(cache);
  i = events.length;

  for (; i--; events.length = i) { // i -= 1
    event = events[i];
    list = cache[event];
    if (!list) continue;

    if (!(callback || context)) {
      delete cache[event];
      continue;
    }

    j = list.length;
    for (; j--; list.length = j) { // j -= 1
      if ((callback && list[j] !== callback) ||
            (context && list[j].__context !== context)) {
        list.length = j; // list.splice(j, 1);
      }
    }
  }

  return this;
};

Events.prototype.once = function (events, callback, context) {
  var cache, event, list, i;
  if (!callback) return this;
  events = events.split(EVENT_SPLITTER);

  cache = this._events || (this._events = {});
  i = events.length;

  for (; i--; events.length = i) { // i -= 1; while (event = events.shift())
    event = events[i];
    list = cache[event] || (cache[event] = []);

    // like list.push(callback, context)
    // http://jsperf.com/multi-push-vs-pus-multi/3
    callback.__once = true;
    callback.__context = context;
    list[list.length] = callback;
  }

  return this;
};

Events.prototype.trigger = function (events) {
  var cache, event, rest = [], all, args, list, i, j, t, s, cb, ctx;
  if (!(cache = this._events)) return this;
  events = events.split(EVENT_SPLITTER);

  // rest = slice(arguments, 1);
  for (i = arguments.length; i--;) {
    rest[i - 1] = arguments[i];
  }

  j = 0;
  i = events.length;
  args = [j].concat(rest);
  all = (s = t = !!cache.all) && cache.all.slice();

  for(; i; (j === 0) && (events.length = --i)) {
    if (j === 0) {
      event = events[i - 1];
      if (cache[event]) {
        t && (args[0] = event);
        s = t;
        list = cache[event];
        j = list.length;
      }
    }

    if (j) {
      cb = list[--j];
      ctx = cb.__context;
      if (cb.__once) list.splice(j, 1);
      cb.apply(ctx || this, t ? args : rest);
      if (s && t && j === 0) {
        list = all;
        j = all.length;
        s = false;
      }
    }
  }

  return this;
};
