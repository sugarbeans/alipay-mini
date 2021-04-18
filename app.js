App({
  globalData: {
    pois: [],
    product: null,
    stockList: null,
    userInfo: null,
    usid: null,
    visitorType: null,
    priceObj: null,
    id: null,
    companyId: 18,
    encryptId: null
  },
  onLaunch(options) {
    // 第一次打开
    // options.query == {number:1}
    if(options.query && options.query.encryptId) {
      this.globalData.encryptId = options.query.encryptId
     }
    console.info('App onLaunch'+this.globalData.encryptId);
  },
  onShow(options) {
    if(options.query && options.query.encryptId) {
      this.globalData.encryptId = options.query.encryptId
     }
    console.info('App onShow'+this.globalData.encryptId);
  },
});
