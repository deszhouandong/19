<template>
  <div class="servePlan" @touchend="touchend" @touchmove="touchmove" @touchstart="touchstart">
    <van-popup v-model="loadFlag" >
      <van-loading class="load" size="24px" vertical >加载中...</van-loading>
    </van-popup>
    <div  @click="objflag = false" v-if="!loadFlag">
    <!-- 导航栏 -->
    <van-nav-bar
      @click-left="onClickLeft"
      @click-right="onClickRight"
      style="color:#333;margin-bottom:10px;margin-bottom:10px;"
    >
    <div slot="right" style="width:48px;" v-if="!this.$route.query.id">
        <span style="font-size:0.426667rem;color:#007AFF;">取消</span>
      </div>
    <div slot="left" v-if="!this.$route.query.id">
      <van-icon name="arrow-left" style="color:#4B77AF;padding-bottom: 0.1rem;"  />
        <span style="color:#007AFF;font-size:0.426667rem;">出差计划</span>
      </div>
      <div slot="title" v-if="this.$route.query.id > 0 ? false : true">招待计划</div>
      <div slot="title" v-if="this.$route.query.id > 0 ? true : false">
          <div style="line-height:12px;margin-top:0.2rem;" >招待计划</div>
      <div style="height:16px;line-height:16px;font-weight:normal;font-size:12px;padding-top:0.05rem;"
      >{{entertainPlanBodyResp.epBillNo}}</div>
      </div>

    </van-nav-bar>
    <van-cell-group :class="this.entertainPlanBodyResp.epStatus === 2 || this.entertainPlanBodyResp.epStatus === 3 ? 'noclick' : ''">
      <!-- 招待计划 -->
      <van-field
        label-width="100px"
        input-align="right"
        label-align="left"
        label="申请日期"
        placeholder="请选择申请日期"
        v-model="entertainPlanBodyResp.epPlanDate"
        @click="applyTime"
        readonly
        class="info laster"
        style="color:#333;"
      >
        <!-- <van-icon v-if="timeflag" name="notes-o" slot="right-icon" class="dataIcon" /> -->
        <van-image
        v-if="timeflag"
        slot="right-icon"
          width="17" height="17"
          :src="serveImgSrc"
        />
      </van-field>
      <van-popup v-model="show" position="bottom" :style="{ height: '55%'}">
        <div>
          <calendar></calendar>
          <inlineCalendar @change="handelChange"   :minDate="startTime" :maxDate="endTime" />
        </div>
      </van-popup>
      <van-field
        input-align="right"
        label-width="100px"
        label-align="left"
        label="招待类型"
        placeholder="请选择招待类型"
        v-model="typevalue"
        @click="typeShow = true"
        readonly
        class="info laster"
        style=" color:#333;"
        is-link
      ></van-field>

      <van-field
        label-width="3rem"
        input-align="right"
        label-align="left"
        label="招待对象名称"
        placeholder="请输入招待对象名称"
        v-if="targetShow"
        v-model="entertainPlanBodyResp.epVisitObjectName"
        class="info obj"
        style=" color:#333; "
        @input="objFocus"
        @blur="objBlur"
      >
        <div class="search" slot="input">
          <van-search
            style="position:reletive;left:6rem;top:-10px;z-index:100;padding: 0px;"
            @input="objFocus"
            input-align="right"
            v-model="visitObjectName"
          />
        </div>
      </van-field>

      <van-card v-if="objflag">
        <van-list slot="title">
          <van-cell
            style="text-align:left;line-height:24px;padding:0px 15px;font-size:16px;"
            v-for="(item,index) of objlist"
            :key="index"
            @click="choose(item)"
          >
          <div slot="title" style="overflow:auto;height:1rem;line-height:1rem;">
            <span>{{item.name}}</span><br/>
            <!-- <span style="color:#979797;font-size:12px;">{{item.qccId}}</span> -->
          </div>
            <span
              v-if="item.sources === 2? true :false"
              slot="right-icon"
              style="color:#D75252;width:24px;height:15px;line-height:15px;border-radius:8px;border:1px solid rgba(215,82,82,1);text-align:center;font-size:12px;
            margin-top:10px;"
            >新</span>
          </van-cell>
          <div
            class="empty"
            style="text-align:center;font-size:16px;"
            v-if="objlistCode ==='success' && objlist.length === 0  ? true : false"
          >
            <p style="color:#000;margin: 24px 0">系统尚未查询到该结果，是否保存输入！</p>
            <van-button
              plain
              type="info"
              style="width:66px;height:30px;border-radius:30px;border:1px solid #4b77af;
                color:#4b77af;line-height:30px;"
            >确定</van-button>
          </div>
        </van-list>
      </van-card>

      <van-field
        label-width="100px"
        input-align="right"
        label-align="left"
        label="招待人数"
        placeholder="请输入招待人数"
        v-model="entertainPlanBodyResp.epNum"
        class="info laster"
        style="color:#333; "
      />

      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="预计费用"
        placeholder="请输入招待费用"
        v-model="entertainPlanBodyResp.epAmount"
        class="info laster"
        style=" color:#333;"
      />

      <!-- <van-field
        label-width="115px"
        label-align="left"
        label="部门"
        v-model="entertainPlanBodyResp.deptName"
        placeholder="请选择部门"
        @click="deptListPicker = true"
        is-link
        disabled
        class="info"
        style="color:#333;"
      />
      <van-field
        label-width="115px"
        label-align="left"
        label="营业店/子部门"
        v-model="entertainPlanBodyResp.shopName"
        placeholder="请选择营业店"
        @click="storeListPicker = true"
        is-link
        disabled
        class="info laster"
        style="color:#333;"
      /> -->

      <!-- 弹出类型 -->
      <van-popup v-model="typeShow" position="bottom" :style="{ height: '28%',bottom: '9%' }">
        <van-list>
          <van-cell
            style="text-align:center;line-height:26px"
            v-for="(item,index) of typeColumns"
            :key="index"
            :title="item.name"
            @click="chanceType(item)"
          />
        </van-list>
      </van-popup>
      <van-cell
        v-if="typeShow"
        title="取消"
        style="position:fixed;bottom:0px;z-index:10000;background: #DCDCDC;text-align:center;line-height:26px"
        @click="cancelType"
      />
      <!-- 部门下拉框 -->
      <van-popup v-model="deptListPicker" position="bottom">
        <van-picker
          readonly
          show-toolbar
          :columns="infoData.deptList"
          @cancel="deptListPicker = false"
          @confirm="deptListConfirm"
        />
      </van-popup>
      <van-popup v-model="storeListPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="storeColumns"
          @cancel="storeListPicker = false"
          @confirm="storeListConfirm"
        />
      </van-popup>
      <!-- <van-popup v-model="show" position="bottom" :style="{ height: '60%',background: '#f7f7f8' }">
        <Time @timedata="timedata" :getdata="getdata" />
        </van-popup> -->

      <!-- 提交按钮 -->
      <div class="footer" v-if="this.entertainPlanBodyResp.epStatus === 2 || this.entertainPlanBodyResp.epStatus === 3 ? false : true">
        <Button
          :title="delevetitle"
          @onclick="btndel"
          v-if="this.$route.query.id >0 ? true : false"
          style="height:50px;line-height:30px;width:50%;background-color: #fff;color:#D75252;font-weight: bold;font-size: 16px;border: 1px solid #fff;box-shadow: 0rem 0 0.266667rem 0 rgba(96, 156, 184, 0.5); "
        />
        <Button
          :title="submittitle"
          @onclick="btnsubmit"
          v-if="this.$route.query.id >0 ? true : false"
          style="height:50px;line-height:30px;width:50%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
        />
        <Button
          :title="submittitle"
          @onclick="btnsubmit"
          v-if="this.$route.query.id >0 ? false : true"
          style="height:50px;line-height:30px;width:100%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
        />
      </div>
    </van-cell-group>
    <!-- 招待回顾  -->
      <div v-if="this.entertainPlanReviewBodyResp.length === 0 ? false : true">
        <van-cell
          size="large"
          style="color:#333;font-weight:bold;padding:0 0 0 15px;background: #f4f4f4;"
        >
          <template slot="title">
            <div class="custom-title">招待回顾</div>
          </template>
        </van-cell>

        <van-field
          readonly
          class="info laster"
          style="color:#333;border-radius: 10px 10px 0 0;"
        >
          <div slot="input" class="review">
            <span>单号</span>
            <span>回顾日期</span>
            <span>实际费用</span>
            <span>访客记录</span>
          </div>
        </van-field>

        <van-field
          v-for="(item,index) of this.infoData.entertainPlanReviewBodyResp"
          :key="index"
          readonly
          class="info laster"
          style="color:#333;font-size:12px;"
        >
          <div slot="input" class="reviewinfo">
            <span
            @click="goServerReview(item)"
              style="width:15%;color:#007AFF;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
            >{{item.erBillNo}}</span>
            <span style="width:26%">{{item.erReviewDate}}</span>
            <span>{{item.erAmount}}</span>
            <span @click="govister(item)" style="color:blue">查看</span>
          </div>
        </van-field>
      </div>
  </div>
  </div>
