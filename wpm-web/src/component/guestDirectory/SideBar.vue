<template>
  <div class="sideBar">

    <van-popup v-model="show" position="left" :style="{ height: '100%'}"  @click-overlay="clickOverlay">
      <div class="sideBarList flexall">
        <h1 class="title">按阶段筛选</h1>
        <ul class="sideBarList-inner flex">
          <li
            v-for=" (item,index) in sideBarList"
            :key="index"
            @click="choose(item,index)"
            :class="{active:chooseList[index]?true:''}"
          >{{item.description}}</li>
        </ul>
        <div class="sideBar-btn">
          <button @click="reset"  class="reset">重置</button>
          <button @click="sure"  class="sure">确定</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false, //侧边栏展示状态
      chooseList: [], //选中列表高亮集合
      chooseListItem: [], //选中列表高亮列表
    };
  },
  props: {
    sideBarList: {
      type: Array,
      default: []
    },
    chooseListItemHandler:{
      type:Function
    }
  },
  methods: {
    // 筛选功能
    choose(item, index) {
      this.chooseList[index] = !this.chooseList[index];
      if(this.chooseList[index]){
        this.chooseListItem[index]=item.code
      }else{
        this.chooseListItem[index]=null
      }
      this.$forceUpdate();
    },
    // 重置
    reset() {
      this.chooseList = [];
      this.chooseListItem=[]
      // this.translateData()
    },
    // 筛选确定
    sure() {
      this.show=false
      this.translateData()
    },
    // 点击遮罩层
    clickOverlay(){
      this.reset()
    },
    //传递数据
    translateData(){
      this.$emit('chooseListItemHandler',this.chooseListItem)
    }
  }
};
</script>

<style lang="scss" scoped>
.sideBar {
  * {
    box-sizing: border-box;
  }
  .sideBarList {
    width: 265px;
    height: 100%;
    background: #fff;
    position: relative;
    padding-top: 60px;

    .title {
      height: 40px;
      line-height: 40px;
      color: #7b7b7b;
      font-size: 12px;
      padding-left: 20px;
      font-weight: normal;
      box-shadow: 0px 2px 4px 0px rgba(75, 119, 175, 0.1);
    }

    .sideBarList-inner {
      padding: 5px 0 5px 15px;
      li {
        float: left;
        margin: 15px 5px;
        padding: 10px;
        min-width: 68px;
        text-align: center;
        background: #f4f4f4;
        font-size: 12px;
        color: #484848;
        &.active {
          color: #4b77af;
        }
      }
    }
.sideBar-btn{
  button{
    width:50%;
    height: 46px;
    line-height: 46px;
    text-align: center;
    border:none;outline: none;
    float: left;
    font-size: 17px;
    font-weight: bold;
  }
.sure{
background: #4B77AF;
color:#fff;
}
.reset{
  background: #F4F4F4;
  color:#007AFF;
}
}
  }

}
</style>
