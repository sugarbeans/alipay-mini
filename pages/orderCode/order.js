const wx2my = require('../../wx2my');
const Behavior = require('../../Behavior');
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
  onLoad: function (options) {
    let that = this;
    wx2my.getSystemInfo({
      //默认swiper-item为手机屏幕高度
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },
  onShow: function () {
    let id = getApp().globalData.id;
    let openid = wx2my.getStorageSync('openid');
    let that = this;

    if (id != '') {
      that.setData({
        active: id,
        current: id
      });
    }

    if (openid != '') {
      that.setData({
        isLogin: true
      });
      this.getAllOrder(openid);
    } else {
      that.setData({
        isLogin: false
      });
    }
  },
  onUnload: function () {
    wx2my.navigateBack({
      delta: 2
    });
  },
  onPullDownRefresh: function () {
    // wx.startPullDownRefresh()
    let openid = wx2my.getStorageSync('openid');

    if (openid == '') {
      wx2my.startPullDownRefresh();
      wx2my.navigateTo({
        url: "/pages/loginPage/loginPage"
      });
      return;
    }

    this.getAllOrder(openid);
  },
  getAllOrder: function (openid) {
    let baseUrl = util.baseUrl;
    let that = this; // that.setData({
    //   showPayLoading:true
    // })

    wx2my.showLoading({
      title: '订单加载中'
    });
    wx2my.request({
      url: baseUrl + '/orderView/queryOrderListBystatus',
      method: 'POST',
      data: {
        openid: openid,
        status: -1
      },
      timeout: 300000,
      success: function (res) {
        if (res.data.success) {
          wx2my.stopPullDownRefresh();
          let orderViewOutPuts = JSON.parse(res.data.data.orderViewOutPuts);
          orderViewOutPuts.map(item => {
            item.startDate = util.formatTime(new Date(item.startDate), 0);
          });
          that.setData({
            orderList: orderViewOutPuts // showPayLoading:false

          });
          wx2my.hideLoading();
        } else {
          wx2my.stopPullDownRefresh();
          wx2my.hideLoading(); // that.setData({
          //   showPayLoading:false
          // })
        }
      },
      fail: function (res) {
        wx2my.stopPullDownRefresh();
        wx2my.hideLoading(); // that.setData({
        //   showPayLoading:false
        // })

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
    wx2my.navigateTo({
      url: '/pages/orderdetail/orderdetail?id=' + _id
    });
  },
  onceAgainPay: function (e) {
    //未支付，再次发起支付
    let _item = e.currentTarget.dataset.item;
    console.log(_item);
  },
  refundMoney: function (e) {
    //申请退款
    let _item = e.currentTarget.dataset.item;
    this.setData({
      showRefundDialog: true,
      refundObj: _item
    });
    this.getRefunddetail(_item.distributorOrderCode);
  },
  checkboxChange: function (e) {
    let vistorIdList = e.detail.value;
    this.setData({
      orderPassengers: vistorIdList
    });
  },
  RefundDialogButton: function (e) {
    let _index = e.detail.index; //1为点击确认  0为点击取消

    if (_index == 0) {
      this.setData({
        showRefundDialog: false,
        refundObj: {}
      });
    } else {
      if (this.data.orderPassengers.length == 0) {
        if (this.data.surplusQuantity == 0) {
          this.setData({
            showError: true,
            errorMsg: '退订数量不能为零',
            surplusQuantity: 0
          });
          return;
        }
      }

      let obj = {
        orderCode: this.data.refundObj.orderCode,
        openid: wx2my.getStorageSync('openid'),
        refundProductInputDto: {
          id: this.data.refundObj.productId,
          refundQuantity: this.data.surplusQuantity ? this.data.surplusQuantity : this.data.orderPassengers.length,
          orderPassengers: this.data.orderPassengers
        }
      };
      this.getToken(obj);
    }
  },
  getRefunddetail: function (id) {
    //获取退订信息
    let baseUrl = util.baseUrl;
    let that = this;
    wx2my.request({
      url: baseUrl + '/orderView/queryOrderListByOrderCode',
      data: {
        openid: wx2my.getStorageSync('openid'),
        distributorOrderCode: id
      },
      method: 'POST',
      timeout: 300000,
      success: function (res) {
        if (res.data.success) {
          let orderInfoView = JSON.parse(res.data.data.orderInfoView)[0];
          orderInfoView.createDate = util.formatTime(new Date(orderInfoView.createDate), 0);
          orderInfoView.startDate = orderInfoView.startDate.split(' ')[0];
          orderInfoView.ruleRefund = orderInfoView.ruleRefund.split('；');
          console.log(orderInfoView);
          orderInfoView.orderPassengerList.map(item => {
            item.checked = false;
          });
          that.setData({
            orderInfoView: orderInfoView
          });
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  getToken: function (obj) {
    //校验是否重复操作
    let baseUrl = util.baseUrl;
    let that = this;
    wx2my.request({
      url: baseUrl + '/token/getToken',
      method: 'POST',
      timeout: 300000,
      success: function (res) {
        if (res.data.success) {
          let token = res.data.data;
          that.refundFn(obj, token);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  refundFn: function (obj, token) {
    let baseUrl = util.baseUrl;
    let that = this;
    wx2my.request({
      url: baseUrl + '/order/refund?applet_token=' + token,
      method: 'POST',
      data: obj,
      success: function (res) {
        console.log(res);

        if (res.data.success) {
          that.setData({
            showError: true,
            errorMsg: res.data.description,
            showRefundDialog: false
          });
          wx2my.nextTick(() => {
            that.getAllOrder(wx2my.getStorageSync('openid'));
          });
        } else {
          that.setData({
            showError: true,
            errorMsg: res.data.description,
            showRefundDialog: false
          });
        }
      },
      fail: function (res) {
        that.setData({
          showError: true,
          errorMsg: '退订失败，请联系客服'
        });
      }
    });
  },
  addIndex: function () {
    if (this.data.surplusQuantity < this.data.orderInfoView.surplusQuantity) {
      this.setData({
        surplusQuantity: this.data.surplusQuantity + 1
      });
    } else {
      this.setData({
        showError: true,
        errorMsg: '退订数量不能大于订单总数量'
      });
    }
  },
  minusIndex: function () {
    if (this.data.surplusQuantity > 0) {
      this.setData({
        surplusQuantity: this.data.surplusQuantity - 1
      });
    } else {
      this.setData({
        showError: true,
        errorMsg: '退订数量已经为零了'
      });
    }
  }
});