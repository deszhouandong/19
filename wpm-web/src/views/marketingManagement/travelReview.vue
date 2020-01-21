<template>
  <div class="travelReview" @touchend="touchend" @touchmove="touchmove" @touchstart="touchstart">
    <van-popup v-model="loadFlag" >
      <van-loading class="load" size="24px" vertical >加载中...</van-loading>
    </van-popup>
    <div  v-if="!loadFlag">
      <!-- 导航栏 -->
      <van-nav-bar
        @click-right="onClickRight"
        style="color:#333;margin-bottom:10px;margin-bottom:10px;"
      >
      <div slot="left" @click="onClickLeft" v-if="!this.query.id && !this.query.isTravelReview" >
        <van-icon name="arrow-left"  style="color:#4B77AF;padding-bottom: 0.05rem;" />
        <span style="color:#007AFF;padding-top:0.2rem;font-size:0.426667rem;">回顾明细</span>
      </div>
      <div slot="left" @click="onClickLeft" v-if="!this.query.id  && this.query.isTravelReview">
        <span style="color:#007AFF;padding-top:0.2rem;font-size:0.426667rem;">取消</span>
      </div>
      <div slot="right" v-if="this.query.id > 0 ? false : true">
        <span style="color:#007AFF;padding-top:0.2rem;font-size:0.426667rem;">招待回顾</span>
        <van-icon name="arrow"  style="color:#4B77AF;padding-bottom: 0.05rem;" />
      </div>
      <div slot="title" v-if="this.query.id > 0 ? false : true">出差回顾</div>
      <div slot="title"  class="navTit" v-if="this.query.id > 0 ? true : false">
        <div style="width:100%;">
          <div style="line-height:16px;margin-top:0.15rem;" >出差回顾</div>
      <div style="height:16px;line-height:16px;font-weight:normal;font-size:12px;padding-top:0.05rem;"
      >{{reviewBody.wrBillNo}}</div>
        </div>
      </div>
      </van-nav-bar>
    <van-cell-group :class="this.reviewBody.wrSatus === 2 || this.reviewBody.wrSatus === 3 ? 'noclick' : ''">
      <!-- 出差计划 -->
      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="回顾日期"
        v-model="reviewBody.wrReviewDate"
        readonly
        style="color:#444;"
      >
      </van-field>

      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="出差计划"
        readonly
        style="color:#333;position:reletive"
      >
      <div slot="right-icon">
        <van-radio-group v-model="reviewBody.wrTripStatus" class="traPlan">
        <van-radio name="1" :class="this.reviewBody.wrTripStatus === 1 ? 'planradio' : 'notick'" @click="radioClick">出差</van-radio>
        <van-radio name="2" :class="this.reviewBody.wrTripStatus === 2 ? 'planradio' : 'notick'" @click="notickClick">未出差</van-radio>
      </van-radio-group>
      </div>
      </van-field>
      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="实际费用"
        placeholder="请输入实际费用"
        v-model="reviewBody.wrAmount"
        style="color:#333; "
      />
      <!-- <van-field
        label-width="115px"
        label-align="left"
        label="部门"
        v-model="reviewBody.deptName"
        placeholder="请选择部门"
        @click="showsType('businessValue')"
        is-link
        disabled
        class="info"
        style="padding:0rem; color:#333;"
        />
        <van-field
        label-width="115px"
        label-align="left"
        label="营业店/子部门"
        v-model="reviewBody.shopName"
        placeholder="请选择营业店"
        @click="storeListPicker = true"
        is-link
        disabled
        class="info laster"
        style="padding:0rem; color:#333;"
        /> -->

      <div class="txtReason">
        <p>备注</p>
        <van-field
        type="textarea"
        placeholder="请输入备注"
        v-model="reviewBody.wrReason"
        class="txtarea"
        rows="4"
        maxlength="200"
      />
      </div>

      <!-- 出差计划 -->
      <div  class="objRw" v-if="!(planBody.wpId === null)">
         <van-cell size="large" style="color:#333;font-weight:bold;padding:0 0 0 15px;background: #f4f4f4;">
          <template slot="title">
            <div class="custom-title">出差计划</div>
          </template>
        </van-cell>
        <van-field
        input-align="right"
        label-width="100px"
        label-align="left"
        label="出差日期-起"
        v-model="planBody.wpStartDate"
        readonly
        style="color:#333;"
      >
      </van-field>

      <van-field
        label-width="100px"
        input-align="right"
        label-align="left"
        label="出差日期-止"
        v-model="planBody.wpEndDate"
        readonly
        style="color:#333;"
      >
      </van-field>

      <van-field
        label-width="100px"
        input-align="right"
        label-align="left"
        label="预计费用"
        readonly
        v-model="planBody.wpAmount"
        style="color:#333; "
      />
      <!-- 拜访对象 -->
      <van-cell size="large" style="color:#333;font-weight:bold;padding:0 0 0 15px;background: #f4f4f4;">
          <template slot="title">
            <span class="custom-title">拜访对象</span>
          </template>
        </van-cell>
        
      <div v-for="(item,index) of planBody.visitObjects" :key="index">
        <van-field
        label-width="100px"
        input-align="right"
        label-align="left"
        label="地点"
        readonly
        v-model="item.location"
        style="color:#333; "
      />
      <van-field
        label-width="100px"
        input-align="right"
        label-align="left"
        label="类型"
        readonly
        v-model="item.subjectType"
        style="color:#333; "
      />
      <van-field
        label-width="100px"
        input-align="right"
        label-align="left"
        label="拜访对象"
        readonly
        v-model="item.visitObjectName"
        style="color:#333; "
      />
      </div>

      </div>
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
    <!-- 出差类型 -->
        <van-popup v-model="travelshow" position="bottom">
          <van-list>
            <van-cell
                style="text-align:center;line-height:26px"
                v-for="(item,index) of travelColumns" :key="index"
                :title="item.name"
                @click="chanceType(item)"
            />
            </van-list>
        </van-popup>
      <!-- 提交按钮 -->
        <div class="footer"  v-if="this.reviewBody.wrSatus === 2 || this.reviewBody.wrSatus === 3 ? false : true">
          <Button :title ="delevetitle" @onclick="btndel"
          v-if="this.query.id >0 ? true : false"
          style="height:50px;line-height:30px;width:50%;background-color: #fff;color:#D75252;font-weight: bold;font-size: 16px;border: 1px solid #fff;box-shadow: 0rem 0 0.266667rem 0 rgba(96, 156, 184, 0.5); "
          />
        <Button :title ="submittitle" @onclick="btnsubmit"
        v-if="this.query.id >0 ? true : false"
        style="height:50px;line-height:30px;width:50%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
        />
        <Button :title ="submittitle" @onclick="btnsubmit"
        v-if="this.query.id >0 ? false : true"
        style="height:50px;line-height:30px;width:100%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
        />
        </div>
    </van-cell-group>
  </div>
  </div>
