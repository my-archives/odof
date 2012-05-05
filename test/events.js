describe('Events', function(){
  describe('#on()', function(){
    it('开始注册事件', function(){
      console.log('#on');
      var e = new Events();
      e.on("change:title change:author", function () {
        console.log(arguments);
      });
    })
  })
})

describe('Events', function(){
  describe('#once()', function(){
    it('注册一次性事件', function(){
      console.log('#once');
      var e = new Events();
      /*e.on('all change:tt', function () {
        console.log('all tt', arguments);
      });
      */
      e.once("dd change:author", function () {
        console.log('once', arguments);
      });
      var n = 3;
      while(n) {
        e.trigger('dd change:author', n);
        n--;
      }
    })
  })
})

describe('Events', function(){
  describe('#off()', function(){
    it('删除特定事件', function(){
      console.log('#off')
      var e = new Events();
      e.on("all change:title change:author", function () {
        console.log(arguments);
      });
      e.once("change:once", function () {
        console.log('once', arguments);
      });
      var n = 10;
      while(n--) {
        if (n == 5) e.off('change:title');
        e.trigger('change:title change:author change:once', n);
      }
    })
  })
})

describe('Events', function(){
  describe('#trigger()', function(){
    it('触发事件', function(){
      console.log('#trigger');
      var e = new Events();
      e.on("change:title change:author", function () {
        console.log(arguments[0] + ' ' + arguments[1]);
      });
      var n = 10;
      //while(n--) {
        e.trigger('change:author change:title', n);
      //}
    })
  })
})

describe('Events', function(){
  describe('#on("all ...")', function(){
    it('all 订阅所有', function(){
      console.log('#trigger all');
      var e = new Events();
      e.on("all post change", function () {
        console.log(arguments);
      });

      e.on("all", function () {
        console.log('all2');
      });

      var n = 10;
      //while(n--) {
      e.trigger('change post', n);
      //}
    })
  })
})
