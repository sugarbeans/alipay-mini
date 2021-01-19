const formatTime = function(date,index){ //格式日期
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  switch (index) {
    case 0:
      return [year, month, day].map(formatNumber).join('-');
      break;
    case 1:
      return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
      break;
    case 2:
      return [year, month].map(formatNumber).join('-');
      break;
    case 3:
      return [month, day].map(formatNumber).join('-');
      break;
    case 4:
      return month;
      break;
    case 5:
      return day;
      break;
    default:
      break;
  }

}

const formatNumber = function(n){
  n = n.toString()
  return n[1] ? n : '0' + n
}

const idCardEcode = function(number){ //格式证件号码
  let str = number + ''
  var a = ''
  var b = ''
  for (var i = 0; i < 6; i++) {
    a += str[i]
  }
  for (var j = 0; j < 4; j++) {
    b += str[str.length - 4 + j]
  }
  return a + '********' + b
}

const IdentityCodeValid = function(code){ //身份证号检验
  let city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "}
  var tip = ""
  var pass= true
  if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
    tip = "身份证号输入有误";
    pass = false;
  } else if(!city[code.substr(0,2)]){
    tip = "前六位输入有误";
    pass = false;
  } else{
    //18位身份证需要验证最后一位校验位
    if(code.length == 18){
      code = code.split('');
      //∑(ai×Wi)(mod 11)//加权因子
      var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
      //校验位
      var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if(last != code[17]){
        tip = "身份证最后一位错误，请大写！";
        pass =false;
      }
    }
  }
  let flag = []
  flag.push(tip)
  flag.push(pass)
  return flag
}

const phoneRule = function(phone){ //手机号验证
  if(!(/^1[3456789]\d{9}$/.test(phone))){
    return false
  }else{
    return true
  }
}

const baseUrl = 'https://saas.ectrip.com'

module.exports = {
  formatTime,
  formatNumber,
  idCardEcode,
  IdentityCodeValid,
  phoneRule,
  baseUrl
}
