var util = require('../../utils/util');

Page({
  data: {
    showError: false,
    errorMsg: '',
    error: 'error',
    showPayLoading: false,
    loadingText: '授权中...'
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
      url: baseUrl + '/api/ali/alilogin?code='+e,
      method: 'GET',
      timeout: 300000,
      success: function (res) {
        if (res.data.code === '200') {
          getApp().globalData.usid = res.data.data.usid
          that.setData({
            showPayLoading: false
          });
          my.navigateBack({delta: 2});
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
  }
});