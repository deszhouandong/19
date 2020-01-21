<template>
  <div class="meetingList flexall meetingManage">
    <PunchDate @getDateHandler="getDateHandler" />
    <div class="meetingList_import flex">
      <div class="meetingList_dateList">
        <div class="dataList_cont">
          <!-- 背景图 勿看 -->
          <div class="dataList_calend" v-for="(item,index) in 12" :key="index + 100">
            <div class="time">{{hour(index+8)}}:00</div>
            <div class="line"></div>
          </div>
          <!-- 数据图 -->
          <div
            :class="[item.state, item.mix<=0.5?'small':'','calendList_list','imgMiddle']"
            :style="{top: item.fromHour +'rem',height: (item.mix  * baseRem) +'rem'}"
            v-for="(item,index) in newCalendList"
            :key="index"
            @click="linkDetail(item)"
          >
            <div class="meeting_infor">
              <div class="name">{{item.title}}</div>
              <div class="detail">
                {{item.room}}
                <span v-show="item.name">({{item.name}})</span>
              </div>
            </div>
            <div class="meeting_state">
              <!-- <div class="cancel">已取消</div>
              <div class="sure">已接受</div>
              <div class="reject">已拒绝</div>
              <div class="end">已结束</div> -->
              <div class="stateStr">{{item.stateStr}}</div>
              <div class="wait">
                <button class="sureBtn" @click.stop="takeOrNo(1,item)">接受</button>
                <button class="cancelBtn" @click.stop="takeOrNo(2,item)">拒绝</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="meetingList_btn"><button @click="toCreate">新建会议</button></div>
  </div>
