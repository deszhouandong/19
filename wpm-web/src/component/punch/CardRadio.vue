<template>
  <div class="cardRadio clear">
    <div class="clear">
      <ul class="radio-tab clear">
        <li
          v-for="(item,index) in radioTab"
          :key="index"
          :class="{active:defaultRadioTab===index?true:false}"
          @click="changeTab(item,index)"
        >{{item.title}}</li>
      </ul>
    </div>
    <div class="clear">
      <ul class="radio-item clear">
        <li
          v-for="(item,index) in radioTab[defaultRadioTab].radioItem"
          :key="index"
          :class="{active:eval()===item.enumValue?true:false}"
          @click="changeItem(item,index)"
          :style="{display:item.hide?'none':'block'}"
        >{{item.title}}</li>
      </ul>
    </div>
    <div style="padding:11px 0 50px;">
      <van-cell-group class="fileld-cell-group">
        <van-field v-model="option" :autosize="{minHeight:89}" type="textarea" class="fileld-item" />
      </van-cell-group>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.cardRadio {
  padding: 14px 10px 0;
}

.radio-tab {
  float: right;

  li {
    float: left;
    width: 100px;
    height: 34px;
    background: #f4f4f4;
    box-shadow: 0px -3px 4px 0px rgba(104, 160, 232, 0.4);
    font-size: 17px;
    text-align: center;
    line-height: 34px;
    font-weight: 600;
    margin-left: 20px;
    border-radius: 16px;
    color: #007aff;

    &.active {
      background: #4b77af;
      color: #fff;
    }
  }
}

