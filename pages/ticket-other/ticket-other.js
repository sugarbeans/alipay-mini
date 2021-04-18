import parse from "mini-html-parser2";

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
    let encryptId = getApp().globalData.encryptId
    this.setData({
      resourceId: encryptId,
      showLoading: true
    });
    this.onGetAuthorize()
  },
    //用户授权
  onGetAuthorize: function (res) {
    let that = this;
    my.getAuthCode ({
      scopes: 'auth_user',
      success(res) {
        my.getAuthUserInfo({
          success: (userInfo) => {
            getApp().globalData.userInfo = userInfo
            that.setData({
              showPayLoading: true
            });
          },
          fail: function (res) {
            that.setData({
              showError: true,
              error: 'error',
              errorMsg: '您取消了授权'
            });
          }
        })
        if (res.authCode) {
          that.toLogin(res.authCode);
        } else {
          that.setData({
            showError: true,
            errorMsg: '授权失败！'
          });
        }
      }

    });
  },

  toLogin: function (e) {
    let baseUrl = util.baseUrl;
    let that = this;
    my.request({
      url: baseUrl + '/smallprogram/ali/alilogin?code='+e+'&companyId='+getApp().globalData.companyId,
      method: 'GET',
      timeout: 300000,
      success: function (res) {
        if (res.data.code === '200') {
          getApp().globalData.usid = res.data.data.usid
          that.setData({
            showPayLoading: false
          });
          that.homeDataInit()
        } else {
          that.setData({
            showPayLoading: false
          });
          my.showToast({
            type: 'fail',
            content: res.data.message
          });
        }
      },
      fail: function (res) {
        that.setData({
          showPayLoading: false
        });
      }
    });
  },

  homeDataInit:function(){
    let baseUrl = util.baseUrl
    let that = this
    my.request({ //获取首页数据
      url: baseUrl +'/smallprogram/order/findProviders',
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
          that.getProductList(that.data.resourceId);
          that.getVisitorType()
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
  onShareAppMessage: function () {
    return {
      title: '鼎游通',
      //转发页面的标题
      path: '/pages/ticket-info/ticket-info?encryptId=' + this.data.resourceId //转发页面的路径以及携带的参数
    };
  },
  toUser: function () {
    my.navigateTo({
      url: "/pages/orderCode/order"
    });
  },
  toHome: function () {
    my.switchTab({
      url:'/pages/index/index'
    })
  },
  getProductList: function (encryptId) {
    this.setData({
      showLoading: true
    });
    let baseUrl = util.baseUrl;
    let that = this;
    let _data = {
      "providerId": encryptId,
      "playtime": util.formatTime(new Date(new Date().setDate(new Date().getDate())), 0), //查询今天的票
      "getPro": 0,
      "requestid": 1,
      "usid": getApp().globalData.usid,
      "version": "1.0",
      "companyId": getApp().globalData.companyId
    }
      my.request({
        url: baseUrl + '/smallprogram/order/findTickets',
        method: 'POST',
        data: _data,
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
              url: '/pages/loginPage/loginPage?encryptId='+this.data.resourceId
            });
          } else {
            my.alert({content: JSON.stringify(_obj)+JSON.stringify(_data)})
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
      url: baseUrl +'/smallprogram/order/findZjtp',
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
    if(getApp().globalData.usid){
      getApp().globalData.product = e.currentTarget.dataset.obj
      getApp().globalData.stockList = this.data.stockList
      my.navigateTo({
        url: '/pages/bookproduct/bookproduct'
      });
    } else {
      my.navigateTo({
        url: '/pages/loginPage/loginPage?encryptId='+this.data.resourceId
      });
    }

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
