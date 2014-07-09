var $ = require('jquery'),
  expect = require('expect.js'),
  sinon = require('sinon'),
  TabPanel = require('../src/tabpanel'),
  Tab = require('../index');

$('<div id="p1"></div>').appendTo('body');
var tab = new TabPanel({
    render : '#p1',
    elCls : 'nav-tabs',
    panelTpl : '<div class="panel">{title}:{value}</div>',
    defaultChildCfg : {
      closeable : true,
      closeTpl : '<span class="x-icon x-icon-small x-icon-hover">×</span>'
    },
    children:[
      {title:'标签一',value:'1'},
      {title:'标签二',value:'2',panelContent :'<p>自定义内容</p>',selected : true},
      {title:'标签三',value:'3',loader : {url : 'data/text.php'},closeable : false}
    ]
  });

tab.render();

var el = tab.get('el'),
  items = tab.getItems();

describe('测试完全生成Panel',function(){

  it('测试生成items',function(){
    expect(items.length).to.be(3);
    expect(items[0].get('panel')).not.to.be(undefined);
  });

  it('测试隐藏，显示',function(){
    BUI.each(items,function(item){
      if(item.get('selected')){
        expect(item.get('panel').height()).not.to.be(0);
      }else{
        expect(item.get('panel').css('display')).to.be('none');
      }
    });
  });

  it('测试panel容器',function(){
    expect(el.find('.tab-panels').length).to.be(1);
  });
  it('测试生成Panel模板',function(){
    expect(items[0].get('panel').text()).to.be("标签一:1");
  });
  it('测试替换内容',function(){
    expect(items[1].get('panel').text()).to.be('自定义内容');
  });

  it('测试可以关闭',function(){
    var items = tab.getItems();
    expect(items[0].get('closeable')).to.be(true);
    expect(items[2].get('closeable')).to.be(false);
  });

});

describe('测试Panel操作',function(){

  it('增加item',function(){
    var item = tab.addItem({
      id: 'a',
      title : 'a',
      value : '1'
    }),
    panel = item.get('panel');
    expect(panel).not.to.be(undefined);
    expect(panel.text()).to.be('a:1');
  });

  it('删除item',function(){
    var item = tab.getItem('a');
    tab.removeItem(item);
    expect(tab.getItem('a')).to.be(null);
    expect(el.find('.panel').length).to.be(tab.getItems().length);
  });

  it('更新内容',function(){
    var text = 'new text',
      item = tab.getFirstItem();

    item.set('title',text);
    item.updateContent();
    expect(item.get('el').find('.bui-tab-item-text').text()).to.be(text);
  });
  it('更新Panel内容',function(){
    var text = '新的内容',
      item = tab.getFirstItem();
    item.set('panelContent',text);
    expect(item.get('panel').text()).to.be(text);
  });
});
/*
BUI.use(['bui/tab/tabpanel','bui/tab/tabpanelitem'],function(TabPanel) {
  var tab = new TabPanel({
      srcNode : '#p2',
      elCls : 'nav-tabs',
      itemStatusCls : {
        'selected' : 'active'
      },
      defaultChildCfg : {
        closeable : true,
        closeTpl : '<span class="x-icon x-icon-small x-icon-hover">×</span>'
      },
      
      panelContainer : '#tc'
    });

  tab.render();
  var el = tab.get('el');

  describe('使用srcNode的方式',function(){

    it('测试items生成',function(){
      expect(tab.getItems().length).to.be(el.find('li').length);
    });
    it('测试默认选中',function(){
      var item = tab.getFirstItem();
      expect(item.get('selected')).to.be(true);
    });
    it('测试Panel',function(){
      var item = tab.getFirstItem();
      expect(item.get('panel')).not.to.be(undefined);
      expect($(item.get('panel')).text()).to.be('第一个');
    });
  });

  describe('测试操作',function(){
    it('插入',function(){
      var item = tab.addChild({
        title : '插入项',panelContent : '<p>插入内容！</p>',id:'new'
      },1);

      expect(tab.indexOfItem(item)).to.be(1);
      expect(item.get('panel')).not.to.be(undefined);
    });

    it('销毁',function(){
      var count = tab.getItemCount(),
        item = tab.getItem('new');
      item.close();
      expect(tab.getItemCount()).to.be(count - 1);

    });
  });

});

*/
