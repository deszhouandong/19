<template>
  <div class="punchItem clear" @click="toAppeal(punchItemProps.id);">
    <div class="fl">
      <div class="type">
        <span class="radius">
          <span class="dashline"></span>
        </span>
        <span class="txt">{{punchItemProps.checkinName}}</span>
      </div>
      <div :class="{clockTime:true,red:punchItemProps.clockDateToStr?false:true}">
        打卡时间
        {{punchItemProps.clockDateToStr?punchItemProps.clockDateToStr.slice(0, 5):'缺失'}}
      </div>
      <div class="area">
        <span :class="{loaction:true}">
          <img :src="locationImgUrl" alt class="svg-location" />
          <span class="loaction-inner">{{punchItemProps.name?punchItemProps.name:'打卡地点缺失'}}</span>
          <!-- {{punchItemProps.name?punchItemProps.name:'打卡地点缺失'}} -->
        </span>
      </div>
      <div class="confirm" v-if="punchItemProps.comfirmType == 'CONFIRMED'">
        <!-- {{punchItemProps.comfirmTime}} -->
        {{punchItemProps.leaderName}}
        {{punchItemProps.finalOpinion||punchItemProps.currentOpinion}}
        <span
          class="red toAppeal"
          v-if="!this.commonUtils.env.getIsApp()&&punchItemProps.appealStatus == '未申诉'  &&
            punchItemProps.comfirmType == 'CONFIRMED' &&
            punchItemProps.checkinStatus != 'NORMAL' &&
            punchItemProps.checkinStatus != 'VACATION'"
        >去申诉</span>
      </div>
      <div class="confirm" v-if="punchItemProps.comfirmType === 'UNCONFIRMED'">
        <span class="brown">{{status[punchItemProps.comfirmType]}}</span>
      </div>
    </div>
    <div class="fr">
      <div
        :class="['status',statusClass[ punchItemProps.abnormalCheckinStatus||punchItemProps.checkinStatus]]"
        v-if="punchItemProps.comfirmType&&punchItemProps.comfirmType==='CONFIRMED'"
      >{{status[punchItemProps.checkinStatus]||status[punchItemProps.abnormalCheckinStatus] }}</div>
      <div
        v-else
        :class="['status',statusClass[punchItemProps.dayType]]"
      >{{status[punchItemProps.dayType]}}</div>
      <div
        class="tag-isrange-wrap"
        v-if="chooseRealExtents||modExtents||realExtents"
        @click="punchItemProps.comfirmType&&punchItemProps.comfirmType==='CONFIRMED'?'':childToggleRangeList({
        mold:'hideOther',
        $event:$event
      })"
      >
        <div class="tag-isrange">
          <span :class="wordNumShort?'short':'long'">
            <van-loading
              size="12px"
              style="vertical-align:top!important;display:inline-block"
              v-if="addressLoading"
              color="#fff"
            />
            <template v-else>{{chooseRealExtents||modExtents||realExtents}}</template>
          </span>
          <transition name="fade">
            <template v-if="chooseRealExtentsList&&chooseRealExtentsList.length">
              <ul class="tag-isrange-list" v-if="isShowRangeList">
                <li
                  v-for="(item,index) in chooseRealExtentsList"
                  :key="index"
                  @click="chooseIsrange(item,$event,punchItemProps.id)"
                >{{item.description}}</li>
              </ul>
            </template>
            <template v-else>
              <ul class="tag-isrange-list" v-if="isShowRangeList">
                <li
                  v-for="(item,index) in realExtentsList"
                  :key="index"
                  @click="chooseIsrange(item,$event,punchItemProps.id)"
                >{{item.description}}</li>
              </ul>
            </template>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PunchItem",
  data() {
    return {
      locationImgUrl: require("../../../static/imgs/location.svg"),
      chooseRealExtents: "", //选中的地址
      chooseRealExtentsList: [], //选中后不调用接口的地址列表
      statusClass: {
        ABSENTEEISM: "red",
        EARLYLEAVE: "red",
        LATE: "red",
        NORMAL: "blue",
        UNCONFIRMED: "brown",
        VACATION: "red",
        CONFIRMED: "blue",
        WEEKEND: "blue",
        WORKINGDAY: "blue",
        HOLIDAY: "blue"
      }
    };
  },
  props: {
    punchItemProps: {
      type: Object,
      default: {}
    },
    status: {
      type: Object,
      default: {}
    },
    enumerationInitialData: {
      type: Object,
      default: {}
    },
    order: {
      type: Number
    },
    isShowRangeList: {
      type: Boolean,
      default: false
    },
    toggleRangeList: {
      type: Function
    },
    toggleAddressLoading: {
      type: Function
    },
    allowSeconded: {
      type: Number
    },
    addressLoading: {
      type: Boolean
    }
  },
  created() {},
  methods: {
    // 去申诉
    toAppeal(id) {
      if (!this.commonUtils.env.getIsApp()) {
        if (
          this.punchItemProps.appealStatus == "未申诉" &&
          this.punchItemProps.comfirmType == "CONFIRMED" &&
          this.punchItemProps.checkinStatus != "NORMAL" &&
          this.punchItemProps.checkinStatus != "VACATION"
        ) {
          const pathType = this.$route.path.replace("/", "");
          this.$router.push({
            path: "/leaderConfirm",
            query: {
              id,
              pathType,
              appeal: true
            }
          });
        }
      }
    },
    // 切换基地内、基地外、高原作业
    chooseIsrange(item, $event, id) {
      // 隐藏列表
      this.$emit("toggleRangeList", {
        mold: "hideAll",
        $event: $event
      });
      // 展示loading
      this.$emit("toggleAddressLoading", {
        order: this.order,
        isEnd: true
      });
      // 调用接口传递修改数据
      this.$getData
        .modExtents({
          method: "post",
          data: {
            id,
            modExtents: item.enumValue
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.chooseRealExtents = item.description;
            this.chooseRealExtentsList = this.formatExtentsList(item.enumValue);
          }
          this.$emit("toggleAddressLoading", {
            order: this.order,
            isEnd: false
          });
        })
        .catch(() => {
          this.$emit("toggleAddressLoading", {
            order: this.order,
            isEnd: false
          });
        });
    },
    childToggleRangeList(mold) {
      const params = {
        ...mold,
        index: this.order
      };
      this.$emit("toggleRangeList", params);
    },
    // 使用枚举值格式化地址
    formatExtents(address) {
      const that = this;
      let aim = "";
      if (this.enumerationInitialData.CheckinExtentsEnum) {
        this.enumerationInitialData.CheckinExtentsEnum.some((item, index) => {
          if (item.enumValue === that.punchItemProps[address]) {
            if (item.enumValue === "HIGHLAND") {
              aim = "高原作业";
            } else {
              aim = item.description;
            }
            return true;
          }
        });
      }
      return aim;
    },
    // 格式化地址列表
    formatExtentsList(addressList) {
      const that = this;
      let arr = [];
      const realExtents = that.punchItemProps.realExtents;
      const modExtents = addressList || that.punchItemProps.modExtents;
      const aim = this.enumerationInitialData.CheckinExtentsEnum;
      if (aim) {
        const filterArr = aim.filter((item, index) => {
          /*
           * 1.上级主管确认前,才可以手动选择地址状态
           * 2.当前地址状态为“基地内”时，只可以手动选择“基地外”
           * 3.当前地址状态为“基地外”且无高原权限的人，只可以手动选择“基地内”
           * 4.当前地址状态为“基地外”且有高原权限的人，可以手动选择“基地内”、“高原作业”
           * 5.当前地址状态为“高原作业”，可以手动选择“基地内”、“基地外”
           */

          if (modExtents) {
            if (
              modExtents === "INBASE" ||
              (modExtents === "OUTBASE" && !this.allowSeconded)
            ) {
              return item.enumValue != "HIGHLAND";
            } else {
              return item;
            }
          } else {
            if (
              realExtents === "INBASE" ||
              (realExtents === "OUTBASE" && !this.allowSeconded)
            ) {
              return item.enumValue != "HIGHLAND";
            } else {
              return item;
            }
          }
        });
        arr = JSON.parse(JSON.stringify(filterArr));
        arr.map((itemInner, indexInner) => {
          if (itemInner.enumValue === "HIGHLAND") {
            arr[indexInner]["description"] = "高原作业";
          }
        });
      }
      return arr;
    }
  },
  computed: {
    // 第一次打卡地址状态
    realExtents: {
      get() {
        return this.formatExtents("realExtents");
      },
      set(newVal) {}
    },
    // 更改地址状态
    modExtents: {
      get() {
        return this.formatExtents("modExtents");
      }
    },
    // 手动切换打卡地址状态
    realExtentsList: {
      get() {
        return this.formatExtentsList();
      }
    },
    wordNumShort: {
      get() {
        const { chooseRealExtents, modExtents, realExtents } = this;
         const aim=chooseRealExtents||modExtents||realExtents
        if (
          aim === "高原作业"
        ) {
          return false;
        } else {
          return true;
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.punchItem {
  border-bottom: 1px solid rgba(104, 160, 232, 0.1);
  padding: 10px 0;
  margin: 0 16px 0 28px;
  position: relative;

  .dashline {
    width: 0;
    height: 88px;
    display: inline-block;
    border-left: 1px dashed #f4f4f4;
    position: absolute;
    left: 3.5px;
    top: 14px;
  }

  .fl {
    line-height: 17px;
    position: relative;

    // padding-left: 12px;
    .type {
      font-size: 12px;
      color: #484848;

      .radius {
        display: inline-block;
        margin-right: 2px;
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background: linear-gradient(
          180deg,
          rgba(139, 202, 247, 1) 0%,
          rgba(83, 154, 237, 1) 100%
        );
        position: absolute;
        left: -13px;
        top: 5px;
      }

      .txt {
        color: $blue;
      }
    }

    .clockTime {
      font-weight: bold;
      margin: 2px 0;
    }

    .loaction {
      // width: 210px;
      display: inline-block;
      font-size: 13px;
      .loaction-inner {
        display: inline-block;
        max-width: 250px;
        text-align: justify;
        word-break: break-all;
        vertical-align: top;
      }
      // @include ellipsis;
    }

    .confirm {
      font-size: 13px;
      margin: 2px 0 0;

      .toAppeal {
        margin-left: 10px;
      }

      .confirm-status {
        margin-left: 10px;
        color: $blue;
      }
    }
  }

  .fr {
    .status {
      color: $blue;
      height: 28px;
      text-align: right;
    }
    .tag-isrange-wrap {
      padding: 10px;
      margin-right: -10px;
    }

    .tag-isrange {
      // width: 42px;
      padding: 0 5px;
      height: 14px;
      line-height: 16px;
      background: #5bce54;
      font-size: 10px;
      color: #fff;
      text-align: center;
      border-radius: 14px;
      position: relative;
      > span {
        display: inline-block;
        &.long {
          min-width:50px;
        }
        &.short {
          min-width:40px;
        }
      }

      .tag-isrange-list {
        position: absolute;
        width: 100px;
        padding: 0 10px;
        box-shadow: -1px 1px 5px 1px rgba(232, 241, 252, 1);
        right: 0;
        // right: 40px;
        box-sizing: border-box;
        // top: -20px;
        top: 21px;
        background: #fff;
        z-index: 2;
        li {
          height: 32px;
          line-height: 32px;
          color: #4b77af;
          border-bottom: 1px solid rgba(104, 160, 232, 0.1);
          cursor: pointer;
          &:last-child {
            border: none;
          }
        }
      }
    }
  }
  .svg-location {
    width: 8px;
    height: 12px;
    // vertical-align: -1.5px;
    vertical-align: middle;
    margin: -1px 3px 0 0;
  }
}
</style>
