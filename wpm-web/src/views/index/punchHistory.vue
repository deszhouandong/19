<template>
  <div class="punch-history">
    <PunchDate  @getDateHandler="getDateHandler"/>
    <div class="punch-list">
      <van-loading style="text-align:center;color:#666" v-if="initLoading" color="#666">加载中...</van-loading>
      <div v-else>
        <div v-if="!checkinRecordRespList.length" class="noData-img">
          <img :src="emptyIconUrl" alt="" class="empty-img">
          <p class="empty-text">暂无考勤数据</p>
        </div>
        <!-- <ul v-else>
          <li v-for="(item,index) in checkinRecordRespList" :key="index">
            <PunchItem :punchItemProps="item" :status="status" :enumerationInitialData="enumerationInitialData"/>
          </li>
        </ul> -->
         <template v-else>
           <PunchItemWrap
              :checkinRecordRespList="checkinRecordRespList"
              :status="status"
              :enumerationInitialData="enumerationInitialData"
            :allowSeconded="allowSeconded"
            />
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import PunchDate from "@/component/punch/PunchDate";
// import PunchItem from "@/component/punch/PunchItem";
import PunchItemWrap from "@/component/punch/PunchItemWrap";
export default {
  name: "punchHistory",
  components: {
    PunchDate,
    PunchItemWrap
  },
  created() {
    document.title = "考勤历史";
    this.getInitial()

  },
  data() {
    return {
      emptyIconUrl:require("../../../static/imgs/empty.png"),
      chooseDate: new Date(),
      initLoading:true,
      initialData: {},
      checkinRecordRespList: [],
      punchItemProps: {},
      status: {}, //枚举类
      enumerationInitialData:{},
       // 是否有高原权限
      //null-后台未配置权限  0-无权限  1-有权限
      allowSeconded:null
    };
  },
  methods: {
    //页面刚进来默认加载
    getInitial() {
      this.initLoading=true
      this.checkinRecordRespList=[]
      this.$getData
        .attendanceInfoLoading({
          method: "post",
          data: {
            chooseDate: this.chooseDate,
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.initialData = res.data;
            this.checkinRecordRespList = res.data.checkinRecordRespList
              ? res.data.checkinRecordRespList
              : [];
            this.initLoading=false
            const { fromDate, toDate,allowSeconded } = this.initialData;
            this.allowSeconded=allowSeconded
            // this.interval = `${fromDate.slice(0, 5)} - ${toDate.slice(0, 5)}`;
            this.enumeration(res.enumVal);
            this.enumerationInitial(res.enumVal);
          }
        }).catch(()=>{
          this.initLoading=false
        })
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
    getDateHandler(chooseDate){
      this.chooseDate=chooseDate
        this.getInitial()
    }
  },

};
</script>

<style lang="scss">
 #app{
      height: calc(100% - 50px);
 }
</style>
<style scoped lang='scss'>
.punch-history {
  padding-top: 66px;
  background: #f4f4f4;

  .punchItem /deep/ {
    //第一种写法
    padding-bottom: 20px;
  }
}

.punch-list {
  margin-top: 10px;
  background: #fff;
  position: relative;
  // z-index: 2222;
}
</style>
