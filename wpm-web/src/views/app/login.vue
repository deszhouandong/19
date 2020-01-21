<template>
  <div class="app-login">
    <div class="head">
      <!-- <img :src="headImgUrl" alt class="headImg" /> -->
      <!-- <img :src="headImgUrl" alt class="headImg" /> -->
      <!-- <p class="hello">hello!</p> -->
    </div>
    <div class="form">
      <div class="form-item">
        <input
          v-model="tell"
          @input="formatter($event,'tell')"
          type="text"
          maxlength="11"
          placeholder="手机号"
        />
        <img :src="tellImgUrl" alt class="tellImg label-img" />
      </div>
      <div class="form-item form-item-yzm">
        <input
          v-model="yzm"
          type="text"
          @input="formatter($event,'yzm')"
          maxlength="6"
          placeholder="验证码"
        />
        <img :src="yzmImgUrl" alt class="yzmImg label-img" />
        <div class="send-message-wrap">
          <span class="line"></span>
          <button class="send-message" v-if="!disabled" :disabled="disabled" @click="send">发送验证码</button>
          <button class="send-message second" disabled v-else>（{{second}}S）</button>
        </div>
      </div>

      <button class="login" @click="login">登陆</button>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { setCookie, getCookie, delCookie } from "@/apis/cookie1";
export default {
  data() {
    return {
      headImgUrl: require("../../../static/imgs/app/touxiang.svg"),
      tellImgUrl: require("../../../static/imgs/app/tell.svg"),
      yzmImgUrl: require("../../../static/imgs/app/yzm.png"),
      timer: null, //定时器
      second: 60, //倒计时
      disabled: false, //发送验证码是否禁用
      tell: "",
      yzm: ""
    };
  },
  mounted() {
    document.title = "登陆";
  },
  methods: {
    // 校验输入框只能输数字
    formatter(e, type) {
      // 手机只能输数字（且首位不为0）
      // 验证码只能输数字
      const reg = type === "tell" ? /^0|[^\d]/g : /[^\d]/g;
      let filtered = e.target.value.replace(reg, "");
      this[type] = filtered;
    },
    // 发送验证码
    send() {
      if (this.tell.length != 11) {
        Toast("请输入正确手机号");
        return;
      }
      this.disabled = true;

      this.$getData
        .sendPhoneCode({
          method: "post",
          data: {
            phone: this.tell
          }
        })
        .then(res => {});
      this.timer = setInterval(
        function() {
          this.second--;
          if (this.second === 0) {
            clearInterval(this.timer);
            this.second = 60;
            this.disabled = false;
          }
        }.bind(this),
        1000
      );
    },
    // 登陆
    login() {
      if (this.tell.length != 11) {
        Toast("请输入正确手机号");
        return;
      }
      if (this.yzm.length != 6) {
        Toast("请输入正确验证码");
        return;
      }
      let loading = Toast.loading({
        message: "登陆中...",
        forbidClick: true,
        duration: 0
      });
      this.$getData
        .login({
          method: "post",
          data: {
            phone: this.tell,
            code: this.yzm
          },
          headers: {
            Authorization: null
          }
        })
        .then(res => {
          loading.clear();
          if (res.code == 200) {
            const { access_token, expires_in } = res.data;
            setCookie("access_token", access_token, expires_in / 3600);
            this.$router.push("punch");
          }
        })
        .catch(() => {
          loading.clear();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-login {
  height: 100%;
  position: relative;
  z-index: 2001;
  background: #fff;

  * {
    box-sizing: border-box;
  }
}

.head {
  height: 247px;
  position: relative;
  text-align: center;
  background: url(../../../static/imgs/app/login-bg1.png) no-repeat center;
  // background-size: 100% 100%;
  .headImg {
    width: 83px;
    height: 83px;
    border-radius: 50%;
    margin: 71px 0 9px;
  }

  .hello {
    line-height: 22px;
    color: #fff;
    font-size: 16px;
  }
}

.form {
  padding: 26px 28px 52px;

  .form-item {
    @include clear;
    padding: 8px 23px;
    position: relative;
    height: 48px;
    border-radius: 20px;
    border: 1px solid #4b77af;
    margin-bottom: 28px;

    input {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      font-size: 17px;
      padding-left: 38px;
      background: transparent;

      &::-webkit-input-placeholder {
        /* Chrome/Opera/Safari */
        color: #e2e2e2;
      }

      &::-moz-placeholder {
        /* Firefox 19+ */
        color: #e2e2e2;
      }

      &:-ms-input-placeholder {
        /* IE 10+ */
        color: #e2e2e2;
      }

      &:-moz-placeholder {
        /* Firefox 18- */
        color: #e2e2e2;
      }
    }

    &.form-item-yzm input {
      padding-right: 110px;
    }

    .label-img {
      position: absolute;
      left: 23px;
      top: 9px;

      &.tellImg {
        width: 26px;
        height: 26px;
      }
      &.yzmImg {
        width: 30px;
        height: 30px;
      }
    }

    .send-message-wrap {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;

      .line {
        float: left;
        border-left: 1px solid #588ec8;
        height: 28px;
        margin-top: 9px;
      }

      .send-message {
        float: left;
        background: none;
        outline: none;
        border: 0;
        text-decoration: underline;
        color: #67dcfb;
        font-size: 17px;
        line-height: 46px;
        margin: 0 17px 0 15px;
      }

      .second {
        text-decoration: none;
      }
    }
  }

  .login {
    display: block;
    width: 100%;
    border: none;
    outline: none;
    height: 48px;
    line-height: 48px;
    background: linear-gradient(
      180deg,
      rgba(75, 119, 175, 1) 0%,
      rgba(102, 169, 228, 1) 100%
    );
    box-shadow: 5px 8px 36px 5px rgba(62, 136, 208, 0.41),
      0px 1px 3px 0px rgba(79, 127, 184, 1);
    border-radius: 20px;
    font-weight: 500;
    font-size: 24px;
    color: #fff;
    margin-top: 80px;
  }
}
</style>