</template>
<script>
import PunchDate from "@/component/punch/PunchDate";
import moment from 'moment';
import { getlocalStorage, setlocalStorage } from "@/utils/format";
export default {
  name: "punchHistory",
  components: {
    PunchDate
  },
  created() {
    document.title = "会议管理";
  },
  mounted() {
    this.listPendingMeeting();
  },
  data() {
    return {
      chooseDate: new Date(),
      baseRem: 1.066667,
      calendList: [
      ]
    };
  },
  computed: {
    beginTime(){
      let strDate = moment(this.chooseDate).format("YYYY/MM/DD")
      return new Date(moment(`${strDate} 07:00:00`));
    },
    endTime(){
      let strDate = moment(this.chooseDate).format("YYYY/MM/DD")
      return new Date(moment(`${strDate} 21:00:00`))
    },
    newCalendList() {
      return this.showCalendList();
    }
  },
  methods: {
    takeOrNo(receptionState,itm){ // 接受或拒绝会议
      let { meetingNumber,meetingName } = itm;
      this.$getData.receiveOrRefuseTheMeeting({
        method:'post',
        data:{
          meetingNumber,
          receptionState,
          // receptionState	接收状态-0：未接收；1：已接收；2：不接收；	
          meetingName
        }
      }).then(res=>{
        this.listPendingMeeting();
      })
    },
    listPendingMeeting(chooseDate){ // 获取待处理会议列表
      const that = this;
      this.$getData.listPendingMeeting({
        method:'post',
        data:{
          beginTime:this.beginTime,	
          endTime:this.endTime
        }
      }).then(res=>{
        let data = res.data;
        if(res.code == 200 && data && data.length>0){
          this.calendList = data.map(element => {
            // scheduleState	日程状态-1：草稿；2：已发出；3：已取消；
            // receptionState	接收状态-0：未接收；1：已接收；2：不接收(拒绝接收)；
            let state = "",stateStr = "";
            if(element.scheduleState == 3){ // 已取消
              state = 'meetingCancel';
              stateStr = "已取消";
            }else{
              if(element.receptionState == 0){ // 未接受
                // state = 'meetingWait'; // 待确认
                if(new Date()>new Date(moment(element['endTime']))){
                  state = 'meetingCancel meetingEnd'
                  stateStr = "已结束";
                }else{
                  if(element.personnelType == 3){
                    state = 'meetingSure';
                    stateStr = "已知会";
                  }else if(element.personnelType == 4 || element.personnelType == 5){
                    state = 'meetingSure';
                    stateStr = "已授权";
                  }else{
                    state = 'meetingWait'; // 待确认
                  }
                }
              }else if(element.receptionState == 1){ // 已接受
                state = 'meetingSure';
                stateStr = "已接受";
                if(element.personnelType == 4 || element.personnelType == 5){
                  state = 'meetingSure';
                  stateStr = "已授权";
                }
              }else{
                state = 'meetingCancel meetingReject'; // 已拒绝
                stateStr = "已拒绝";
              }
            }
            let obj = {
              ...element,
              // from: moment(element.beginTime)._d,
              // to: moment(element.endTime)._d,
              id:element.id,
              // state: 0, //0 取消 1 已接收 2 待确认，
              state,stateStr,
              title: element.meetingName,
              room: element.meetingRoom,
              name: element.createName,
              fromHour: (that.getHours(element.beginTime) - 8 + 0.5) * that.baseRem,
              mix: that.dateHours(element.endTime, element.beginTime),
            }
            return obj;
          });
        }else{
          this.calendList = [];
        }
      })
    },
    toCreate(){ // 跳转到新建会议界面
      setlocalStorage("meetingForm","");
      setlocalStorage("confereeList",[]);
      setlocalStorage("ccList",[]);

      this.$router.push('/meetingCreate');
    },
    linkDetail(itm){ //跳到详情页
      setlocalStorage("meetingDetailScrollTop",0);
      this.$router.push({
        name:'meetingDetail',params:{ itm, },query:{ beginTime:this.beginTime.getTime(),endTime:this.endTime.getTime() }
      });
    },
    groupList(arr) {
      var result = [];
      var temp = {};
      for (let item of arr) {
        if (!temp[item.from]) {
          temp[item.from] = [];
          result.push(temp[item.from]);
        }
        temp[item.from].push(item);
      }
      // return result
    },
    //日期选择
    getDateHandler(chooseDate) {
      this.chooseDate = moment(chooseDate).format("YYYY-MM-DD HH:mm");
    },
    //时间补充 0
    hour(s) {
      return s < 10 ? "0" + s : s;
    },
    dateHours(date1, date2) {
      return (moment(date1) - moment(date2)) / (1000 * 3600);
    },
    getHours(date){
      const dateFormat =  moment(date);
      return dateFormat.hours()+(dateFormat.minutes()/60)
    },
    //会议列表排序
    showCalendList() {
      return this.calendList;
      // const mixDate = this.calendList.map(item => {
      //     //会议开始时间
      //     item.fromHour = (this.getHours(item.from) - 8 + 0.5) * this.baseRem;
      //     //会议相差时间
      //     item.mix = this.dateHours(item.to, item.from);
      //     return item;
      //   });
      // const  arr = this.sortCalendList(this.calendList, "beginTime", 1);
      // return this.sortCalendList(arr, "endTime", -1);
    },
    //会议列表排序
    sortCalendList(arrObj, keyName, type) {
      //这里如果 直接等于arrObj，相当于只是对对象的引用，改变排序会同时影响原有对象的排序，而通过arrObj.slice(0)，
      //表示把对象复制给另一个对象，两者间互不影响
      var tempArrObj = arrObj.slice(0);
      var compare = function(keyName, type) {
        return function(obj1, obj2) {
          var val1 = obj1[keyName];
          var val2 = obj2[keyName];
          if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
          }
          //如果值为空的，放在最后
          if (val1 == null && val2 == null) {
            return 0;
          } else if (val1 == null && val2 != null) {
            return type == 1 ? -1 : 1;
          } else if (val2 == null && val1 != null) {
            return type == 1 ? 1 : -1;
          }
          //排序
          if (val1 < val2) {
            return type == 1 ? 1 : -1;
          } else if (val1 > val2) {
            return type == 1 ? -1 : 1;
          } else {
            return 0;
          }
        };
      };
      return tempArrObj.sort(compare(keyName, type));
    }
  },
  watch:{
    chooseDate:function(val){
      this.listPendingMeeting(val);
    }
  }
};
</script>

