<template>
      <!-- 防抖 -->
      <van-button 
      type="info" @click="onclick">{{title}}</van-button>
    <!-- <button :disabled="clickState" 
            @click="onclick" 
            class="butt" 
    >{{title}}</button> -->
</template>

<script>
  export default {
    props: {
      clickState: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        buttonStatus: true,
        stopTime: null
      }
    },
    methods: {
      onclick() {
          this.$emit('onclick',this.buttonStatus)
        if (this.buttonStatus) {
          this.buttonStatus = false;
        }
        this.setButton();
      },
      setButton() { //添加一个定时器，点击之后延时1s，防二次点击后台报错
        clearTimeout(this.stopTime);
        this.stopTime = setTimeout(() => {
            console.log
          this.buttonStatus = true
        }, 1000)
      }
    }
  };
</script>
<style lang="scss" scoped >
// .button {
  .van-button--normal {
    width: 40%;
    height: 0.8rem;
    line-height: 0.8rem;
  }
// }
</style>