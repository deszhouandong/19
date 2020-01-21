<template>
  <div class="wrap">
      <guestlist :isOperate = isOperate />
  </div>
</template>
<script>

import guestlist from "@/component/guestDirectory/guestlist";
export default {
  components: {
    guestlist
  },
  data(){
    return{
        isOperate:true,
    }
  },
  beforeCreate() {
    document.title = "访客记录-2019-10-23";
  }

};
</script>
<style lang="scss" scoped>
$border: 1px solid rgba(75, 119, 175, 0.2);
.wrap {
  background: #f4f4f4;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.flex {
  display: flex;
}
</style>
