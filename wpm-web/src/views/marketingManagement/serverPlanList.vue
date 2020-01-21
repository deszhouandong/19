<template>
  <div>
    <van-popup v-model="loadFlag" >
      <van-loading class="load" size="24px" vertical >加载中...</van-loading>
    </van-popup>
    <div class="serverList">
      <!-- 列表 -->
      <van-card
        @click="()=>{$router.push(
          { path:'/servePlan', query:{ id:item.epId,startDate:$route.query.time} }
        )}"
        v-for="(item,index) of this.infoData"
        :key="index"
      >
          <van-cell-group slot="title">
         <van-field size="large" style="font-weight:bold;font-size:16px;" label-width="3rem">
           <div slot="label" >
             <van-image
              slot="right-icon"
                width="15" height="15"
                :src="serveImgSrc"
              />
            <span class="filTit">招待计划</span>
           </div>
            <span slot="input" style="font-size:16px;">{{recordDate}}</span>
        </van-field>
        <van-field>
            <span slot="label">计划日期：</span>
            <span slot="input">{{gettime(item.epPlanDate)}}</span>
        </van-field>
        <van-field >
            <span slot="label">招待对象：</span>
            <span slot="input">{{item.epVisitObjectName}}</span>
        </van-field>
        <div style="border-bottom: 1px solid rgba(75,119,175,0.2);width:100%;margin:5px 0px;"></div>
        <van-field >
            <span slot="label">招待人数：</span>
            <span slot="input">{{item.epNum}}</span>
        </van-field>
        <van-field >
            <span slot="label">预计费用：</span>
            <span slot="input">{{item.epAmount}}</span>
        </van-field>
        </van-cell-group>
      </van-card>

  </div>
  </div>
  
</template>
<script>
import Vue from "vue";

import wx from "weixin-js-sdk"; // 引入企业微信的sdk
export default {
  name: "actionSafe",
  data() {
    return {
      loadFlag:true,
      infoData: {},
      list:[],
      serveImgSrc:require("../../../static/imgs/zhaodailist.png"),
    };
  },
  created() {
    this.init();
    document.title = "招待计划列表";
  },
  methods: {
    //初始化
    init() {
      //查询
      this.recordDate = this.$route.query.time
      this.$getData
        .servePlanListFind({
          method: "post",
          data: {
            date: this.recordDate,
            adAcount: this.$route.query.adAcount
          }
        })
        .then(res => {
          this.loadFlag = false
          this.infoData = res.data;
        });
    },
    gettime(vel){
      return this.$moment(vel).format("YYYY-MM-DD")
    },
  }
};
</script>
<style lang="scss" scoped >
.load{
  padding-top: 50px;
}
.van-loading--vertical{
  width: 150px;
  height: 100px;
  border-radius: 10px;
}
.serverList{
    background-color: #F4F4F4;
    height: 810px;
}
//导航栏
.van-nav-bar {
  font-weight: bold;
}
.van-nav-bar__title {
  color: #333;
  font-weight: bold;
}
//新增问题
.van-cell {
  // padding-top: 10px;
  padding: 0 15px;
  min-height: 30px;
  line-height: 30px;
  font-size: 15px;
}
.van-cell--large {
  padding: 0rem;
}
/deep/.van-card .van-cell--large .van-cell__title {
    // width: 70px;
  text-align: left;
  color: #7B7B7B;
}
.filTit{
    color: #000;
}
/deep/.van-card .van-field__control{
    color: #000;
}
//去除边框
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after{
    border: none;
}
.van-cell:not(:last-child)::after{
    border: none;
}
.van-card{
    padding: 10px 15px;
    background-color: #fff;
    margin: 0px 0 10px 0;
    border-radius: 10px;
}
//图标
.van-image{
  padding: 0px 5px 0 15px;
}
</style>
