const wx2my = require('../../wx2my');
const Behavior = require('../../Behavior');
Component({
  data: {
    active: '0'
  },
  props: {
    active: ''
  },
  methods: {
    switchType: function (e) {
      let _id = e.currentTarget.dataset.id;
      this.setData({
        active: _id
      });
      this.props.onSwitchType({
        detail: _id
      });
    }
  }
});