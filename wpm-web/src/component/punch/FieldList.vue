<template>
  <div class="fieldListItem">
    <label for>{{label}}</label>
    <div class="content">{{content}}</div>
  </div>
</template>

<script>
export default {
  props: ["label", "content"]
};
</script>

<style lang="scss" scoped>
.fieldListItem {
    height: 51px;
    line-height: 51px;
    border-bottom: 1px solid rgba(75, 119, 175, 0.2);
    @include clear;
    margin:0 10px;
    color:#484848;
    .content {
      float: right;
    }
}
</style>
