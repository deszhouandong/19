<template>
  <div class="clock">
    <div class="warning">
      <img :src="warningImgUrl" alt />
      <p class="word">你手机时间与本地标准时间相差较大</p>
      <p class="word">本地标准时间为{{currDate}}</p>
      <p class="word">你的手机时间为{{frontTime}}</p>
      <p class="fit">请校准手机时间与本地时间保持一致!</p>
    </div>
  </div>
</template>
<script>
  import querystring from 'querystring';

  export default {
    name: "abnormalClock",
    data() {
      return {
        warningImgUrl:require('@static/imgs/warning.png'),
        currDate: '',
        frontTime:''
      };
    },
    created() {
      const {
        currDate,
        frontTime
      } = this.$route.query
      if(currDate){
        this.currDate = this.format(Number(currDate))
      }else{
        this.currDate=this.format()
      }
      if(frontTime){
        this.frontTime = this.format(Number(frontTime))
      }else{
        this.frontTime=this.format()
      }
    },
    methods: {
      format(time) {
        return this.$moment(time).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  };
</script>
<style scoped>
  .warning {
    margin-top: 40px;
    text-align: center;
  }

  .warning .word {
    font-size: 16px;
    font-weight: 700;
  }

  .warning .fit {
    margin-top: 30px;
    color: red;
    font-size: 16px;
    font-weight: 700;
  }
</style>
