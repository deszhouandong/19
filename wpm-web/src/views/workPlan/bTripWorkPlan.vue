<template>
  <div id="bTripWorkplan">
    <ul class="main" v-show="h3Active == 2 && numberOfWeeks == numberOfWeeksNow">
      <li>
        <div class="title">
          <span>周{{fontChange(new Date(onBusinessItem.dateAll).getDay())}}</span><span>{{onBusinessItem.dateAll}}</span>
        </div>
        <div class="main_body">
          <div class="itemUp itemText">
            <div class="itemTextTitle">上午</div>
            <van-field v-model="onBusinessItem.dworkReviewDesAm"
              maxlength="200" rows="3" type="textarea"
              :readonly="true"
              @click="clickInputF(onBusinessItem.dworkReviewDesAm,'周'+fontChange(new Date(onBusinessItem.dateAll).getDay())+'  '+onBusinessItem.dateAll)"
            />
          </div>
          <div style="height:0;width:100%;border-top:1px dashed rgba(75,119,175,0.2);"></div>
          <div class="itemDown itemText">
            <div class="itemTextTitle">下午</div>
            <van-field v-model="onBusinessItem.dworkReviewDesPm"
              maxlength="200" row="3" type="textarea"
              :readonly="true"
              @click="clickInputF(onBusinessItem.dworkReviewDesPm,'周'+fontChange(new Date(onBusinessItem.dateAll).getDay())+'  '+onBusinessItem.dateAll)"
            />
          </div>
        </div>
      </li>
    </ul>
    <!-- 出差 -->
    <div v-show="tripList.length>0">
      <h3 class="h3_title">{{h3Active==1?'本周出差计划':'今日出差回顾'}}</h3>
      <table class="table" v-show="h3Active == 2"> <!-- 出差 回顾 -->
        <tr>
          <th>单号</th>
          <th>出差日期</th>
          <th>实际费用</th>
          <th>计划内</th>
        </tr>
        <tr v-for="(item,index) in tripList" :key="index" :style="item.status == 1?'':'color:#D75252;'">
          <td @click="()=>{ $router.push({ path:'/travelReview',query:{ id:item.id } }) }" ><div>{{item.billNo}}</div></td>
          <td>{{item.startDate}}</td>
          <td class="txtCenter">{{item.amountShow}}</td>
          <td class="txtCenter">{{item.status == 1?'Y':'N'}}</td>
        </tr>
      </table>
      <table class="table" v-show="h3Active == 1"> <!-- 出差 计划 -->
        <tr>
          <th>单号</th>
          <th>出差日期-起</th>
          <th>出差日期-止</th>
        </tr>
        <tr v-for="(item,index) in tripList" :key="index">
          <td @click="()=>{ $router.push({ path:'/travelPlan', query:{ id:item.id,weekNum:numberOfWeeks,year,startDate,time:item.startDate  } }) }" ><div >{{item.billNo}}</div></td>
          <td>{{item.startDate}}</td>
          <td>{{item.endDate}}</td>
        </tr>
      </table>
    </div>
    <!-- 加班考勤 -->
    <div v-if="h3Active == 2 && checkOverTimeData">
      <h3 class="h3_title">今日加班情况</h3>
      <table class="table"> 
        <tr>
          <th>单号</th>
          <th>加班类型</th>
          <th>开始时间</th>
          <th>结束时间</th>
          <th>加班小时数</th>
        </tr>
        <tr>
          <td @click="toOvertimeOrder"><div>{{checkOverTimeData.overtimeNo}}</div></td>
          <td>{{checkOverTimeData.overtimeType}}</td>
          <td class="txtCenter">{{checkOverTimeData.startDate}}</td>
          <td class="txtCenter">{{checkOverTimeData.endDate}}</td>
          <td class="txtCenter">{{checkOverTimeData.overtimeHours}}</td>
        </tr>
        <!-- <tr>
          <td @click="toOvertimeOrder"><div>CYD092849…</div></td>
          <td>基地内</td>
          <td class="txtCenter">08:34</td>
          <td class="txtCenter">08:34</td>
          <td class="txtCenter">8</td>
        </tr> -->
      </table>
    </div>
    <!-- 招待 -->
    <div v-show="entertainList.length>0">
      <h3 class="h3_title">{{h3Active==1?'本周招待计划':'今日招待回顾'}}</h3>
      <table class="table" v-show="h3Active == 2"> <!-- 招待 回顾 -->
        <tr>
          <th>单号</th>
          <th>招待对象</th>
          <th class="p-r30">实际费用</th>
          <th >计划内</th>
        </tr>
        <tr v-for="(item,index) in entertainList" :key="index" :style="item.status == 1?'':'color:#D75252;'" >
          <td @click="()=>{ $router.push({ path:'/serveReview', query:{ id:item.id} }) }"><div>{{item.billNo}}</div></td>
          <td>{{item.objectName}}</td>
          <td class="txtCenter">{{item.amountShow}}</td>
          <td class="txtCenter">{{item.status == 1?'Y':'N'}}</td>
        </tr>
      </table>
      <table class="table" v-show="h3Active == 1"><!-- 招待 计划 -->
        <tr>
          <th>单号</th>
          <th>招待对象</th>
          <th class="p-r30">预计费用</th>
        </tr>
        <tr v-for="(item,index) in entertainList" :key="index">
          <td  @click="()=>{ $router.push({ path:'/servePlan', query:{ id:item.id} }) }" ><div >{{item.billNo}}</div></td>
          <td>{{item.objectName}}</td>
          <td class="p-r30">{{item.amountShow}}</td>
        </tr>
      </table>
    </div>
    <!-- 回顾明细 -->
    <div v-if="h3Active == 2 && reviewDetailData">
      <h3 class="h3_title">今日回顾明细</h3>
      <div class="particulars">
        <div class="item">
          <span>单号</span><span class="blueColor">{{reviewDetailData.rdIdNumber}}</span>
        </div>
        <div class="item">
          <span>回顾类型</span><span>{{rdType}}</span>
        </div>
        <div class="item">
          <span>费用</span><span>{{reviewDetailData.rdOutlay}}</span>
        </div>
        <div class="item">
          <span>费用明细</span><span>{{reviewDetailData.rdOutlayDes}}</span>

        </div>
      </div>
      
    </div>
    <div id="opinion">
      <div class="header">
        <span class="h3">管理者意见</span>-<span>{{thisName}}的{{numberOfWeeks}}周工作{{h3Active == 1?'计划':'回顾'}}</span>
      </div>
      <van-field
        type="textarea" style="padding:10px;border-radius:4px;border:1px solid rgba(75,119,175,0.2);margin-bottom:10px;"
        :autosize="{ minHeight:160,maxHeight:160 }"
        placeholder="请输入留言" v-model="wplanVerifiedOpinion"
      />
      <van-checkbox v-model="agree" shape="square" :icon-size="12" style="padding-left:10px;" id="myCheckbox">
        <div style="font-weight:400;color:rgba(72,72,72,1);line-height:16px;font-size:11px;"  >
          不认同<span style="color:#D75252;">（说明：点击不认同后，当天招待/出差相关费用将无法报销！）</span>
        </div>
      </van-checkbox>
    </div>

    <div class="but_b">
      <van-button plain type="primary" @click="audit" :disabled="subDisabled" >已阅</van-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import methods from "@/views/workPlan/workPlanJ.js";
