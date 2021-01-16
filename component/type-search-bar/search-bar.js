Component({
  data: {
    firstName:'',
    secondName:'',
    thirdName:'',
    showFirst:false,
    showSecond:false,
    showThird:false,
    num:8,
    cityList:[],
    citySmallList:[],
    active:'',
  },
  properties: {
    firstName:{
      type: String,
      value: ''
    },
    firstList:{
      type: Array,
      value: []
    },
    secondName:{
      type: String,
      value: ''
    },
    secondList:{
      type:Array,
      value:[]
    },
    thirdName:{
      type: String,
      value: ''
    },
    thirdList:{
      type:Array,
      value:[]
    },
    firstNum:{
      type: String,
      value: ''
    },
    secondNum:{
      type: String,
      value: ''
    },
    thirdNum:{
      type: String,
      value: ''
    }
  },
  methods: {
    showFn:function(e){
      let _id = e.currentTarget.dataset.id
      let that = this
      that.setData({
        active:_id
      })
      switch (_id) {
        case '1':
          let showFirst = that.data.showFirst
          that.setData({
            showFirst:!showFirst,
            showSecond:false,
            showThird:false,
            active:!showFirst?'1':'',
          })
          break;
        case '2':
          let showSecond = that.data.showSecond
          that.setData({
            showSecond:!showSecond,
            showFirst:false,
            showThird:false,
            active:!showSecond?'2':'',
          })
          break;
        case '3':
          let showThird = that.data.showThird
          that.setData({
            showThird:!showThird,
            showSecond:false,
            showFirst:false,
            active:!showThird?'3':'',
          })
          break;
        default:
          break;
      }
    },
    choseFirst:function(e){ //选择一
      let _id = e.currentTarget.dataset.id
      let _name = e.currentTarget.dataset.name
      let that = this
      that.setData({
        firstNum:_id,
        showFirst:false,
        active:'',
        firstName:_id==0?this.data.firstName:_name
      })
      //子组件向父组件传值
      that.triggerEvent('choseFirst',_id)
    },
    choseSecond:function(e){ //选择二
      let _id = e.currentTarget.dataset.id
      let _name = e.currentTarget.dataset.name
      let that = this
      that.setData({
        secondNum:_id,
        showSecond:false,
        active:'',
        secondName:_id==0?this.data.secondName:_name
      })
      //子组件向父组件传值
      that.triggerEvent('choseSecond',_id)
    },
    choseThird:function(e){ //选择三
      let _id = e.currentTarget.dataset.id
      let _name = e.currentTarget.dataset.name
      let that = this
      that.setData({
        thirdNum:_id,
        showThird:false,
        active:'',
        thirdName:_id==0?this.data.thirdName:_name
      })
      that.triggerEvent('choseThird',_id)
    },
  },
})
