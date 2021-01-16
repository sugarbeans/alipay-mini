Component({
  data: {},
  commonVistorList: {
    type: Array,
    value: true
  },
  props: {
    priceObj: true,
    priceList: true,
    priceIndex: true
  },
  methods: {
    closeMaskDialog: function () {
      this.props.onCloseMaskDialog({
        detail: false
      });
    },
    toAddVistor: function () {
      let that = this;

      if (this.data.priceObj.number > this.data.priceObj.vistorList.length) {
        wx2my.navigateTo({
          url: '/pages/addvistorpage/addvistorpage',
          success: function (res) {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('visitorType', {
              data: that.data.priceObj,
              list: that.data.priceList,
              priceIndex: that.data.priceIndex
            });
          }
        });
      } else {
        this.props.onToAddVistor({
          detail: '出行人数不能大于预定数量'
        });
      }
    },
    changeVistorInfo: function (e) {
      let obj = e.currentTarget.dataset.obj;
      wx2my.navigateTo({
        url: "/pages/addvistorpage/addvistorpage",
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('changeVistorInfo', {
            data: obj,
            priceObj: this.data.priceObj,
            list: that.data.priceList
          });
        }
      });
    },
    chooseCommonVistor: function (e) {
      let commonObj = e.currentTarget.dataset.obj;
      this.props.onChooseCommonVistor({
        detail: commonObj
      });
    }
  }
});