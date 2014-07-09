var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  TabPanel = require('../src/tabpanel'),
  Tab = require('../index');

/**/
describe('测试标签项生成', function(){
  $('<div id="container"></div>').appendTo('body');
  $('<div id="t1"></div>').appendTo('body');
  var CLS_ITEM_TITLE = 'tab-item-title',
    CLS_ITEM_CLOSE = 'tab-item-close',
    CLS_CONTENT = 'tab-content';
  var config = {
    render : '#t1',
    title : '<i class="icon icon-music"></i>测试标签',
    actived : true,
    href : 'http://www.taobao.com',
    tabContentContainer : '#container'
  };
  var item = new Tab.NavTabItem(config);

  item.render();
  
  item.on('click',function(){
    BUI.log('click');
  });

  item.on('closing',function(){
    BUI.log('closing');

  });

  item.on('closed',function(){
    BUI.log(closed);
    item.hide();
  })
  var el = item.get('el');

  describe("测试标签项生成",function(){
    it('测试标签导航生成',function(){
      expect(el).not.to.be(undefined);
    });
    it('测试标题',function(){
      var titleEl = el.find('.'+CLS_ITEM_TITLE);
      expect(titleEl.text()).to.be('测试标签');
    });

    it('测试标签内容生成',function(){
      var contentEl = $('.'+ CLS_CONTENT,config.tabContentContainer);
      expect(contentEl[0]).not.to.be(null);
      expect(contentEl[0]).not.to.be(undefined);
      var iframeEl = contentEl.find('iframe');
      expect(iframeEl.attr('src')).to.be(config.href);
    })
  });
  
});

describe('测试导航标签', function(){

  var CLS_NAV_LIST = 'tab-nav-list';
  var tab = new Tab.NavTab({
    render:'#t2',
	  height:500,
    forceFit : true,
    children : [
      {
        title : '测试标签',
        href : 'http://www.baidu.com',
        xclass:'nav-tab-item',
		    id:'testitem'

      },
	  {
        title : '测试标签2',
        href : 'http://www.baidu.com',
        xclass:'nav-tab-item',
		    id:'testitem2'

      },
    {
        title : '测试标签3',
        href : 'http://www.baidu.com',
        xclass:'nav-tab-item',
        id:'testitem3'

      }
    ]
  });

  tab.render();
  $('#btnAdd').on('click',function(){
    var config = {
        title : '添加标签',
        href : 'http://www.taobao.com'
      };
    tab.addTab(config);
  });
  var el = tab.get('el');
	describe("导航标签测试",function(){
		it('导航栏',function(){
		  expect(el).not.to.be(undefined);
		  var list = el.find('.'+CLS_NAV_LIST);
		  expect(list.length).not.to.be(0);
		});
		it('添加标签',function(){
			var config = {
				id : 'additem',
				actived : true,
				title : '添加标签',
				href : 'http://www.taobao.com',
				xclass:'nav-tab-item'
			};
			tab.addChild(config);
			var item = tab.getItemById(config.id);
			expect(item).not.to.be(null);
			expect(item.get('actived')).to.be(config.actived);

		});

		it('设置标签选中',function(){
			var item = tab.getItemById('testitem');
			tab.setActived('testitem');
			expect(tab.getActivedItem()).to.be(item);
		});

    it('添加标签并同时打开',function(){
      
      var config = {
        id:'add2',
        title : '添加标签',
        closeable : false,
        href : 'http://www.taobao.com'
      };
      var item = tab.addTab(config);
      expect(tab.getActivedItem()).to.be(item);
    });
	});
});

describe('测试标签添加删除', function(){

  var tab = new Tab.Tab({
      render : '#tab',
      elCls : 'button-tabs',
      itemStatusCls : {
        selected : 'active',
        hover:'tab-item-hover'
      },
      autoRender: true,
      children:[
        {text:'标签一',value:'1',selected:true},
        {text:'标签二',value:'2'},
        {text:'标签三',value:'3'}
      ]
    });
  var el = tab.get('el');
  describe('测试标签生成',function(){
    it('初始化',function(){
      expect(el.find('.bui-tab-item').length).to.be(tab.getItemCount());
    });
    it('设置，取消选中',function(){
      tab.setSelected(tab.getItemAt(0));
      expect(tab.getSelected()).not.to.be(undefined);
      tab.setSelected(null);
      expect(tab.getSelected()).to.be(undefined);
    });

    it('添加选项,并设置选中',function(){
      var item = tab.addItem({text:'新标签',value:'1',selected:true})
      expect(tab.getSelected()).to.be(item);
    });

    it('删除选中选项',function(){
      var item = tab.getItemAt(0),
        callBack = sinon.spy();
      tab.setSelected(item);

      tab.on('selectedchange',callBack);
      tab.removeItem(item);
      expect(callBack.called).to.be(true);
      tab.off('selectedchange',callBack);
    });
  });
});


describe('测试标签项生成', function(){
  $('<div id="tp"></div><div id="tc" ><p id="p1">第一个</p><p id="p2">第二个</p><p id="p3">第三个</p></div>').appendTo('body');
  var tab = new TabPanel({
      render : '#tp',
      elCls : 'nav-tabs',
      panelContainer : '#tc',
      autoRender: true,
      selectedEvent: 'mouseenter',
      children:[
        {text:'标签一',value:'1'},
        {text:'标签二',value:'2',panelContent :'<p>自定义内容</p>'},
        {text:'标签三',value:'3',loader : {url : 'data/text.php'}}
      ]
    });
  describe('测试标签选中跟面板显示',function(){
    it('测试生成',function(){
      var items = tab.getItems();
      BUI.each(items,function(item){
        var panel = item.get('panel');
        expect(panel).not.to.be(null);
      });
    });
    it('测试初始面板隐藏',function(){
      var items = tab.getItems();
      BUI.each(items,function(item){
        var panel = item.get('panel');
        expect($(panel).css('display')).to.be('none');
      });
    });

    it('选中节点,判断对应的节点显示',function(){
      var item = tab.getItemAt(0),
        panel = item.get('panel');
      tab.setSelected(item);
      expect($(panel).css('display')).not.to.be('none');
    });

    it('选中其他节点,判断对应的节点显示',function(){
      var item = tab.getItemAt(1),
        panel = item.get('panel');
      tab.setSelected(item);
      expect($(panel).css('display')).not.to.be('none');

      var firsItem = tab.getFirstItem(),
        panel = firsItem.get('panel');
      expect($(panel).css('display')).to.be('none');
    });
  });
});/**/
