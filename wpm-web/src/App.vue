<template>
  <div id="app">
    <!-- <keep-alive include="keyAction,actionSafe">
      <router-view/>
    </keep-alive>-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!($route.meta&&$route.meta.keepAlive)"></router-view>
    <water ref="initwart"></water>
  </div>
</template>

<script>
import water from "@/component/global/watermarker";
import { setCookie, getCookie } from "@/apis/cookie1";
import wx from "weixin-js-sdk"; // 引入企业微信的sdk
// import cookieOperation from "@/apis/cookie";
import { mapState } from "vuex";

export default {
  name: "App",
  components: {
    water
  },
  computed: {
    //获取store里面的state值
    ...mapState(["access_token"])
  },
  data() {
    return {
      userName: ""
    };
  },
  created() {
    this.getConfig()
  },
  mouted() {
    // this.$refs.initwart.initWaterMark(this.userName);
    // wx.ready(function() {
    //   wx.hideAllNonBaseMenuItem();
    // });
  },
  watch: {
    access_token: {
      handler: function(newState) {
        if (newState || getCookie("access_token")) {
          this.getSaasUser();
        }
      },
      immediate: true
    }
  },
  methods: {
    getConfig() {
      let url = window.location.href.split("#")[0];
      this.$getData
        .getConfig({
          method: "post",
          data: {
            url: url
          },
          headers: {
            Authorization: null
          }
        })
        .then(res => {
          if (res && res.code == 200) {
            wx.config({
              beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: res.data.appId, // 必填，企业微信的corpID
              timestamp: res.data.timestamp, // 必填，生成签名的时间戳
              nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
              signature: res.data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
              jsApiList: [
                // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
                "getLocation", // 获取地理位置接口
                "checkJsApi",
                "hideAllNonBaseMenuItem",
                "scanQRCode"
              ]
            });
            wx.error(function(res) {
              console.log(res);
              // Sentry.captureException(res);
            });
            wx.ready(function() {
              wx.hideAllNonBaseMenuItem();
            });
          }
        });
    },
    getSaasUser() {
      this.$getData
        .getCurrent({
          method: "post"
        })
        .then(res => {
          if (res.code == 200) {
            const { accountName, name } = res.data;
            this.userName = accountName;
            // cookieOperation.cookie.set(
            //   "accountName",
            //   accountName,
            //   1000 * 60 * 60 * 24
            // );
            setCookie("accountName", accountName, 24 * 7);
            setCookie("name", escape(name), 24 * 7);
            localStorage.setItem("personName", name);
            this.$refs.initwart.initWaterMark(this.userName);
          }
        })
        .catch(function(error) {
          console.log("error" + error);
        });
    }
  },
};
</script>

<style scoped>
#app {
  /* padding-bottom:50px; */
  box-sizing: border-box;
}
</style>




