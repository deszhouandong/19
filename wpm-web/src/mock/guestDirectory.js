import Mock, {
  Random
} from "mockjs";
// 侧边栏筛选条件
const sideBarList = {
  rurl: "/sideBarList",
  rtype: "post",
  template: config => {
    return {
      code: 200,
      data: {
        ...Mock.mock({
          "list|10": [{
            "id|+1": 0,
            name: "@cname",
          }],
        })
      },
    };
  },
}
// 访客记录翻页
const listVisitorsRecordForState1 = {
  rurl: "/listVisitorsRecordForState1",
  rtype: "post",
  template: config => {
    const total = 20; //总条数
    const list = Mock.mock({
      "list|20": [{
        "id|+1": 0,
        "adAcount": "changxu01",
        "userName": "殷鹏飞",
        "visitState": 1,
        "visitType": 3,
        "visitObjectName": "@cname",
        "visitObjectId": 160,
        "arriveDate": "2020-01-08T07:32:04.000+0000",
        "arriveProvice": "上海市",
        "arriveCity": "上海市",
        "arriveAddress": "浦东新区",
        "arriveDescribe": "上钢新村街道",
        "leaveDate": "2020-01-08T07:32:13.000+0000",
        "leaveProvice": "上海市",
        "leaveCity": "上海市",
        "leaveAddress": "浦东新区",
        "leaveDescribe": "上钢新村街道",
        "chanceId": null,
        "hasCreateBus": 1,
        "hasSeeBus": 1,
        "chanceCreateUrl": "http%3A%2F%2Fwww.w3school.com.cn%2FMy%20first%2F%3FID%3D11%26name%3D%E6%98%AF%E7%9A%84",
        "chanceSeeUrl": "http%3A%2F%2Fwww.w3school.com.cn%2FMy%20first%2F%3FID%3D11%26name%3D%E6%98%AF%E7%9A%84"
      }]
    })
    const {
      index,
      size
    } = JSON.parse(config.body)
    const len = total / size
    const totalPages = len - parseInt(len) > 0 ? parseInt(len) + 1 : len //计算总页数
    const newList = list.list.slice(index * size, (index + 1) * size)
    // console.log(newList,111)
    return {
      code: 200,
      data: {
        pageIndex: index, //当前页面
        total: total, //总条数
        rows: newList //数据
      }
    };
  },
}

export default [sideBarList, listVisitorsRecordForState1];
