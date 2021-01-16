App({
  globalData: {
    pois: [],
    product: null,
    stockList: null,
    userInfo: null,
    usid: null,
    visitorType: null,
    priceObj: null,
    id: null
  },
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    console.info('App onLaunch');
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // options.query == {number:1}
  },
});
