<template>
  <div :class="['punch',this.commonUtils.env.getIsApp()?'punch-header':'']">
    <!-- <button @click="getLocationLat">aa</button> -->
    <!-- 默认a标签会跳转，所以改成iframe方式 -->
    <!-- <a    :href="`shell:lieyinstart:86438|${device_name}`">11</a> -->
    <!-- 引导图 -->
    <!-- <div class="leader-img-wrap" v-if="leaderPunch1">
      <div class="leader-img-inner" v-if="leaderPunchImg1">
        <img :src="leaderPunchImg1Url" alt class="leader-img" />
        <div
          class="btn-know btn-know1"
          @click="closeLeader({
          type:'next',
          from:'leaderPunchImg1',
          to:'leaderPunchImg2',
        })"
        ></div>
      </div>
      <div class="leader-img-inner" v-if="leaderPunchImg2">
        <img :src="leaderPunchImg2Url" alt class="leader-img" />
        <div
          class="btn-know btn-know2"
          @click="closeLeader({
          type:'end',
          from:'leaderPunchImg2',
          leaderCookie:'leaderPunch1'
        })"
        ></div>
      </div>
    </div> -->
    <iframe
      :src="android_device"
      v-if="this.commonUtils.env.getTerminal()==='shell-android'"
      style="display:none"
    ></iframe>

    <div class="autoPunch-header" v-if="this.commonUtils.env.getIsApp()">
      在线考勤
      <div class="refresh" @click="refresh">
        <img :src="refreshImgUrl" alt />
      </div>
    </div>
    <div class="punch-operate">
      <div class="time-zone">
        北京时间
        <span class="fr blue">{{getDayType()}}</span>
      </div>
      <div class="time-clock">
        <div class="time-clock-inner">
          <div class="clock-top">
            <span>{{time[0]}}</span>
            <!-- <span>{{time[1]}}</span> -->
            <span>{{week}}</span>
          </div>
          <div class="clock-count">{{time[1]}}</div>
        </div>
      </div>
      <!-- 手动打卡 -->
      <template v-if="!this.commonUtils.env.getIsApp()">
        <!-- 暂时没有自动打卡选项 -->
        <div v-if="this.checkinMode==='AUTOMATIC'" :class="['time-btn-wrap','disabled']">
          <div :class="['time-mask','showMask']"></div>
          <div class="time-btn" :style="{opacity:0.5}">
            <div class="time-btn-inner">
              <b class="when">自动打卡</b>
              <br />
              <span class="interval">08:40-17:30</span>
            </div>
          </div>
        </div>
        <div
          v-else
          :class="['time-btn-wrap',!isWeekDays&&!allowOvertime?'disabled':'',confirmStatus==='CONFIRMED'?'disabled':'']"
        >
          <div
            :class="['time-mask',showMask?'showMask':'',confirmStatus==='CONFIRMED'?'showMask':'']"
          ></div>
          <div
            class="time-btn"
            :style="{opacity:showMask?0.5:1}"
            @click="delayOpenOvertime"
            v-if="!isWeekDays&&allowOvertime&&!openOvertime"
          >
            <div class="time-btn-inner">
              <b class="when">我要加班</b>
              <br />
              <span class="interval">{{interval}}</span>
            </div>
          </div>
          <div class="time-btn" :style="{opacity:showMask?0.5:1}" @click="delayGetCard" v-else>
            <div class="time-btn-inner">
              <b class="when">{{!isWeekDays&&!allowOvertime?'暂无打卡':initialData.checkinName}}</b>
              <br />
              <span class="interval">{{interval}}</span>
            </div>
          </div>
        </div>
      </template>
      <!-- 自动打卡 -->
      <template v-else>
        <!-- 去掉17:30限制 -->
        <!-- <div :class="['time-btn-wrap',isWeekDays?'':'disabled',overTimeAutoGetCard?'disabled':'']"> -->
        <div :class="['time-btn-wrap',isWeekDays?'':'disabled']">
          <!-- <div :class="['time-mask',showMask?'showMask':'',openLocus?'showMask':'']"></div> -->
          <div :class="['time-mask',showMask?'showMask':'']"></div>
          <div class="time-btn" :style="{opacity:showMask?0.5:1}" @click="delayAutoGetCard">
            <!-- <div class="time-btn-inner" v-if="overTimeAutoGetCard">
              <b class="when">暂无打卡</b>
              <br />
              <span class="interval">00:00-00:00</span>
            </div>-->
            <!-- <div class="time-btn-inner" v-else> -->
            <div class="time-btn-inner">
              <b class="when">{{isWeekDays?'自动打卡':'暂无打卡'}}</b>
              <br />
              <!-- <span class="interval">{{openLocus?'打卡中...':interval}}</span> -->
              <span class="interval">{{this.checkinMode==='AUTOMATIC'?'08:40-17:30':interval}}</span>
            </div>
          </div>
        </div>
      </template>

      <div class="history clear">
        <span class="fl">
          考勤截止:
          <span v-if="this.checkinMode==='AUTOMATIC'">17:30:00</span>
          <span
            v-else
            style="vertical-align:-0.03rem"
          >{{!isWeekDays&&!allowOvertime?'00:00:00':initialData.checkinToDate}}</span>
        </span>
        <!-- 如果在壳子中，不展示考勤历史选项 -->
        <span class="fr" v-if="!this.commonUtils.env.getIsApp()">
          <router-link to="/punchHistory" class="blue">
            考勤历史
            <img :src="historyImgUrl" alt class="svg-history" />
          </router-link>
        </span>
      </div>
    </div>
    <div class="punch-list">
      <van-loading style="text-align:center;color:#666" v-if="initLoading" color="#666">加载中...</van-loading>
      <div v-else>
        <div v-if="!checkinRecordRespList.length" class="punch-noData">
          <p class="empty-text">暂无考勤数据</p>
        </div>
        <template v-else>
          <PunchItemWrap
            :checkinRecordRespList="checkinRecordRespList"
            :status="status"
            :enumerationInitialData="enumerationInitialData"
            :allowSeconded="allowSeconded"
          />
        </template>
        <!-- <ul v-else>
          <li v-for="(item,index) in checkinRecordRespList" :key="index">
            <PunchItem
              :punchItemProps="item"
              :status="status"
              :enumerationInitialData="enumerationInitialData"
              :order="index"
            />
          </li>
        </ul>-->
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
// import PunchItem from "@/component/punch/PunchItem";
import PunchItemWrap from "@/component/punch/PunchItemWrap";
import { getWxClient } from "@/utils/env";
import { localeWeek } from "@/utils/time";
import { Dialog, Toast } from "vant";
import wx from "weixin-js-sdk"; // 引入企业微信的sdk
import { getCookie, setCookie } from "@/apis/cookie1";
// import AMap from AMap
export default {
  name: "punch",
  components: {
    // PunchItem,
    PunchItemWrap
  },
  data() {
    return {
      checkinDateId: "",
      confirmStatus: "", //已经打过卡，领导是否确认
      initLoading: true, //打卡列表loading
      isWeekDays: true, //是否为工作日
      isDisablePunch: false, //是否禁用打卡按钮
      historyImgUrl: require("@static/imgs/history.svg"),
      refreshImgUrl: require("@static/imgs/app/refresh.svg"),
      showMask: false, //隐藏打卡遮罩层
      initialData: {},
      interval: "", //正常打卡时间范围
      time: this.$moment()
        .format("YYYY-MM-DD HH:mm:ss")
        .split(" "),
      week: localeWeek(this.$moment().format("dddd")),
      timer: null, //钟表定时器
      cardTimer: null, //获取经纬度超时定时器
      cardTimerSecond: 10000, //获取经纬度超时时间
      cardClickTimer: null,
      cardTimerSecondDefault: 10,
      formaterDay: "",
      formaterTime: "",
      checkinRecordRespList: [],
      punchItemProps: {},
      status: {}, //枚举类
      enumerationInitialData: {}, //所有枚举类
      openLocus: false, //自动打卡是否开启
      checkinMode: "", // MANUAL-手动打卡、 AUTOMATIC-自动打卡（业务人员只能自动打卡）、 FACETOMANUAL-人脸+手动打卡
      overTimeAutoGetCard: false, //是否禁用按钮，当天且时间在17:30-24:00
      android_device: "", //传给安卓的参数
      // 引导图路径
      leaderPunchImg1Url: require("@static/imgs/leader/leaderPunchImg1.png"),
      leaderPunchImg2Url: require("@static/imgs/leader/leaderPunchImg2.png"),
      leaderKnowUrl: require("@static/imgs/leader/know.png"),
      // 是否展示隐藏层,第一次进入展示
      leaderPunch1: true, //用于存入cookie,从而使得后面进入不再展示
      leaderPunchImg1: true,
      leaderPunchImg2: false,

      // 是否有高原权限
      //null-后台未配置权限  0-否  1-是
      allowSeconded: null,
      // 是否允许加班
      //null-后台未配置权限  0-否  1-是
      allowOvertime: null,
      // 是否开启加班
      //null-后台未配置权限  false-否  true-是
      openOvertime: null
    };
  },

  methods: {
    // 自动打卡刷新页面
    refresh() {
      window.location.reload();
    },
    // 判断网络状态
    networkState() {
      if (!Object.is(window.navigator.onLine, true)) {
        Toast("网络未连接");
      }
      window.addEventListener("online", online, false);
      window.addEventListener("offline", offline, false);
      function online() {
        Toast("网络已重新连接");
      }
      function offline() {
        Toast("网络连接已断开");
      }
    },
    //页面刚进来默认加载
    getInitial(mold) {
      this.initLoading = true;
      this.$getData
        .attendanceInfoLoading({
          method: "post",
          data: {
            // chooseDate: new Date()
            // chooseDate: this.$moment().add(1, 'days')._d
          }
        })
        .then(res => {
          if (res.code == 200) {
            const that = this;
            this.initialData = res.data;
            this.initLoading = false;
            this.checkinRecordRespList = res.data.checkinRecordRespList
              ? res.data.checkinRecordRespList
              : [];
            const {
              checkinDateId,
              checkinMode,
              allowSeconded,
              allowOvertime,
              openOvertime
            } = this.initialData;
            this.checkinDateId = checkinDateId;
            // 判断是否存已经打过卡以及领导确认过
            let confirmStatus = "";
            this.checkinRecordRespList.some((item, index) => {
              if (item.checkinDateId === that.checkinDateId) {
                confirmStatus = item.comfirmType;
                return true;
              }
            });
            this.confirmStatus = confirmStatus;
            this.checkinMode = checkinMode;
            this.allowSeconded = allowSeconded;
            this.allowOvertime = allowOvertime;
            this.openOvertime = openOvertime;
            const { fromDate, toDate, dayType } = this.initialData;
            if (dayType === "WEEKEND" || dayType === "HOLIDAY") {
              this.isWeekDays = false;
              if (!allowOvertime) {
                this.interval = `00:00 - 00:00`;
              } else {
                this.interval = fromDate&&toDate?`${fromDate.slice(0, 5)} - ${toDate.slice(
                  0,
                  5
                )}`:'';
              }
            } else {
              this.isWeekDays = true;
              this.interval =fromDate&&toDate? `${fromDate.slice(0, 5)} - ${toDate.slice(0, 5)}`:'';
            }
            // this.disablePunch()
            this.enumeration(res.enumVal);
            this.enumerationInitial(res.enumVal);
            if (mold === "auto") {
              this.getCard("auto");
            }
          }
        })
        .catch(() => {
          this.initLoading = false;
          if (mold === "auto") {
            this.showMask = false;
          }
        });
    },
    // 拼接枚举类
    enumeration(str) {
      var arr = str.ComfirmEnum;
      arr = JSON.parse(arr);
      for (var i = 0; i < arr.length; i++) {
        this.status[arr[i].enumValue] = arr[i].description;
      }
      arr = str.CheckinEnum;
      arr = JSON.parse(arr);
      for (var i = 0; i < arr.length; i++) {
        this.status[arr[i].enumValue] = arr[i].description;
      }
      arr = str.DayTypeEnum;
      arr = JSON.parse(arr);
      for (var i = 0; i < arr.length; i++) {
        this.status[arr[i].enumValue] = arr[i].description;
      }
    },
    enumerationInitial(str) {
      let enumerationInitialData = {};
      for (let index in str) {
        enumerationInitialData[index] = JSON.parse(str[index]);
      }
      this.enumerationInitialData = enumerationInitialData;
    },
    // 通过枚举类获取当前是否为节假日
    getDayType() {
      const that = this;
      let aim = "";
      if (JSON.stringify(this.enumerationInitialData) != "{}") {
        this.enumerationInitialData.DayTypeEnum.some((item, index) => {
          if (item.enumValue === that.initialData.dayType) {
            aim = item.description;
          }
        });
      }
      return aim;
    },
    // 获取账户信息
    getSaasUser() {
      this.$getData
        .getCurrent({
          method: "post"
        })
        .then(res => {
          if (res.code == 200) {
            const { accountName, name } = res.data;
            setCookie("accountName", accountName, 24 * 7);
            setCookie("name", escape(name), 24 * 7);
            this.getCurrentDeviceStatus();
          }
        })
        .catch(function(error) {
          console.log("error" + error);
        });
    },
    // 点击按钮手动打卡
    getCard(mold) {
      this.showMask = true;
      const that = this;

      // if (!Object.is(window.navigator.onLine, true)) {
      //   Toast({
      //     type: "fail",
      //     duration: 1000,
      //     message: "网络未连接",
      //     forbidClick: true,
      //     onClose: function() {
      //       that.showMask = false;
      //     }
      //   });
      //   return;
      // }
      // const { checkinDateId } = this.initialData;
      // 判断是否存已经打过卡
      const exist = this.checkinRecordRespList.some((item, index) => {
        if (item.checkinDateId === that.checkinDateId) {
          return true;
        }
      });
      if (exist) {
        Dialog.confirm({
          title: "提示信息",
          message: "是否覆盖已有的考勤记录?"
        })
          .then(() => {
            if (mold == "auto") {
              this.getGDLocationLat(that.checkinDateId, {
                type: "replace"
              });
            } else {
              this.getLocationLat(that.checkinDateId, {
                type: "replace"
              });
            }
          })
          .catch(error => {
            this.showMask = false;
          });
        // .finally(() => {
        //   this.networkState();
        // });
      } else {
        if (mold == "auto") {
          this.getGDLocationLat(that.checkinDateId, {
            type: "add"
          });
        } else {
          // 先获取经纬度
          this.getLocationLat(that.checkinDateId, {
            type: "add"
          });
        }
      }
    },

    //点击按钮自动打卡
    autoGetCard() {
      const that = this;
      this.showMask = true;
      this.getInitial("auto");
      // setTimeout(() => {
      //   this.getCard("auto");
      // }, 100);
    },

    // 点击开启我要加班
    openOvertimeFn() {
      this.showMask = true;
      this.$getData
        .openOverTime({
          method: "post"
        })
        .then(res => {
          if (res.code == 200) {
            Toast("开启我要加班成功");
            this.openOvertime = true;
          }
          this.showMask = false;
        })
        .catch(() => {
          this.showMask = false;
        });
    },
    // 创建设备
    addDeviceInfo() {
      const that = this;
      this.android_device = ""; //暂时改成可以多次点击，所以需要先清空iframe,让其重新加载
      const terminal = this.commonUtils.env.getTerminal();
      this.$getData
        .addDeviceInfo({
          method: "post",
          data: {
            ad_account: getCookie("accountName"),
            name: unescape(getCookie("name"))
          }
        })
        .then(res => {
          if (res.code == 200) {
            const { device_id, device_name } = res.data;
            if (terminal === "shell-android") {
              this.openLocus = true;
              that.showMask = false;
              this.android_device = `shell:lieyinstart:93818|${device_name}`;
              // // 安卓壳子
              // try {
              //   //通过a标签向android传递参数
              //   var a = document.createElement("a");
              //   a.setAttribute(
              //     "href",
              //     "shell:lieyinstart:86438|hongxin_e03f8f90-177b-4565-812c-bd89140eb086"
              //   );
              //   a.setAttribute("id", "shell-android-href");
              //   // 防止反复添加
              //   if (document.getElementById("shell-android-href")) {
              //     document.body.removeChild(
              //       document.getElementById("shell-android-href")
              //     );
              //   }
              //   document.body.appendChild(a);
              //   a.click();
              // } catch (error) {
              //   console.log(error);
              //   Toast("开启自动打卡失败");
              //   that.showMask = false;
              // }
            } else if (terminal === "shell-ios") {
              //ios壳子
              try {
                //向ios传递参数
                window.OCJSBridge.jsToOc(device_id, device_name);
              } catch (error) {
                // 桥方法未注入
                Toast("开启自动打卡失败");
                that.showMask = false;
              }
            } else {
              // pc或其他平台
              this.showMask = false;
            }
          }
        })
        .catch(() => {
          this.showMask = false;
        });
    },
    // 获取ios开启轨迹是否成功的信息
    getOpenLocusMsg(msg) {
      // code  '1'-开启成功 '0'-开启失败
      const { code } = JSON.parse(msg);
      if (Number(code)) {
        Dialog({
          message: "自动打卡成功<br/>17:30停止获取地理位置",
          className: "autoGetCardlayer",
          confirmButtonText: "我知道了",
          overlayStyle: {
            backgroundColor: "rgba(0,0,0,.1)"
          }
        });
        this.openLocus = true;
        this.showMask = false; //按钮高亮，但是不可点击
      } else {
        Toast("开启自动打卡失败");
        this.showMask = false;
      }
    },
    // 获取当天是否已经点击过自动打卡（如果点过，就算手动杀掉app进程,）
    getCurrentDeviceStatus() {
      this.$getData
        .getCurrentDeviceStatus({
          method: "post",
          headers: {
            hideToast: true
          },
          data: {
            ad_account: getCookie("accountName")
            // ad_account: "liguang03"
          }
        })
        .then(res => {
          if (res.code == 200) {
            /*
             *如当天且设备已开启，msg 为'1'
             *如当天且设备未开启，msg 为'0'
             *如当天且时间在17:30-24:00，msg 为'2'
             */
            const msg = Number(res.msg);
            if (msg == 1) {
              this.openLocus = true;
              this.overTimeAutoGetCard = false;
            } else if (msg == 2) {
              this.openLocus = false;
              this.overTimeAutoGetCard = true;
            } else {
              this.openLocus = false;
              this.overTimeAutoGetCard = false;
            }
          }
        });
    },
    // 获取定位授权
    getDeny() {
       wx.ready(function(){

      wx.getLocation({
        type: "gcj02",
        success: function(response) {},
        complete: function(response) {
        },
        fail: function(error) {
          const { errMsg, err_Info, err_reason } = error;

          // 用户没有开启定位权限
          if (
            errMsg == "getLocation:user deny" ||
            (errMsg == "getLocation:fail" &&
              err_Info == "error" &&
              err_reason == "user denied to authorize the LBS permissions.")
          ) {
             window.location.reload();
            // Dialog.alert({
            //   message: "请开启手机授权地理位置"
            // }).then(() => {

            // });
          }
        },
        cancel: function(response) {}
      });
       })

    },
    //企业微信获取经纬度
    getLocationLat(checkinDateId, way) {
      const that = this;
      let hideFailToast = false;
      const toast = Toast.loading({
        message: "打卡中...",
        duration: 0, // 持续展示 toast
        forbidClick: true
        // className:'layer-toast',
        // loadingType: 'spinner'
      });
      let num = 0;
      if (getWxClient() === "other") {
        this.showMask = false;
        toast.clear();
      }

      // clearInterval(this.cardTimer);
      // this.cardTimer = setInterval(() => {
      //   that.cardTimerSecond--;
      //   if (that.cardTimerSecond == 0) {
      //     clearInterval(that.cardTimer);
      //     that.cardTimerSecond = that.cardTimerSecondDefault;
      //     // toast.clear();
      //     Toast("网络异常，获取经纬度失败，请重新打卡");
      //     that.showMask = false;
      //     hideFailToast = true; //已经超过规定时间，不允许wx.getLocation的success,fail提示
      //   }
      // }, 1000);
      clearTimeout(this.cardTimer);
      this.cardTimer = setTimeout(() => {
        Toast("网络异常，获取经纬度失败，请重新打卡");
        that.showMask = false;
        hideFailToast = true; //已经超过规定时间，不允许wx.getLocation的success,fail提示
      }, this.cardTimerSecond);
      clearInterval(this.cardClickTimer);
      // wx.ready(function() {
      // 部分安卓或ios手机点击一次，无法获取经纬度，需要快速多次点击才可以，模拟200ms触发一次获取经纬度
      // 部分安卓或ios手机重复点击，无法获取经纬度，只需一次点击才可以，模拟2s后再执行一次，不重复触发
      this.cardClickTimer = setInterval(() => {
        num++;
        if (num >= 10) {
          clearInterval(this.cardClickTimer);
          console.log(num, "定时器清除");
        }

        if (hideFailToast) {
          clearTimeout(that.cardTimer);
          clearInterval(this.cardClickTimer);
        } else {
          //    setTimeout(() => {
          //      hideFailToast=true

          //    }, 2000);
          // return
          wx.getLocation({
            type: "gcj02",
            success: function(response) {
              if (hideFailToast) {
                return;
              }
              const { latitude, longitude } = response;
              if (latitude && longitude) {
                hideFailToast = true;
                that.latitude = latitude; // 纬度，浮点数，范围为90 ~ -90
                that.longitude = longitude; // 经度，浮点数，范围为180 ~ -180。
                that.getPunch(checkinDateId, way);
                clearTimeout(that.cardTimer);
                clearInterval(that.cardClickTimer);
                // 关闭自定义未授权弹窗
                Dialog.close();
              }
            },
            complete: function(response) {
              // this.showMask = false;
            },
            fail: function(error) {
              console.log(error, "fail");
              that.Sentry.captureException({
                type: "fail",
                error
              });
              const { errMsg } = error;

              // 用户没有开启定位权限
              if (
                errMsg == "getLocation:user deny"
                // ||
                // errMsg == "getLocation:nopermission" ||
                // errMsg == "getLocation:permission denied"
              ) {
                clearTimeout(that.cardTimer);
                clearInterval(that.cardClickTimer);
                that.showMask = false;
                toast.clear();
                Dialog.alert({
                  message: "请开启手机授权地理位置"
                }).then(() => {
                  // on close
                  window.location.reload();
                });
              } else {
                // 网络或其他问题获取位置失败
                // Toast("网络异常，获取经纬度失败，请重新打卡。");
              }
            },
            cancel: function(response) {
              console.log(response, "cancel");

              clearTimeout(that.cardTimer);
              clearInterval(that.cardClickTimer);
              that.showMask = false;
              toast.clear();
              Dialog.close();

              // that.Sentry.captureException({
              //   type: "cancel",
              //   error: response
              // });

              // 用户首页安装时候开启定位权限了，后面如果在应用管理里面关闭后台权限，会走到cancel回调函数
              // {errMsg:'getLocation:cancel'}
              Dialog.alert({
                message: "请开启手机授权地理位置."
              }).then(() => {
                window.location.reload();
              });
            }
          });
        }
      }, 200);

      // });
    },
    // 高德获取经纬度
    getGDLocationLat(checkinDateId, way) {
      let that = this;
      const toast = Toast.loading({
        message: "打卡中...",
        duration: 0, // 持续展示 toast
        forbidClick: true
        // className:'layer-toast',
        // loadingType: 'spinner'
      });

      AMap.plugin("AMap.Geolocation", function() {
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true,
          // 设置定位超时时间，默认：无穷大
          timeout: 10000
        });
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);
        // data是具体的定位信息
        function onComplete(data) {
          console.log("具体的定位信息", data);
          const { position } = data;
          that.latitude = position.lat; // 纬度，浮点数，范围为90 ~ -90
          that.longitude = position.lng; // 经度，浮点数，范围为180 ~ -180。
          that.getPunch(checkinDateId, way);
          that.addDeviceInfo();
        }
        function onError(data) {
          Toast("网络异常，获取经纬度失败，请重新打卡");
          that.showMask = false;
          console.log(data);
          that.Sentry.captureException(data);
          that.addDeviceInfo();
          // 失败 启用 ip定位
          // AMap.plugin("AMap.CitySearch", function() {
          //   var citySearch = new AMap.CitySearch();
          //   citySearch.getLocalCity(function(status, result) {
          //     if (status === "complete" && result.info === "OK") {
          //       // 查询成功，result即为当前所在城市信息
          //       console.log("通过ip获取当前城市：", result);
          //     }
          //   });
          // });
        }
      });
    },

    //调用接口打卡
    getPunch(checkinDateId, way) {
      let that = this;
      this.$getData
        .punchClock({
          method: "post",
          data: {
            lng: that.longitude,
            lat: that.latitude,
            checkinDateId: checkinDateId
          }
        })
        .then(res => {
          Toast.clear();
          if (res.code == 200) {
            this.showMask = false;
            const { type } = way;
            const { checkinRecordRespList } = res.data;
            const { checkinDateId, confirmStatus ,comfirmType} = checkinRecordRespList[0];
            this.checkinDateId = checkinDateId;
            // this.confirmStatus = confirmStatus;
            this.confirmStatus = comfirmType;
            if (type === "add") {
              // this.checkinRecordRespList
              this.checkinRecordRespList.push(checkinRecordRespList[0]);
            } else if (type === "replace") {
              this.checkinRecordRespList.pop();
              this.checkinRecordRespList.push(checkinRecordRespList[0]);
            }
            this.$forceUpdate();
            // this.getInitial();
          } else {
            this.showMask = false;
            // that.isdisabledFn = false;
          }
        })
        .catch(() => {
          this.showMask = false;
          Toast.clear();
        });
    },

    // 关闭引导层
    closeLeader(params) {
      const { type, from, to, leaderCookie } = params;
      if (type === "next") {
        this[from] = false;
        this[to] = true;
      } else if (type === "end") {
        this[leaderCookie] = false;
        setCookie(leaderCookie, false, Infinity);
      }
    }
  },
  mounted() {
    this.getInitial();
    document.title = "在线考勤";

    // 在window上绑定 用于接收ios是否开启成功的反馈 的函数
    window.getOpenLocusMsg = this.getOpenLocusMsg;

    if (this.commonUtils.env.getIsApp()) {
      document.getElementById("nav-bottom").style.display = "none";
      document.getElementById("mianFotter").style.paddingTop = "1.1467rem";
      document.getElementById("mianFotter").style.paddingBottom = 0;
      this.getSaasUser();
    }

    // 判断是否展示引导层
    const leaderPunch1 = getCookie("leaderPunch1");
    if (leaderPunch1 === "false") {
      this.leaderPunch1 = false;
    } else {
      this.leaderPunch1 = true;
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearTimeout(this.cardTimer);
    clearInterval(this.cardClickTimer);
  },

  created() {
    this.getDeny()

    this.delayGetCard = _.debounce(this.getCard, 300); //点击手动打卡
    this.delayAutoGetCard = _.debounce(this.autoGetCard, 300); //点击自动打卡
    this.delayOpenOvertime = _.debounce(this.openOvertimeFn, 300); //点击开启我要加班
    this.timer = null;
    this.timer = setInterval(() => {
      const time = this.$moment()
        .format("YYYY-MM-DD HH:mm:ss")
        .split(" ");
      const week = localeWeek(this.$moment().format("dddd"));
      this.time = time;
      this.week = week;
    }, 1000);
  }
};
</script>


