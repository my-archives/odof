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
  , slice = function (args, i) {
      return Array.prototype.slice.call(args, ~~i);
    }
  , EVENT_SPLITTER = /\s+/
  , ALL = 'all';

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
    list.push(callback, context);
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
    for (; j--; list.length = --j) { // j -= 2
      if ((callback && list[j - 1] !== callback) ||
            (context && list[j] !== context)) {
        list.splice(j, 2);
      }
    }
  }

  return this;
};

// TODO: jquery style
Events.prototype.once = function (events, callback, context) {
  var cb, event, i;
  if (!callback) return this;
  events = events.split(EVENT_SPLITTER);

  return this;
};

Events.prototype.trigger = function (events) {
  var cache, event, rest, all, args, list, i, j = 0, t = 0;
  if (!(cache = this._events)) return this;
  events = events.split(EVENT_SPLITTER);

  rest = slice(arguments, 1);
  all = cache.all && cache.all.concat();
  args = [0].concat(rest);
  i = events.length;

  while (i) {

    // concat cache[event] & all
    if (!list) {
      event = events[i - 1];
      if (cache[event]) {
        list = [];
        if (all) {
          list.push.apply(list, all);
          args[0] = event;
        }
        // record all start inserted
        t = list.length;
        list.push.apply(list, cache[event]);
      }
    }

    if (list) {
      j = list.length;
      if (j--) {
        list[j - 1].apply(list[j] || this, j <= t ? args : rest);
        list.length = --j;
      }
    }

    if (j === 0) {
      list = null;
      events.length = --i;
    }
  }

  return this;
};
