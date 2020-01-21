<template>
  <div class="workplan">
    <div id="review" :style="viewShow == 'review'?'':'display:none'">
      <div ref="review">
        <water ref="initwart"></water>
        <van-nav-bar class="vanNavBar">
          <div slot="title" @click="optionDate()">
            <div class="center">
              <div class="title_h3" v-if="h3Active == 1">
                工作计划
                <div
                  v-show="thisName"
                  style="
                    position:absolute;left:67%;top:0;bottom:0;margin:auto 0;
                    font-size:12px;font-weight:400;color:rgba(72,72,72,1);line-height:15px;
                    border-left:1px solid #007AFF;height:15px;padding-left:3px;
                  "
                >{{thisName}}</div>
              </div>
              <div class="title_h3" v-if="h3Active == 2">
                工作回顾
                <div
                  v-show="thisName"
                  style="
                    position:absolute;left:67%;top:0;bottom:0;margin:auto 0;
                    font-size:12px;font-weight:400;color:rgba(72,72,72,1);line-height:15px;
                    border-left:1px solid #007AFF;height:15px;padding-left:3px;
                  "
                >{{thisName}}</div>
              </div>
              <div class="title_span">{{year}}年 第{{numberOfWeeks}}周 {{getXDate}}</div>
            </div>
          </div>
        </van-nav-bar>
        <div class="first" ref="first">
          <div class="title">
            <div style="display:inline-block;vertical-align: middle;height:100%;">{{numberOfWeeks}}周</div>

            <!-- 显示访客次数 -->
            <div
              v-if="h3Active == 2 && visitNumber!=0"
              style="height:100%;width:1px;display:inline-flex;align-items:center;vertical-align: middle;"
            >
              <div style="height:18px;width:0px;border-right:1px solid #007AFF;"></div>
            </div>

            <div v-if="h3Active == 2 && visitNumber!=0" id="visitNumber" @click="toVisitorlist">
              <van-image :src="imgSrc" />
              <span class="visitNumber_span">{{visitNumber}}次拜访</span>
            </div>
          </div>

          <div
            class="field"
            style="border: 1px solid rgba(75, 119, 175, 0.2);"
          >{{wworkPlanReviewDes}}</div>
        </div>
        <div
          class="list"
          :style="(h3Active == 2 && numberOfWeeks<numberOfWeeksNow )||(h3Active == 1 && wstatus == 3)||(h3Active == 2&&dstatus == 5)||(h3Active == 2&&wstatus != 3)||(h3Active == 1 && (numberOfWeeks<numberOfWeeksNow || numberOfWeeks>numberOfWeeksNow+3) ) ?'padding-bottom:0px;':''"
          @scroll="listScroll"
          ref="list"
        >
          <ul class="main">
            <li v-for="(item,index) in weekArr" :key="index">
              <div class="title">
                <span>周{{fontChange(index)}}</span>
                <span>{{item.date}}日</span>
                <!-- 出差图标 -->
                <van-image
                  v-show="item.isTrip"
                  width="17"
                  height="17"
                  :src="item.isTrip==3&&item.approvalTripStatus == 1?chuchaiImgSrc :chuchaiImgGSrc"
                />
                <!-- 招待图标 -->
                <van-image
                  v-show="item.isEntertain"
                  width="17"
                  height="17"
                  :src="item.isEntertain==3&&item.approvalEntertainStatus == 1?zhaodaiImgSrc :zhaodaiImgGSrc"
                />
              </div>
              <div class="itemUp itemText">
                <div class="itemTextTitle">上午</div>
                <div v-if="h3Active == 1 && !item.disabledUp" class="field">{{item.dworkPlanDesAm}}</div>
                <div
                  v-if="h3Active == 2 && !item.disabledUp"
                  class="field"
                >{{item.dworkReviewDesAm}}</div>
                <!-- 休假 -->
                <div
                  v-show="item.disabledUp"
                  style="width:340px;height:18px;background:rgba(255,232,182,1);text-align:center;font-size:12px;font-weight:600;color:rgba(255,167,0,1);line-height:17px;"
                >休假</div>
              </div>
              <div style="height:0;width:100%;border-top:1px dashed rgba(75,119,175,0.2);"></div>
              <div class="itemDown itemText">
                <div class="itemTextTitle">下午</div>
                <div
                  v-if="h3Active == 1 && !item.disabledDown"
                  class="field"
                >{{item.dworkPlanDesPm}}</div>
                <div
                  v-if="h3Active == 2 && !item.disabledDown"
                  class="field"
                >{{item.dworkReviewDesPm}}</div>
                <!-- 休假 -->
                <div
                  v-show="item.disabledDown"
                  style="width:340px;height:18px;background:rgba(255,232,182,1);text-align:center;font-size:12px;font-weight:600;color:rgba(255,167,0,1);line-height:17px;"
                >休假</div>
              </div>
            </li>
          </ul>

          <!-- 领导的回顾审核意见 -->
          <div
            id="opinion"
            v-if="(dstatus == 5 && h3Active == 2) || (dreviewVerifiedOpinionArr.length>0 && h3Active == 2)"
          >
            <h3>管理者意见</h3>
            <div
              v-for="(item,index) in dreviewVerifiedOpinionArr"
              :key="index"
              :style="index!=0?'margin-top:0px;':''"
            >
              <div style="width:100%;border:none">
                <p>{{item.dreviewVerifiedOpinion1}}</p>
                <div>
                  <span>{{item.dverifiedUserName1}}</span>
                  <br />
                  <span>{{wdDate(1,item.dreviewVerifiedDate1)}}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 领导的计划审核意见 -->
          <div id="opinion" v-if="(wstatus == 3 && h3Active == 1)">
            <h3>管理者意见</h3>
            <div v-if="!wverifiedUserName2">
              <div style="width:100%;border:none">
                <p>{{wplanDreviewVerifiedOpinio(1)}}</p>
                <div>
                  <span>{{wverifiedUserName1}}</span>
                  <br />
                  <span>{{wdDate(1)}}</span>
                </div>
              </div>
            </div>
            <div v-if="wverifiedUserName2">
              <div>
                <p>{{wplanDreviewVerifiedOpinio(1)}}</p>
                <div>
                  <span>{{wverifiedUserName1}}</span>
                </div>
                <div>
                  <span>{{wdDate(1)}}</span>
                </div>
              </div>
              <div>
                <p>{{wplanDreviewVerifiedOpinio(2)}}</p>
                <div>
                  <span>{{wverifiedUserName2}}</span>
                </div>
                <div>
                  <span>{{wdDate(1)}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="but_b">
      <van-button
        plain
        type="primary"
        @click.stop="share"
        style="width:100%;background: #4B77AF;color: #fff;"
      >生成图片</van-button>
    </div>
    <div :style="{zIndex:showMask?2:-1,position:'relative'}">
    <van-popup
      v-model="thisImgShow"
      overlay-class="popupZIndex"

      class="myVanPopup"
    >
      <van-image :src="thisImgSrc" id="vanImg" ref="vanImg" @load="imageLoad" @error="imageError" />
    </van-popup>
    </div>

  </div>
</template>

<script>
import water from "@/component/global/watermarker";
import { getCookie, setCookie } from "@/apis/cookie1";
import { CellGroup, Dialog } from "vant";
import moment from "moment";
import Cookie from "@/apis/cookie";
import html2canvas from "html2canvas";
import { getlocalStorage, setlocalStorage } from "@/utils/format";
import { Toast} from "vant";

export default {
  name: "workPlanShare",
  components: {
    water
  },
  data() {
    return {
      showMask:false,
      thisImgShow: true,
      thisImgSrc: "",
      // 本界面实际属性

      isFocusType: false, // 判断所有输入框是否聚焦
      adAcount: "", // 当前用户的adAcount
      initialScoll: null, //填写列表距离顶部的距离
      firstRows: 4, // 头部框所占行数

      thisName: localStorage.getItem("personName"),
      zhaodaiImgSrc: require("../../../static/imgs/zhaodai.svg"),
      zhaodaiImgGSrc: require("../../../static/imgs/zhaodai-zhihui.svg"),
      chuchaiImgSrc: require("../../../static/imgs/chuchai.svg"),
      chuchaiImgGSrc: require("../../../static/imgs/chuchai-zhihui.svg"),
      required: false, // 表单效验
      visitNumber: 0, //拜访次数
      imgSrc: require("../../../static/imgs/visit.png"), // 拜访次数的icon

      isFocus: true, // 判断回顾输入框是否已聚焦过

      textLength: 1000, // 输入框的可输入最大字符长度

      overlayShowTime: null, //login的计时器
      overlayShow: false, // 遮罩层状态

      onceStr: "未填写",
      dreviewVerifiedOpinionArr: [], // 领导审核回顾意见列表

      // 弹出层状态
      popupObj: {}, // 弹出层展示数据
      popupShow: false,
      popupText: "",
      popupTitle: "",
      popupName: "",
      popupDate: "",

      // 轮播图
      move: null,
      startX: null,
      moveDire: "",

      // 同事圈 start
      colleagueCircleRespList: [], // 当前用户的下级
      superiorName: "", // 当前用户的上级
      colleagueSearchList: [], // 搜索获得的数据
      concernList: [], // 关注的同事列表
      // 同事圈 end

      active: 1,
      viewShow: "review", //顶部导航切换状态
      // review 界面的数据
      selected: "",
      weekArrNull: [
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        }
      ],
      weekArr: [
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        }
      ],
      year: null,
      numberOfWeeks: 1, // 当前周数
      numberOfWeeksNow: 1, // 当前周数
      wworkPlanDes: "", // 周计划
      wworkReviewDes: "", // 周回顾
      startDate: null,
      endDate: null,
      // 弹出日期选择框的状态
      show: false, // 决定日期组件的显示与否
      calendarShow: false,
      defaultDate: new Date(),
      newDate: new Date(), // 当前最新的

      h3Active: 1, // 标题“工作计划”被选中的状态
      subDisabled: true, //提交按钮是否可提交

      wid: null,
      did: null,
      wstatus: 1, // 计划状态
      dstatus: null, //回顾状态
      wplanVerifiedOpinion1: "", // 管理者 计划意见1
      wverifiedUserName1: "", // 管理者1
      wplanVerifiedOpinion2: "", // 管理者 计划意见2
      wverifiedUserName2: "", // 管理者2
      wplanVerifiedDate1: "",
      wplanVerifiedDate2: "",

      dreviewVerifiedOpinion1: "", // 管理者 回顾意见1
      dreviewVerifiedOpinion2: "", // 管理者 回顾意见2
      dreviewVerifiedDate1: "",
      dreviewVerifiedDate2: "",

      dverifiedUserName1: "",
      dverifiedUserName2: "",

      // #search 搜索块数据
      focus: false,
      searchText: "",
      // transpond界面的状态
      transpondList: [1, 2, 3, 4],
      // colleague界面的数据
      activeNames: ["1"]
    };
  },
  created() {
    this.dateFormat(); // 注册时间处理函数
    this.numberOfWeeksNow = this.getWeekOfYear(); // 缓存当前周数
    document.title = "分享预览";

    let obj = this.$route.query;
    console.log("params", this.$route);
    this.adAcount = obj.adAcount
      ? obj.adAcount
      : Cookie.cookie.get("accountName");
    this.year = obj.year;
    this.numberOfWeeks = obj.numberOfWeeks;
    this.h3Active = obj.h3Active;
    this.thisName = obj.thisName;

    // let save = JSON.parse(Cookie.cookie.get("save"));
    // let save = JSON.parse(getlocalStorage("save"));
    let save = getlocalStorage("save");
    if (save) {
      this.weekArr = save.weekArr;
      this.wworkPlanDes = save.wworkPlanDes;
      this.wworkReviewDes = save.wworkReviewDes;
    }
     Toast.loading({
      message: "图片生成中...",
      duration: 0, // 持续展示 toast
      forbidClick: true
    });
    console.log("create", this.weekArr);
  },
  mounted() {
    this.$refs.initwart.initWaterMark(getCookie("accountName"));
    // this.$forceUpdate();
    // this.selOneWeekPlan();

    setTimeout(() => {
      this.share(); // 生成预览图
      // console.log(1333);
    }, 500);
  },

  methods: {
    base64URLtoFile(base64Data, filename) {
        var arr = base64Data.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    },

    opened() {
      this.$toast({
        message: "长按图片进行分享",
        getContainer: () => this.$refs.vanImg.$el,
        duration: 1000
      });
    },

     base64URLtoFile(base64Data, filename) {
    var arr = base64Data.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
},



    share() {
      this.showMask=false
      Toast.loading({
        message: "图片生成中...",
        duration: 0, // 持续展示 toast
        forbidClick: true
      });
      html2canvas(this.$refs.review, {
        // allowTaint: true,
        useCORS: true,
        width: window.screen.availWidth,
        // height:window.screen.availHeight,
        widowWidth: document.body.scrollWidth,
        widowHeight: document.body.scrollHeight,
        scale: 2
      })
        .then(canvas => {
          const fileName=`${new Date().getTime()}.jpg`
          const file=this.base64URLtoFile(canvas.toDataURL("image/jpeg",0.6),fileName)
          const  params = new FormData();
          params.append("file", file);
          console.log(file)
          // setTimeout(() => {

          //   this.thisImgSrc="http://a.fehorizon.com/HXJFwpsTEST/image/group1/M00/01/55/rBBVfl4TDeiAPsSnAABy_cnF0PQ198.jpg"
          // this.thisImgShow = true;
          // }, 10);
           this.$getData
            .uploadImg({
              method: "post",
              data: params
            })
            .then(res => {
              console.log(res)
              if(res.code==200){
                this.thisImgSrc = res.data
                this.thisImgShow = true;
              }
            })
            .catch(() => {
              Toast.clear();
              this.showMask=false
            });
        })
    },
    imageLoad() {
      this.showMask=true
      Toast.clear();
       this.$toast({
        message: "长按图片进行分享",
        getContainer: () => this.$refs.vanImg.$el,
        duration: 1000
      });
      // this.thisImgShow = true;
    },
    imageError(error){
      this.showMask=false
      if(this.thisImgSrc){
        Toast('图片加载失败,请重新分享')
      }

    },
    // 实际方法 end

    firstFocus() {
      // 头部输入框聚焦事件
      this.firstRows = 4;
      this.$refs.list.style.top = this.initialScoll + "px";
    },
    listScroll() {
      // 滚动事件
      // this.$refs.first.style.display = 'block';
      if (!this.isFocusType) {
        this.$refs.list.style.top = this.initialScoll - 40 + "px";
        this.firstRows = 1;
      }
    },
    showBtripServe() {
      // 决定展示计划和招待的图标
      let data = {
        endDate: this.endDate,
        queryType: this.h3Active,
        startDate: this.startDate
      };
      this.$getData
        .queryHomeDataForPerson({
          method: "post",
          data
        })
        .then(res => {
          if (res.code == 200 && res.msg == "success") {
            let { entertain, trip } = res.data;

            this.weekArr.map(el => {
              entertain.length <= 0
                ? (el.isEntertain = false)
                : entertain.map(item => {
                    // 招待
                    if (item.itemDate == el.dateAll) {
                      if (item.num != 0) {
                        el.isEntertain = item.status;
                        el.imgEntertainId = item.id;
                        el.approvalEntertainStatus = item.approvalStatus;
                      } else {
                        el.isEntertain = false;
                      }
                    }
                  });
              trip.length <= 0
                ? (el.isTrip = false)
                : trip.map(item => {
                    // 出差
                    if (item.itemDate == el.dateAll) {
                      if (item.num != 0) {
                        el.imgTripId = item.id;
                        el.isTrip = item.status;
                        el.approvalTripStatus = item.approvalStatus;
                      } else {
                        el.isTrip = false;
                      }
                    }
                  });
            });
            this.$forceUpdate();
          }
        });
    },

    getWorkDay() {
      // 查询用户某周的请假和节假日
      let data = {
        endDate: moment(this.endDate).format(),
        startDate: moment(this.startDate).format(),
        wweekNum: this.numberOfWeeks.toString(),
        wyear: this.year.toString()
      };
      this.$getData
        .getWorkDay({
          method: "post",
          data
        })
        .then(res => {
          if (res.code == 200 && res.msg == "success") {
            let dataArr = res.data;
            this.weekArr.map((item, index) => {
              dataArr.map(value => {
                let date = moment(value.nowDate).format("YYYY-MM-DD");
                if (item.dateAll == date) {
                  switch (value.time) {
                    case "全天":
                      item.disabledUp = value.leaveType;
                      item.disabledDown = value.leaveType;
                      break;
                    case "上午":
                      item.disabledUp = value.leaveType;
                      break;
                    case "下午":
                      item.disabledDown = value.leaveType;
                      break;
                  }
                }
              });
            });
          } else {
            this.visitNumber = 0;
          }
        });
    },
    toVisitorlist() {
      // 跳转到访客记录界面
      let query = {
        startTime: this.startDate,
        endTime: this.endDate,
        modelType: 10
      };
      this.$router.push({ path: "/visitorlist", query });
    },
    getVisitorCount() {
      // 获取访客记录
      this.$getData
        .getVisitorCount({
          method: "post",
          data: {
            startTime: this.startDate,
            endTime: this.endDate
          }
        })
        .then(res => {
          if (res.code == 200 && res.msg == "success") {
            this.visitNumber = res.data.visitorCount;
          } else {
            this.visitNumber = 0;
          }
        });
    },
    onFocus(i) {
      // 输入框聚焦 触发同步工作计划
      if (
        this.isFocus &&
        Cookie.cookie.get("isFocus") != this.weekArr[i].dateAll
      ) {
        this.isFocus = false;
        Cookie.cookie.set("isFocus", this.weekArr[i].dateAll, 60 * 60 * 24);
        Dialog.confirm({
          message: "确定将当日计划内容同步到回顾吗？"
        })
          .then(() => {
            this.$set(
              this.weekArr[i],
              "dworkReviewDesPm",
              this.weekArr[i].dworkPlanDesPm
            );
            this.$set(
              this.weekArr[i],
              "dworkReviewDesAm",
              this.weekArr[i].dworkPlanDesAm
            );
            this.$forceUpdate();
            // this.weekArr[i].dworkReviewDesPm = this.weekArr[i].dworkPlanDesPm;
            // this.weekArr[i].dworkReviewDesAm = this.weekArr[i].dworkPlanDesAm; // 当日上午的工作计划
          })
          .catch(() => {});
      }
    },

    butisShow() {
      // 判断计划的提交保存按钮是否展示
      return (
        this.wstatus == 1 &&
        this.h3Active == 1 &&
        (this.numberOfWeeks >= this.numberOfWeeksNow &&
          this.numberOfWeeks <= this.numberOfWeeksNow + 2)
      );
    },

    weekDay(str) {
      // 处理当前为星期几
      let s = "";
      switch (str) {
        case "Monday":
          s = "一";
          break;
        case "Tuesday":
          s = "二";
          break;
        case "Wednesday":
          s = "三";
          break;
        case "Thursday":
          s = "四";
          break;
        case "Friday":
          s = "五";
          break;
        case "Saturday":
          s = "六";
          break;
        case "Sunday":
          s = "日";
          break;
      }
      return "星期" + s;
    },
    wdDate(i, date) {
      // 展示审阅的日期
      var str;
      if (date) {
        var weekDay = moment(date).format("dddd");
        return (
          moment(date).format("YYYY-MM-DD HH:mm:ss") +
          " " +
          this.weekDay(weekDay)
        );
      }
      if (this.h3Active == 1) {
        var weekDay = moment(this["wplanVerifiedDate" + i]).format("dddd");
        return (
          moment(this["wplanVerifiedDate" + i]).format("YYYY-MM-DD HH:mm:ss") +
          " " +
          this.weekDay(weekDay)
        );
      } else if (this.h3Active == 2) {
        var weekDay = moment(this["dreviewVerifiedDate" + i]).format("dddd");
        return (
          moment(this["dreviewVerifiedDate" + i]).format(
            "YYYY-MM-DD HH:mm:ss"
          ) +
          " " +
          this.weekDay(weekDay)
        );
      }
    },
    wplanDreviewVerifiedOpinio: function(i) {
      // 决定显示审核内容
      if (this.h3Active == 1) {
        return this["wplanVerifiedOpinion" + i];
      } else if (this.h3Active == 2) {
        return this["dreviewVerifiedOpinion" + i];
      }
    },
    placeholderReviewShow: function(item) {
      // 决定回顾的提示信息

      if (
        this.newDate.format("yyyy-MM-dd") == item.dateAll &&
        this.h3Active == 2 &&
        this.dstatus == 3
      ) {
        return "请填写工作回顾";
      } else if (
        new Date(item.dateAll).getTime() > this.newDate.getTime() &&
        this.h3Active == 2 &&
        this.dstatus == 3 &&
        this.wstatus == 3
      ) {
        return "未到回顾时间";
      } else if (
        new Date(item.dateAll).getTime() < this.newDate.getTime() &&
        this.h3Active == 2
      ) {
        return "未填写";
      } else if (
        this.wstatus == 1 &&
        this.h3Active == 2 &&
        new Date(item.dateAll).getTime() < this.newDate.getTime()
      ) {
        return "未填写";
      } else if (
        new Date(item.dateAll).getTime() > this.newDate.getTime() &&
        this.h3Active == 2 &&
        this.wstatus <= 3
      ) {
        return "请先完成本周工作计划";
      }
      // !disabledReview(item) ? '请填写工作回顾！' : ''
    },
    disabledReview: function(item) {
      // 决定非当日不能填写 回顾
      return (
        !(this.newDate.format("yyyy-MM-dd") == item.dateAll) ||
        (this.h3Active == 2 && (this.dstatus == 3 || this.dstatus == 2))
      );
    },

    // 接口方法 start
    myNotify(str) {
      // 提示框方法
      this.$notify({
        message: str,
        duration: 2000,
        className: "myNotify"
      });
    },
    selOneWeekPlan() {
      // 查询某周的计划 和 回顾
      let wweekNum = this.numberOfWeeks;
      let wyear = this.year;
      this.overlayShow = true;

      // 清楚数据缓存 start
      // end
      this.$getData
        .selOneWeekPlan({
          method: "post",
          data: {
            wweekNum: wweekNum.toString(),
            wyear: wyear.toString(),
            adAcount: this.adAcount
          }
        })
        .then(res => {
          // 将加载中隐藏
          this.overlayShow = false;
          if (res.code == 200 && res.data) {
            let data = res.data;
            this.wworkPlanDes = data.wworkPlanDes;
            this.wworkReviewDes = data.wworkReviewDes;
            this.wid = data.wid;
            this.wstatus = data.wstatus;
            this.adAcount = data.adAcount; // 新增 保存adAcount
            if (data.wstatus >= 3) {
              this.wplanVerifiedOpinion1 = data.wplanVerifiedOpinion1;
              this.wverifiedUserName1 = data.wverifiedUserName1;
              this.wplanVerifiedOpinion2 = data.wplanVerifiedOpinion2;
              this.wverifiedUserName2 = data.wverifiedUserName2;

              this.wplanVerifiedDate1 = data.wplanVerifiedDate1;
              this.wplanVerifiedDate2 = data.wplanVerifiedDate2;
            }
            data.workPlanDayList.map((item, index) => {
              let i = index == 0 ? this.weekArr.length - 1 : index - 1;
              this.weekArr[i].did = item.did;
              this.weekArr[i].dworkPlanDesPm = item.dworkPlanDesPm;
              this.weekArr[i].dworkPlanDesAm = item.dworkPlanDesAm; // 当日上午的工作计划
              this.weekArr[i].dworkReviewDesAm = item.dworkReviewDesAm;
              this.weekArr[i].dworkReviewDesPm = item.dworkReviewDesPm;
              if (item.dworkPlanDate == this.newDate.format("yyyy-MM-dd")) {
                this.did = item.did;
                this.dstatus = item.dstatus;
                this.dreviewVerifiedOpinion1 = item.dreviewVerifiedOpinion1;
                this.dreviewVerifiedOpinion2 = item.dreviewVerifiedOpinion2;
                this.dreviewVerifiedDate1 = item.dreviewVerifiedDate1;
                this.dreviewVerifiedDate2 = item.dreviewVerifiedDate2;
                this.dverifiedUserName1 = item.dverifiedUserName1;
                this.dverifiedUserName2 = item.dverifiedUserName2;
              }
              if (item.dreviewVerifiedOpinion1) {
                let verifObj = {
                  dreviewVerifiedOpinion1: item.dreviewVerifiedOpinion1,
                  dreviewVerifiedOpinion2: item.dreviewVerifiedOpinion2,
                  dreviewVerifiedDate1: item.dreviewVerifiedDate1,
                  dreviewVerifiedDate2: item.dreviewVerifiedDate2,
                  dverifiedUserName1: item.dverifiedUserName1,
                  dverifiedUserName2: item.dverifiedUserName2
                };
                this.dreviewVerifiedOpinionArr.push(verifObj);
              }
            });
          } else {
            this.clearView();
          }
        });
    },
    // 接口方法 end

    handelChange(date) {
      console.log("date", date.$d);
      this.getWeekOfYear(date.$d);
    },
    dateFormat() {
      // date格式处理函数
      Date.prototype.format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return fmt;
      };
    },
    dateRight() {
      // 日期下一周按钮事件
      // this.getXDate(this.year,this.numberOfWeeks);
      this.numberOfWeeks++;
    },
    dateLeft() {
      // 日期上一周按钮事件
      this.numberOfWeeks--;
    },
    optionDate() {
      // 控制日期弹出组件的状态
      this.show = true;
      this.calendarShow = true;
    },

    headerUlClick(e) {
      // 顶部菜单切换
      switch (e.target.innerHTML) {
        case "计划与回顾":
          this.active = 1;
          this.viewShow = "review";
          break;
        case "同事圈":
          this.active = 2;
          this.viewShow = "colleague";
          break;
        case "转发":
          this.active = 3;
          this.viewShow = "transpond";
          break;
      }
    },
    getWeekOfYear(date) {
      // 返回当前是第几周
      var today;
      if (date) {
        today = date;
      } else {
        today = new Date();
      }
      var year = today.getFullYear(); //获取选中的当前年
      var firstDay = new Date(year, 0, 1);
      var dayOfWeek = firstDay.getDay(); //返回表示星期几的数字 0~6
      var spendDay = 1;
      if (dayOfWeek != 1 && dayOfWeek != 0) {
        spendDay = 7 - dayOfWeek + 1 + 1;
      } else if (dayOfWeek == 0) {
        spendDay = 2;
      }
      firstDay = new Date(year, 0, spendDay); // 一年中第一周的开始时间 2019-01-07
      console.log(firstDay.format("yyyy-MM-dd"));
      console.log(today.format("yyyy-MM-dd"));
      // firstDay = new Date(today.getFullYear(),0, 1+spendDay);
      var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000); // 计算时间差 向上取整
      var result;
      if (d == 0) {
        result = 1;
      } else if (d < 0) {
        result = -1;
        var _week;
        year--;
        var date = new Date(year, "0", "1");
        _week = date.getDay();
        if (_week != 1) {
          // 一年53周的情况
          result = 52; // 应该为53周 2018 1
        } else {
          //一年54周情况
          result = 53; // 52
        }
      } else if (d % 7 == 0) {
        // result = Math.ceil(d/7) ;
        result = d / 7 + 1; // 最新版本 保证周一为本周
      } else {
        result = Math.ceil(d / 7) == 0 ? 1 : Math.ceil(d / 7);
        // result = Math.ceil(d/7) + 1;
      }
      this.year = year;
      this.numberOfWeeks = result;
      return result;
    }
  },
  computed: {
    placeholderPlanShow: function() {
      // 决定当日计划的提示信息
      if (this.wstatus == 1 && this.butisShow()) {
        return "请填写当日工作计划";
      } else if (
        this.numberOfWeeks >= this.numberOfWeeksNow &&
        this.numberOfWeeks <= this.numberOfWeeksNow + 3 &&
        this.h3Active == 1 &&
        this.wstatus != 1
      ) {
        return "未填写";
      }
    },
    placeholderShow: function() {
      // 决定周计划和回顾的提示信息
      if (
        !(
          (this.wstatus != 1 && this.h3Active == 1) ||
          (this.h3Active == 2 && this.dstatus != 3)
        )
      ) {
        if (this.h3Active == 1 && this.butisShow()) {
          return "请填写本周重点工作";
        } else if (this.h3Active == 2) {
          return "请填写本周总结报告";
        }
      } else if (
        this.h3Active == 2 &&
        this.wstatus == 3 &&
        this.numberOfWeeks > this.numberOfWeeksNow
      ) {
        return "未到回顾时间";
      } else if (this.h3Active == 2 && this.dstatus > 3) {
        return "未填写";
      } else if (
        this.h3Active == 2 &&
        this.numberOfWeeksNow > this.numberOfWeeks
      ) {
        return "未填写";
      } else if (
        this.h3Active == 2 &&
        this.numberOfWeeksNow < this.numberOfWeeks &&
        this.wstatus < 3
      ) {
        return "请先完成本周工作计划";
      } else {
        return "";
      }
    },
    lastNumberOfweeks: function() {
      // 上一周展示按钮
      var last = this.numberOfWeeks - 1;
      if (last < 1) {
        var year = this.year;
        var date = new Date(year - 1, "0", "1");
        var _week = date.getDay();
        if (_week != 1) {
          // 一年53周的情况
          last = 52; // 应该为53周 2018 1
        } else {
          //一年54周情况
          last = 53; // 52
        }
      }
      return last;

      var _week;
      var year = this.year;
      var date = new Date(year, "0", "1");

      if (this.numberOfWeeks < 1) {
        this.year--;
        var time = date.getTime();
        _week = date.getDay();
      } else {
        if (_week != 1) {
          // 一年52周的情况
          if (this.numberOfWeeks > 52) {
            this.year++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year, "0", "1");
            var time = date.getTime();
            _week = date.getDay();
          }
        } else {
          //一年53周情况
          if (this.numberOfWeeks > 53) {
            this.year++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year, "0", "1");
            var time = date.getTime();
            _week = date.getDay();
          }
        }
      }
    },
    nextNumberOfWeeks: function() {
      // 下一周展示按钮
      var next = parseInt(this.numberOfWeeks) + 1;
      var year = this.year;
      var date = new Date(year + 1, "0", "1");
      var _week = date.getDay();

      if (_week != 1) {
        // 一年52周的情况
        if (next > 52) {
          next = 1;
        }
      } else {
        //一年53周情况
        if (next > 53) {
          next = 1;
        }
      }
      return next;
    },
    // wplanVerifiedOpinion dreviewVerifiedOpinion

    wworkPlanReviewDes: {
      // 展示周计划 或 回顾
      set: function(newValue) {
        newValue = newValue.replace(/(^\s*)|(\s*$)/g, "");
        if (this.h3Active == 1) {
          this.wworkPlanDes = newValue;
        } else if (this.h3Active == 2) {
          this.wworkReviewDes = newValue;
        }
      },
      get: function() {
        if (this.h3Active == 1) {
          return this.wworkPlanDes;
        } else if (this.h3Active == 2) {
          return this.wworkReviewDes;
        }
      }
    },
    getXDate: function() {
      // 根据周数获取当前周的日期范围
      var _week;
      if (!this.year) {
        return "";
      }
      var year = this.year;
      var date = new Date(year, "0", "1");
      var time = date.getTime();
      _week = date.getDay();
      if (this.numberOfWeeks < 1) {
        this.year--;
        // let _week0 = new Date(this.year,"0","1").getDay();

        var date = new Date(this.year, "0", "1");
        var time = date.getTime();
        _week = date.getDay();
        // date = new Date(this.year,"0","1");
        // _week = date.getDay();
        if (_week != 1) {
          // 一年53周的情况
          this.numberOfWeeks = 52; // 应该为53周 2018 1
        } else {
          //一年54周情况
          this.numberOfWeeks = 53; // 52
        }
      } else {
        // var _week0 = new Date((this.year-1),"0","1").getDay();
        if (_week != 1) {
          // 一年52周的情况
          if (this.numberOfWeeks > 52) {
            this.year++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year, "0", "1");
            var time = date.getTime();
            _week = date.getDay();
          }
        } else {
          //一年54周情况
          if (this.numberOfWeeks > 53) {
            this.year++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year, "0", "1");
            var time = date.getTime();
            _week = date.getDay();
          }
        }
      }
      // 当这一年的1月1日为周日时则本年有54周，否则没有54周，没有则去除第54周的提示
      var cnt = 0; // 获取距离周末的天数
      switch (_week) {
        case 2:
          cnt = 5;
          break;
        case 3:
          cnt = 4;
          break;
        case 4:
          cnt = 3;
          break;
        case 5:
          cnt = 2;
          break;
        case 6:
          cnt = 1;
          break;
      }
      if (_week == 1) {
        cnt = 0;
      } else {
        cnt += 1; //加1表示以星期一为一周的第一天
      }
      var _start = date.format("MM月dd日");
      // 将这个长整形时间加上第N周的时间偏移
      time += cnt * 24 * 3600000; //第1周开始时间
      var nextYear = new Date(parseInt(year, 10) + 1, "0", "1"); // parseInt(str,10) 10进制解析字符串
      var nextWeek = nextYear.getDay();
      var lastcnt = 0; //获取最后一周开始时间到周末的天数
      switch (nextWeek) {
        case 0:
          cnt = 6;
          break;
        case 1:
          cnt = 0;
          break;
        case 2:
          cnt = 1;
          break;
        case 3:
          cnt = 2;
          break;
        case 4:
          cnt = 3;
          break;
        case 5:
          cnt = 4;
          break;
        case 6:
          cnt = 5;
          break;
      }

      date.setTime(time);
      // var _start = date.format("MM-dd");
      var start = time + (this.numberOfWeeks - 1) * 7 * 24 * 3600000; //第n周开始时间
      date.setTime(start);
      this.startDate = date.format("yyyy-MM-dd");
      var _start = date.format("MM-dd");
      // var arr = [];
      // arr.push(date.getDate());
      console.log("this.arr", this.weekArr);
      this.weekArr[0].date = date.getDate();
      this.weekArr[0].dateAll = date.format("yyyy-MM-dd");
      this.weekArrNull[0].dateAll = date.format("yyyy-MM-dd");
      for (var i = 1; i <= 6; i++) {
        start += 24 * 3600000;
        date.setTime(start);
        // arr.push(date.getDate());
        this.weekArr[i].date = date.getDate();
        this.weekArr[i].dateAll = date.format("yyyy-MM-dd");
        this.weekArrNull[i].dateAll = date.format("yyyy-MM-dd");
      }
      // this.weekArr = arr;
      var end = start;
      var end = time + this.numberOfWeeks * 7 * 24 * 3600000 - 24 * 3600000; //第n周结束时间
      // var end = time+(this.numberOfWeeks*7 - 1)*24*3600000- 24*3600000; //第n周结束时间
      // 为日期对象 date 重新设置成时间 time
      date.setTime(end);
      this.endDate = date.format("yyyy-MM-dd");
      var _end = date.format("MM-dd");

      return _start + "至" + _end;
    },
    fontChange: function() {
      // 根据索引决定星期几
      return function(i) {
        switch (i) {
          case 0:
            return "一";
          case 1:
            return "二";
          case 2:
            return "三";
          case 3:
            return "四";
          case 4:
            return "五";
          case 5:
            return "六";
          case 6:
            return "日";
        }
      };
    },
    h3ActiveS: {
      // h3Active 的特殊算法
      set: function(newValue) {
        this.h3Active = newValue;
      },
      get: function() {
        if (this.h3Active == 0) {
          this.h3Active = 2;
        } else if (this.h3Active == 3) {
          this.h3Active = 1;
        }
        return this.h3Active;
      }
    }
  },
  watch: {
    h3Active: function(val) {
      this.$nextTick(function() {
        // 在下次 DOM 更新循环结束之后执行延迟回调。
        this.showBtripServe(); // 查询出差和招待的图标
      });
      this.required = false;
    },
    getXDate: function() {
      this.getVisitorCount(); // 获取访客记录数
    },
    overlayShow: function(val, val0) {
      let _this = this;
      if (val) {
        this.overlayShowTime = setTimeout(function() {
          _this.myNotify("数据加载失败");
          _this.overlayShow = false;
        }, 5000);
      } else {
        clearTimeout(this.overlayShowTime);
      }
    },
    numberOfWeeks: function(val, val0) {
      // this.selOneWeekPlan();
      this.getWorkDay(); // 注释请求节假日接口 2020/01/03
    }
  }
};
</script>

