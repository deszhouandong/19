<template>
  <div class="error" style="">
    <div class="errInfo">
      <p class="grayInfo">{{msg}}</p>
    </div>
  </div>
</template>
<script>
  // import cookieOperation from '@/apis/cookie'
  export default {
    name:"Error",
    data() {
      return {
        // token: '',
        msg:""
      }
    },
    // watch: {
    //   token(val) {
    //     if (!val === undefined) {
    //       this.$router.push("/Index")
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    created() {
      document.title = '页面出错'
      // this.token = cookieOperation.cookie.get('access_token')
      // this.msg = this.$route.query['msg']
    }
  }

</script>
<style lang="scss" scoped>
  .error {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background:url('../../static/imgs/errBj.jpg') center center no-repeat;
        width: 100%;
    height: 600px;
    .errInfo {
      position: fixed;
      top: 48%;
      width: 200px;
      color: #000;
      font-size: 18px;
      text-align: center;
      color: #E2E2E2;
    }
  }

  .error p {
    margin: 0 0 10px 0 !important;
  }

</style>