<style scoped lang='scss'>
.punch {
  background: #fff;
}

.punch * {
  @include box-sizing;
}

.punch-operate {
  .time-zone {
    padding: 13px 20px;
    color: $blue;
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
  }

  .time-clock-wrap {
    background: linear-gradient(
      180deg,
      rgba(126, 194, 246, 1) 0%,
      rgba(72, 143, 235, 1) 100%
    );
    padding: 10px;
    width: 130px;
    height: 130px;
  }

  .time-clock {
    text-align: center;
    color: #6cb1f2;
    margin-bottom: 21px;

    .time-clock-inner {
      display: inline-block;

      .clock-top {
        font-size: 14px;
        line-height: 20px;
      }

      .clock-count {
        line-height: 45px;
        font-size: 32px;
        font-weight: bold;
      }
    }
  }

  .time-btn-wrap {
    width: 130px;
    height: 130px;
    margin: 0 auto;
    border-radius: 50%;
    background: rgb(241, 248, 254);
    padding: 10px;
    position: relative;
    box-sizing: border-box;
    // background:linear-gradient(180deg,rgba(126,194,246,1) 0%,rgba(72,143,235,1) 100%);
    &.disabled {
      background: #f9f9f9;
      .time-mask {
        display: block;
      }
      .time-btn {
        background: #efefef;
        .time-btn-inner {
          color: rgba(72, 72, 72, 0.4);
        }
      }
    }
    .time-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      border-radius: 50%;
      background: transparent;
      display: none;

      &.showMask {
        display: block;
        z-index: 1;
      }
    }
    .time-btn {
      border-radius: 50%;
      background: linear-gradient(
        180deg,
        rgba(126, 194, 246, 1) 0%,
        rgba(72, 143, 235, 1) 100%
      );
      text-align: center;
      line-height: 110px;

      .time-btn-inner {
        display: inline-block;
        line-height: 1;
        color: #fff;
        vertical-align: middle;

        .when {
          font-size: 18px;
          font-weight: bold;
          line-height: 25px;
        }

        .interval {
          line-height: 13px;
          font-size: 9px;
          font-weight: 400;
        }
      }
    }
  }

  .history {
    color: $blue;
    font-size: 14px;
    line-height: 17px;
    padding: 3px 10px 11px;
    margin: 0 10px 9px;
    border-bottom: 1px solid rgba(104, 160, 232, 0.1);
  }
}