<style lang="scss" scoped >
.myVanPopup {
  // 生成图片遮罩层样式
  width: 80%;
}

.field {
  min-height: 82px;
  box-sizing: border-box;
  width: 340px;
  overflow: hidden;
  padding: 10px 16px;
  // 换行样式
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
// 新增样式end

$blue: #4b77af;
$int: 26px;
p {
  margin: 0;
}
// 顶部导航 start
.blue {
  $h: 40px;
  background-color: $blue;
  width: 100%;
  height: $h;
  .headerUl {
    height: $h;
    padding-left: $int;
    margin: 0;
    float: left;
    li {
      float: left;
      margin-right: 10.5px;
      line-height: 30px;
      font-weight: 700;
      color: #8bbdde;
      height: 80%;
      font-size: 17px;
      &.active {
        border-bottom: 2px solid #fff;
        color: #fff;
      }
    }
  }
  img {
    width: 28px;
    height: 28px;
    display: inline-block;
    vertical-align: middle;
  }
  .close {
    float: right;
    margin: 0;
    padding-right: 17px;
    line-height: $h;
    height: 100%;
  }
  .record {
    float: right;
    margin-right: 20px;
    height: 100%;
    line-height: $h;
  }
}
// 顶部导航end

input:disabled {
  color: #000;
}

#visitNumber {
  // 拜访次数样式
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  color: #007aff;
  height: 100%;
  line-height: 36px;
  vertical-align: middle;
  & > .visitNumber_span {
    margin-left: 4px;
    line-height: 36px;
  }
}
#myPopup {
  // 我的弹出层样式
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.but_b {
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -1px 8px #3488c2;
  height: 42px;
  z-index: 2;
  & button {
    width: 33%;
    float: left;
    height: 100%;
    font-size: 20px;
    line-height: 42px;
    font-weight: 600;
    border: 0;
    &:nth-of-type(1) {
      background: #fff;
      color: #4b77af;
    }
    &:nth-of-type(2) {
      background: #669bdf;
      color: #fff;
    }
    &:nth-of-type(3) {
      background: #4b77af;
      color: #fff;
      font-size: 16px;
      font-weight: 600;
      padding: 0;
    }
    &.withdraw {
      width: 100%;
    }
  }
}
#review {
  // 计划与回顾的样式
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  & > .hHeader {
    height: 42px;
    background: #ececec;
    & > h3 {
      height: 100%;
      width: 50%;
      box-sizing: border-box;
      margin: 0;
      font-size: 18px;
      line-height: 42px;
      padding: 0 $int;
      color: $blue;
      &:nth-of-type(1) {
        float: left;
      }
      &:nth-of-type(2) {
        float: right;
        text-align: right;
      }
      &.active {
        background-image: linear-gradient(
          182deg,
          rgba(130, 175, 216, 0.04) 1%,
          rgba(75, 119, 175, 0.2) 100%
        );
      }
    }
  }

  .first {
    // 从.list移动到了外面 同时组件也进行了移动
    padding: 5px 11px 20px 21px;
    min-height: 120px;
    box-sizing: border-box;
    // margin-bottom: 10px;
    background: #fff;
    .title {
      height: 36px;
      font-size: 17px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(72, 72, 72, 1);
      line-height: 36px;
      border-bottom: 2px solid #4b77af;
      margin-bottom: 6px;
    }
  }
  .list {
    // height: 100%;box-sizing: border-box;
    // position: absolute;left: 0;right: 0;bottom: 0;
    // top: 200px;
    padding-top: 10px;
    // 新增样式 end
    width: 100%;
    overflow-y: scroll;
    background: #ececec;
    padding-bottom: 64px;
    & > textarea {
      border: 0;
      padding: 10px 27px;
      width: 100%;
      box-sizing: border-box;
      height: 98px;
      margin-bottom: 10px;
    }
  }
  .flexbox {
    // 周一~日的工作计划列表
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 160px;
    background: #fff;
    margin-bottom: 10px;
    .box-l {
      width: 42px;
      text-align: center;
      height: 64px;
      display: inline-block;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      & > div {
        margin: 0 auto;
        width: 30px;
        height: 2px;
        background-image: linear-gradient(270deg, #8bbae5 0%, #4b77af 100%);
      }
      p {
        letter-spacing: -0.24px;
        font-size: 12px;
        line-height: 37px;
        padding-left: 5px;
        & > span {
          font-size: 20px;
        }
      }
      // &:before{ content: '';display: inline-block;vertical-align:middle;height: 100%; }
    }
    .box-c {
      width: 26px;
      height: 100%;
      p {
        height: 50%;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        &:nth-of-type(1) img {
          transform: scaleY(-1);
        }
      }
    }
    .box-r {
      width: 70%;
      height: 100%;
      textarea {
        height: 49%;
        box-sizing: border-box;
        width: 100%;
        padding: 20px 0;
        border: 0;
        font: 14px/20px "";
        &:nth-of-type(1) {
          border-bottom: 1px solid rgba(75, 119, 175, 0.2);
        }
      }
    }
  }
  .calendar {
    // 日期横幅展示样式
    display: flex;
    justify-content: space-between;
    height: 66px;
    background-color: $blue;
    color: #fff;
    font-size: 15px;
    line-height: 66px;
    width: 100%;
    span:not(:nth-of-type(2)) {
      display: inline-block;
      padding: 0 26px;
      & img {
        vertical-align: middle;
        width: 8px;
        height: 15px;
      }
    }
    span:last-child {
      img {
        transform: rotate(-180deg);
      }
    }
  }
  .vanNavBar {
    // 顶部vant导航样式
    height: 60px;
    border-bottom: 10px solid #ececec;
    .van-nav-bar__left,
    .van-nav-bar__left > div {
      height: 100%;
      display: flex;
      align-items: center;
      color: #007aff;
    }
    .van-nav-bar__right,
    .van-nav-bar__right > div {
      height: 100%;
      display: flex;
      align-items: center;
      color: #007aff;
    }
    .van-nav-bar__title {
      height: 100%;
      & > div {
        height: 100%;
        padding-top: 10px;
        box-sizing: border-box;
        .title_h3 {
          height: 24px;
          font-size: 17px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: rgba(72, 72, 72, 1);
          line-height: 24px;
          position: relative;
        }
        .title_span {
          margin: 0 auto;
          width: 200px;
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(72, 72, 72, 1);
          line-height: 17px;
        }
      }
    }
  }
}

