<template>
  <div class="punchDate flexall-hor">
    <div class="left clear">
      <div class="last fl" @click="weekPre">
        <van-icon name="arrow-left" class="arrow" />
      </div>
      <!-- 年份 月份 -->
      <div class="month fl">
        <!-- <p class="year" @click="yearMiddle">{{ currentYear }}年{{ currentMonth }}月</p> -->
        <p class="year" @click="yearMiddle">{{ currentMonth }}月</p>
        <!-- 弹出日期插件 -->
        <van-popup
          v-model="show"
          overlay-class="layer-punchDate-mask"
          position="bottom"
          class="layer-punchDate-popup"
          :style="{ height: '55%'}"
        >
          <div>
            <calendar v-model="calendarShow"></calendar>
            <inlineCalendar @change="handelChange" :defaultDate="defaultDate" ref="popDate" />
          </div>
        </van-popup>
      </div>
    </div>

    <!-- 日历 -->
    <div class="date clear flex">
      <!-- 日期 -->
      <ul class="days clear">
        <li @click="pick(day)" v-for="(day, index) in days" :key="index">
          <!--本月-->
          <span
            v-if="day.getMonth()+1 != currentMonth"
            class="other-month"
            :class="{active:currentDay == day.getDate()}"
          >{{ day.getDate() }}</span>
          <!--今天-->
          <span v-else :class="{active:currentDay == day.getDate()}">{{ day.getDate() }}</span>
        </li>
      </ul>
      <!-- 星期 -->
      <ul class="weekdays">
        <li>周一</li>
        <li>周二</li>
        <li>周三</li>
        <li>周四</li>
        <li>周五</li>
        <li class="six">周六</li>
        <li class="six">周日</li>
      </ul>
    </div>
    <div class="next" @click="weekNext">
      <van-icon name="arrow" class="arrow" />
    </div>
  </div>
</template>
<script>
export default {
  name: "PunchDate",
  props: ["getDateHandler"],
  data() {
    return {
      show: false,
      currentYear: 1970, // 年份
      currentMonth: 1, // 月份
      currentDay: 1, // 日期
      currentWeek: 1, // 星期
      days: [],
      calendarShow: false,
      defaultDate: new Date(),
      active: 0
    };
  },
  created() {
    let chooseDate = this.$route.query["chooseDate"]
      ? Number(this.$route.query["chooseDate"])
      : null;
    this.initData(chooseDate);
    // this.getToDate();
  },
  methods: {
    //解析打卡考勤页面传来的时候为空
    getToDate() {
      let chooseDate = new Date(this.$route.query["chooseDate"] / 1);
      chooseDate = chooseDate ? new Date(chooseDate) : new Date();
      if (chooseDate) {
        this.currentDay = chooseDate.getDate();
      }
    },
    translateDateHandler(params) {
      this.$emit("getDateHandler", params);
    },
    yearMiddle() {
      this.show = true;
      this.dateShow = true;
    },
    // formatter(type, value) {
    //   if (type === "year") {
    //     return `${value}年`;
    //   } else if (type === "month") {
    //     return `${value}月`;
    //   }
    //   return value;
    // },

    formatDate(year, month, day) {
      const y = year;
      let m = month;
      if (m < 10) m = `0${m}`;
      let d = day;
      if (d < 10) d = `0${d}`;
      return `${y}-${m}-${d}`;
    },

    initData(cur) {
      let date = "";
      if (cur) {
        date = new Date(cur);
      } else {
        date = new Date();
      }
      this.currentDay = date.getDate(); // 今日日期 几号
      this.currentYear = date.getFullYear(); // 当前年份
      this.currentMonth = date.getMonth() + 1; // 当前月份
      this.currentWeek = date.getDay(); // 1...6,0  // 星期几
      this.defaultDate=date //日历弹窗
      if (this.currentWeek === 0) {
        this.currentWeek = 7;
      }
      const str = this.formatDate(
        this.currentYear,
        this.currentMonth,
        this.currentDay
      ); // 今日日期 年-月-日
      this.days.length = 0;
      // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
      /* eslint-disabled */
      for (let i = this.currentWeek - 1; i >= 0; i -= 1) {
        const d = new Date(str);
        d.setDate(d.getDate() - i);
        this.days.push(d);
      }
      for (let i = 1; i <= 7 - this.currentWeek; i += 1) {
        const d = new Date(str);
        d.setDate(d.getDate() + i);
        this.days.push(d);
      }
    },

    // 上个星期
    weekPre() {
      const d = this.days[0]; // 如果当期日期是7号或者小于7号
      d.setDate(d.getDate() - 7);
      this.initData(d);
      this.defaultDate = d;
      if (this.$refs.popDate) {
        this.$refs.popDate.changeDate(d);
      }
      this.translateDateHandler(this.defaultDate);
    },

    // 下个星期
    weekNext(date) {
      const d = this.days[6]; // 如果当期日期是7号或者小于7号
      d.setDate(d.getDate() + 7);
      this.initData(d);
      this.defaultDate = d;
      if (this.$refs.popDate) {
        this.$refs.popDate.changeDate(d);
      }
      this.translateDateHandler(this.defaultDate);
    },
    //弹窗日li
    handelChange(date) {
      this.initData(date.$d);
      this.defaultDate = date.$d;
      date = this.defaultDate;
      this.translateDateHandler(this.defaultDate);
    },
    // 当前选择日期
    pick(date) {
      this.currentDay = date.getDate();
      this.currentMonth = date.getMonth() + 1; // 当前月份
      this.defaultDate = date;
      if (this.$refs.popDate) {
        this.$refs.popDate.changeDate(date);
      }
      this.translateDateHandler(this.defaultDate);
    }
  }
};
</script>

<style scoped lang="scss">
.punchDate,
.punchDate * {
  box-sizing: border-box;
}

.punchDate {
  background: #fff;
  height: 66px;
  color: #4b77af;
  font-size: 11px;
  padding: 10px 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;

  .left {
    width: 70px;
  }

  .date {
    overflow: visible;
  }

  .next {
    width: 50px;
    text-align: right;

    .arrow {
      margin-right: 12px;
    }
  }

  .arrow {
    color: #4b77af;
    margin-top: 10px;
  }

  .arrow:before {
    font-size: 25px;
  }

  .month {
    .year {
      font-size: 15px;
      color: #4b77af;
      padding: 12px 5px;
    }
  }
}

.van-icon,
.van-icon::before {
  font-size: 16px;
  display: inline-block;
}

.whiteBg {
  background: #fff;
}

.hide {
  display: none;
}

.aa {
  text-align: center;
}

.weekdays,
.days {
  // display: flex;

  li {
    // padding: 0 5px;
    text-align: center;
    float: left;
    width: 37px;
    // font-weight: bold;
  }
}

.weekdays {
  display: flex;
  margin-top: 8px;

  li {
    // line-height: 16px;
    text-align: center;
    font-size: 11px;

    // &.six {
    //   color: red;
    // }
  }
}

.days {
  li {
    float: left;
    font-size: 14px;

    span {
      display: inline-block;
      width: 24px;
      height: 24px;
      text-align: center;
      line-height: 24px;

      &.active {
        color: #fff;
        border-radius: 50%;
        background-color: #4b77af;
      }
    }
  }

  .other-month {
    color: #4a77b0;
  }
}

// .days li:nth-last-child(1),
// .days li:nth-last-child(2) {
//   color: red;
// }
</style>
