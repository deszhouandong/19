<template>
  <div class="leaderConfirm clear">
    <!-- 引导图 -->
    <!-- <div class="leader-img-wrap" v-if="leaderConfirm1">
      <div class="leader-img-inner" v-if="leaderConfirmImg1">
        <img :src="leaderConfirmImg1Url" alt class="leader-img" />
        <div
          class="btn-next btn-next1"
          @click="closeLeader({
          type:'next',
          from:'leaderConfirmImg1',
          to:'leaderConfirmImg2',
        })"
        ></div>
      </div>
      <div class="leader-img-inner" v-if="leaderConfirmImg2">
        <img :src="leaderConfirmImg2Url" alt class="leader-img" />
        <div
          class="btn-next btn-next2"
          @click="closeLeader({
          type:'next',
          from:'leaderConfirmImg2',
          to:'leaderConfirmImg3',
        })"
        ></div>
      </div>
      <div class="leader-img-inner" v-if="leaderConfirmImg3">
        <img :src="leaderConfirmImg3Url" alt class="leader-img" />
        <div
          class="btn-know btn-know3"
          @click="closeLeader({
          type:'end',
          from:'leaderConfirmImg3',
          leaderCookie:'leaderConfirm1'
        })"
        ></div>
      </div>
    </div> -->
    <div class="scroll-box clear">
      <AttendanceCard :message="message" :enumerationInitialData="enumerationInitialData" />
      <!-- 领导意见 -->
      <div class="bg-white clear section" v-if="comfirmType==='CONFIRMED'">
        <CardTitle title="领导意见" class="normal"></CardTitle>
        <CardList :cardListProps="cardListProps" :message="message" :status="status" />
      </div>
      <!-- 上上级查看或者层级关系改变 -->
      <div class="bg-white clear section" v-if="isOneSelf===false&&comfirmType==='UNCONFIRMED'">
        <CardTitle title="领导意见" class="normal"></CardTitle>
        <CardList
          :cardListProps="cardListProps"
          :isOneSelf="isOneSelf"
          :comfirmType="comfirmType"
          :message="message"
          :status="status"
        />
      </div>
      <template v-if="isOneSelf">
        <!-- 员工申诉框 -->
        <div class="bg-white clear section" v-if="appeal&&!appealTime&&!replyTime">
          <CardTitle title="考勤申诉" :showBorder="true"></CardTitle>
          <div style="padding-bottom:10px;">
            <van-cell-group class="fileld-cell-group">
              <van-field
                v-model="reason1"
                :autosize="{minHeight:60}"
                type="textarea"
                class="fileld-item"
              />
            </van-cell-group>
          </div>
        </div>
        <!-- 申诉意见框（不可编辑） -->
        <div class="bg-white clear section" v-if="appealTime&&!replyTime&&!appeal">
          <CardTitle title="考勤申诉" :showBorder="true">
            <div class="title-content" slot="content">申诉时间：{{message.appealTimeToStr}}</div>
          </CardTitle>
          <div style="padding-bottom:10px;">
            <van-cell-group class="fileld-cell-group">
              <van-field
                v-model="reason"
                :autosize="{minHeight:60}"
                type="textarea"
                class="fileld-item"
                readonly="readonly"
              />
            </van-cell-group>
          </div>
        </div>
        <!-- 领导未确认或者领导未申诉确认且员工已申诉，显示可操作选项 -->
        <div
          class="bg-white clear section"
          v-if="normalToNotConfirmTag||(comfirmType==='UNCONFIRMED'&&excptionTime==='ABNORMAL')||(!replyTime&&appealTime&&!appeal)"
        >
          <CardTitle title="考勤确认" :showBorder="true"></CardTitle>
          <CardRadio ref="cardRadio" :cardRadioProps="message" />
        </div>
      </template>
      <!-- 申訴原因 -->
      <div
        class="bg-white clear section"
        v-if="replyTime||(isOneSelf===false&&!replyTime&&appealTime)||(appeal&&(!replyTime&&appealTime))"
      >
        <CardTitle title="员工申诉" class="normal"></CardTitle>
        <CardList :cardListProps="cardListPropsReason" :message="message" :status="status" />
      </div>
      <!-- 最终意见 -->
      <div class="bg-white clear section" v-if="replyTime">
        <CardTitle title="最终意见" class="normal"></CardTitle>
        <CardList :cardListProps="cardListPropsFinal" :message="message" :status="status" />
      </div>
      <!-- 如果上上级查看或者层级关系改变,如果已经涉诉但未确认,显示下面最终意见 -->
      <div
        class="bg-white clear section"
        v-if="((isOneSelf===false&&!replyTime&&appealTime))||(appeal&&(!replyTime&&appealTime))"
      >
        <CardTitle title="最终意见" class="normal"></CardTitle>
        <CardList :cardListProps="cardListPropsFinal1" :message="message" :status="status" />
      </div>
    </div>
    <template v-if="isOneSelf">
      <!-- 正常考勤显示不确认和正常确认按钮 -->
      <div class="btn-wrap" v-if="excptionTime==='NORMAL'&&comfirmType==='UNCONFIRMED'">
        <button class="refuse" @click="unConfirm" :disabled="unConfirmDisabled">不确认</button>
        <button class="accept" @click="delayConfirm" :disabled="confirmDisabled">正常确认</button>
      </div>

      <div
        v-if="(comfirmType==='UNCONFIRMED'&&excptionTime==='ABNORMAL')||appeal||(!replyTime&&appealTime)||normalToNotConfirmTag"
      >
        <div class="btn-wrap" v-if="(appeal&&(!replyTime&&appealTime))"></div>
        <div class="btn-wrap" v-else>
          <button class="refuse" @click="cancel" :disabled="cancelDisabled">取消</button>
          <button class="accept" @click="delayPost" :disabled="postDisabled">提交</button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import { Toast } from "vant";
