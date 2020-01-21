<template>
  <div>
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        @confirm="confirm"
        @cancel="cancel"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      minDate: new Date(),
      currentDate: new Date()
    };
  },
  props:{
    getDateHandler:{
      type:Function
    }
  },
  methods: {
    showPopup() {
      this.show = true;
    },
    hidePopup() {
      this.show = false;
    },
    // 点击完成按钮时触发的事件
    confirm(){
      this.$emit('getDateHandler',this.currentDate)
      this.hidePopup()
    },
    // 点击取消按钮时触发的事件
    cancel(){
      this.hidePopup()
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
