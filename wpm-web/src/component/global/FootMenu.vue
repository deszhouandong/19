<template>
  <Footer>
    <van-row type="flex" justify="space-around">
      <van-col span="5">
        <a :href="getEvironment()">
          <i class="shouye"></i>
          <span>首页</span>
        </a>
      </van-col>
      <van-col span="5">
        <a :href="getEvironment('application')">
          <i class="yingyong"></i>
          <span>应用</span>
        </a>
      </van-col>
      <van-col span="5">
        <a :href="getEvironment('report')">
          <i class="baogao"></i>
          <span>报告</span>
        </a>
      </van-col>
      <van-col span="5">
        <a :href="getEvironment('colleague')" class="active">
          <i class="tongshiquan active"></i>
          <span>同事圈</span>
        </a>
      </van-col>
      <!-- <van-col span="5">
        <i class="shezhi"></i>
        <span>设置</span>
      </van-col>-->
    </van-row>
  </Footer>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    getEvironment(path='') {
      let prefix;
      const environment=process.env.NODE_ENV
      let wps=path==='colleague'?'wps-vue':''
      switch (environment) {
        case "test":
          prefix = `http://a.fehorizon.com/HXJFwpsTEST/${wps}#/`;
          break;
        case "production":
          prefix = `http://hxjf.fehorizon.com/${wps}#/`;
          break;
        default:
          prefix = `localhost:8080/${wps}#/`;
          break;
      }
      return prefix + path;
    }
  }
};
</script>>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
Footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 50px;
  background: #f4f4f4;
  border-top: 1px solid #d3d3d3;
  // border-bottom: 1px solid #949494;
  text-align: center;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  i{
     background: url("../../assets/images/icon.png")  no-repeat;
    background-size:225px 80px;
    display: block;
  }
}

.van-col{
  margin-top: 7px;
  >a.active{
     i{
      &.shouye{
        background: url("../../assets/images/shouye02.png") no-repeat;
        background-size:18px 18px;
      }
      &.yingyong{
        background: url("../../assets/images/yingyong02.png") no-repeat;
        background-size:18px 18px;
      }
      &.baogao{
        background: url("../../assets/images/baogao02.png") no-repeat;
        background-size:18px 18px;
      }
      &.tongshiquan{
        background: url("../../assets/images/tongshiquan02.png") no-repeat;
        background-size:18px 18px;
      }
    }
  }
  span {
    display: block;
    padding: 0 5px;
    color: #484848;
    font-size: 12px;
    font-weight: bold;
  }

  i{
    width: 18px;
    height:18px; //16
    margin: 0 auto;
     &.shouye{
      background: url("../../assets/images/shouye01.png") no-repeat;
      background-size:18px 18px;
    }
    &.yingyong{
      background: url("../../assets/images/yingyong01.png") no-repeat;
      background-size:18px 18px;
    }
    &.baogao{
      background: url("../../assets/images/baogao01.png") no-repeat;
      background-size:18px 18px;
    }
    &.tongshiquan{
      background: url("../../assets/images/tongshiquan01.png") no-repeat;
      background-size:18px 18px;
    }
  }

  // .router-link-active{
  //   i{
  //     &.shouye{
  //       background-position: -109px -0px;
  //     }
  //     &.yingyong{
  //       background-position: -192px 1px;
  //     }
  //     &.baogao{
  //       background-position: -76px 0px;
  //     }
  //     &.tongshiquan{
  //       background-position: -175px 0px;
  //     }
  //     &.shezhi{
  //       background-position: -143px 1px;
  //     }
  //   }
  // }
}

</style>
