var util = require('../../utils/util.js');
let _year = new Date().getFullYear();
let _month = new Date().getMonth() + 1;
let _flagNum = new Date(_year, _month - 1, 1).getDay();
Page({
  data: {
    showPriceFlag: true,
    dateBoxNum: 3,
    activeTime: 0,
    showCalendar: false,
    showMask: false,
    vistorList: [],
    //游客列表
    commonVistorList: [],
    //常用联系人列表
    contactName: '',
    contactPhone: '',
    contactType: '',
    credentialsTypeEnum: '01',
    typeName: '证件号',
    contactCode: '',
    encryptId: '',
    total: 0,
    errorMsg: '',
    showError: false,
    showDialog: false,
    textButton: [{
      text: '取消'
    }],
    codeTypeFlag: false,
    error: 'error',
    showPayLoading: false,
    moreVistor: false,
    dateActive: new Date().getDate() + _flagNum - 1,
    delay: 5000,
    loadingText: '数据加载中· · ·',
    priceList: [],
    dateList: [],
    ticketId: '',
    min: 0,
    max: 2
  },
  onLoad: function (option) {
    this.getPrice(getApp().globalData.product, getApp().globalData.visitorType, getApp().globalData.stockList);
  },
  onShow: function () {

  },
  closeCalendaer: function () {
    this.setData({
      showCalendar: false
    });
  },
  chooseType: function (e) {
    this.setData({
      codeTypeFlag: !this.data.codeTypeFlag
    });
  },
  getPrice: function (productInfo, contactType, stockList, otherDate) {
    let that = this;
    let dateList = [];
    productInfo.prices.map((item, index) => {
      item.number = 0;
      item.vistorList = [];
      item.itickettypeid = productInfo.ticketId;
      item.vistorActive = null;
    });
    for (let i = 0; i < productInfo.imaxdata; i++) {
      let _str = util.formatTime(new Date(new Date().setDate(new Date().getDate() + i)), 3);
      dateList.push({
        date: _str
      });
    }
    dateList.map(item => {
      let _dateArr = item.date.split('-');
      item.month = _dateArr[0];
      item.day = _dateArr[1];
    });
    that.setData({
      contactType: contactType,
      dateList: dateList,
      priceList: productInfo.prices,
      productInfo: productInfo,
      stockList: stockList,
      newDate: otherDate ? otherDate : dateList[1].date,
      ticketId: productInfo.ticketId,
      encryptId: productInfo.providerId
    });
  },
  showMoreVistor: function () {
    this.setData({
      moreVistor: !this.data.moreVistor
    });
  },
  choseDateOut: function (e) {
    let _obj = e.currentTarget.dataset.obj;
    this.setData({
      showCalendar: false,
      newDate: _obj.date,
      showPayLoading: true
    });
    this.getProductList();
  },
  getProductList: function () {
    let baseUrl = util.baseUrl;
    let that = this;
      my.request({
        url: baseUrl + '/api/order/findTickets',
        method: 'POST',
        data: {
          "providerId": this.data.encryptId,
          "playtime": `${new Date().getFullYear()}-${that.data.newDate}`,
          "getPro": 0,
          "requestid": 1,
          "usid": "",
          "version": "1.0",
          "companyId": getApp().globalData.companyId
        },
        success: function (res) {
          if (res.data.code === '200') {
            let _obj = res.data.data
            let _arr = []
            console.log(_obj.tickets, that.data.ticketId, 'ticketId')
            _arr = _obj.tickets.filter(item => item.ticketId == that.data.ticketId);
            _arr[0].imaxdata = _obj.imaxdata ? _obj.imaxdata : 7
            _arr[0].providerId = that.data.encryptId
            if(_arr.length> 0) {
              that.getPrice(_arr[0], getApp().globalData.visitorType, _obj.providersubstocks, that.data.newDate);
            } else {
              my.showToast({
                type: 'fail',
                content: '暂无数据，请选取其它日期！'
              });
            }
            that.setData({
              showPayLoading: false,
            });

          } else if(res.data.code === '202') {
            my.navigateTo({
              url: '/pages/loginPage/loginPage'
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
  chooseTimeOut: function (e) {
    let _stockObj = e.currentTarget.dataset.stockObj;
    this.setData({
      activeTime: _stockObj.subStockid
    });
  },
  showCalendarDialog: function () {
    // let showCalendar = this.data.showCalendar;
    // this.setData({
    //   showCalendar: !showCalendar,
    //   codeTypeFlag: false
    // });
    let _max = this.data.max
    let _length = this.data.dateList.length
    if(_max === _length) {
      this.setData({
        max: 2,
        min: 0
      })
    } else {
      if(_max + 3 >_length ) {
        this.setData({
          max: _length,
          min: _length - 3
        })
      } else {
        this.setData({
          max: _max+3,
          min: this.data.min+3
        })
      }
    }
  },
  minusTicketIndex: function (e) {
    let index = e.currentTarget.dataset.index;
    let _number = this.data.priceList[`${index}`].number;
    let _key = `priceList[${index}].number`;

    if (_number == 0) {
      my.showToast({
        type: 'fail',
        content: '数量不能为负值'
      });
    } else {
      this.setData({
        [_key]: _number - 1
      });
      this.changeTotal();
    }
  },
  addTicketIndex: function (e) {
    let index = e.currentTarget.dataset.index;
    let _number = this.data.priceList[`${index}`].number;
    let _key = `priceList[${index}].number`;
    this.setData({
      [_key]: _number + 1
    });
    this.changeTotal();
  },
  getNumber: function (e) {
    let index = e.currentTarget.dataset.index;
    let _key = `priceList[${index}].number`;
    this.setData({
      [_key]: e.detail.value
    });
    this.changeTotal();
  },

  changeTotal() {
    let _total = 0;
    this.data.priceList.forEach(item => {
      item.number > 0 && (_total += item.number * item.saleprice);
    });
    this.setData({
      total: _total > 0 ? _total.toFixed(2) : this.data.total
    });
  },

  showMaskDialog: function (e) {
    let _obj = e.currentTarget.dataset.priceObj;
    let _priceIndex = e.currentTarget.dataset.priceIndex;
    let that = this;
    if (_obj.number > _obj.vistorList.length) {
      getApp().globalData.priceObj = {
        data: _obj,
        list: that.data.priceList,
        priceIndex: _priceIndex
      }
      my.navigateTo({url: '/pages/addvistorpage/addvistorpage'});
    } else {
      my.showToast({
        type: 'fail',
        content: '出行人数不能大于预定数量',
        duration: 3000
      });
    }
  },
  getName: function (e) {
    this.setData({
      contactName: e.detail.value.replace(/[^\w\u4E00-\u9FA5]/g, '')
    });
  },
  getPhone: function (e) {
    this.setData({
      contactPhone: e.detail.value
    });
  },
  getCode: function (e) {
    this.setData({
      contactCode: e.detail.value
    });
  },
  closeMaskDialog: function () {
    this.setData({
      showMask: false
    });
  },
  toAddVistor: function (e) {
    this.setData({
      errorMsg: e.detail,
      showError: true
    });
  },
  payOrder: function () {
    let that = this; //判断页面信息是否输入完整

    if (that.data.stockList && that.data.stockList.length > 0 && !that.data.activeTime) {
      my.showToast({
        type: 'fail',
        content: '请选择分时时段！'
      });
      return;
    }
    that.data.priceList.forEach(item=> {
      if (item.isRealname && item.vistorList.length < item.number) {
          my.showToast({
            type: 'fail',
            content: '出行人数量和预订数量不匹配!'
          });
          return;
      }
    })

    if (!that.data.contactName) {
      my.showToast({
        type: 'fail',
        content: '请输入联系人姓名!'
      });
      return;
    }
    if (that.data.contactPhone.length < 11) {
      my.showToast({
        type: 'fail',
        content: '手机号输入有误!'
      });
      return;
    }
    if (that.data.contactCode.length < 18) {
      my.showToast({
        type: 'fail',
        content: '证件号码输入有误!'
      });
      return;
    }
    let _num = 0
    that.data.priceList.forEach(item => {
      _num += item.number
    })
    if (_num ===0) {
      my.showToast({
        type: 'fail',
        content: '预订数量不能为0！'
      });
      return;
    }
    that.payOrderMethod()
  },
  payOrderMethod: function () {
    //提交订单
    let baseUrl = util.baseUrl;
    let that = this;
    that.setData({
      showPayLoading: true
    })
    let lpr = {
      zjhm: that.data.contactCode,
      daoyou: that.data.contactName,
      mobile: that.data.contactPhone,
      zjlb: that.data.credentialsTypeEnum,
      szregionalid: 1
    };
    let orders = []
    let orderinfos = [];
    let _order = {
      playtime: `${new Date().getFullYear()}-${that.data.newDate}`,
      providerId: this.data.encryptId,
      substockid: that.data.activeTime
    }
    that.data.priceList.forEach(item => {
      if (item.number > 0) {
        let _ticket = {
          isRealname: item.isRealname,
					num: item.number,
					priceId: item.priceId,
          productsubstockid: 0,
          ticketId: this.data.productInfo.ticketId
        };
        let realnames = [];
        item.vistorList.forEach(vistor => {
          let _obj = {
            cname: vistor.name,
						idcard: vistor.code,
						ischild: 0,
						mbnumber: vistor.phone,
						zjtp: vistor.credentialsTypeEnum
          };
          realnames.push(_obj);
        });
        _ticket.realnames = realnames
        orderinfos.push(_ticket);
      }
    });
    _order.orderinfos = orderinfos
    _order.lpr = lpr
    orders.push(_order)
    let obj = {
      requestid: 1,
      usid: '',
      version: '1.0',
      orders: orders,
      "companyId": getApp().globalData.companyId
    };
    console.log(obj, 'create-order');
    my.request({
      url: baseUrl + '/api/order/createTicketOrder',
      data: obj,
      method: 'POST',
      timeout: 300000,
      success: function (res) {
        console.log(res, 'res-order')
        if (res.data.code==='200') {
          // getApp().globalData.usid = null
          let _obj = res.data.data
          that.transferWechatPay(_obj.orid, _obj.usid, _obj.zfmont);
        } else if(res.data.code==='202'){
          my.showToast({
            type: 'fail',
            content: '已超时，请重新授权登录!'
          });
          that.setData({
            showPayLoading: false
          });
          my.navigateTo({
            url: '/pages/loginPage/loginPage'
          });
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
        console.log(res);
        that.setData({
          showPayLoading: false
        });
      }
    });
  },
  transferWechatPay: function (orid, usid, zfmont) {
    //调用支付宝支付
    let baseUrl = util.baseUrl;
    let that = this;
    getApp().globalData.usid = usid
    my.request({
      url: baseUrl + '/api/ali/smallalipay',
      data: {
	      orid: orid,
	      requestid: 1,
	      usid: usid,
	      version: "1.0",
        "companyId": getApp().globalData.companyId
      },
      method: 'POST',
      timeout: 300000,
      success: function (res) {
        that.setData({
          showPayLoading: false
        })
        if(res.data.code==='200'){
          let _tradeno = res.data.data.tradeno
          my.tradePay({
            tradeNO: _tradeno,
            success () {
              my.alert({
                content: `${JSON.stringify(res.data.message)}, 跳转到订单列表页面`,
              });
              my.navigateTo({
                url:"/pages/order/order"
              })
            },
            fail () {
              my.navigateBack({
                delta:1,
              })
            }
          })
        } else {
          my.showToast({
            type: 'fail',
            content: res.data.message
          });
        }
      },
      fail: function (res) {
        console.log(res);
        my.showToast({
          type: 'fail',
          content: "支付失败"
        });
      }
    });
  },
  zeroPay: function (obj, token) {
    let baseUrl = util.baseUrl;
    let that = this;
    my.request({
      url: baseUrl + '/order/createPayment?applet_token=' + token,
      data: obj,
      method: 'POST',
      timeout: 300000,
      success: function (res) {
        if (res.data.success) {
          that.setData({
            showPayLoading: false
          });
          that.setData({
            errorMsg: '支付成功',
            error: 'success',
            showError: true
          });
          my.setStorage({
            key: 'vistorList',
            value: []
          });
          my.navigateTo({
            url: "/pages/payorderpage/payorderpage"
          });
        } else {
          that.setData({
            errorMsg: res.data.description,
            error: 'error',
            showError: true,
            showPayLoading: false
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
  },
  changeVistor: function (e) {
    let _id = e.currentTarget.dataset.id;
    let _obj = e.currentTarget.dataset.obj;
    let _index = e.currentTarget.dataset.index;

    for (let i = 0; i < this.data.priceList.length; i++) {
      this.setData({
        ['priceList[' + i + '].vistorActive']: null
      });
    }

    this.setData({
      ['priceList[' + _index + '].vistorActive']: _id,
      name: _obj.name,
      phone: _obj.phone,
      code: util.idCardEcode(_obj.code),
      moreVistor: false
    });
  },
  longChange: function (e) {
    //长按弹出游客操作选项框
    console.log(e, 'longChange')
    let obj = e.currentTarget.dataset.obj;
    obj.isChecked = false;
    this.setData({
      showDialog: true,
      nowObj: obj
    });
  },
  tapDialogButton: function () {
    //取消弹出框
    this.setData({
      showDialog: false
    });
  },
  deleteInfo: function () {
    this.data.vistorList.map((item, index) => {
      if (item.code == this.data.nowObj.code) {
        this.data.vistorList.splice(index, 1);
      }
    });
    this.setData({
      vistorList: this.data.vistorList,
      showDialog: false
    });
    my.setStorage({
      key: 'vistorList',
      data: this.data.vistorList
    });

  },
  changeInfo: function () {
    let that = this;
    my.navigateTo({
      url: "/pages/addvistorpage/addvistorpage",
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('changeVistorInfo', {
          data: that.data.nowObj
        });
      }
    });
  },
  chooseTypeItem: function (e) {
    let _id = e.currentTarget.dataset.id;
    let _name = e.currentTarget.dataset.name;
    this.setData({
      credentialsTypeEnum: _id,
      typeName: _name,
      codeTypeFlag: false
    });
  },
  chooseCommonVistor: function (e) {
    let needVisitor = 1;
    let obj = e.detail;

    if (this.data.vistorList.length < this.data.number) {
      this.data.vistorList.push(obj);
      this.setData({
        vistorList: this.data.vistorList,
        showMask: false,
        name: this.data.vistorList[0].name,
        phone: this.data.vistorList[0].phone,
        code: util.idCardEcode(this.data.vistorList[0].code)
      });
    } else {
      this.setData({
        errorMsg: '出行人数量不能大于预定数量',
        showError: true
      });
    }
  },
  getCommonVistor: function () {
    let that = this;
    let baseUrl = util.baseUrl;
    my.request({
      url: baseUrl + '/tourist/queryTouristList',
      data: {
        openid: my.getStorageSync('openid') // openid:'o72-z1FX3GcyBKyq6VnkW9OZomR0',

      },
      method: 'POST',
      success: function (res) {
        if (res.data.success) {
          let commonVistorList = JSON.parse(res.data.data.list);
          commonVistorList.map(item => {
            item.isChecked = true;
          });
          that.setData({
            commonVistorList: commonVistorList
          });
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  getCommonVistorStorage: function () {
    let that = this;
    my.getStorage({
      key: 'commonVistorList',
      success: function (res) {
        if (res.data) {
          if (res.data.length > 0) {
            that.setData({
              commonVistorList: res.data
            });
          }
        }
      }
    });
  }
});
