<template>
  <div class="mianFotter" id="mianFotter">
    <router-view />
    <!-- <div class> -->
    <van-tabbar v-model="active" id="nav-bottom">
      <van-tabbar-item icon="home-o" @click="changRouter('punch')">打卡</van-tabbar-item>
      <!-- <van-tabbar-item icon="search" @click="changRouter('checkDetail')">地图</van-tabbar-item> -->
      <van-tabbar-item icon="search" @click="changRouter('attendanceRecord')">地图</van-tabbar-item>
    </van-tabbar>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      active0Path:['/punch','/punchHistory'],
      active1Path:['/attendanceRecord','/mapDetail']
    };
  },
  created() {
    this.menuChange()
  },
  methods: {
    menuChange(index) {
      const {path}=this.$route
      if(this.active0Path.indexOf(path)>-1){
         this.active = 0;
      }
      if(this.active1Path.indexOf(path)>-1){
         this.active = 1;
      }
    },
    changRouter(str) {
      this.$router.push(str);
      if (str == "punch") {
        this.active = 0;
      } else {
        this.active = 1;
      }
    }
  },
  watch: {
    $route(to, from) {
      this.menuChange();
    }
  }
};
</script>

<style scoped lang="scss">
/deep/.van-tabbar {
  background: #f4f4f4;
}
.mianFotter {
  padding-bottom: 50px;
}
</style>
