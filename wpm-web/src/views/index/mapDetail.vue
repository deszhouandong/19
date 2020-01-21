<template>
  <div class="punch">
    <PunchDate @getDateHandler="getDateHandler" />
    <!-- 地图 -->
    <div class="baidumap-wrap">
      <div class="baidumap" id="allmap"></div>
    </div>

    <!-- 个人详情列表 -->
    <div class="content flexall">
      <van-cell
        :title="attendanceList.personName"
        title-style="color:#4B77AF;width:60px;"
        style="position:relative"
        class="tell-wrap"
      >
      {{attendanceList.orgUnitName}}
      <a :href="'tel:' + attendanceList.cellPhone"
        style="position:absolute;right:0"
      >
        <!-- <van-icon
          name="phone"
          color="#4B77AF"
          size="25px"
          style="float: right;margin-top: -35px;margin-right: 15px"
        />-->
        <img
          :src="dianhuaImgUrl"
          alt
          style="margin:0 15px 0 0;float:right;width:24px"
        />
      </a>
      </van-cell>

      <!-- 打卡记录 -->
      <van-tabs v-model="active" class="flex" color="#1989fa" @disabled="onClickDisabled()" @click="changeTab">
        <van-tab title="打卡记录">
          <van-steps direction="vertical" :active="0" active-color="#151515" active-icon="checked">
            <div class="go">
              <van-step v-for="(item,index) in individualCardingRespList" :key="index">
                <div
                  @click="goAbnormal(item.id,item.comfirmType,item.excptionTime,item.appealStatus,item.dayTime)"
                  :class="(item.comfirmType == 'CONFIRMED' || item.comfirmType == 'VACATION' && item.excptionTime == 'ABNORMAL') ? 'abnormalStatus' : 'unconfirmedStatus'"
                >
                  <p
                    style="float:right;margin:0;"
                    v-if="item.comfirmType == 'CONFIRMED'"
                  >{{status[item.checkinStatus]||status[item.abnormalCheckinStatus] }}</p>
                  <p>{{item.clockDateToStr}}</p>
                  <p style="word-break:break-all">{{item.name}}</p>
                  <p style="float:right;margin:0;">{{item.appealStatus}}</p>
                  <p v-if="item.comfirmType == 'UNCONFIRMED'">
                    {{item.comfirmTimeToStr}}
                    {{status[item.comfirmType]}}
                  </p>
                  <p v-else>
                    {{item.comfirmTimeToStr}}
                    <span>{{item.leaderName}}</span>
                    {{status[item.comfirmType]}}
                  </p>
                </div>
              </van-step>
            </div>
          </van-steps>
        </van-tab>
        <van-tab title="计划与回顾">
          <ul class="main">
            <li>
              <div class="title">
                <span>工作计划</span>
              </div>
              <div class="itemUp itemText">
                <div class="itemTextTitle">上午</div>
                <textarea
                  v-if="workPlan.dworkPlanDesAm"
                  v-model="workPlan.dworkPlanDesAm"
                  cols="50"
                  rows="2"
                  readonly="readonly"
                  class="workPlan"
                  :placeholder="workPlan.dworkPlanDesAm"
                  @click="clickTextarea(workPlan.dworkPlanDesAm)"
                ></textarea>
                <textarea
                  v-else
                  readonly="readonly"
                  cols="50"
                  rows="2"
                  class="workPlan"
                  @click="clickTextarea(workPlan.dworkPlanDesAm)"
                >暂无数据</textarea>
              </div>
              <van-divider dashed style="margin:0"></van-divider>
              <div class="itemDown itemText">
                <div class="itemTextTitle">下午</div>
                <textarea
                  v-if="workPlan.dworkPlanDesPm"
                  v-model="workPlan.dworkPlanDesPm"
                  cols="50"
                  rows="2"
                  readonly="readonly"
                  class="workPlan"
                  :placeholder="workPlan.dworkPlanDesPm"
                  @click="clickTextarea(workPlan.dworkPlanDesPm)"
                ></textarea>
                <textarea
                  v-else
                  cols="50"
                  rows="2"
                  class="workPlan"
                  @click="clickTextarea(workPlan.dworkPlanDesPm)"
                  readonly="readonly"
                >暂无数据</textarea>
              </div>
            </li>
            <li>
              <div class="title">
                <span>工作回顾</span>
              </div>
              <div class="itemUp itemText">
                <div class="itemTextTitle">上午</div>
                <textarea
                  v-if="workPlan.dworkReviewDesAm"
                  v-model="workPlan.dworkReviewDesAm"
                  readonly="readonly"
                  cols="50"
                  rows="2"
                  class="workPlan"
                  :placeholder="workPlan.dworkReviewDesAm"
                  @click="clickTextarea(workPlan.dworkReviewDesAm)"
                ></textarea>
                <textarea
                  cols="50"
                  rows="2"
                  v-else
                  readonly="readonly"
                  class="workPlan"
                  @click="clickTextarea(workPlan.dworkReviewDesAm)"
                >暂无数据</textarea>
              </div>
              <van-divider dashed style="margin:0"></van-divider>
              <div class="itemDown itemText">
                <div class="itemTextTitle">下午</div>
                <textarea
                  v-if="workPlan.dworkReviewDesPm"
                  v-model="workPlan.dworkReviewDesPm"
                  cols="50"
                  rows="2"
                  readonly="readonly"
                  class="workPlan"
                  :placeholder="workPlan.dworkReviewDesPm"
                  @click="clickTextarea(workPlan.dworkReviewDesPm)"
                ></textarea>
                <textarea
                  cols="50"
                  rows="2"
                  v-else
                  readonly="readonly"
                  class="workPlan"
                  @click="clickTextarea(workPlan.dworkReviewDesPm)"
                >暂无数据</textarea>
              </div>
            </li>
          </ul>
        </van-tab>
        <van-tab title disabled></van-tab>
        <van-tab title="查看更多" disabled></van-tab>
        <!-- <van-tab title ></van-tab> -->
      </van-tabs>
    </div>

    <!-- 弹出层 -->
    <van-popup
      v-model="popupShow"
      style="padding:10px;width:100%;height:100%;"
      @click="()=>{this.popupShow = false;}"
    >
      <!-- <div id="myPopup"> -->
      <ul class="main" style="padding:15px;font-size:14px;">
        <li>
          {{popupDate}}
          <van-divider />
          <div>{{popTxt}}</div>
        </li>
      </ul>

      <!-- </div> -->
    </van-popup>
  </div>
