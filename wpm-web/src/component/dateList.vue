<template>
  <div class="dateList">
    <!-- 日历 -->
    <div class="date">
      <!-- 年份 月份 -->
      <div class="month">
        <p class="last" @click="weekPre">
          <van-icon name="arrow-left" />
        </p>
        <p class="year" @click="yearMiddle">{{ currentYear }}年{{ currentMonth }}月</p>
        <p class="next" @click="weekNext">
          <van-icon name="arrow" />
        </p>
        <!-- 弹出日期插件 -->
        <van-popup v-model="show" position="bottom" :style="{ height: '55%' }">
          <div>
            <calendar v-model="calendarShow"></calendar>
            <inlineCalendar @change="handelChange" :defaultDate="defaultDate" ref="popDate" />
          </div>
        </van-popup>
      </div>
      <!-- 星期 -->
      <ul class="weekdays">
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li class="six">六</li>
        <li class="six">日</li>
      </ul>
      <!-- 日期 -->
      <ul class="days">
        <li @click="pick(day)" v-for="(day, index) in days" :key="index">
          <!--本月-->
          <span v-if="day.getMonth()+1 != currentMonth" class="other-month">{{ day.getDate() }}</span>
          <span v-else>
            <!--今天-->
            <span :class="{active:currentDay == day.getDate()}">{{ day.getDate() }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "date",
  data() {
    return {
      currrentTime: "",
      show: false,
      currentYear: 1970, // 年份
      currentMonth: 1, // 月份
      currentDay: 1, // 日期
      currentWeek: 1, // 星期
      days: [],
      calendarShow: false,
      defaultDate: "",
      workPunch: [],
      morning: {}, // 上午
      noon: {}, //中午
      afternoon: {}, //下午
      status: {}, //显示状态
      contrastDateMorning: false, // 对比时间
      contrastDateNoon: false,
      contrastDateafternoon: false,
      checkinDateId: ""
    };
  },
  created() {
    this.initData(null);
  },
  methods: {
    // 点击年月
    yearMiddle() {
      this.show = true;
      this.dateShow = true;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },

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
        // console.log(y:" + d.getDate())
        this.days.push(d);
      }
      for (let i = 1; i <= 7 - this.currentWeek; i += 1) {
        const d = new Date(str);
        d.setDate(d.getDate() + i);
        this.days.push(d);
      }
    },

    // 上个星期
    weekPre(date) {
      const d = this.days[0]; // 如果当期日期是7号或者小于7号
      d.setDate(d.getDate() - 7);
      this.initData(d);
      this.defaultDate = d;
      if (this.$refs.popDate) {
        this.$refs.popDate.changeDate(d);
      }
      this.getDefault(date);
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
      this.getDefault(date);
    },

    // 上一個月  传入当前年份和月份
    pickPre(year, month) {
      const d = new Date(this.formatDate(year, month, 1));
      d.setDate(0);
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
    },
    // 下一個月  传入当前年份和月份
    pickNext(year, month) {
      const d = new Date(this.formatDate(year, month, 1));
      d.setDate(35);
      this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
    },
    //弹窗日li
    handelChange(date) {
      this.initData(date.$d);
      this.defaultDate = date.$d;
      date = this.defaultDate;
      console.log(date);
      this.getDefault(date + 1);
    },
    // 当前选择日期
    pick(date) {
      this.currentDay = date.getDate();
      this.defaultDate = date;
      console.log(this.defaultDate);
      if (this.$refs.popDate) {
        this.$refs.popDate.changeDate(date);
      }
      this.getDefault(date);
    }
  },
  mounted() {
   this.getDefault();
  }
};
</script>

<style scoped>
.date {
  height: 100px;
  color: #333;
  border-bottom: 1px solid #333;
}
.date .month .year {
  font-size: 12px;
  text-align: center;
  width: 90%;
}
.month .last {
  float: left;
  /* height: 30px; */
  margin-top: 1px;
  width: 10%;
  text-align: center;
}
.month .next {
  float: right;
  margin-top: -27px;
  width: 10%;
  text-align: center;
}
.date .weekdays {
  display: flex;
  font-size: 14px;
  margin-top: 15px;
}
.date .weekdays li {
  flex: 1;
  text-align: center;
  float: left;
}

.date .weekdays .six {
  color: red;
}
.date .weekdays .date .weekdays .days {
  display: flex;
}
.days li {
  flex: 1;
  font-size: 15px;
  text-align: center;
  margin-top: 5px;
  line-height: 30px;
  width: 14.28%;
  float: left;
}
.days .active {
  display: inline-block;
  width: 30px;
  height: 30px;
  color: #fff;
  border-radius: 50%;
  background-color: #4a77b0;
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
</style>