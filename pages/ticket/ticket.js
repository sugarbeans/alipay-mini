var util = require('../../utils/util');
Page({
  data: {
    productList: [],
    encryptId: '',
  },
  onLoad: function (option) {
  },
  onShow: function (e) {
    this.getScenicList(); //this.getThemeList()
  },
  onShareAppMessage: function () {
    return {
      title: '鼎游通',
      //转发页面的标题
      path: '/pages/ticket/ticket' //转发页面的路径以及携带的参数

    };
  },
  getScenicList: function () {
    // let that = this
    // my.getStorage({key:'pois',
    //   success: function(res) {
    //     that.setData({
    //       productList: res.data
    //     });
    //   },
    //   fail: function(res){
    //     my.showToast({
    //       content: '暂无数据！',
    //       duration: 2000
    //     })
    //   }
    // })   
    this.setData({
      productList: getApp().globalData.pois
    })
  },
  toProductInfo: function (e) {
    let _id = encodeURIComponent(e.currentTarget.dataset.id);
    my.navigateTo({
      url: '/pages/ticket-info/ticket-info?encryptId=' + _id
    });
  },
  //搜索
  doneSearch(e) {
    let _str = e.detail.value
    if(_str) {
      let _arr = this.data.productList.filter(item =>item.providerName.indexOf(_str) !== -1)
      this.setData({
        productList: _arr
      });
    } else {
      this.setData({
        productList: getApp().globalData.pois
      });
    }
    
  }
});