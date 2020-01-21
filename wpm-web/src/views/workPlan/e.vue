<template>
    <div class="e" style="">
        <div class="txt">
            <p>数据加载失败,请返回上一页从新加载!</p>
            <van-button @click="go">返回上一页</van-button>
        </div>
        <img :src="src" alt="">
    </div>
</template>

<script>

export default {
    data(){
        return {
            src:require('../../../static/imgs/errBj.jpg')
        }
    },
    mounted(){
        console.log('this.$route.params',this.$route);
        if(this.$route.params.src){
            this.src = this.$route.params.src;
        }
    },
    methods:{
        go(){
            this.$router.push("workplan");
            // this.$router.go(-1);
        }
    }
}
</script>

<style lang="scss" scoped>
.e {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .txt {
      position: fixed;
      top: 48%;
      width: 200px;
      color: #000;
      font-size: 18px;
      text-align: center;
      color: #000;
    }

}
</style>