</template>
<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script>
import PunchDate from "@/component/punch/PunchDate";

import Vue from "vue";
import { Toast,Dialog } from "vant";

Vue.use(Toast);
export default {
  name: "mapDetail",
  components: {
    PunchDate
  },
  data() {
    return {
      dianhuaImgUrl:require('../../../static/imgs/dianhua.svg'),
      currrentTime: "",
      show: false,
      currentYear: 1970, // 年份
      currentMonth: 1, // 月份
      currentDay: 1, // 日期
      currentWeek: 1, // 星期
      days: [],
      calendarShow: false,
      defaultDate: "",
      checkinDateId: "",
      active: 0,
      chooseAdAcount: "",
      attendanceList: [],
      status: {},
      chooseDate: "",
      abnomalAdAcounts: "",
      individualCardingRespList: "",
      title: "",
      value: "",
      adAcount: "",
      workPlan: [], //工作计划与回顾
      datTime:
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1) +
        "-" +
        new Date().getDate(),
      adAccId: "",
      popupShow: false, //弹窗层
      popupDate: "",
      popTxt: ""
    };
  },
  created() {
    // this.initData(null);
    document.title = "在线考勤";
    this.load();
    this.getToDate();
  },
  watch: {
    $route: "load"
  },
  mounted() {
    // this.getCardingRecords();
  },
  methods: {
    // 打卡记录、计划与回顾 tab切换
    changeTab() {
      this.implement();
    },
    implement() {
      if (this.active) {
        this.getWorkPlan();
      } else {
        this.getCardingRecords();
      }
    },
    getDateHandler(chooseDate) {
      this.chooseDate = chooseDate;
      this.implement();
      // this.getInitial()
    },

    load() {
      this.chooseAdAcount = this.$route.query["abnomalAdAcount"];
      this.adAcount = this.$route.query["adAcount"];
      this.chooseDate = new Date(this.$route.query["chooseDate"] / 1);
      this.abnomalAdAcounts = this.$route.query["abnomalAdAcount"];
      this.getCardingRecords(this.chooseDate);
      // this.getWorkPlan();
    },
    //解析打卡考勤页面传来的时候为空
    getToDate() {
      let chooseDate = new Date(this.$route.query["chooseDate"] / 1);
      chooseDate = chooseDate ? new Date(chooseDate) : new Date();
      if (chooseDate) {
        this.currentDay = chooseDate.getDate();
      }
    },
    //绘制百度地图
    baiduMap() {
      let _self = this;
      var map = new BMap.Map("allmap"); // 创建地图实例
      var point = new BMap.Point(121.465978, 31.174226); // 创建点坐标
      map.centerAndZoom(point, 13); // 初始化地图，设置中心点坐标和地图级别
      // map.setCurrentCity("上海");
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          // 定位成功事件
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            for (let i = 0; i < _self.individualCardingRespList.length; i++) {
              if (_self.individualCardingRespList[i].lat) {
                var marker = new BMap.Marker(
                  new BMap.Point(
                    _self.individualCardingRespList[i].lng,
                    _self.individualCardingRespList[i].lat
                  )
                );
                var point = new BMap.Point(
                  _self.individualCardingRespList[i].lng,
                  _self.individualCardingRespList[i].lat
                );
                map.addOverlay(marker);
              }
            }
          }
        },
        {
          enableHighAccuracy: true
        }
      );
    },

    // 获取个人打卡详情列表
    getCardingRecords() {
      this.$getData
        .individualCardingRecords({
          method: "post",
          data: {
            chooseAdAcount:
              this.chooseAdAcount || this.abnomalAdAcounts || this.adAcount,
            chooseDate: this.defaultDate || this.chooseDate
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.attendanceList = res.data || [];
            this.personNames = this.attendanceList;
            this.adAccId = res.data.adAccId;
            var arr = res.data,
              obj = res.enumVal;
            this.individualCardingRespList = arr
              ? arr.individualCardingRespList
              : [];
            arr = obj.ComfirmEnum || "";
            if (arr) {
              arr = JSON.parse(arr);
              for (var i = 0; i < arr.length; i++) {
                this.status[arr[i].enumValue] = arr[i].description;
              }
            }
            arr = obj.CheckinEnum || "";
            if (arr) {
              arr = JSON.parse(arr);
              for (var i = 0; i < arr.length; i++) {
                this.status[arr[i].enumValue] = arr[i].description;
              }
            }
          } else {
          }
          this.baiduMap();
        });
    },

    //查看工作计划与回顾
    getWorkPlan(datTime) {
      // let d = datTime ? datTime : new Date();
      // let dataTime01 = new Date(d);
      // let dateTime02 =
      //   this.getZero(dataTime01.getFullYear()) +
      //   "-" +
      //   this.getZero(dataTime01.getMonth() + 1) +
      //   "-" +
      //   this.getZero(dataTime01.getDate());
      this.$getData
        .selOneDayPlan({
          method: "post",
          data: {
            adAcount: this.abnomalAdAcounts,
            // date: dateTime02
            date: this.chooseDate
          }
        })
        .then(res => {
          this.workPlan = res.data;
        });
    },
    // 点击查看更多
    onClickDisabled() {
      this.$router.push({
        path: "/workPlanAudit",
        query: {
          adAcount: this.abnomalAdAcounts,
          chooseDate:
            new Date(this.defaultDate).getTime() ||
            new Date(this.chooseDate).getTime()
        }
      });
    },
    //到确认详情2019-10-21T14:18:53.000+0000
    goAbnormal(id, type, eTime, aStatus, dTime) {
       this.$router.push({
          path: "/leaderConfirm",
          query: {
            id: id,
            pathType: "mapDetail",
            chooseDate: Date.parse(this.chooseDate)
          }
        });
      // if (aStatus == null && eTime == "NORMAL") {
      //   this.$router.push({
      //     path: "/AttendanceAffirm",
      //     query: {
      //       id: id,
      //       pathType: "mapDetail",
      //       chooseDate: Date.parse(this.chooseDate)
      //     }
      //   });
      // } else if (
      //   (aStatus == "未申诉" || aStatus == null) &&
      //   eTime == "ABNORMAL"
      // ) {
      //   this.$router.push({
      //     path: "/abnormalCheck",
      //     query: {
      //       id: id,
      //       pathType: "mapDetail",
      //       chooseDate: Date.parse(this.chooseDate)
      //     }
      //   });
      // } else if (
      //   (aStatus == "已申诉" || aStatus == "申诉确认") &&
      //   type == "CONFIRMED"
      // ) {
      //   this.$router.push({
      //     path: "/CheckAppeal",
      //     query: {
      //       id: id,
      //       pathType: "mapDetail",
      //       chooseDate: Date.parse(this.chooseDate)
      //     }
      //   });
      // }

      // else if (type == "CONFIRMED") {
      //   this.$router.push({
      //     path: "/confirmResult",
      //     query: {
      //       id: id,
      //       pathType: "mapDetail",
      //       chooseDate: Date.parse(this.chooseDate)
      //     }
      //   });
      // }
    },
    clickTextarea(txt) {
      this.popupDate =
        this.chooseDate.getDate() + "日" || this.defaultDate.getDate() + "日";
      this.popTxt = txt;
      if (this.popTxt && this.popTxt.length > 0) {
        this.popupShow = true;
      } else {
        Toast("暂无数据");
      }
    }
  }
};
</script>