<style lang="scss">
// @import "reset";
</style>
<style scoped lang='scss'>
.meetingList_dateList,.meetingList_dateList *,.meetingList{
  box-sizing: border-box;
}
.meetingList {
  padding-top: 66px;
  .punchDate {
    color: #007aff;
    box-shadow: 0px 2px 18px 0px rgba(75, 119, 175, 0.2);
  }
}
.meetingList_import{
  background-color: #f4f4f4;
  padding-bottom: 50px;
}
.meetingList_dateList {
  // background-color: #f4f4f4;
  padding: 10px 0 10px 56px;
  height: 100%;
  // padding-bottom: calc( 100% - 480px);
  overflow: auto;
  .dataList_cont {
    position: relative;
    z-index: 0; // 不更改会将日期组件盖掉
    // &:before {
    //   content: "";
    //   display: block;
    //   position: absolute;
    //   z-index: 3;
    //   width: 100%;
    //   height: 60px;
    //   background-color: rgba(223, 223, 223, 0.4);
    // }
    .dataList_calend {
      height: 40px;
      width: 100%;
      border: 1px solid rgba(75, 119, 175, 0.2);
      border-right: none;
      border-top: none;
      position: relative;
      z-index: 2;
      // margin-top: -1px;
      background: #fff;
      &:first-child {
        border-top: 1px solid rgba(75, 119, 175, 0.2);
      }
      &:after {
        content: "";
        display: block;
        height: 1px;
        width: 100%;
        background-color: rgba(75, 119, 175, 0.2);
        position: absolute;
        top: 50%;
      }
      .time {
        position: absolute;
        width: 40px;
        left: -48px;
        color: #484848;
        line-height: 17px;
        top: 12px;
        text-align: right;
        font-size: 12px;
        &:after {
          display: block;
          content: "";
          position: absolute;
          width: 6px;
          height: 2px;
          top: 50%;
          margin-top: -1px;
          right: -8px;
          background-color: #4b77af;
        }
      }
    }
  }
  .calendList_list {
    position: absolute;
    z-index: 5;
    width: 100%;
    font-size: 12px;
    overflow: hidden;
    // border: 1px solid red;
    // margin-top: 10px;
    .meeting_infor {
      position: absolute;
      top: 50%;
      width: 100%;
      margin-top: -17px;
      text-align: center;
      color: #484848;
      // display: inline-block;
      // vertical-align: middle;
      .name {
        font-weight: 600;
        line-height: 17px;
      }
      .detail {
        margin-top: 2px;
        line-height: 17px;
      }
    }
    .meeting_state {
      position: absolute;
      right: 33px;
      top: 50%;
      margin-top: -10px;
    }
    &.meetingSure,
    &.meetingCancel {
      .meeting_infor {
        width: 100%;
        padding-right: 80px;
      }
      .sure,
      .cancel,.reject,.end {
        font-size: 15px;
        line-height: 21px;
      }
    }
    .meeting_state {
      .wait {
        display: none;
      }
      .wait {
        button {
          width: 46px;
          height: 28px;
          line-height: 27px;
          border-radius: 8px;
          border: none;
          color: #484848;
          font-size: 12px;
        }
        button + button {
          margin-left: 5px;
        }
        .sureBtn {
          background-color: #ffc648;
          box-shadow: 0px 2px 4px 0px #ffc648;
        }
        .cancelBtn {
          background-color: #ff9548;
          box-shadow: 0px 2px 4px 0px #ff9548;
        }
      }
      .stateStr{
        font-size: 15px;
        line-height: 21px;
      }
      .sure {
        color: #007aff;
      }
      .cancel,.reject,.end {
        color: #c3c1c1;
      }
    }
    &.meetingWait {
      z-index: 10;
      // background-color: rgba(255, 198, 72, 0.4);
      background-color: #ffe7b2;
      box-shadow: 3px -3px 3px rgba(255, 198, 72, 0.4),3px 3px 3px rgba(255, 198, 72, 0.6);
      .wait {
        display: block;
      }
      .stateStr{
        display: none;
      }
      .meeting_state {
        right: 16px;
        margin-top: -15px;
      }
      .meeting_infor {
        right: 113px;
        padding-right: 0;
        width: auto;
        left: 0;
      }
    }
    &.meetingSure {
      z-index: 9;
      // background-color: rgba(75, 119, 175, 0.4);
      background-color: #b7c9df;
      box-shadow: 3px -3px 3px rgba(75, 119, 175, 0.4),3px 3px 3px rgba(75, 119, 175, 0.6);
      .sure {
        display: block;
      }
      .stateStr{
        color: #007aff;
      }
    }
    &.meetingCancel {
      // background-color: rgba(223, 223, 223, 0.4);
      background-color: #f2f2f2;
      box-shadow: 3px -3px 3px rgba(223, 223, 223, 0.4),3px 3px 3px rgba(223, 223, 223, 0.6);
      .cancel {
        display: block;
      }
      .stateStr{
        color: #c3c1c1;
      }
      &.meetingReject{
        .stateStr{
          color: #d75252;
        }
        .cancel {
          display: none;
        }
        .reject{
          display: block;
        }
      }
      &.meetingEnd{
        z-index: 8;
        .cancel {
          display: none;
        }
        .end{
          display: block;
        }
      }
    }
  }
}
.meetingList_btn{
  position:fixed; bottom: 0px;left:0px;right:0px;
  button{
    width: 100%;
    height: 46px;
    line-height: 44px;
    text-align: center;
    background-color: #4B77AF;
    box-shadow:2px -1px 4px 0px rgba(104,160,232,0.4);
    border: none;
    font-size: 17px;
    font-weight: 600;
    color: #fff;
  }
}
</style>
