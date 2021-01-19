var util = require('../../utils/util')
Page({
  data: {
    activeNum: 3,
    showScrollTop: false,
    ticketIndex: 1,
    errorMsg: '',
    showError: false,
    ruleShow: false,
    scale: 14,
    productList: [],
    showDialog: false,
    textButton: [{
      text: '确定'
    }],
    itemRule: [],
    poi: null,
    stockList: null,
    showLoading: false,
    loadingText: '数据加载中...'
  },
  onLoad: function (option) {
    let encryptId = option.encryptId;
    this.setData({
      resourceId: encryptId,
    });
  },
  onShareAppMessage: function () {
    return {
      title: '鼎游通',
      //转发页面的标题
      path: '/pages/ticket-info/ticket-info?encryptId=' + this.data.resourceId //转发页面的路径以及携带的参数
    };
  },
  onShow: function () {
    if(getApp().globalData.usid){
      this.getProductList(this.data.resourceId);
      this.getVisitorType()
    } else {
      my.navigateTo({
        url: '/pages/loginPage/loginPage'
      });
    }
  },
  toUser: function () {
    my.navigateTo({
      url: "/pages/orderCode/order"
    });
  },
  getProductList: function (encryptId) {
    this.setData({
      showLoading: true
    });
    let baseUrl = util.baseUrl;
    let that = this;
      my.request({
        url: baseUrl + '/api/order/findTickets',
        method: 'POST',
        data: {
          "providerId": encryptId,
          "playtime": util.formatTime(new Date(new Date().setDate(new Date().getDate() + 1)), 0), //查询明天的票
          "getPro": 0,
          "requestid": 1,
          "usid": getApp().globalData.usid,
          "version": "1.0",
          "companyId": getApp().globalData.companyId
        },
        success: function (res) {
          if (res.data.code === '200') {
            let _obj = getApp().globalData.pois
            let _arr = []
            if(_obj) {
              _arr = _obj.filter(item => item.providerId == encryptId);
              that.setData({
                poi: _arr[0],
                productList: that.changeMinPrice(res.data.data.tickets, encryptId, _arr[0].imaxdata),
                showLoading: false,
                stockList: res.data.data.providersubstocks
              });
            }
          } else if(res.data.code === '202') {
            my.navigateTo({
              url: '/pages/loginPage/loginPage'
            });
          } else {
            my.navigateTo({
              url: '/pages/ticket/ticket'
            });
          }
        },
        fail: function (res) {
          console.log(res);
          that.setData({
            errorMsg: '请求数据异常',
            showError: true
          });
        }
      });
  },
  getVisitorType: function() {
    let baseUrl = util.baseUrl
    let that = this
    my.request({ //获取证件类型
      url: baseUrl +'/api/order/findZjtp',
      data: {
        "requestid": 1,
        "usid": getApp().globalData.usid,
        "version": "1.0",
        "companyId": getApp().globalData.companyId
      },
      method:'POST',
      timeout:300000,
      success:function(res){
        if(res.data.code === '200'){
          getApp().globalData.visitorType = res.data.data.zjtps
        }else {
          console.log(res.data.message, '获取证件类别')
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
  changeMinPrice: function (arr, id, maxDate) {
    let _productList = [];
    arr.forEach(item => {
      let _prices = [];
      item.prices.forEach(price => _prices.push(price.todayPrice));
      let _arr = _prices.sort((a, b) => a - b);
      item.price = _arr[0];
      item.providerId = id
      item.imaxdata = maxDate ? maxDate : 7
      _productList.push(item);
    });
    return _productList;
  },
  onPageScroll: function (e) {
    let scrollTop = e.scrollTop;

    if (scrollTop > 500) {
      this.setData({
        showScrollTop: true
      });
    } else {
      this.setData({
        showScrollTop: false
      });
    }
  },
  moreItem: function () {
    let that = this;

    if (this.data.activeNum > that.data.productList.length) {
      this.setData({
        errorMsg: '暂无更多',
        showError: true
      });
    } else {
      this.setData({
        activeNum: that.data.productList.length
      });
    }
  },
  lessItem: function () {
    let that = this;
    this.setData({
      activeNum: 3
    });
    my.pageScrollTo({
      scrollTop: 0
    });
  },
  toScrollTop: function () {
    my.pageScrollTo({
      scrollTop: 0
    });
  },
  toBookProduct: function (e) {
    getApp().globalData.product = e.currentTarget.dataset.obj
    getApp().globalData.stockList = this.data.stockList

    my.navigateTo({
      url: '/pages/bookproduct/bookproduct'
    });
  },
  seeRule: function (e) {
    let obj = e.currentTarget.dataset.obj;
    this.setData({
      ruleShow: true,
      itemRule: obj.productnote
    });
  },
  tapDialogButton: function (e) {
    console.log(e, 'dialog')
    this.setData({
      ruleShow: false,
      itemRule: ""
    });
  }
});
