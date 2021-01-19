var util = require('../../utils/util')
import parse from 'mini-html-parser2'
Page({
  data: {
    hotTicketList: [],
    isHiddenMsg: false,
    announcementText: "疫情期间:进入景区,请出示健康码,佩戴好口罩",
    //滚动速度
    step: 1,
    //初始滚动距离
    distance: 0,
    space: 30,
    // 时间间隔
    interval: 20,
  },
  onLoad(query) {
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
    this.homeDataInit()
  },
  homeDataInit:function(){
    let baseUrl = util.baseUrl
    let that = this
    my.request({ //获取首页数据
      url: baseUrl +'/api/order/findProviders',
      method:'POST',
      timeout:300000,
      data: {
        "getDetail": 1,
        "requestid": 1,
        "usid": "",
        "version": "1.0",
        "companyId": getApp().globalData.companyId
      },
      success:function(res){
        if(res.data.code === '200'){
          let result = res.data.data.providers
          result.map((item)=>{ //imageList转数组
            item.pictureUrl ? (item.pictureUrl = baseUrl+item.pictureUrl) : item.pictureUrl = '../../assets/banner/error.png'
            if(item.szsimpleintroduction) {
              parse(item.szsimpleintroduction, (err, arr) => {
                if(!err) {
                  item.szsimpleintroductionArr = arr
                }
              })
            }
            if(item.sznote) {
              parse(item.sznote, (err, arr) => {
                if(!err) {
                  item.sznoteArr = arr
                }
              })
            }
            if(item.bookdescription) {
              parse(item.bookdescription, (err, arr) => {
                if(!err) {
                  item.bookdescriptionArr = arr
                }
              })
            }
          })
          that.setData({
            hotTicketList:result
          })
          getApp().globalData.pois = result
        }
      },
      fail:function(res){
        that.setData({
          errorMsg:'请求数据异常',
          showError:true
        })
      }
    })
  },
  toSearch:function(){
    my.switchTab({
      url:'/pages/ticket/ticket'
    })
  },
  toBase:function(e){
    let _id = e.currentTarget.dataset.id
    switch (_id) {
      case '1':
        my.switchTab({
          url:'/pages/ticket/ticket'
        })
        break;
        case '2':
          my.navigateTo({
            url:'/pages/map/map'
          })
          break;
      case '3':
        my.navigateTo({
          url:'/pages/changguan/changguan'
        })
        break;
        case '4':
          my.navigateTo({
            url:'/pages/xianlu/xianlu'
          })
          break;
      case '5':
      my.navigateTo({
        url:'/pages/techan/techan'
      })
      break;
      default:
        my.showToast({
          content: '敬请期待',
          duration: 2000
        })
        break;
    }
  },
  toTicket:function(e){
    let encryptId = e.currentTarget.dataset.id
    my.navigateTo({
      url:'/pages/ticket-info/ticket-info?encryptId='+encryptId,
    })
  },
  /** 关闭顶部通知 */
  closeMsg(){
    this.setData({ isHiddenMsg: true});
    clearInterval(this.data.interval);
  },

 /** 获取滚动条基本信息 */
  topScroll(){
    var that = this;
    var query = my.createSelectorQuery();
    //选择id
    query.select('#mjltest').boundingClientRect()
    query.exec(function (res) {
      var length = res[0].width;
      var windowWidth = my.getSystemInfoSync().windowWidth; // 屏幕宽度
      that.setData({
        length: length,
        windowWidth: windowWidth,
        space: windowWidth
      });
      //that.scrollling(); // 第一个字消失后立即从右边出现
    });
  },
  /** 向左滚动 */
  scrollling: function () {
    var that = this;
    var length = that.data.length; //滚动文字的宽度
    var windowWidth = that.data.windowWidth; //屏幕宽度
    let interval = setInterval(function () {
      var maxscrollwidth = length + that.data.space;
      var left = that.data.distance;
      if (left < maxscrollwidth) { //判断是否滚动到最大宽度
        that.setData({
          distance: left + that.data.step
        })
      } else {
        that.setData({
          distance: 0 // 直接重新滚动
        });
        clearInterval(interval);
        that.scrollling();
      }
    }, that.data.interval);
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
