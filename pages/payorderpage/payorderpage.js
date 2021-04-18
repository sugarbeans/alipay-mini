const wx2my = require('../../wx2my');
const Behavior = require('../../Behavior');
var timer = null;
Page({
  data: {
    plain: false,
    time: 5,
    plain: true
  },
  onLoad: function () {
    let that = this;
    timer = setInterval(() => {
      if (that.data.time == 0) {
        clearInterval(timer);
        let code = getApp().globalData.code;

        if (code) {
          wx2my.navigateTo({
            url: '/pages/orderCode/order'
          });
        } else {
          wx2my.switchTab({
            url: '/pages/order/order'
          });
        }
      } else {
        that.setData({
          time: that.data.time - 1
        });
      }
    }, 1000);
  },
  toOrder: function () {
    clearInterval(timer);
    let code = getApp().globalData.code;

    if (code) {
      wx2my.navigateTo({
        url: '/pages/orderCode/order'
      });
    } else {
      wx2my.switchTab({
        url: '/pages/order/order'
      });
    }
  },
  toProduct: function () {
    clearInterval(timer);
    wx2my.navigateBack({
      delta: 2
    });
  }
});