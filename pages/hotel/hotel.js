const wx2my = require('../../wx2my');
const Behavior = require('../../Behavior');
Page({
  data: {
    inputShowed: false,
    firstName: '区域/位置',
    secondName: '价格/档次',
    thirdName: '筛选',
    hotelList: ['1']
  },

  onLoad() {},

  toSearch: function () {
    wx2my.navigateTo({
      url: '/pages/searchpage/searchpage'
    });
  },
  toProductInfo: function () {
    wx2my.showToast({
      title: '敬请期待',
      icon: 'none',
      duration: 2000
    }); // wx.navigateTo({
    //   url:'/pages/hotel-info/hotel-info'
    // })
  },
  choseFirst: function (e) {
    //选择主题传过来的值
    console.log(e);
  },
  choseSecond: function (e) {
    //选择类型传过来的值
    console.log(e);
  },
  choseThird: function (e) {
    //选择地理位置传过来的值
    console.log(e);
  }
});