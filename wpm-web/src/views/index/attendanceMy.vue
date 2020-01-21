<template>
  <div class="workbench">
    <!-- 顶部下拉框 -->
    <van-dropdown-menu>
      <van-dropdown-item disabled title="我的" />
      <van-dropdown-item ref="item" :title="dateTime">
        <van-datetime-picker
          type="year-month"
          :formatter="formatter"
          v-model="currentDate"
          @change="changePick"
          cancel-button-text=" "
          confirm-button-text=" "
        />
      </van-dropdown-item>
    </van-dropdown-menu>
    <!-- 中间内容 -->
    <van-collapse v-model="activeName">
      <div v-if="!individualCardingRespList||individualCardingRespList.length===0" style="text-align:center;" class="noData">暂无数据</div>
      <van-collapse-item v-else  name="1">
        <div slot="title">
          <span style="display:inline-block;font-weight: bold;width:77px;font-size: 17px;margin-right:5px;color: #333;">{{RecordsList.personName}} </span>
          <span style="width:108px;float:right;margin-right:10px;display:inline-block;font-size: 14px;color: #D75252; text-align:center;border-radius:20px;">考勤异常{{RecordsList.count}}次</span>
        </div>
        <van-steps
          direction="vertical"
          active-icon="checked"
          active-color="#969799"
        >
          <van-step  v-for="(items,index) in individualCardingRespList" :key="index" >
            <div
              @click="goAbnormal(items.id,items.comfirmType,items.excptionTime,items.appealStatus,items.abnormalCheckinStatus,items.appealTime)"
             :class="items.comfirmType == 'CONFIRMED' && items.excptionTime == 'ABNORMAL' && items.appealStatus == '未申诉' ? 'unconfirmedStatus' : 'abnormalStatus'"
            >
              <!-- <p
                style="float:right;margin:0;"
                v-if="status[items.checkinStatus] == null "
              >{{status[items.comfirmType]}}</p>
              <p style="float:right;margin-top:0px;" v-else>{{status[items.checkinStatus]}}</p>
              -->
            <p style="float:right;margin-top:0;">
              {{status[items.checkinStatus]||status[items.abnormalCheckinStatus]}}
            </p>
              <h3>
                {{items.dateToStr}}
                <span>{{items.checkinName}}</span>
              </h3>

              <p>{{items.clockDateToStr}}</p>
               <P style="float:right;color:rgb(215, 82, 82);margin-top:0px;">{{items.appealStatus}}</P>
              <p  class="location-name">{{items.name}}</p>
            </div>
          </van-step>
        </van-steps>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  name: "attendanceMy",
  data() {
    return {
      value: 0,
      switch1: false,
      switch2: false,
      currentDate: new Date(),
      dateTime:
        new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月",
      activeName: ["1"],
      dateCurrent: null,
      RecordsList: [],
      individualCardingRespList: [],
      status: {},
      userName: ""
    };
  },
  methods: {
    //跳转到不同状态的页面
    goAbnormal(id, type, eTime, aStatus,abnormalCheckinStatus,appealTime) {
      // items.id,items.comfirmType,items.excptionTime,items.appealStatus
      // if (aStatus == "未申诉" && type == "CONFIRMED" && eTime == "ABNORMAL") {
      if (abnormalCheckinStatus && type == "CONFIRMED" && !appealTime) {
        this.$router.push({
          path: "/leaderConfirm",
          query: {
            id: id,
            pathType:'attendanceMy',
            appeal:true
          }
        });
      }
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    //改变时间
    changePick() {
      var date = this.currentDate;
      this.dateCurrent = date;
      this.dateTime = date.getFullYear() + "年" + (date.getMonth() + 1) + "月";
      this.getAttendance();
    },

    //获取单个异常次数
    getAttendance() {
      this.$getData
        .individualAbnormalRecordsList({
          method: "post",
          data: {
            chooseDate: this.dateCurrent
          }
        })
        .then(res => {
          if (res.code == 200) {
             this.RecordsList = res.data || [];
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
            console.log(res.msg);
          }
        });
    }
  },
  mounted() {
    this.getAttendance();
  },
  created() {
    document.title = "我的异常考勤";


  }
};
</script>

<style scoped lang="scss">
.location-name{
  width:235px;
  @include ellipsis;
}
 .workbench p{
  margin:12px 0;
}
h3{
  margin: 0!important;
}
// 10-9 Start
/deep/.van-steps i.van-icon-checked::before {
 color:#4B77AF!important;
}
/deep/.van-icon, .van-icon-phone::before {
  vertical-align: top;
}
// End
.confirmed {
  color: red;
}
.noData {
  text-align: center;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  color: #000;
}
.abnormalStatus {
  color: #969799;
}
.unconfirmedStatus {
  color: #000;
}
</style>
