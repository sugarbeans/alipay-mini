var util = require('../../utils/util');

let _year = new Date().getFullYear();

let _month = new Date().getMonth() + 1;

let _flagNum = new Date(_year, _month - 1, 1).getDay();

let _flagDay = new Date(_year, _month, 0).getDate(); //多少天


Component({
  data: {
    week: ['日', '一', '二', '三', '四', '五', '六'],
    nowDate: util.formatTime(new Date(), 2),
    num: 42,
    //一个月不超过35天
    flag: true,
    //不能选择过期日期
    flagNum: _flagNum,
    //开始星期
    flagDay: _flagDay,
    //一共多少天
    dateActive: new Date().getDate() + _flagNum - 1,
    //默认当天,不准
    month: new Date().getMonth() + 1
  },
  props: {
    encryptId: '',
    priceList: [],
    dateActive: new Date().getDate() + _flagNum - 1
  },
  methods: {
    preDate: function () {
      //上一月
      let year = new Date(this.data.nowDate).getFullYear();
      let month = new Date(this.data.nowDate).getMonth() + 1;
      let day = new Date(this.data.nowDate).getDate();

      if (new Date().getMonth() + 1 > month - 1) {
        return;
      }

      if (month > 1) {
        month -= 1;
      } else {
        year -= 1;
        month = 12;
      }

      let dateStr = util.formatNumber(year) + '-' + util.formatNumber(month) + '-' + util.formatNumber(day);
      this.setData({
        nowDate: util.formatTime(new Date(dateStr), 2),
        flagNum: new Date(year, month - 1, 1).getDay(),
        //开始星期
        flagDay: new Date(year, month, 0).getDate(),
        month: month,
        dateActive: this.data.priceList[0].day + new Date(year, month - 1, 1).getDay() - 1
      }); //拉去价格
    },
    nextDate: function () {
      //下一月
      let year = new Date(this.data.nowDate).getFullYear();
      let month = new Date(this.data.nowDate).getMonth() + 1;
      let day = new Date(this.data.nowDate).getDate();
      let dateFlag = false;
      this.data.priceList && this.data.priceList.length > 0 (this.data.priceList.map((item, index) => {
        let temp = this.data.priceList.length;

        if (temp - 1 == index) {
          if (item.month == month) {
            dateFlag = true;
          }
        }
      }));

      if (dateFlag) {
        return;
      }

      if (month < 12) {
        month += 1;
      } else {
        year += 1;
        month = 1;
      }

      let dateStr = util.formatNumber(year) + '-' + util.formatNumber(month) + '-' + util.formatNumber(day);
      this.setData({
        nowDate: util.formatTime(new Date(dateStr), 2),
        flagNum: new Date(year, month - 1, 1).getDay(),
        //开始星期
        flagDay: new Date(year, month, 0).getDate(),
        month: month,
        dateActive: new Date(year, month - 1, 1).getDay()
      }); //拉去价格
    },
    choseDate: function (e) {
      //选择日期
      let _id = e.currentTarget.dataset.id;
      let priceObj = e.currentTarget.dataset.priceobj;
      this.setData({
        dateActive: _id
      }); //判断选择的日期是否是当天以前的日期

      this.props.onChoseDate({
        detail: {
          priceObj,
          _id
        }
      });
    }
  }
});