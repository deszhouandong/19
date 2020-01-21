<template>
  <div class="meetingDetail meetingManage" style="height:100%;background:rgba(244,244,244,1);overflow:auto;" ref="meetingDetail">
    <div
      :class="[getState(item)['state'],'detailList']"
      v-for="(item,index) in dataList"
      :key="index"
    >
      <div class="detailList_row" @click="toInfo(item)">
        <div class="meeting_infor">
          <div class="name">{{item.meetingName}}</div>
          <div class="detail">
            {{item.meetingRoom}}
            <span>{{`(${getDateRange(item)})`}}</span>    
            <span v-show="item.createName">-{{item.createName}}</span>
          </div>
        </div>
        <div class="meeting_state">
          <!-- <div class="cancel">已取消</div>
          <div class="sure">已接受</div>
          <div class="reject">已拒绝</div>
          <div class="end">已结束</div> -->
          <div class="stateStr">{{getState(item)['stateStr']}}</div>
          <div class="wait">
            <button class="sureBtn" @click.stop="takeOrNo(1,item)">接受</button>
            <button class="cancelBtn" @click.stop="takeOrNo(2,item)">拒绝</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { getlocalStorage, setlocalStorage } from "@/utils/format";
export default {
  name: "meetingDetail",
  created() {
    document.title = "会议消息";
    this.endTime = new Date(Number(this.$route.query.endTime));
    this.beginTime = new Date(Number(this.$route.query.beginTime));
    this.getList();
  },
  mounted() {
  },
  data() {
    return {
      beginTime:new Date(),
      endTime:new Date(),
      dataList:[]
    };
  },
  computed: {},
  methods: {
    toInfo(itm){
      setlocalStorage("meetingDetailScrollTop",this.$refs.meetingDetail.scrollTop);
      this.$router.push({
        name:"meetingInfo",query:{ 
          id:itm.id,
          name:encodeURIComponent(itm.meetingName),
          number:encodeURIComponent(itm.meetingNumber),
        }
      })
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
    },
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
        this.getList();
      })
    },
    getState(element){
      let state = "",stateStr = "";
          if(element.scheduleState == 3){ // 已取消
            state = 'meetingCancel';
            stateStr = '已取消';
          }else{
            if(element.receptionState == 0){ // 未接受
              // state = 'meetingWait'; // 待确认
              if(new Date()>new Date(moment(element['endTime']))){
                  state = 'meetingCancel meetingEnd'
                  stateStr = '已结束';
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
              stateStr = '已接受';
              if(element.personnelType == 4 || element.personnelType == 5){
                state = 'meetingSure';
                stateStr = "已授权";
              }
            }else if(element.receptionState == 2){ // 拒绝接受
              state = 'meetingReject';
              stateStr = '已拒绝';
            }
          }
      return {state,stateStr}
    },
    getDateRange(item){
      const { beginTime,endTime  } = item;
      // YYYY/MM/DD HH:mm
      return moment(beginTime).format('HH:mm') + "-" + moment(endTime).format('HH:mm')
    },
    async getList(){
      const res =await this.$getData.listPendingMeeting({
        method:"post",
        data:{
          beginTime:this.beginTime,	
          endTime:this.endTime
        }
      });
      if(res.code == 200){
        // scheduleState	日程状态-1：草稿；2：已发出；3：已取消；
        // receptionState	接收状态-0：未接收；1：已接收；2：不接收(拒绝接收)；
        this.dataList = this.sortCalendList(res.data, "beginTime", -1);
        setTimeout(()=>{
            this.$refs.meetingDetail.scrollTop = getlocalStorage("meetingDetailScrollTop")||0;
        },0)
      }
    }
  },
  
};
</script>

<style lang="scss">
// @import "reset";
</style>
<style scoped lang='scss'>
.meetingDetail {
  .detailList {
    display: table;
    background-color: #fff;
    width: 100%;
    margin-top: 10px;
    &:first-child {
      margin-top: 0;
    }
    .detailList_row {
      display: table-row;
    }
  }
  .meeting_infor {
    display: table-cell;
    vertical-align: middle;
    padding: 5px 14px;
    .name {
      font-size: 14px;
      color: #151515;
      line-height: 20px;
      font-weight: bold;
    }
    .detail {
      font-size: 11px;
      line-height: 16px;
      font-weight: 500;
    }
  }
  .meeting_state {
    display: table-cell;
    vertical-align: middle;
  }
  .meeting_state {
    padding-right: 20px;
    white-space: nowrap;
    text-align: right;
    // > * {
    //   display: none;
    // }
    .wait {
      display: none;
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
    }
    .sure {
      color: #007aff;
      font-size: 15px;
    }
    .cancel,.end {
      color: #c3c1c1;
      font-size: 15px;
    }
    .reject {
      color: #d75252;
      font-size: 15px;
    }
  }
  .detailList {
    &.meetingWait .meeting_state{
      .wait {
        display: block;
      }
      .stateStr{
        display: none;
      }
    }
    &.meetingSure {
      .stateStr{
        color: #007aff;
      }
      .sure {
        display: block;
      }
    }
    &.meetingCancel {
      .stateStr{
        color: #c3c1c1;
      }
      .cancel {
        display: block;
      }
      &.meetingEnd{
        .cancel {
          display: none;
        }
        .end{
          display: block;
        }
      }
    }
    &.meetingReject {
      .stateStr{
        color: #d75252;
      }
      .reject {
        display: block;
      }
    }
  }
}
</style>
