<template>
  <div class="confirmResultsss">
    <!-- 考勤基本情况 -->
    <div class="essential">
      <p class="title">{{confrimResult.userName}}</p>
      <van-divider />
      <p class="scope">
        打卡时间：
        <span class="scope">{{confrimResult.clockDateToStr}}</span>
      </p>
      <p class="scope">
        打卡地点：
        <span class="scope">{{confrimResult.name}}</span>
      </p>
      <p class="time">
        正常时间：
        <span>{{confrimResult.normalAattendanceToStr}}</span>
      </p>
    </div>
    <div class="essential">
      <p class="opinion">当前意见</p>
      <van-divider />
      <p class="word">
        确认时间：
        <span class="word">{{confrimResult.comfirmTimeToStr}}</span>
      </p>
      <p class="word">
        当前意见：
        <span class="word">{{confrimResult.currentOpinion}}</span>
      </p>
      <p class="word">
        考勤状态：
        <span class="status">{{status[confrimResult.checkinStatus]}}</span>
      </p>
    </div>
  </div>
</template>
<script>
import {dateCompare} from '@/utils/time'

export default {
  name: "confirmResult",
  data() {
    return {
      confrimResult: [],
      status: {}
    };
  },
  created() {
    document.title = "考勤确认";
    this.id = this.$route.query["id"];
  },
  mounted() {
    this.getConfrimResult();
  },
  methods: {
      // 格式化下午打卡时间
    // 如果下午：17:30以后只显示正常时间，17:30之前显示具体时间
    // 如果上午和中午，显示具体时间
    formatAfternoon(checkinDateId,clockDate,fromDate){
        let result='';
        if(checkinDateId===3){
          if(clockDate){
            if(clockDate==='-- -- --:--'||clockDate==='缺失'){
                result=clockDate
            }else{
                const endData=fromDate&&fromDate.slice(0,5);
                const cardDate=clockDate&&clockDate.split(' ')[1]
                result=dateCompare('0:00',endData,cardDate)?clockDate:'正常时间'
            }
          }
        }else{
            result=clockDate
        }
        return result;
    },
    getConfrimResult() {
      this.$getData
        .checkinInfo({
          method: "post",
          data: {
            id: this.id
          }
        })
        .then(res => {
          this.confrimResult = res.data;
          // const {checkinDateId,clockDateToStr,normalAattendanceToStr}=res.data
          // this.confrimResult.clockDateToStr=this.formatAfternoon(checkinDateId,clockDateToStr,normalAattendanceToStr)
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
        });
    }
  }
};
</script>
<style scoped  lang="scss">
/* 考勤基本情况 12*/
.essential {
  background: #fff;
  box-shadow: 0 2px 10px 0 rgba(199, 197, 197, 0.5);
  border-radius: 12px;
  padding-left: 10px;
  padding-top: 3px;
  padding-bottom: 10px;
  padding-right: 10px;
  margin-top: 10px;
}
.title {
  width: 100%;
  font-size: 17px;
  color: #484848;
  font-weight: 700;
}
.essential .scope {
  font-size: 14px;
  color: #4b77af;
}
.essential .time {
  color: #484848;
  font-size: 14px;
}
.opinion {
  text-align: center;
  font-size: 17px;
  color: #000;
  font-weight: 700;
}
.word {
  font-size: 17px;
  color: #000;
}
.status {
  color: #4b77af;
  font-size: 17px;
}
</style>