<style lang="scss">
 #app{
      height: calc(100% - 50px);
 }
</style>
<style scoped lang="scss">
.punch {
  background: #f4f4f4;
  width: 100%;
  height: 100%;
  // padding-top: 296px;
  .baidumap-wrap {
    position: fixed;
    top: 66px;
    width: 100%;
    height: 200px;

  }
  .baidumap {
    height: 200px;
  }
}

.content {
   position: fixed;
    top: 266px;
    right: 0;
  left: 0;
  height:calc(100% - 316px);
  background: #f4f4f4;
}
.content /deep/ .van-tabs__content{
  height: calc(100% - 46px);
  overflow: auto;
}
/deep/.van-cell {
  width: 100%;
  background-color: #fff;
}

/deep/.van-tabs {
  margin-top: 10px;
  background: #ffffff;
  padding: 0 21px 0 19px;
  box-shadow: 0 2px 10px 0 rgba(199, 197, 197, 0.5);
  border-radius: 10px 15px 10px 5px !important;
}

/deep/.van-tabs .van-tab span {
  text-align: left !important;
}

/deep/.van-tabs .van-tab--disabled {
  color: #4b77af !important;
}

/deep/.van-cell__title,
.van-cell__value {
  width: 100px;
  flex: none;
  font-weight: 700;
}
/deep/.van-steps--vertical {
  padding: 0 0 0 0.53333rem !important;
}

