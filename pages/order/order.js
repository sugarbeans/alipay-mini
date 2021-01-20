var util = require('../../utils/util'); //时间格式化
Page({
  data: {
    active: '0',
    isLogin: false,
    clientHeight: '',
    //改变swiper-item默认高度
    current: 0,
    showDialog: false,
    showItemDialog: false,
    colorType: ['#35c0ff', '#ff4242'],
    //订单状态颜色
    textButton: [{
      text: '确定'
    }],
    orderList: [],
    showRefundDialog: false,
    refundButton: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    surplusQuantity: 1,
    showError: false,
    errorMsg: '',
    orderPassengers: [],
    showPayLoading: false,
    loadingText: '订单查询中 • • • '
  },
  onLoad: function (option) {
    let that = this
    my.getSystemInfo({
      //默认swiper-item为手机屏幕高度
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },
  onShow: function () {
    if(getApp().globalData.usid){
      let _id = getApp().globalData.id
      this.setData({
        active: _id ? _id : '0'
      })
      this.getAllOrder();
    } else {
      my.navigateTo({
        url: '/pages/loginPage/loginPage'
      });
    }
  },
  onPullDownRefresh: function () {
    this.getAllOrder();
  },
  getAllOrder: function () {
    let baseUrl = util.baseUrl;
    let that = this;
    that.setData({
      showPayLoading: true,
      loadingText: '订单加载中...'
    });
    my.request({
      url: baseUrl + '/smallprogram/user/getOrderBefore',
      method: 'POST',
      data: {
        begindate: "",
	      ddzt: that.data.active==='0'? '' : that.data.active,
	      enddate: "",
	      requestid: 1,
	      usid: "",
	      version: "1.0",
        "companyId": getApp().globalData.companyId
      },
      timeout: 300000,
      success: function (res) {
        if(res.data.code==='202') {
          my.navigateTo({url: '/pages/loginPage/loginPage'})
        } else if(res.data.code === '200') {
          my.stopPullDownRefresh();
          that.setData({
            isLogin: true,
            orderList: res.data.data.response,
            showPayLoading: false
          })
        }else {
          my.stopPullDownRefresh();
          that.setData({
            showPayLoading: false
          });
        }
      },
      fail: function (res) {
        my.stopPullDownRefresh();
        that.setData({
          showPayLoading: false
        });
        console.log(res);
      }
    });
  },
  changeOrderList: function (e) {
    let _id = e.currentTarget.dataset.id;
    this.setData({
      active: _id,
      current: _id
    });
    getApp().globalData.id = _id
    this.getAllOrder()
  },
  changeCurrent: function (e) {
    let _id = e.detail.current;
    this.setData({
      active: _id
    });
  },
  showQrcode: function (e) {
    let voucherpics = e.currentTarget.dataset.voucherpics;
    this.setData({
      showDialog: true,
      voucherpics: voucherpics
    });
  },

  tapDialogButton(e) {
    this.setData({
      showDialog: false,
      voucherpics: []
    });
  },

  showCodeItem: function (e) {
    let url = e.currentTarget.dataset.url;
    this.setData({
      url: url,
      showItemDialog: true,
      showDialog: false
    });
  },
  tapItemDialogButton: function () {
    this.setData({
      showItemDialog: false,
      showDialog: true
    });
  },
  toOrderDetail: function (e) {
    let _id = e.currentTarget.dataset.id;
    my.navigateTo({
      url: '/pages/orderdetail/orderdetail?id=' + _id
    });
  }
});