.main {
  // position: absolute;left: 0;right: 0;bottom: 0;top:120px;overflow-y: scroll;
  // 新增样式 end
  padding: 11px;
  background: #fff;
  .title {
    height: 17px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(72, 72, 72, 1);
    line-height: 17px;
    border-bottom: 1px solid #4b77af;
    padding-bottom: 2px;
    display: flex;
    align-items: center;
    // vertical-align: middle;

    & > span:first-child {
      margin-right: 10px;
    }
    .van-image {
      // margin-left: 10px;
      padding: 0 7px;
    }
  }
  .itemText {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
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
    & > .popupUp {
      position: absolute;
    }
    // &>.popupDown{}
  }
  .itemUp {
    padding-top: 5px;
  }
}

#opinion {
  // 管理者意见样式
  background: #fff;
  padding-top: 8px;
  // height: 180px; UI图样式
  min-height: 150px;
  padding-bottom: 17px;
  &::before {
    content: "";
    margin-left: 9px;
    width: 6px;
    height: 20px;
    background: #367ef4;
    display: block;
    float: left;
  }
  & > h3 {
    margin: 0;
    float: left;
    padding-bottom: 5px;
    border-bottom: 2px solid #4b77af;
    margin-left: 12px;
  }
  // 12px
  & > div {
    margin-top: 42px;
    padding: 0 22px 0 27px;
    height: 120px;
    & > div {
      width: 50%;
      position: relative;
      // width: 100%;
      height: 100%;
      box-sizing: border-box;
      p {
        height: 60px;
        font: 17px/24px "";
        letter-spacing: -0.24px;
        overflow: scroll;
      }
      & > div {
        font: 12px/17px "";
        text-align: right;
        position: absolute;
        top: 60px;
        width: 100%;
      }
    }
    & > div:nth-of-type(1) {
      float: left;
      padding-right: 10px;
      border-right: 1px solid rgba(75, 119, 175, 0.2);
    }
    & > div:nth-of-type(2) {
      float: right;
      padding-left: 15px;
    }
  }
}
#transpond {
  // 转发样式
  .item {
    display: flex;
    justify-content: space-between;
    .item_c {
      h4 {
        display: inline-block;
        margin: 0;
      }
    }
  }
}
#tabDiv {
  // 轮播界面样式
  background: #ececec;
  position: relative;
  // 新增样式
  width: 100%;
  position: fixed;
  top: 70px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  // overflow-y: scroll;
  // padding-bottom: 64px;
}
</style>

<style lang="scss">
  .watermark{
    height:20000px;
  }
.van-field--disabled .van-field__control,
.van-field__right-icon {
  // 修改输入框的disabled文字样式
  -webkit-color: #000;
  -moz-color: #000;
  -o-color: #000;
  color: #000;
  -webkit-opacity: 1;
  -moz-opacity: 1;
  -o-opacity: 1;
  opacity: 1;
}

// vue 解决disabled的样式问题
#tabDiv .list textarea[disabled],
textarea:disabled,
textarea.disabled {
  // -webkit-text-fill-color:#000;  //会将提示文字也修改掉
  -webkit-text-fill-color: initial;
  -webkit-color: #000;
  -moz-color: #000;
  -o-color: #000;
  color: #000;
  -webkit-opacity: 1;
  -moz-opacity: 1;
  -o-opacity: 1;
  opacity: 1;
}
// vue 解决disabled的样式问题 end

.myNotify {
  // 提示框样式
  &.van-popup.van-popup--top.van-notify.van-notify--danger {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 48px;
    width: 50%;
    margin: auto;
    font-size: 17px;
    line-height: 48px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    background: #7f7f7f;
    padding: 0 10px;
    display: inline-block;
    border-radius: 5px;
  }

}
</style>
