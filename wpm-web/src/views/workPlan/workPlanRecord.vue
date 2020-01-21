<template>
  <div id="workPlanRecord">
    <van-list class="recordUl"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多的操作记录了！"
      :error.sync="error"
      error-text="请求失败!"
      @load="onLoad"
    >
      <van-cell class="recordLi"
        v-for="(item,index) in list"
        :key="index"
      >
        {{item.userName}}<span>--{{ltype(item.ltype)}}</span>
        <p>{{getMyTime(item.lrecordTime)}}</p>
      </van-cell>
    </van-list>

    <!-- <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in list"
        :key="item"
        :title="item"
      />
    </van-list> -->
  </div>
</template>

<script>
import axios from 'axios';
import { CellGroup } from 'vant';
export default {
  name: "workplan",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false, // 数据加载错误的状态

      start:0,  // 从索引几初拿数据
      length:3, // 每次拿几条数据
      // list: [],
      // loading: false,
      // finished: false
    }
  },
  created() {
  },
  mounted(){
    // this.selWorkPlanLog();
  },
  methods:{
    getMyTime(timeStr){
      return new Date(timeStr).format('yyyy/MMdd hh:mm');
    },
    ltype(type){
      switch(type){
        case '1':
          return '打开';
        case '2':
          return '批阅';
        case '3':
          return '发布';
        case '4':
          return '撤回';
      }
    },
    onLoad() {
      let data = { ...this.$route.query.data, start:this.start, length:this.length, 
        // adAcount:'' 
      };
      this.start = this.start + this.length;
      console.log(data);
      this.$getData.selWorkPlanLog({
        method:'post',
        data
      }).then(res => {
        console.log('res',res);
        this.list = this.list.concat(res.data);
        this.loading = false;
        if(this.list.length  >= res.total){
          this.finished = true;
        }
      }).catch(error => {
        this.error = true;
      })
    },
    selWorkPlanLog(){ // 查询关于自己的操作记录
      console.log('周数23333',this.$route);
      this.$getData.selWorkPlanLog({
        method:'post',
        data:{}
      }).then(res => {
        if(res.code == 200 && res.msg == 'success'){
          console.log('获取操作记录成功',res);
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped >
#workPlanRecord{
  background: #f4f4f4;padding-top: 15px;height: 100%;position: fixed;top: 0;bottom: 0;left: 0;right: 0;
  overflow-y: scroll;
}
</style>
<style lang='scss'>
.recordUl.van-list{

  &>.recordLi.van-cell{
    background: #fff;height: 60px;border-bottom: 1px solid #f4f4f4;font: 17px/60px ''; padding: 0 17px;
    span{ color: rgba(-2147483648,-2147483648,-2147483648,0.30);letter-spacing: -0.32px; }
    p{float: right;margin: 0;
      font-size: 14px;
      color: #D75252;
      letter-spacing: -0.26px;
    }
  }
}
</style>
