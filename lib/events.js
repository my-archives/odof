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
  if (!callback) return this;
  events = events.split(EVENT_SPLITTER);

  var cache = this._events || (this._events = {})
    , event, list, i = events.length;

  for (; i--; events.length = i) { // i -= 1; while (event = events.shift())
    event = events[i];
    list = cache[event] || (cache[event] = []);
    list.push(callback, context);
  }

  return this;
};

Events.prototype.off = function (events, callback, context) {
  var cache, event, list, cb, ctx, i, j, newest;

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

    newest = [];
    j = list.length;
    for (; j--; list.length = --j) { // j -= 2
      ctx = list[j];
      cb = list[j - 1];

      if ((callback && cb !== callback) ||
            (context && ctx !== context)) {
        newest.push(cb, ctx);
      }
    }
    cache[event] = newest;
  }

  return this;
};

Events.prototype.once = function (events, callback, context) {
  if (!callback) return this;

  var cb = callback
    , callback = function () {
      this.off(events);
      return cb.apply(this, arguments);
    };

  this.on(events, callback, context);

  return this;
};

Events.prototype.trigger = function (events) {
  var cache;
  if (!(cache = this._events)) return this;
  events = events.split(EVENT_SPLITTER);

  var event, j
    , i = events.length
    , rest = slice(arguments, 1)
    , all = cache.all && cache.all.concat()
    , lists = []
    , list
    , cb
    , ctx;

  for (; i--; events.length = i) { // i -= 1
    event = events[i];
    event !== ALL && cache[event] && all && lists.push(all, [event].concat(rest));
    cache[event] && lists.push(cache[event], rest);
  }

  /*
  for (i = lists.length; i--; lists.length = --i) { // i -= 2
    rest = lists[i];
    list = lists[i - 1];
    for (j = list.length; j--; --j) { // j -= 2
      list[j - 1].apply(list[j] || this, rest);
    }
  }
  */

  i = lists.length;
  while (i) {
    j = lists[i - 2].length;
    if (j) {
      cb = lists[i - 2][j - 2];
      ctx = lists[i - 2][j - 1];
      cb.apply(ctx || this, lists[i - 1]);
      j -= 2;
      lists[i - 2].length = j;
    }
    if (j === 0) {
      i -= 2;
      lists.length = i;
    }
  }


  return this;
};
