const wx2my = require('../../wx2my');
const Behavior = require('../../Behavior');
var util = require('../../utils/util.js');

Page({
  data: {
    vistorList: [],
    commonVistorList: []
  },
  onLoad: function () {
    let openid = wx2my.getStorageSync('openid');

    if (openid == '') {
      //判断是否授权登录
      wx2my.navigateTo({
        url: "/pages/loginPage/loginPage"
      });
      return;
    }
  },
  onShow: function () {
    let that = this;
    let baseUrl = util.baseUrl;
    wx2my.request({
      url: baseUrl + '/tourist/queryTouristList',
      data: {
        openid: wx2my.getStorageSync('openid') // openid:'o72-z1FX3GcyBKyq6VnkW9OZomR0',

      },
      method: 'POST',
      success: function (res) {
        if (res.data.success) {
          let commonVistorList = JSON.parse(res.data.data.list);
          commonVistorList.map(item => {
            item.isChecked = true;
          });
          console.log(commonVistorList);
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
  addCommomVistor: function () {
    let openid = wx2my.getStorageSync('openid');

    if (openid == '') {
      //判断是否授权登录
      wx2my.navigateTo({
        url: "/pages/loginPage/loginPage"
      });
      return;
    }

    wx2my.navigateTo({
      url: "/pages/addvistorpage/addvistorpage",
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('checkedSwitch', {
          data: true
        });
      }
    });
  },
  changeVistorInfo: function (e) {
    let obj = e.currentTarget.dataset.obj;
    wx2my.navigateTo({
      url: "/pages/addvistorpage/addvistorpage",
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('changeVistorInfo', {
          data: obj
        });
      }
    });
  }
});