</template>
<script>
import Vue from "vue";
import wx from "weixin-js-sdk"; // 引入企业微信的sdk
  import Button from "@/component/marketingManagement/button.vue";
export default {
  name: "travelPlan",
  components:{
        Button,
    },
  data() {
    return {
      query: this.$route.query,
      navFlag:false,
      loadFlag:true,
      radio:1,
      infoData: {},
      planBody:{},
      reviewBody:{},
      timeflag:false,//时间图标
      recordDate: "",
      popContent: "",
      showTime: false,
      num: "",
      list:[1,1],
      defaultDate: new Date(),
      show:false,
      calendarShow:false,
      typevalue:'',//出差计划类型
      btnflag: false,
      travelshow:false,//出差类型下拉
      travelColumns:[{name:"出差",code:1},{name:"未出差",code:2}],
      wpId:true,//判断是否存在计划
      objflag:true,
      //时间
      showTime: false,//控件
      timeflag:true,//图标
      //下拉
      storeColumns: [],
      deptListPicker: false,
      storeListPicker: false,
      storeListCode: '',
      listCode: '',
      delevetitle: "删除",//按钮
      submittitle: "保存",
      //切换
      startX:'',
      moveEndX:'',
    };
  },
  created() {
    this.init()
    document.title = "出差回顾";
  },
  methods: {
      init(){
        this.navFlag = this.query.isTravelReview
        let par = this.query
      par.id = this.query.id?this.query.id:null;
      par.startDate = this.query.startDate;
      par.weekNum = this.query.weekNum;
      par.year = this.query.year;
        this.$getData
        .travelReviewFind({
          method: "post",
          data: {
            "wrId": par.id,
            "reviewDate":par.startDate,
            "weekNum":par.weekNum,
            "year":par.year,

          }
        })
        .then(res => {
          this.loadFlag = false;
          this.infoData = res.data
          this.planBody = this.infoData.planBody
          this.reviewBody = this.infoData.reviewBody
           if(!this.query.id){
            this.infoData.reviewBody.wrReviewDate = this.$moment(new Date()).format("YYYY-MM-DD")
            this.reviewBody.wrAmount = 0
          } else{
            this.infoData.reviewBody.wrReviewDate = this.$moment(res.data.reviewBody.wrReviewDate).format("YYYY-MM-DD")
          }
          if(this.planBody.wpId === null || this.planBody.wpId === 0){
            this.wpId = false
          } else{
            this.wpId = true
          }
          if(this.infoData.reviewBody.wrTripStatus === 1){
            this.typevalue = "出差"
          } else if(this.infoData.reviewBody.wrTripStatus === 2){
            this.typevalue = "未出差"
          }
        });
    },
      onClickRight(){
          this.$router.push(
          {
            name:'serveReview',
            query:this.query

          })
      },
      onClickLeft(){
        if(!this.query.id && !this.query.isTravelReview){
          this.$router.push(
          {
            name:'reviewDetail',
            query:this.query

          })
        }else if(!this.query.id  && this.query.isTravelReview) {
            this.$router.push('/workPlan')
          }
      },

     //滑动跳转
      touchstart() {
        this.startX = event.changedTouches[0].pageX
      },
      touchend(){
      },

      touchmove() { // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
        // event.preventDefault()
        this.moveEndX = event.changedTouches[0].pageX
        if(this.moveEndX-this.startX<-150){
          this.$router.push(
            {
              name:'serveReview',
              query:this.query

            })
        } else if(this.moveEndX-this.startX > 150){
          if(!this.query.id && !this.query.isTravelReview){
          this.$router.push(
            {
              name:'reviewDetail',
              query:this.query

            })
          }else if(!this.query.id && this.query.isTravelReview) {
            // this.$router.push('/workPlan')
          }
        }
      },

      //出差类型
      chanceType(value){
        this.reviewBody.wrTripStatus = value.code
        this.typevalue = value.name
        this.travelshow = false
    },
      //下拉框
    showsType(){
        this.deptListPicker = true
    },
    //单选框
    radioClick(){
      this.reviewBody.wrTripStatus = 1
    },
    notickClick(){
      this.reviewBody.wrTripStatus = 2
    },
    deptListConfirm(value){
        this.deptListPicker = false
        this.reviewBody.deptName = value.text
        this.reviewBody.deptId = value.id
        for (let i in this.infoData.deptList) {
            if(this.infoData.deptList[i].text === value.text){
                this.listCode = i
            }
      }
      this.storeColumns = this.infoData.deptList[this.listCode].shopList
      if(value !== ""){
        this.infoData.storeName = ""
      }
    },
    storeListConfirm(value){
        this.storeListPicker = false
        this.reviewBody.shopName = value.text
        this.reviewBody.shopId = value.id
    },
    btndel(){
      let par = this.query.id
      this.$getData
        .travelReviewDel({
          method: "post",
          data: {
            "wrId":par
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
    getobj(vel){
      let data = ''
      if(vel === 1){
        data = "企业"
      } else if(vel === 2){
        data = "个体户"
      } else if(vel === 3){
        data = "自然人"
      } else if(vel === 5){
        data = "政府机构/事业单位"
      }
      return data
    },
    
    //校验
    check(){
      let flag = false
      var reg = /^[1-9]\d{0,3}$/;//正整数
      let rag = /(^[0-9]\d{0,4}$)|(^\.\d{1,2}$)|(^[0-9]\d{0,4}\.\d{1,2}$)|(^100000(\.0{1,2}){0,1}$)/;
      if(this.reviewBody.wrReviewDate === null || this.reviewBody.wrReviewDate === ""){
            this.$toast('请选择回顾时间')
        } else if(this.reviewBody.wrTripStatus === null || this.reviewBody.wrTripStatus === ""){
            this.$toast('请选择出差类型')
        } else if(this.reviewBody.wrAmount === null || this.reviewBody.wrAmount === ""){
            this.$toast('请输入实际费用')
        } else if(!rag.test(this.reviewBody.wrAmount)){
            this.$toast('实际费用不能超过十万')
        }
            else if(this.reviewBody.wrAmount > 0 && (this.reviewBody.wrReason ==='' || this.reviewBody.wrReason === null)){
            this.$toast('请输入备注')
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
    btnsubmit(){
      this.check()
      let flag = this.check()
      if(flag === true){
      this.infoData.planBody = this.planBody
      this.reviewBody.wrId = this.query.id
      this.reviewBody.wpId = this.infoData.planBody.wpId
      let par = this.infoData.reviewBody

      this.$getData
        .travelReviewSave({
          method: "post",
          data: par
        })
        .then(res => {
          if(res.code === 200){
            this.tips('保存成功')
          }
        });
    }
    }
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
.travelReview{
    background: #f4f4f4;
    height: 100%;
    overflow: auto;
}
.noclick {
      pointer-events: none;
    }
.van-cell-group{
  padding-top: 56px;
  background: #F4F4F4;
}
.van-nav-bar{
  width: 100%;
  position: fixed;
  top: 0;
}
//导航栏
.van-nav-bar__title {
  color: #333;
  font-weight: bold;
}
.rwTit{
  padding-top: 20px;
}
.navTit{
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
}
//箭头
.van-nav-bar .van-icon{
    color: #4b77af;
    font-size: 24px;
}
/deep/ .van-field__label {
    padding: 2px 0;
  }
  /deep/ .van-field__control--right{
    padding: 4px 10px;
  }
//内容
.van-cell {
  font-size: 14px;
  color: #333;
}
/deep/.info .van-cell__value {
  padding-right: 15px;
}

/deep/.info .van-field__label {
  position: relative;
  padding-left: 15px;
}
/deep/.fpx .van-field__control{
  color:#007AFF;
}
 //备注
  .txtReason{
    background-color: #fff;
    color: #333;
    p{
      font-size: 16px;
      padding: 10px 0 0 16px;
    }
  }
   .txtarea /deep/.van-field__body{
    line-height: 25px;
    padding: 0px 10px 0 5px;
    height: 110px;
    border: 1px solid #ebedf0;
    overflow: auto;
  }
//禁用
.info /deep/.van-field__control:disabled{
    color: #333;
}
/deep/.info .van-cell__right-icon{
  margin-top: 0.4rem;
}
//日期
.dataIcon {
  color: #4b77af;
  font-size: 20px;
}

//出差计划
.objRw{
  padding-bottom: 3rem;
}
.traPlan{
  font-size: 14px;
  position: relative;
  width: 150px;
  display: flex;
  justify-content: space-around;
  line-height: 52px;
}
/deep/.traPlan .van-radio__icon{
  display: none;
}
/deep/.traPlan .planradio .van-radio__label{
  background: #4B77AF;
  color: #fff;
  width: 54px;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #4B77AF;
  border-radius: 13px;
}
/deep/.traPlan .notick .van-radio__label{
  background: #fff;
  color: #4B77AF;
  width: 54px;
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #4B77AF;
  border-radius: 13px;
}
//拜访对象
  .objTitle{
    display: flex;
    justify-content: space-around;
    background:rgba(75,119,175,0.3);
    font-size: 16px;
    color: #333;
    height: 42px;
    align-items: center;
    border-radius: 10px 10px 0 0;
  }
  .addText{
    font-size: 12px;
    color: #007AFF;
    position: absolute;
    right:30px;
  }
//对象
.obj{
  display: flex;
}
.objadd{
  padding: 10px 0;
}
.obj-ame{
  display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1;
overflow: hidden;
width: 100%;
}
//异地按钮
.btn {
  background-color: #4b77af;
  font-size: 12px;
  width: 54px;
  height: 24px;
  line-height: 24px;
  border-radius: 12px;
  border: none;
  padding: 0;
}
//标题
.custom-title{
  height: 40px;
  line-height: 40px;
}
//提交按钮
.footer {
  padding-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom:0px;
  z-index: 100;
}
</style>
