
var util = require('../../utils/util'); //时间格式化
Page({
  data: {
    showItemDialog: false,
    textButton: [{
      text: '确定'
    }],
    url: '',
    orderInfoView: [],
    showPayLoading: false,
    loadingText: '订单详情查询中 • • • '
  },
  onLoad: function (option) {
    let id = option.id;
    this.getOrderdetail(id);
  },
  getOrderdetail: function (id) {
    let baseUrl = util.baseUrl;
    let that = this;
    that.setData({
      showPayLoading: true,
      loadingText: "加载中..."
    });
    my.request({
      url: baseUrl + '/api/user/orderView',
      data: {
        orid: id,
        requestid: 1,
        usid: '',
        version: '1.0',
        "companyId": getApp().globalData.companyId
      },
      method: 'POST',
      timeout: 300000,
      success: function (res) {
        if (res.data.code==='200') {
          let _obj = res.data.data
          console.log(res.data);
          that.setData({
            orderInfoView: _obj,
            showPayLoading: false
          });
        } else if(res.data.code === '202') {
          my.navigateTo({url: '/pages/loginPage/loginPage'})
        }else {
          that.setData({
            showPayLoading: false
          });
        }
      },
      fail: function (res) {
        that.setData({
          showPayLoading: false
        });
        console.log(res);
      }
    });
  },
  handleRefundorder: function() {
    let baseUrl = util.baseUrl;
    let that = this;
    let _orid = that.data.orderInfoView.orid
    that.setData({
      showPayLoading: true,
      loadingText: "加载中..."
    });
    my.request({
      url: baseUrl + '/api/refund/refundorder',
      data: {
        iscenicid: that.data.orderInfoView.scenicorders[0].iscenicid,
        orid: _orid,
        requestid: 1,
        usid: '',
        version: '1.0',
        isallrefund: 1, // 死
        isqzylkc: 0, //是否退订预留库存 1:是,0:否 死
        iszl: 0, //是否收取手续费 1是 0否 死
        num: 0, //退订数量 死
        seqs: [],
        "companyId": getApp().globalData.companyId
      },
      method: 'POST',
      timeout: 300000,
      success: function (res) {
        if (res.data.code==='200') {
          let _obj = res.data.data
          console.log(res.data);
          that.getOrderdetail(_orid)
          that.setData({
            showPayLoading: false
          });
        } else if(res.data.code === '202') {
          my.navigateTo({url: '/pages/loginPage/loginPage'})
        } else if(res.data.code ==='201') {
          my.showToast({
            type: 'fail',
            content: '核销码已使用或者请稍后重试！'
          });
          that.getOrderdetail(_orid)
        }else {
          that.setData({
            showPayLoading: false
          });
        }
      },
      fail: function (res) {
        that.setData({
          showPayLoading: false
        });
        console.log(res);
      }
    });
  },
  handleToPay: function() {
    //调用支付宝支付
    let _usid =getApp().globalData.usid
    if(_usid) {
      let baseUrl = util.baseUrl;
      let that = this;
      that.setData({
        showPayLoading: true
      });
      my.request({
        url: baseUrl + '/api/ali/smallalipay',
        data: {
          orid: that.data.orderInfoView.orid,
          requestid: 1,
          usid: _usid,
          version: "1.0",
          "companyId": getApp().globalData.companyId
        },
        method: 'POST',
        timeout: 300000,
        success: function (res) {
          console.log(res, 'res-pay');
          if(res.data.code==='200'){
            let _tradeno = res.data.data.tradeno
            my.tradePay({
              tradeNO: _tradeno,
              success () {
                that.setData({
                  showPayLoading:false
                })
                my.alert({
                  content: `${JSON.stringify(res.data.message)}, 跳转到订单列表页面`,
                });
                my.navigateTo({
                  url:"/pages/order/order"
                })
              },
              fail () {
                that.setData({
                  showPayLoading:false
                })
                my.showToast({
                  type: 'fail',
                  content: '支付失败'
                });
                wx.navigateBack({
                  delta:1,
                })
              }
            })
          } else {
            that.setData({
              showPayLoading:false
            })
            my.showToast({
              type: 'fail',
              content: res.data.message
            });
          }
        },
        fail: function (res) {
          console.log(res);
          that.setData({
            errorMsg: '支付失败',
            error: 'error',
            showError: true,
            showPayLoading: false
          });
        }
      });
    } else {
      my.showToast({
        type: 'fail',
        content: '登录授权已过期，需重新授权'
      });
      my.navigateTo({url: '/pages/loginPage/loginPage'})
    }

  },

  seeQRcode: function (e) {
    let _code = e.currentTarget.dataset.base64;
    this.setData({
      showItemDialog: true,
      url: "data:image/ico;base64,"+_code
    });
  },
  tapItemDialogButton: function () {
    this.setData({
      showItemDialog: false
    });
  }
});
