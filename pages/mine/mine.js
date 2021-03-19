const app = getApp();
Page({
  data: {
    isLogin: false,
    nickName: '',
    userImg: '../../assets/banner/icon.png'
  },
  //事件处理函数
  onLoad: function (option) {
    let userInfo = getApp().globalData.userInfo;
    if (!userInfo) {
      //判断是否授权登录
      my.navigateTo({
        url: "/pages/loginPage/loginPage"
      });
      return;
    }
  },
  onShow: function () {
    let userInfo = getApp().globalData.userInfo;
    if (userInfo) {
      this.setData({
        userImg: userInfo.avatar,
        nickName: userInfo.nickName,
        isLogin: true
      });
    }
  },
  toGetLogin: function () {
    my.navigateTo({
      url: "/pages/loginPage/loginPage"
    });
  },
  toOrder: function (e) {
    let _id = e.currentTarget.dataset.id;
    getApp().globalData.id = _id
    my.switchTab({
      url: "/pages/order/order"
    });
  },
  toMyfavourite: function () {
    // wx.navigateTo({
    //   url:"/pages/myfavourite/myfavourite"
    // })
    my.showToast({
      content: '敬请期待',
      duration: 2000
    })
  },
  toContactPeople: function () {
    // wx.navigateTo({
    //   url:"/pages/commonvistor/commonvistor"
    // })
    my.showToast({
      content: '敬请期待',
      duration: 2000
    })
  },
  toContact: function () {
    my.makePhoneCall({
      number: '400-001-8887'
    });
  }
});