/deep/.van-cell__value {
  text-align: left;
  color: #4b77af;
}

/deep/.van-tabs .van-tabs__wrap .van-tabs__nav .van-tabs__line {
  height: 0px !important;
  background-color: #4b77af;
  left: -24px;
  // transform: translateX(45px) translateX(-68%) !important;
}

// /deep/.van-step__title {
//   margin-right: 15px;
//   font-size: 17px;
//   color: #4b77af !important;
// }

// /deep/.van-hairline--top-bottom::after,
// /deep/.van-cell:not(:last-child)::after {
//   border: none;
// }

// /deep/.van-tab  {

//   text-align: left;
// }

.myRecord {
  height: 40px;
  line-height: 40px;
  width: 100%;
  background: #f5f6f8;
  font-size: 16px;
  font-weight: 700;
}

.hide {
  display: none;
}

.aa {
  text-align: center;
}

.date {
  height: 105px;
  padding-top: 10px;
  background-color: #719cd2;
}

.date p {
  margin: 0;
}
.date .month .year {
  font-size: 17px;
  line-height: 24px;
  text-align: center;
  width: 90%;
  color: #fff;
}

.month .last {
  float: left;
  /* height: 30px; */
  margin-top: 7px;
  width: 10%;
  text-align: center;
  color: #fff;
}