import AttendanceCard from "@/component/punch/AttendanceCard";
import CardTitle from "@/component/punch/CardTitle";
import CardList from "@/component/punch/CardList";
import CardRadio from "@/component/punch/CardRadio";
import { getCookie, setCookie } from "@/apis/cookie1";

export default {
  name: "leaderConfirm",
  components: {
    AttendanceCard,
    CardTitle,
    CardList,
    CardRadio
  },
  /**
   * @title data参数
   *
   * @param reason      （申诉原因）
   * @param message      (接口所取得的初始化数据)
   * @param excptionTime (考试是否正常)
   *        NORMAL-正常   ABNORMAL-不正常
   * @param comfirmType （领导是否确认）
   *        UNCONFIRMED-未确认 CONFIRMED-已确认
   * @param appealTime  （员工申诉时间）
   *        null-未申诉  2019-11-11T09:35:48.000+0000-已申诉时间
   * @param replyTime   （领导确认员工申诉时间）
   *        null-未确认  2019-11-11T09:35:48.000+0000-已确认时间
   *
   */
  data() {
    return {
      normalToNotConfirmTag: false, //正常考勤是否显示可操作选项
      reason: "", //申诉原因
      reason1: "", //申诉原因
      message: {}, //接口所取得的初始化数据
      comfirmType: null,
      excptionTime: null,
      appealTime: null,
      replyTime: null,
      abnormalCheckinStatus: null,
      isOneSelf: false,
      status: {},
      // 领导意见
      cardListProps: {
        tag: "leaderOption",
        list: [
          {
            label: "确认时间",
            key: "comfirmTimeToStr"
          },
          {
            label: "当前意见",
            key: "currentOpinion"
          },
          {
            label: "确认人",
            key: "leaderName"
          },
          {
            label: "考勤状态",
            key: "checkinStatus",
            color: "#4B77AF"
          }
        ]
      },

      //最终意见
      cardListPropsFinal: {
        tag: "finalOption",
        list: [
          {
            label: "确认时间",
            key: "replyTimeToStr"
          },
          {
            label: "最终意见",
            key: "finalOpinion"
          },
          {
            label: "确认人",
            key: "leaderName"
          },
          {
            label: "考勤状态",
            key: "checkinStatus",
            color: "#4B77AF"
          }
        ]
      },
      //最终意见
      cardListPropsFinal1: {
        tag: "finalOption1",
        list: [
          {
            label: "确认时间",
            key: "replyTimeToStr"
          },
          {
            label: "最终意见",
            key: "finalOpinion"
          },
          {
            label: "确认人",
            key: "leaderName"
          },
          {
            label: "考勤状态",
            key: "checkinStatus",
            color: "#4B77AF"
          }
        ]
      },

      //申訴原因
      cardListPropsReason: {
        tag: "appealReason",
        list: [
          {
            label: "申诉时间",
            key: "appealTimeToStr"
          },
          {
            label: "申诉原因",
            key: "appealDesc"
          }
        ]
      },

      id: "", //通过页面跳转拿到的id
      appendId: "", // 通过消息传来的id
      type: "",
      types: "",
      chooseDate: "",
      unConfirmDisabled: false,
      confirmDisabled: false,
      cancelDisabled: false,
      postDisabled: false,
      enumerationInitialData: {}, //所有枚举类
      appeal: false, //是否为申诉
      // 引导图路径
      leaderConfirmImg1Url: require("@static/imgs/leader/leaderConfirmImg1.png"),
      leaderConfirmImg2Url: require("@static/imgs/leader/leaderConfirmImg2.png"),
      leaderConfirmImg3Url: require("@static/imgs/leader/leaderConfirmImg3.png"),
      leaderKnowUrl: require("@static/imgs/leader/know.png"),
      leaderNext1Url: require("@static/imgs/leader/next1.png"),
      leaderNext2Url: require("@static/imgs/leader/next2.png"),
      // 是否展示隐藏层,第一次进入展示
      leaderConfirm1: false, //用于存入cookie,从而使得后面进入不再展示
      leaderConfirmImg1: true,
      leaderConfirmImg2: false,
      leaderConfirmImg3: false
    };
  },
  methods: {
    enumerationInitial(str) {
      let enumerationInitialData = {};
      for (let index in str) {
        enumerationInitialData[index] = JSON.parse(str[index]);
      }
      this.enumerationInitialData = enumerationInitialData;
    },
    getCheck() {
      this.$getData
        .checkinInfo({
          method: "post",
          data: {
            id: this.id || this.appendId
          }
        })
        .then(res => {
          const that = this;
          this.message = res.data;
          const {
            comfirmType,
            excptionTime,
            appealTime,
            replyTime,
            appealDesc,
            abnormalCheckinStatus,
            checkinStatus,
            isOneSelf
          } = res.data;
          this.comfirmType = comfirmType;
          this.excptionTime = excptionTime;
          this.appealTime = appealTime;
          this.replyTime = replyTime;
          this.reason = appealDesc;
          this.abnormalCheckinStatus = abnormalCheckinStatus;
          this.checkinStatus = checkinStatus;
          this.isOneSelf = isOneSelf;
          this.changeTitle();
          this.enumerationInitial(res.enumVal);

          var arr = res.enumVal.ComfirmEnum;
          arr = JSON.parse(arr);
          for (var i = 0; i < arr.length; i++) {
            this.status[arr[i].enumValue] = arr[i].description;
          }
          arr = res.enumVal.CheckinEnum;
          arr = JSON.parse(arr);
          for (var i = 0; i < arr.length; i++) {
            this.status[arr[i].enumValue] = arr[i].description;
          }
          // const aim = this.cardListProps.map((item, index) => {
          //   if (item.key === "checkinStatus") {
          //     item.content =
          //       that.status[res.data[item.key]] ||
          //       that.status[res.data.abnormalCheckinStatus];
          //   } else {
          //     item.content = res.data[item.key];
          //   }
          //   return item;
          // });
          // this.cardListProps = aim;
        });
    },
    // 不确认
    unConfirm() {
      this.normalToNotConfirmTag = true;
      //   setTimeout(function(){
      //  this.$refs.cardRadio.defaultRadioTab=1
      //   }.bind(this),0);

      // .defaultRadioTab=1
      this.changeTitle();
    },
    // 正常确认
    confirm() {
      this.confirmDisabled = true;
      let loading = Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.$getData
        .checkinConfirm({
          method: "post",
          data: {
            id: this.id || this.appendId,
            frontCheckinStatus: "NORMAL"
          }
        })
        .then(res => {
          if (res.code == 200) {
            loading.clear();
            setTimeout(() => {
              // Toast("考勤确认成功");
            }, 100);
            this.confirmDisabled = false;
            if (this.type == undefined) {
              if (this.types == 0 || this.types == 2) {
                window.history.go(-1);
              } else {
                this.$router.push({
                  path: "/workBench"
                });
              }
            } else {
              this.$router.push({
                path: this.type,
                query: {
                  adAcount: this.message.adAcount,
                  chooseDate: Date.parse(this.chooseDate)
                }
              });
            }
          } else if (res.code == -1) {
            loading.clear();
            this.confirmDisabled = false;
            Toast(res.msg);
          }
        })
        .catch(() => {
          loading.clear();
          this.confirmDisabled = false;
        });
    },
    // 取消
    cancel() {
      if (this.message.excptionTime === "NORMAL" && !this.appeal) {
        this.normalToNotConfirmTag = false;
      } else {
        if (this.type == undefined) {
          if (this.types == 0 || this.types == 2) {
            window.history.go(-1);
          } else {
            this.$router.push({
              path: "/workBench"
            });
          }
        } else {
          this.$router.push({
            path: this.type,
            query: {
              adAcount: this.message.adAcount,
              chooseDate: Date.parse(this.chooseDate)
            }
          });
        }
      }
    },
    // 提交
    post() {
      this.postDisabled = true;
      let params = {};
      if (this.appeal) {
        if (!this.reason1.replace(/(^\s*)|(\s*$)/g, "")) {
          Toast("请输入申诉原因");
          this.postDisabled = false;
          return;
        }
        params = {
          id: this.id || this.appendId,
          frontCheckinDesc: this.reason1
        };
      } else {
        const { $data, getFrontCheckinStatus } = this.$refs.cardRadio;
        const { option } = $data;
        params = {
          id: this.id || this.appendId,
          frontCheckinStatus: getFrontCheckinStatus().frontCheckinStatus,
          frontCheckinDesc: option
        };
      }
      let loading = Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.$getData
        .checkinConfirm({
          method: "post",
          data: params
        })
        .then(res => {
          if (res.code == 200) {
            loading.clear();
            setTimeout(() => {
              // Toast("考勤确认成功");
            }, 100);
            this.confirmDisabled = false;
            if (this.type == undefined) {
              if (this.types == 0 || this.types == 2) {
                window.history.go(-1);
              } else {
                this.$router.push({
                  path: "/workBench"
                });
              }
            } else {
              this.$router.push({
                path: this.type,
                query: {
                  adAcount: this.message.adAcount,
                  chooseDate: Date.parse(this.chooseDate)
                }
              });
            }
          } else if (res.code == -1) {
            loading.clear();
            Toast(res.msg);
          }
        })
        .catch(() => {
          loading.clear();
          this.postDisabled = false;
        });
    },
    // 更改title
    changeTitle() {
      const {
        excptionTime,
        comfirmType,
        appealTime,
        replyTime,
        abnormalCheckinStatus,
        checkinStatus
      } = this;
      let titleStr = "";
      let reltitle = "";
      if (this.appeal && !appealTime && !replyTime) {
        titleStr = "考勤申诉";
        reltitle = "考勤申诉";
      } else {
        if (comfirmType === "CONFIRMED") {
          if (appealTime) {
            if (checkinStatus) {
              titleStr = "最终申诉结果";
              reltitle = "考勤结果";
            } else {
              titleStr = "考勤申诉确认";
              reltitle = "考勤申诉确认";
            }
          } else {
            titleStr = "考勤结果";
            reltitle = "考勤结果";
          }
        } else {
          if (excptionTime === "NORMAL") {
            titleStr = "正常考勤确认";
            reltitle = "正常考勤确认";
          } else {
            titleStr = "异常考勤确认";
            reltitle = "异常考勤确认";
          }
        }
      }
      document.title = reltitle;
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
    this.getCheck();
    const { appeal } = this.$route.query;
    this.appeal = appeal;
      // 判断是否展示引导层
    const leaderConfirm1=getCookie('leaderConfirm1')
    if(leaderConfirm1==='false'){
      this.leaderConfirm1=false
    }else{
      this.leaderConfirm1=true
    }
  },
  created() {
    const {state}=this.commonUtils.env.getUrlparams().search
    this.delayPost = _.debounce(this.post, 300);
    this.delayConfirm = _.debounce(this.confirm, 300);
    // this.changeTitle();
    // document.title = "考勤确认";
    this.id = this.$route.query["id"];
    this.appendId =state;
    this.type = this.$route.query["pathType"];
    this.types = sessionStorage.getItem("type"); // 从我的待办进来的
    this.chooseDate = new Date(this.$route.query["chooseDate"]);
  }
  // beforeRouteLeave(to, from, next) {
  //   // alert(1)
  //   next()
  // }
};
</script>

<style scoped lang="scss">
.fileld-cell-group {
  margin: 10px 10px 22px;
}
.leaderConfirm {
  background: #f4f4f4;
  height: 100%;
  padding-top: 10px;
  box-sizing: border-box;
}
.leader-img-wrap{
  top:-10px;
  height: calc(100% + 10px);
  .leader-img-inner .leader-img{
    height: 100%;
  }
}
.btn-next1{
  bottom:260px;
  left: 50%;
  margin-left: -55px;
}
.btn-next2{
  top:450px;
  left: 50%;
  margin-left: -55px;
}
.btn-know3{
  top:450px;
  left: 50%;
  margin-left: -55px;
}
</style>


