<template>
  <div class="radioGroup">
    <van-radio-group v-model="radio" @change="onChange">
      <van-radio
        v-for="(item,index) in dataList"
        :key="index"
        :name="item.value"
        
      >{{item.label}}</van-radio>
    </van-radio-group>
  </div>
</template>
 
<script>
export default {
  name: "radio",
  props: {
    dataList: Array,
    active: null,
    change: Function,
  },
  data() {
    return {
      radio: this.active
    };
  },
  created() {},
  methods: {
    onChange(val){
      this.change(val);
    }
  }
};
</script>
 
<style scoped lang="scss">
/deep/.radioGroup {
  .van-radio {
    display: inline-block;
    white-space: nowrap;
    .van-radio__icon {
      display: inline-block;
      vertical-align: middle;
      margin-top: 0px;
      &.van-radio__icon--checked {
        .van-icon:before {
          border-radius: 50%;
          width: 12px;
          height: 12px;
          background-color: #4b77af;
          display: block;
          margin-top: 1px;
          margin-left: 1px;
        }
      }
      .van-icon {
        width: 16px;
        height: 16px;
        border-color: #4b77af;
        background-color: #fff;
        &:before {
          content: "";
        }
      }
    }
    .van-radio__label {
      margin-left: 6px;
    }
  }
  .van-radio + .van-radio {
    margin-left: 38px;
  }
}
</style>