.month .next {
  float: right;
  margin-top: -17px;
  width: 10%;
  text-align: center;
  font-size: 14px;
  color: #fff;
}

.date .weekdays {
  display: flex;
  font-size: 14px;
  margin-top: 15px;
  color: #fff;
}

.date .weekdays li {
  flex: 1;
  line-height: 24px;
  font-size: 17px;
  text-align: center;
  float: left;
}

.date .weekdays .six {
  color: red;
  color: #fff;
}

.date .weekdays .date .weekdays .days {
  display: flex;
  color: #fff;
}

.days li {
  flex: 1;
  font-size: 15px;
  text-align: center;
  margin-top: 5px;
  line-height: 30px;
  width: 14.28%;
  float: left;
  color: #fff;
}

.days .active {
  display: inline-block;
  width: 30px;
  height: 30px;
  color: #fff;
  border-radius: 50%;
  background-color: #4b77af;
}

.date .weekdays .days .other-month {
  color: #4a77b0;
}

.days li:nth-last-child(1),
.days li:nth-last-child(2) {
  color: red;
}

.clear {
  clear: both;
}

.checkRecord {
  height: 70px;
  padding-left: 15px;
  padding-right: 10px;
}

.record {
  width: 100%;
  height: 42px;
}

.checkRecord .name {
  float: left;
  font-size: 16px;
  font-weight: 700;
}

.checkRecord .status {
  float: right;
  width: 80px;
  height: 30px;
  line-height: 30px;
  background: #ffccff;
  color: #ff85d1;
  text-align: center;
}

.checkRecord .address {
  color: #1989fa;
}

.abnormalStatus {
  color: #969799;
    p{
    margin:12px 0;
  }
}

.unconfirmedStatus {
  color: #000;
  p{
    margin:12px 0;
  }
}

/deep/.van-step--vertical .van-step__circle-container {
  position: absolute;
  top: 0.22rem;
  left: -0.4rem;
  z-index: 2;
  font-size: 0.32rem;
  line-height: 1;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

/deep/.van-step--vertical {
  display: block;
  float: none;
  padding: 0rem 0.266667rem 0.266667rem 0;
  line-height: 0.48rem;
}

.main {
  padding: 11px;
  background: #fff;
  // height: 195px;
  height: calc(100% - 44px);
  overflow: auto;
  .title {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(72, 72, 72, 1);
    line-height: 17px;
    border-bottom: 1px solid #4b77af;
    padding-bottom: 2px;
    & > span:first-child {
      margin-right: 10px;
    }
  }
  .itemText {
    display: flex;
    justify-content: flex-start;
    & > .itemTextTitle {
      letter-spacing: 12px;
      width: 16px;
      height: 34px;
      font-size: 12px;
      font-family: PingFang-SC-Regular, PingFang-SC;
      font-weight: 400;
      color: rgba(75, 119, 175, 0.2);
      line-height: 17px;
    }
  }
  .itemUp {
    padding-top: 5px;
  }
}
.workPlan {
  border: solid 0px;
  outline: none;
  color: #888;
  background: #fff;
}
/deep/ .van-tab--active {
  color: #4b77af !important;
}
.go {
  height: calc(100% - 44px);
overflow: auto;
}
/deep/.content .tell-wrap{
  overflow: visible;
}
/deep/.tell-wrap .van-cell__value{
 flex: 1;
  overflow: visible;

}
</style>