.punch-list {
  margin-top: -9px;
  li {
    // margin: 9px 0;
    position: relative;
  }
}
.punch-noData {
  color: #484848;
  text-align: center;
  font-weight: 500;
  line-height: 25px;
  font-size: 18px;
  margin-top: 106px;
}
.svg-history {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  margin-left: 3px;
}

//引导层按钮
.btn-know1 {
  top: 329px;
  right: 132px;
}
.btn-know2 {
  bottom: 150px;
  right: 132px;
}
</style>
<style lang="scss">
// 自动打开开启轨迹成功提示
.autoGetCardlayer {
  width: 264px;
  // height: 132px;
  height: auto;
  .van-dialog__message {
    color: #000;
    font-size: 17px;
    max-height: auto;
    line-height: 24px;
    padding: 20px 40px 16px;
  }
  .van-hairline--top {
    border-top: 1px solid rgba(75, 119, 175, 0.2);
    button {
      color: #4b77af;
      height: 48px;
      font-size: 17px;
    }
  }
}
.layer-toast {
  background: none;
  .van-toast__loading {
    color: #ccc;
  }
}

.punch-header {
  padding-top: 43px;
}
.autoPunch-header {
  // padding-top: constant(safe-area-inset-top);
  // padding-top: env(safe-area-inset-top);
  background: #4b77af;
  height: 43px;
  line-height: 43px;
  color: #fff;
  font-size: 17px;
  font-weight: 400;
  text-align: center;
  position: fixed;
  top: calc(constant(safe-area-inset-top)); // 标准
  top: calc(env(safe-area-inset-top)); // 兼容 ios11
  top: 0; // 兼容非刘海屏
  width: 100%;
  z-index: 1;

  .refresh {
    width: 32px;
    height: 32px;
    padding: 5px;
    position: absolute;
    top: 50%;
    margin-top: -16px;
    right: 10px;
    img {
      width: 22px;
      height: 22px;
      vertical-align: top;
    }
  }
}
</style>
