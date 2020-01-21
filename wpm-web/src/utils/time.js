/**
 * 判断一个时间是否在一个时间段内
 * @param beginTime "21:30"
 * @param endTime "21:30"
 * @param nowTime "21:30"
 */
const dateCompare = (beginTime, endTime, nowTime) => {
  var strb = beginTime.split(":");
  if (strb.length != 2) {
    return false;
  }

  var stre = endTime.split(":");
  if (stre.length != 2) {
    return false;
  }

  var strn = nowTime.split(":");
  if (stre.length != 2) {
    return false;
  }
  var b = new Date();
  var e = new Date();
  var n = new Date();

  b.setHours(strb[0]);
  b.setMinutes(strb[1]);
  e.setHours(stre[0]);
  e.setMinutes(stre[1]);
  n.setHours(strn[0]);
  n.setMinutes(strn[1]);

  if (n.getTime() - b.getTime() >= 0 && n.getTime() - e.getTime() <= 0) {
    return true;
  } else {
    // alert("当前时间是：" + n.getHours() + ":" + n.getMinutes() + "，不在该时间范围内！");
    return false;
  }
}
/**
 * 汉化日期
 * @param week (周)
 */
const localeWeek=(week)=>{
  let s='';
  switch(week){
    case 'Monday': s = '一'; break;
    case 'Tuesday': s = '二'; break;
    case 'Wednesday': s = '三'; break;
    case 'Thursday': s = '四'; break;
    case 'Friday': s = '五'; break;
    case 'Saturday': s = '六'; break;
    case 'Sunday': s = '日'; break;
  }
  return '星期' + s;
}
export {dateCompare,localeWeek}
