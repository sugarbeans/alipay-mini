const wx2my = require('../../wx2my');
const Behavior = require('../../Behavior');
var util = require('../../utils/util');

Page({
  data: {
    current: 0,
    active: 0,
    productList: [],
    type: 1
  },
  onLoad: function () {
    var that = this;
    wx2my.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },
  onShow: function () {
    var that = this;
    let openid = wx2my.getStorageSync('openid');

    if (openid == '') {
      //判断是否授权登录
      wx2my.navigateTo({
        url: "/pages/loginPage/loginPage"
      });
      return;
    } else {
      that.getFavouriteList(that.data.type);
    }
  },
  switchType: function (e) {
    let _id = e.detail;
    this.setData({
      current: _id
    });
  },
  changeCurrent: function (e) {
    let _id = e.detail.current;
    this.setData({
      active: _id
    }); // this.getFavouriteList(_id)
  },
  getFavouriteList: function (type) {
    let baseUrl = util.baseUrl;
    let that = this;
    wx2my.request({
      url: baseUrl + '/follow/queryFollow',
      data: {
        type: type
      },
      method: 'POST',
      success: function (res) {
        console.log(res);

        if (res.data.success) {
          if (res.data.data.list) {
            let data = res.data.data.list.content;
            data.map(item => {
              //imageList转数组
              let imgUrl = JSON.parse(item.imageList);
              item.imageList = imgUrl;
            });
            that.setData({
              productList: data
            });
          } else {
            that.setData({
              productList: []
            });
          }
        }
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  cancelCollectOne: function (e) {
    let _id = e.currentTarget.dataset.item.encryptId;
    let type = this.data.type;
    this.cancelCollectOneFn(_id, type);
  },
  cancelCollectOneFn: function (id, type) {
    let baseUrl = util.baseUrl;
    let that = this;
    wx2my.request({
      url: baseUrl + '/follow/unFollowPoi',
      data: {
        encryptId: id,
        type: type
      },
      method: 'POST',
      success: function (res) {
        if (res.data.success) {
          that.setData({
            showError: true,
            errorMsg: '取消收藏',
            error: 'success'
          });
          that.getFavouriteList(that.data.type);
        } else {
          that.setData({
            showError: true,
            errorMsg: '收藏失败！请稍后重试！'
          });
        }
      },
      fail: function (res) {
        console.log(res);
        that.setData({
          showError: true,
          errorMsg: '收藏失败！请稍后重试！'
        });
      }
    });
  },
  toProductInfo: function (e) {
    let _id = encodeURIComponent(e.currentTarget.dataset.id);

    wx2my.navigateTo({
      url: '/pages/ticket-info/ticket-info?encryptId=' + _id
    });
  },
  bindErrorImg: function (e) {
    let errorImgIndex = e.currentTarget.dataset.errorimg;
    this.data.hotTicketList.map((item, index) => {
      if (errorImgIndex == index) {
        item.imageList[errorImgIndex].url = '../../assets/banner/error.jpg';
      }
    });
    this.setData({
      hotTicketList: this.data.hotTicketList
    });
  }
});