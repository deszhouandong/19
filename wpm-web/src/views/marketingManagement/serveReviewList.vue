<template>
  <div>
    <div class="serverReviewList">
      <!-- 列表 -->
      <van-card
        v-for="(item,index) of this.infoData"
        :key="index"
        @click="()=>{$router.push(
          { path:'/serveReview', query:{ id:item.erId} }
        )}"
      >
        <van-cell-group slot="title">
          <van-field  style="font-weight:bold;" label-width="2.4rem">
            <div slot="label">
             <van-image
              slot="right-icon"
                width="15" height="15"
                :src="travelImgSrc"
              />
            <span class="filTit">招待回顾</span>
           </div>
            <span slot="input" >{{ recordDate }}</span>
          </van-field>
          <van-field >
              <span slot="label">回顾日期：</span>
              <span slot="input">{{gettime(item.erReviewDate)}}</span>
          </van-field>
          <van-field >
              <span slot="label">招待对象：</span>
              <span slot="input">{{item.erVisitorObjectName}}</span>
          </van-field>
          <div style="border-bottom: 1px solid rgba(75,119,175,0.2);width:100%;"></div>
          <van-field >
              <span slot="label">招待人数：</span>
              <span slot="input">{{item.erNum}}</span>
          </van-field>
          <van-field >
              <span slot="label">实际费用：</span>
              <span slot="input">{{item.erAmount}}</span>
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
      objlist:[],
      travelImgSrc:require("../../../static/imgs/zhaodailist.png"),
    };
  },
  created() {
    this.init();
    document.title = "招待回顾列表";
  },
  methods: {
    //初始化
    init() {
      //查询
      this.recordDate = this.$moment(this.$route.query.time).format("YYYY-MM-DD");
      this.$getData
        .serveReviewList({
          method: "post",
          data: {
            'date': this.recordDate,
            'adAcount': this.$route.query.adAcount
          }
        })
        .then(res => {
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
.serverReviewList{
    background-color: #F4F4F4;
    height: 810px;
    padding-top: 10px;
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
  padding: 0 15px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
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
  padding: 0px 5px 0 0px;
}
</style>
