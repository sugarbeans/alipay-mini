const wx2my = require('../../wx2my');
const Behavior = require('../../Behavior');
Page({
  data: {
    activeNum: 3,
    showScrollTop: false,
    ticketIndex: 1,
    num: 10,
    latitude: 22.569533,
    longitude: 113.929291,
    covers: [{
      latitude: 22.569533,
      longitude: 113.929291,
      iconPath: '../../assets/banner/location.png'
    }]
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap');
  },
  onPageScroll: function (e) {
    let scrollTop = e.scrollTop;

    if (scrollTop > 500) {
      this.setData({
        showScrollTop: true
      });
    } else {
      this.setData({
        showScrollTop: false
      });
    }
  },
  moreItem: function () {
    let that = this;
    this.setData({
      activeNum: that.data.num
    });
  },
  lessItem: function () {
    let that = this;
    this.setData({
      activeNum: 3
    });
    wx2my.pageScrollTo({
      scrollTop: 0
    });
  },
  toScrollTop: function () {
    wx2my.pageScrollTo({
      scrollTop: 0
    });
  },
  minusTicketIndex: function () {
    if (this.data.ticketIndex <= 1) {
      this.setData({
        ticketIndex: 1
      });
    } else {
      this.setData({
        ticketIndex: this.data.ticketIndex - 1
      });
    }
  },
  addTicketIndex: function () {
    this.setData({
      ticketIndex: this.data.ticketIndex + 1
    });
  }
});