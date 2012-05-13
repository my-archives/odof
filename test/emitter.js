describe('Emitter', function(){
  describe('#on()', function(){
    it('开始注册事件', function(){
      console.log('#on');
      var e = new Emitter();
      e.on("change:title change:author", function () {
        console.log(arguments);
      });
    })
  })
})

describe('Emitter', function(){
  describe('#once()', function(){
    it('注册一次性事件', function(){
      console.log('#once');
      var e = new Emitter();
      /*e.on('all change:tt', function () {
        console.log('all tt', arguments);
      });
      */
      e.once("dd change:author", function () {
        console.log('once', arguments);
      });
      var n = 3;
      while(n) {
        e.emit('dd change:author', n);
        n--;
      }
    })
  })
})

describe('Emitter', function(){
  describe('#off()', function(){
    it('删除特定事件', function(){
      console.log('#off')
      var e = new Emitter();
      e.on("all change:title change:author", function () {
        console.log(arguments);
      });
      var n = 10;
      while(n--) {
        if (n == 5) e.off('change:title');
        e.emit('change:title change:author change:once', n);
      }
    })
  })
})

describe('Emitter', function(){
  describe('#emit()', function(){
    it('触发事件', function(){
      console.log('#emit');
      var e = new Emitter();
      e.on("change:title change:author", function () {
        console.log(arguments[0] + ' ' + arguments[1]);
      });
      var n = 10;
      //while(n--) {
        e.emit('change:author change:title', n);
      //}
    })
  })
})

describe('Emitter', function(){
  describe('#on("all ...")', function(){
    it('all 订阅所有', function(){
      console.log('#emit all');
      var e = new Emitter();
      e.on("all post change", function () {
        console.log(arguments);
      });

      /*
      e.on("all", function () {
        console.log('all2');
      });
      */

      var n = 10;
      //while(n--) {
      e.emit('post', n);
      //}
    })
  })
})