.radio-item {
  float: right;
  margin: 20px 0 0;

  li {
    float: left;
    width: 48px;
    height: 20px;
    border: 1px solid #49b9ff;
    font-size: 13px;
    text-align: center;
    line-height: 20px;
    font-weight: 400;
    margin-left: 20px;
    border-radius: 12px;
    color: #49b9ff;

    &.active {
      background: #4b77af;
      color: #fff;
      border-color: #4b77af;
    }
  }
}
</style>
<script>
import { dateCompare } from "../../utils/time";
export default {
  data() {
    return {
      defaultRadioTab: 1, //默认选中tab
      // defaultRadioItem0: "other", //异常确认下的高亮item
      // defaultRadioItem1: "LATE", //不确认下的高亮item
      defaultRadioItem0: "", //异常确认下的高亮item
      defaultRadioItem1: "", //不确认下的高亮item
      option: "", //textarea原因
      radioTab: [
        {
          title: "异常确认",
          tag: "abnormalConfirm",
          radioItem: [
            // {
            //   title: "忘带卡",
            //   enumValue: "forgetTakeCard",
            //   frontCheckinStatus:"NORMAL"
            // },
            {
              title: "忘打卡",
              enumValue: "forgetPunchCard",
              frontCheckinStatus: "NORMAL"
            },
            {
              title: "其他",
              enumValue: "other",
              frontCheckinStatus: "NORMAL"
            },
            {
              title: "休假",
              enumValue: "VACATION",
              frontCheckinStatus: "VACATION"
            }
          ]
        },
        {
          title: "不确认",
          tag: "unConfirm",
          radioItem: [
            {
              title: "迟到",
              enumValue: "LATE",
              frontCheckinStatus: "LATE"
            },
            {
              title: "早退",
              enumValue: "EARLYLEAVE",
              frontCheckinStatus: "EARLYLEAVE"
            },
            {
              title: "旷工",
              enumValue: "ABSENTEEISM",
              frontCheckinStatus: "ABSENTEEISM"
            }
          ]
        }
      ]
    };
  },
  props: {
    cardRadioProps: {
      type: Object
    }
  },
  created() {
    const {replyTime,appealTime,appeal}=this.cardRadioProps
    // 申诉确认页面默认选中第一个tab
    if(!replyTime&&appealTime&&!appeal){
      this.defaultRadioTab=0
    }
    // this.option = this.getFrontCheckinStatus().title;
    // const { ruleRecord } = this.cardRadioProps;
    // this.toggleBtnStatus(ruleRecord);
    // const aim = this.toggleDefaultBtnStatus(this.cardRadioProps);
    // this.updateToggleDefaultBtnStatus(aim);
  },
  methods: {
    eval(str) {
      const aim = this[`defaultRadioItem${this.defaultRadioTab}`];
      return aim;
    },
    // 获取当前选中状态供接口传参
    getFrontCheckinStatus() {
      let aim = "";
      const that = this;
      this.radioTab[this.defaultRadioTab].radioItem.some((item, index) => {
        if (
          item.enumValue === that[`defaultRadioItem${that.defaultRadioTab}`]
        ) {
          aim = item;
          return true;
        }
      });
      return aim;
    },
    /**
     * 切换异常和不确认按钮
     * @param item 当前选中tab项item；
     * @param index 当前选中tab项序号； 0-异常 1-不确认
     */
    changeTab(item, index) {
      if(this.defaultRadioTab != index){
      this.defaultRadioTab = index;
      this[`defaultRadioItem${this.defaultRadioTab}`] = "";
      this.option=""
      }

      // if (index === 0) {
      //   this[`defaultRadioItem${this.defaultRadioTab}`] = "other";
      // } else {
      //   this[
      //     `defaultRadioItem${this.defaultRadioTab}`
      //   ] = this.toggleDefaultBtnStatus(this.cardRadioProps);
      // }
      // this.option = this.getFrontCheckinStatus().title;
    },
    /**
     * 切换异常和不确认按钮下的子tab
     * @param item 当前选中tab项item；
     * @param index 当前选中tab项序号；
     */
    changeItem(item, index) {
      this[`defaultRadioItem${this.defaultRadioTab}`] = item.enumValue;
      // 将当前点击项内容赋值到textarea
      this.option = item.title;
    },
    /**
     * 判断早退迟到旷工按钮默认状态是否隐藏
     * @require 当为第一次打卡时，页面隐藏“早退”按钮
     * @require 当为中间次数打卡时，页面显示“早退”、“迟到”、“旷工”按钮
     * @require 当为最后一次打卡时，页面隐藏“迟到”按钮
     * @param ruleRecord FIRST-第一层 OTHER-中间次数 LAST-最后一次
     */
    toggleBtnStatus(ruleRecord) {
      if (ruleRecord) {
        const formatDateId = {
          FIRST: "EARLYLEAVE", //早退
          LAST: "LATE" //迟到
        };
        const aim = this.radioTab[1].radioItem;
        aim.map((item, index) => {
          if (item.enumValue === formatDateId[ruleRecord]) {
            aim[index].hide = true;
          } else {
            aim[index].hide = false;
          }
        });
      }
    },
    /**
     * 增加早退迟到旷工按钮默认选中状态
     * @require 第一次考勤：当为异常考勤且不在fromDate-toDate时间段打卡的系统默认为“迟到”
     *          当为异常考勤且时间为缺失时系统默认“旷工”
     * @require 中间考勤：当为异常考勤时且打卡时间在 <fromDate 时系统默认为“早退
     *          当为异常考勤且时间 >toDate 时，系统默认“迟到”
     *          当为异常考勤且时间为缺失时系统默认“旷工”
     * @require 当为异常考勤时且打卡时间不在fromDate-toDate时间段,系统默认为“早退”
     *          当为异常考勤且时间为缺失时系统默认“旷工”
     * @param ruleRecord（第几次打卡） FIRST-第一次 OTHER-中间次  LAST-最后一次
     * @param fromDate（正常打卡时间起点） 00:00:00
     * @param toDate（正常打卡时间终点） 08:40:59
     * @param excptionTime NORMAL-正常 ABNORMAL-异常
     * @param clockDateToStr（打卡时间） "11-05 13:25"
     */
    toggleDefaultBtnStatus(cardRadioProps) {
      let aim = "";
      if (JSON.stringify(cardRadioProps) != "{}") {
        const {
          ruleRecord,
          clockDateToStr,
          excptionTime,
          fromDate,
          toDate
        } = cardRadioProps;
        const transClockDateToStr = clockDateToStr.split(" ")[1];
        if (excptionTime === "ABNORMAL") {
          if (clockDateToStr === "缺失" || !clockDateToStr) {
            aim = "ABSENTEEISM";
          } else {
            if (ruleRecord) {
              if (ruleRecord === "FIRST") {
                const isBelong = dateCompare(
                  fromDate.slice(0, 5),
                  toDate.slice(0, 5),
                  transClockDateToStr
                );
                if (!isBelong) {
                  aim = "LATE";
                }
              } else if (ruleRecord === "LAST") {
                const isBelong = dateCompare(
                  fromDate.slice(0, 5),
                  toDate.slice(0, 5),
                  transClockDateToStr
                );
                if (!isBelong) {
                  aim = "EARLYLEAVE";
                }
              } else {
                const isBelong1 = dateCompare(
                  "00:00",
                  fromDate.slice(0, 5),
                  transClockDateToStr
                );
                if (isBelong1) {
                  aim = "EARLYLEAVE";
                }
                const isBelong2 = dateCompare(
                  toDate.slice(0, 5),
                  "24:00",
                  transClockDateToStr
                );
                if (isBelong2) {
                  aim = "LATE";
                }
              }
            } else {
              let arr = [];
              this.radioTab[1].radioItem.map((item, index) => {
                if (!item.hide) {
                  arr.push(item);
                }
              });
              aim = arr[0].enumValue;
            }
          }
        } else {
          let arr = [];
          this.radioTab[1].radioItem.map((item, index) => {
            if (!item.hide) {
              arr.push(item);
            }
          });
          aim = arr[0].enumValue;
        }
      }
      return aim;
    },
    updateToggleDefaultBtnStatus(str) {
      this[`defaultRadioItem${this.defaultRadioTab}`] = str;
      this.option = this.getFrontCheckinStatus().title;
    }
  }
};
</script>