</template>
<script>
import Vue from "vue";

import wx from "weixin-js-sdk"; // 引入企业微信的sdk
  import Button from "@/component/marketingManagement/button.vue";
export default {
  name: "travelPlan",
  components: {
    Button,
  },
  data() {
    return {
      loadFlag:true,//加载
      serveImgSrc:require("../../../static/imgs/travelPlan.svg"),
      getdata:'',
      infoData: {},
      entertainPlanBodyResp: {},
      entertainPlanReviewBodyResp:[],
      recordDate: "",
      popContent: "",
      showTime: false,
      num: "",
      typeColumns: [
        { name: "企业", code: 1 },
        { name: "个体户", code: 2 },
        { name: "自然人", code: 3 },
        { name: "政府机构/事业单位", code: 5 }
      ],
      typevalue: "",
      targetShow: false, //招待对象
      typeShow: false,
      emptyShow: false, //招待对象
      visitObjectName: "",
      objlist: null,
      objlistCode:'',
      objflag: false,
      defaultDate: new Date(), //时间弹框
      show: false,
      calendarShow: false,
      timeflag: true,
      startTime:'',
      endTime:'',
      //下拉
      storeColumns: [],
      deptListPicker: false,
      storeListPicker: false,
      storeListCode: "",
      listCode: "",
      delevetitle: "删除", //按钮
      submittitle: "保存",
      //切换
      startX:'',
      moveEndX:'',
    };
  },
  created() {
    document.title = "招待计划";
    this.init();
  },
  methods: {
    //初始化
    init() {
      // let tdata = this.getXDate(this.$route.query.year,49)
      // this.startTime = tdata.substr(0,10)
      // this.endTime = tdata.substr(12,22)
      this.endTime = this.getBeforeDate(6)
      this.startTime = this.$route.query.startDate
        let par = this.$route.query.id
        this.$getData
        .servePlanFind({
          method: "post",
          data: {
            epId: par
          }
        })
        .then(res => {
          this.loadFlag = false;
          this.infoData = res.data;
          this.entertainPlanBodyResp = this.infoData.entertainPlanBodyResp;
          this.entertainPlanReviewBodyResp = this.infoData.entertainPlanReviewBodyResp
          this.visitObjectName = this.entertainPlanBodyResp.epVisitObjectName
          if(this.$route.query.id === "" || this.$route.query.id === null){
          this.entertainPlanBodyResp.epAmount = null
          } else{
            this.entertainPlanBodyResp.epPlanDate = this.$moment(this.entertainPlanBodyResp.epPlanDate).format("YYYY-MM-DD");
            this.targetShow = true
          }

          if (this.infoData.entertainPlanBodyResp.epSubjectType === 1) {
            this.typevalue = "企业";
          } else if (this.infoData.entertainPlanBodyResp.epSubjectType === 2) {
            this.typevalue = "个体户";
          } else if (this.infoData.entertainPlanBodyResp.epSubjectType === 3) {
            this.typevalue = "自然人";
          } else if (this.infoData.entertainPlanBodyResp.epSubjectType === 5) {
            this.typevalue = "政府机构/事业单位";
          }
        });
    },
    onClickLeft() {
      let data = this.$route.query
          this.$router.push(
          {
            name:'travelPlan',
            query:this.$route.query

          })
    },
    //取消
    onClickRight(){
      this.$router.push('/workPlan')
    },

    //类型改变
    //   typeChange(value){
    //       console.log(value)
    //   },
    chanceType(value) {
      this.visitObjectName = null
      this.entertainPlanBodyResp.epVisitObjectId = null
      this.typevalue = value.name;
      this.entertainPlanBodyResp.epSubjectType = value.code;
      if (this.typevalue === undefined) {
        this.targetShow = false;
      } else {
        this.targetShow = true;
        if (this.typevalue === []) {
          this.emptyShow = true;
        } else {
          this.emptyShow = false;
        }
      }
      this.typeShow = false;
    },
    //点击取消
    cancelType() {
      this.typeShow = false;
    },
    //滑动跳转
      touchstart() {
      // event.preventDefault() //阻止默认事件（长按的时候出现复制）

      this.startX = event.changedTouches[0].pageX
},
      touchend(){
      },

      touchmove() { // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
      // event.preventDefault()
      this.moveEndX = event.changedTouches[0].pageX
      // console.log(this.moveEndX-this.startX)
      if(this.moveEndX-this.startX<-150){
        this.$router.push('/workPlan')
      } else if(this.moveEndX-this.startX > 150){
        this.$router.push(
          {
            name:'travelPlan',
            query:this.$route.query

          })
      }
    },
    //申请日期
    applyTime() {
      this.show = true;
      this.calendarShow = true;
    },
    //组件传值
      timedata(data){

        this.entertainPlanBodyResp.epPlanDate = data
          this.show = false;
      },
    //时间插件改变
    handelChange(date){
      this.entertainPlanBodyResp.epPlanDate = this.$moment(new Date(date.$d)).format("YYYY-MM-DD");
    },
    // handelChange(date) {
    //   //   this.getWeekOfYear(date.$d);
    //   // this.year = date.$y;
    //   this.defaultDate = date.$d;
    //   date = this.$moment(this.defaultDate).format("YYYY-MM-DD");
    //   // this.getDefault(date + 1);
    //   this.entertainPlanBodyResp.epPlanDate = date;
    //   this.timeflag = false;
    // },

    //下拉框
    showsType() {
      this.deptListPicker = true;
    },
    deptListConfirm(value) {
      this.deptListPicker = false;
      this.entertainPlanBodyResp.deptName = value.text;
      this.entertainPlanBodyResp.deptId = value.id;
      for (let i in this.infoData.deptList) {
        if (this.infoData.deptList[i].text === value.text) {
          this.listCode = i;
        }
      }
      this.storeColumns = this.infoData.deptList[this.listCode].shopList;
      if (value !== "") {
        this.infoData.storeName = "";
      }
    },
    storeListConfirm(value) {
      this.storeListPicker = false;
      this.entertainPlanBodyResp.shopName = value.text;
      this.entertainPlanBodyResp.shopId = value.id;
    },
    //招待对象名称展示
    objFocus(value) {
      if(value !== ""){
        this.objflag = true;
      this.$getData
        .travelPlanSearch({
          method: "post",
          data: {
            visitType: this.entertainPlanBodyResp.epSubjectType,
            name: this.visitObjectName
          }
        })
        .then(res => {
          this.objlist = res.data;
          this.objlistCode = res.msg
        });
      } else{
        this.objflag = false;
      }

    },
    objBlur() {
      this.objflag = false;
    },
    //对象选择
    choose(vel) {
      this.entertainPlanBodyResp.epVisitObjectId = vel.id;
      this.entertainPlanBodyResp.epVisitObjectName = vel.name;
      this.visitObjectName = vel.name;
      this.objflag = false;
    },
    //回顾
    goServerReview(item){
      this.$router.push(
        {
          path:"/serveReview",
          query: {id:item.erId},
        }
      );
    },
    govister(item) {
      this.$router.push(
        {
          name:"visitorDetail",
          query: {id:item.erVisitorRecordId,type:'readonly'},
        }
      );
    },
    btndel() {
      let par = this.$route.query.id
      this.$getData
        .servePlanDel({
          method: "post",
          data: {
            epId: par
          }
        })
        .then(res => {
          if(res.code === 200){
            this.tips('删除成功')
          } else{
            this.$toast('删除失败')
          }
        });
    },
    //校验
    check(){
      let flag = false
      let reg = /^[1-9]\d{0,3}$/;//正整数
      let rag = /(^[0-9]\d{0,4}$)|(^\.\d{1,2}$)|(^[0-9]\d{0,4}\.\d{1,2}$)|(^100000(\.0{1,2}){0,1}$)/;
      if(this.entertainPlanBodyResp.epPlanDate === undefined || this.entertainPlanBodyResp.epPlanDate === null){
            this.$toast('请选择申请日期')
        } else if(this.typevalue === ""){
            this.$toast('请输入招待类型')
        } else if(this.visitObjectName === "" || this.visitObjectName === null){
            this.$toast('请输入招待对象名称')
        } else if(this.entertainPlanBodyResp.epNum === undefined || this.entertainPlanBodyResp.epNum === null){
            this.$toast('请输入招待人数')
        } else if(!reg.test(this.entertainPlanBodyResp.epNum)){
            this.$toast('招待人数最大4位')
        }
         else if(this.entertainPlanBodyResp.epAmount === undefined || this.entertainPlanBodyResp.epAmount === null){
            this.$toast('请输入预计费用')
        } else if(!rag.test(this.entertainPlanBodyResp.epAmount)){
            this.$toast('预计费用不能超过十万')
        }
        else{
          flag = true
          return flag
        }
    },
    tips(name){
      this.$toast({
          message: name,
          forbidClick: true,
          duration: 1000
        });
        let that = this
        setTimeout(function () {
      //要延时执行的代码
      that.$router.push('/workplan')
      }, 1000) //延迟时间
    },
    btnsubmit() {
      this.check()
      let flag = this.check()
      if(flag === true){
        this.entertainPlanBodyResp.epVisitObjectName = this.visitObjectName;
      this.infoData.entertainPlanBodyResp = this.entertainPlanBodyResp;
      if(this.$route.query.id === null){
      this.infoData.entertainPlanBodyResp.weekNo = this.$route.query.weekNum
      this.infoData.entertainPlanBodyResp.year = this.$route.query.year
      this.infoData.entertainPlanBodyResp.nextWeekStartDate = this.$route.query.startDate;
      this.infoData.entertainPlanBodyResp.erVisitorRecordId = this.$route.query.erVisitorRecordId;
      this.infoData.entertainPlanBodyResp.epVisitorObjectId = this.entertainPlanBodyResp.epVisitObjectId
      // this.infoData.entertainPlanBodyResp.erVisitorObjectName = this.$route.query.erVisitorObjectName
      let par = this.infoData.entertainPlanBodyResp;
      this.$getData
        .servePlanSave({
          method: "post",
          data: par
        })
        .then(res => {
          if(res.code === 200){
            this.tips('保存成功')
          } else{
            this.$toast('保存失败')
          }
        });
      } else{
        this.infoData.entertainPlanBodyResp.epId = this.$route.query.id
      let par = this.infoData.entertainPlanBodyResp;
      this.$getData
        .servePlanUpdate  ({
          method: "post",
          data: par
        })
        .then(res => {
          if(res.code === 200){
            this.tips('保存成功')
          } else{
            this.$toast('保存失败')
          }
        });
      }
      }
    },
    //获取开始日期后n天
    getBeforeDate(n){
  var date = new Date(this.$route.query.startDate) ;
  var year,month,day ;
  date.setDate(date.getDate()+n);
  year = date.getFullYear();
  month = date.getMonth()+1;
  day = date.getDate() ;
  let s = year + '-' + ( month < 10 ? ( '0' + month ) : month ) + '-' + ( day < 10 ? ( '0' + day ) : day) ;
  return s ;
},

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
.servePlan {
  background: #f4f4f4;
  height: 100%;
  overflow: auto;
}
.noclick {
      pointer-events: none;
    }
//导航栏
.van-nav-bar{
  width: 100%;
  position: fixed;
  top: 0;
}
.van-cell-group{
  padding-top: 56px;
  background: #F4F4F4;
}
.van-nav-bar__title {
  color: #333;
  font-weight: bold;
}
//箭头
.van-nav-bar .van-icon {
  color: #4b77af;
  font-size: 24px;
}
//内容
.van-cell {
  font-size: 14px;
  color: #333;
}
/*new add style*/
  /deep/ .van-field__label {
    padding: 2px 0;
  }
  /deep/ .van-field__control--right{
    padding: 2px 0;
  }
  /deep/ .van-icon {
    padding: 2px 0 0 0;
  }
.obj .van-cell {
  padding-top: 0px;
}
/deep/.obj .van-icon{
  padding-right: 10px;
}

/deep/.info .van-field__label {
  position: relative;
}
//禁用
.info /deep/.van-field__control:disabled {
  color: #333;
}
//卡片
.van-card {
  position: absolute;
  z-index: 100;
  width: 90%;
  background: #fff;
  box-shadow: 0rem 0 0.266667rem 0 rgba(96, 156, 184, 0.5);
  margin: 0px 0 5px 5%;
  height: 156px;
  overflow: auto;
}
//日期
.dataIcon {
  color: #4b77af;
  font-size: 20px;
}
//招待对象
/deep/.search .van-cell__value{
  padding: 0px;
}
/deep/.search .van-field__body{
  height: 100%;
}
 /deep/.search .van-search .van-cell{
    padding:0;
    height: 20px;
  }
/deep/.search .van-search {
  padding: 0px;
  line-height: 30px;
}
/deep/.search .van-search__content {
  background: #fff;
}
/deep/.search .van-field__left-icon {
  display: none;
}
//招待回顾
.review {
  font-size: 16px;
  display: flex;
  justify-content: space-around;
}
.reviewinfo {
  display: flex;
  justify-content: space-around;
  text-align: center;
  span {
    width: 20%;
    overflow: hidden;
  }
}
//标题
.custom-title{
  height: 40px;
  line-height: 40px;
}
//提交按钮
.footer {
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0px;
}
</style>
