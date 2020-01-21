import moment from 'moment'

const columns = [
  //   {
  //   id: 1,
  //   name: '内访'
  // },
  {
    id: 3,
    name: '企业'
  },
  {
    id: 2,
    name: '项目'
  }, {
    id: 4,
    name: '自然人'
  }, {
    id: 5,
    name: '个体工商户'
  }, {
    id: 6,
    name: '政府机构/事业单位'
  }
]

export function formatTime(time, type) {
  if (time && type === 'hour') {
    return moment(time).format('YYYY-MM-DD HH:ss')
  }
  if (time && type === 'second') {
    return moment(time).format('YYYY/MM/DD HH:mm:ss')
  }
  if (time && type === 'year') {
    return moment(time).format('YYYY-MM-DD')
  }
}

function handlename(arr, value) {
  arr.forEach(item => {
    if (value === item.id) {
      value = item.name
    }
  })
  return value
}

function handleId(arr, value) {
  arr.forEach(item => {
    if (value === item.name) {
      value = item.id
    }
  })
  return value
}

export function returnArr(type) {
  switch (type) {
    case 'columns':
      return columns;
      break;
  }
}

export function handleReturnid(value, type) {
  switch (type) {
    case 'columns':
      return handleId(columns, value)
      break;
  }
}

export function handleReturnname(value, type) {
  switch (type) {
    case 'columns':
      return handlename(columns, value)
      break;
  }
}
export function getlocalStorage(name) {
  if (localStorage.getItem(name)) {
    return JSON.parse(localStorage.getItem(name));
  } else {
    return null
  }
}
export function setlocalStorage(name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

export function debounce(func, wait, immediate) { //防抖
  let timeout
  return function (...args) {
    let context = this
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(function () {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
  }
}

/*
@desc：json转字符串函数
@author <lee> [<complet@163.com>]
@param json json对象
@return str 字符串
*/
export function jsontostr(json) {
  var arr = new Array()
  for (var k in json) {
    var v = json[k]
    var val = k + '=' + v
    arr.push(val)
  }
  var str = arr.join('&')
  return str
}


