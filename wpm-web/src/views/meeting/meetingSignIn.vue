<template>
  <div id="meetingSignIn"></div>
</template>

<script>
export default {
  name: "meetingSignIn",
  data() {
    return {
      meetingNumber: ""
    };
  },
  mounted() {
    const { number } = this.$route.query;
    this.meetingNumber = number;
    this.signIn();
  },
  methods: {
    goback(){
      this.$router.go(-1);
      this.$router.replace({
        path: "/meetingInfo",
        query: this.$route.query,
      })
    },
    signIn() {
      this.$getData.scanningSignIn({
        method: "get",
        data: {
          meetingNumber:this.meetingNumber,
        }
      }).then(res=>{
          this.$toast('签到成功')
          this.goback()
      }).catch(rej=>{
          this.goback()
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>