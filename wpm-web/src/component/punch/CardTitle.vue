<template>
  <div :class="['cardTitle',showBorder?'showBorder':'']">
    <div class="cardTitle-inner clear">
      <b class="fl title">{{title}}</b>
      <div class="supply fl">
        <slot name="content"></slot>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
      },
      showBorder: {
        type: Boolean,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cardTitle {
    background: #fff;
    &.normal{
      padding:0 10px;
    }
    .cardTitle-inner {
      margin: 0 10px;
    }

    &.showBorder {
      .cardTitle-inner {
        border-bottom: 1px solid rgba(104, 160, 232, 0.1);
        padding-left: 15px;
      }

    }
  }

  .title {
    line-height: 24px;
    font-weight: 600;
    color: #484848;
    font-size: 17px;
    padding: 10px 0;
  }

  .supply {
    margin-left: 10px;
    line-height:30px;
    padding: 10px 0;

  }
</style>
