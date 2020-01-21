<template>
  <div>
    <van-popup v-model="loadFlag" >
      <van-loading class="load" size="24px" vertical >加载中...</van-loading>
    </van-popup>
    <div class="vistorList" >
      <!-- 列表 -->
      <van-card
        @click="goServer(item)"
        v-for="(item,index) of this.objlist"
        :key="index"
      >
          <van-cell-group slot="title">

        <van-field label-width="300px"   style="font-weight:bold;">
           <van-image
        slot="label"
          width="17" height="17"
          :src="visImgSrc"
          style="padding-right:10px;"
        />
             <span slot="label" class="filTit">{{item.visitObjectName}}</span>
        </van-field>

        <van-field >
            <span slot="label" >开始时间：</span>
            <span slot="input">{{gettime(item.arriveDate)}}</span>
        </van-field>

        <van-field >
            <span slot="label">访客地址：</span>
            <span slot="input" class="vis-add">{{item.arriveCity+item.arriveAddress+item.arriveDescribe}}</span>
        </van-field>
        <div style="border-bottom: 1px solid rgba(75,119,175,0.2);width:100%;margin:5px 0px;"></div>
        <van-field >
            <span slot="label">结束时间：</span>
            <span slot="input">{{gettime(item.leaveDate)}}</span>
        </van-field>

        <van-field >
            <span slot="label">访客地址：</span>
            <span slot="input" class="vis-add">{{item.leaveCity+item.leaveAddress+item.leaveDescribe}}</span>
        </van-field>
        </van-cell-group>
      </van-card>
      <div v-if="objlist.length === 0 && loadFlag === false ? true :false" class="empty">
        <p>没有查询相关的数据，点击返回!</p>
        <van-button class="btn" type="info" @click="goback">返回</van-button>
      </div>
  </div>
  </div>
  
</template>
<script>
import Vue from "vue";

export default {
  name: "actionSafe",
  data() {
    return {
      infoData: {},
      objlist:[],
      adAcount:'',
      loadFlag:true,
      visImgSrc:require("../../../static/imgs/visListReview.svg"),
    };
  },
  created() {
    document.title = "访客记录列表";
    this.init();
    // const a = this.addHour('2019-11-10 20:20:10', 12)
    // console.log('2019-11-10 20:20:10加12小时---', a)
  },
  methods: {
    //初始化
    init() {
      //获取ad账号
        this.$getData.getCurrent({
            method: "post",
        }).then(res => {
            this.adAcount = res.data.accountName
            this.recordDate  = this.$moment(new Date()).format("YYYY-MM-DD")
             //查询
      this.objflag = true
        this.$getData
        .serveRewVis({
          method: "post",
          data:{
            "startTime": this.$moment(new Date()).format("YYYY-MM-DD"),
            "endTime": this.$moment(new Date()).format("YYYY-MM-DD"),
            adAcount: this.adAcount,
          }
        })
        .then(res => {
            this.loadFlag = false
          this.objlist = res.data
        });
        })
    },
    gettime(vel){
      const oldTimeStr = this.$moment(vel).format("YYYY/MM/DD HH:mm:ss")
      // const newTimeStr = this.addHour(oldTimeStr, 0)
      return oldTimeStr
      // const newtime = this.$moment(new Date(vel)).format("YYYY-MM-DD HH:mm:ss")
      // return newtime
    },
    // 已有时间基础上追加n小时
    // addHour(dates,num){
    //   const   d=new   Date(dates.replace(/-/g,"/"))
    //   d.setHours(d.getHours()+num)
    //   let tempday=d.getDate()
    //   let tempmonth=(1+d.getMonth())
    //   let temphour=d.getHours()
    //   let tempmin=d.getMinutes()
    //   let tempsecond=d.getSeconds()

    //   if(tempday.toString().length==1)
    //     tempday="0"+tempday
    //   if(tempmonth.toString().length==1)
    //     tempmonth="0"+tempmonth
    //   if(temphour.toString().length==1)
    //     temphour="0"+temphour
    //   if(tempmin.toString().length==1)
    //     tempmin="0"+tempmin
    //   if(tempmin.toString().length==1)
    //     tempsecond="0"+tempsecond
    //   return   d.getFullYear()+ "-"+tempmonth+ "-"+tempday+" "+temphour+":"+tempmin+":"+tempsecond
    // },
    goback(){
      this.$router.go(-1);
    },
    goServer(vel){
    this.$router.push({
            path: "/serveReview",
            query: {
              id:this.$route.query.id,
              weekNum:this.$route.query.weekNum,
              erVisitorRecordId:vel.id,
              erVisitorObjectId:vel.visitObjectId,
              erVisitorObjectName:vel.visitObjectName
            }
          });
  }
  },
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
.vistorList{
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
//省略号
.vis-add{
  display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1;
overflow: hidden;
width: 100%;
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
.empty{
  padding-top: 3rem;
  text-align: center;
  p{
    font-size: 16px;
    color: #333;
  }
  .van-button{
    border-radius: 10px;
    height: 40px;
    line-height: 40px;
  }
}
.btn{
  background: #4B77AF;
  border: none;
  margin-top: 1rem
}
</style>