export default {
  name: "bTripWorkplan",
  data() {
    return {
      checkOverTimeData:null, // 加班数据
      reviewDetailData:null, // 回顾明细的数据
      subDisabled:false, // 决定已阅按钮是否被禁用

      wplanVerifiedOpinion:'', // 领导填写意见
      agree:false,
      entertainList:[], // 招待
      tripList:[], // 出差
    };
  },
  props:['numberOfWeeks','h3Active','onBusinessItem','numberOfWeeksNow','clickInputF','wstatus','dstatus','did','thisName','year','wid','adAcount','startDate','wpsFrom','code'],
  created() {},
  mounted(){
    console.log('code',this.code);
    if(this.h3Active == 1){
      this.queryTripEntertainPlanDataForLeader();
    }else if(this.h3Active == 2){
      this.queryTripEntertainReviewDataForLeader();
      this.selWorkReviewDetails();
      this.checkOverTime();
    }
  },
  methods: {
    ...methods,
    toOvertimeOrder(){ // 跳转加班考勤详情
      this.$router.push({
        path:'/overtimeOrder',
        query:{
          queryDate:new Date(this.onBusinessItem.dateAll).getTime(),
          adAcount:this.adAcount
        }
      })
    },
    checkOverTime(){ // 查看加班考勤清单
      console.log('checkOverTime onBusinessItem',this.onBusinessItem.dateAll);
      console.log('moment',moment(this.onBusinessItem.dateAll).format());
      this.$getData.checkOverTime({
        method:'post',
        data:{
          queryDate:moment(this.onBusinessItem.dateAll).format(),
          adAcount:this.adAcount
        }
      }).then(res=>{
        console.log("checkOverTime res",res);
        if(res.code == 200){
          if(res.data.id){
          // if(res.data){
            this.checkOverTimeData = {
              ...res.data,
              startDate:res.data.startDate?moment(res.data.startDate).format("HH:mm"):res.data.startStatus,
              // startDate:moment("2020-01-08").format("HH:mm"),
              endDate:res.data.endDate?moment(res.data.endDate).format("HH:mm"):res.data.endStatus,
            }
            // res.data;

          }else{
            this.checkOverTimeData = null
          }
        }
      })
    },
    selWorkReviewDetails(){ // 查询回顾明细
      this.$getData.reviewDetailFind({
        method:"post",
        data:{
          did:this.did,
          adAcount:this.adAcount
        }
      }).then(res=>{
        console.log('selWorkReviewDetails res',res);
        if(res.code == 200){
          this.reviewDetailData = res.data;
        }
      })
    },
    clear(){
      this.entertainList = [];
      this.tripList = [];
    },
    queryTripEntertainReviewDataForLeader(){ // 获取 回顾 招待出差
      this.clear();
      this.$getData.queryTripEntertainReviewDataForLeader({
        method:'post',
        data:{
          "adCount": this.adAcount,
          "queryDate": this.onBusinessItem.dateAll
        }
      }).then(res => {
        if(res.code == 200 && res.msg == 'success' && res.data){
          this.entertainList = res.data.entertainList;
          this.tripList = res.data.tripList
        }
      })
    },
    queryTripEntertainPlanDataForLeader(){ // 获取 计划 招待出差
      this.clear();
      this.$getData.queryTripEntertainPlanDataForLeader({
        method:'post',
        data:{
          "adCount": this.adAcount,
          "weekNum": this.numberOfWeeks,
          "year":this.year
        }
      }).then(res => {
        console.log('fdasf',typeof res.data);
        if(res.data){
          console.log(345);
        }else{
          console.log(123);
        }
        if(res.code == 200 && res.msg == 'success' && res.data){
          this.entertainList = res.data.entertainList;
          this.tripList = res.data.tripList;
        }
      })
    },
    audit(){ // 已阅按钮点击事件
      if(this.h3Active == 1 && this.wstatus == 2){
        this.examineWeekWorkPlan();
      }else if(this.h3Active == 2 && this.dstatus == 4){
        this.checkinRecordList({
          dayTime:moment(this.onBusinessItem.dateAll).format(),
          adAcount:this.adAcount
        }).then(res=>{
          console.log('执行完毕',this.examineWeekWorkReview);
          this.examineWeekWorkReview(this.wplanVerifiedOpinion);
        })
      }
    },
    examineWeekWorkReview(str){ // 审核回顾
      var _this = this;
      let data = {
        'agree':!this.agree,
        "did": this.did
      }
      if(str){
        data.wplanVerifiedOpinion = str;
      }
      this.$dialog.confirm({
        title: '审核工作回顾',
        message: '是否提交审核？'
      }).then(() => {
        this.$getData.examineWeekWorkReview({
          method:'post',
          data
        }).then(res => {
          if(res.code == 200 && res.msg == 'success'){
            // this.wstatus = 1;
            this.myNotify('审批成功');
            if(this.code>-1){
              this.$router.push('colleague')
            }else{
              // this.$router.go(-1);
              window.history.go(-1);
            }
            // this.subDisabled = true;
            // _this.selOneWeekPlan();
          }
        })
      }).catch(() => {
      });
    },
    examineWeekWorkPlan(){ // 审核计划
      var _this = this;
      this.$dialog.confirm({
        title: '审核工作计划',
        message: '是否提交审核？'
      }).then(() => {
        this.$getData.examineWeekWorkPlan({
          method:'post',
          data:{
            'agree':!this.agree,
            "wid": this.wid,
            "wplanVerifiedOpinion": this.wplanVerifiedOpinion,
            "wweekNum": this.numberOfWeeks.toString(),
            "wyear": this.year.toString()
          }
        }).then(res => {
          this.myNotify('审批成功');
          if(this.code>-1){
            this.$router.push('colleague')
          }else{
            // this.$router.go(-1);
            window.history.go(-1);
          }
          // this.wstatus = 3;
          // this.subDisabled = true;
          // _this.selOneWeekPlan();
        })
      }).catch(() => {
      });
    },
    myNotify(str){ // 提示框方法
      this.$notify({
        message: str,
        duration: 2000,
        className: 'myNotify'
      });
    },
  },
  computed:{
    rdType:function(){ // 回顾明细中的回顾类型
      switch(this.reviewDetailData.rdType){
        case "3":
          return "技工";
        case "2":
          return "路途";
        default:
          return "正常"
      }
      // return '2222'
    },
    fontChange:function(){ // 周序号处理显示
      return function (i){
        switch(i){
          case 0:
            return "日";
          case 1:
            return "一";
          case 2:
            return "二";
          case 3:
            return "三";
          case 4:
            return "四";
          case 5:
            return "五";
          case 6:
            return "六";
        }
      }
    },
  },
  watch:{
    h3Active:function(){
      if(this.h3Active == 1){
        this.queryTripEntertainPlanDataForLeader(); // 计划
      }else if(this.h3Active == 2){
        this.queryTripEntertainReviewDataForLeader(); // 回顾
      }
    }
  }
};
</script>
<style scoped lang='scss'>
h3{ margin:0; }
.blueColor{
  color:#007AFF;
}
#bTripWorkplan{
  overflow-y: scroll;
  background: #ececec; // 旧版本
  // background:rgba(244,244,244,1); // 新版本
  height: 100%;
  .particulars{
    background:rgba(255,255,255,1);
    .item{ height: 36px;padding: 0px 20px 0px 44px; 
      font-weight: 500;
      font-size: 12px;
      line-height: 3;
      color:rgba(72,72,72,1);
      display: flex;justify-content: space-between;
      border-top: 1px solid rgba(75,119,175,0.1);
    }
  }
  .h3_title{ 
    // height: 50px; // 旧版本
    // line-height: 50px;
    line-height: 31px;
    height: 31px; // 新版本

    padding-left: 20px;
    font-size:15px;
    font-weight:bold;
    color:rgba(72,72,72,1);
  }
  .table{
    border-collapse: collapse; // 合并边框
    width: 100%;
    tr{
      // display: flex;justify-content:space-between;
      background:rgba(255,255,255,1);
      .txtCenter{ text-align: center; }
      .p-r30{ padding-right:30px;text-align: right; }
      th{
        // height: 52px; // 旧版本
        height: 35px; // 旧版本
        font:bold 12px/35px "";
        // background:rgba(75,119,175,0.3); // 旧版本
        border-bottom: 1px solid rgba(75,119,175,0.1);
        &:first-child{ padding-left: 20px;text-align: left;

        }
      }
      td{  text-align: center;background:#fff;height:38px;
        &:first-child{ padding-left: 20px;text-align: left;color: #007AFF;
          &>div{width: 72px;
            white-space: nowrap; // 超出文本省略
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
#opinion{
  margin-bottom: 64px;
  margin-top: 10px;padding: 5px 10px;background:#fff;
  .header{ border-bottom: 2px solid #4B77AF;margin-bottom:6px;
    &>span{
      font-size:13px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(72,72,72,1);
      line-height:24px;
      &.h3{ font-size: 17px;font-weight:600; }
    }
  }
  padding-bottom: 10px;
}
.but_b{ position: fixed;bottom: 0;width: 100%; box-shadow: 0 -1px 8px #3488c2;height:42px;z-index: 2;
  & button{ width:100%;height: 100%;font-size: 20px;line-height: 42px;font-weight: 600;border:0; background: #4B77AF;color: #fff;  }
}
.main{
  padding: 11px;background: #fff;
  .title{
    height:17px;
    font-size:12px;
    font-weight:400;
    color:rgba(72,72,72,1);
    line-height:17px;
    border-bottom: 1px solid #4B77AF;padding-bottom:2px;
    &>span:first-child{ margin-right: 10px; }
  }
  .itemText{
    display: flex;justify-content: flex-start;align-items:center;
    &>.itemTextTitle{ letter-spacing:12px;
      width:16px;
      height:34px;
      font-size:12px;
      font-family:PingFang-SC-Regular,PingFang-SC;
      font-weight:400;
      color:rgba(75,119,175,0.2);
      line-height:17px;
    }
  }
  .itemUp{ padding-top: 5px; }

  .main_body{ //li 中除了标题的包裹框
    position: relative;
    .circleBut{ // 圆形审阅按钮样式
      // background: rgb(75, 119, 175);
      background: #fff;
      width: 54px;height: 54px;border-radius: 50%;color: #000;
      // box-shadow:0px 0px 8px 0px rgba(155,195,238,0.3);
      position: absolute;right: 0;top: 0;bottom: 0;margin: auto 0;
      // z-index: 1;
    }
  }

}

</style>
<style lang="scss">
div#myCheckbox.van-checkbox{
  @mixin iconsize{
    width:13px;height: 13px;display: inline-block;
  }
  &>div.van-checkbox__icon.van-checkbox__icon--square{
     @include iconsize;
    i.van-icon.van-icon-success{
      @include iconsize;
    }
  }
}
</style>
