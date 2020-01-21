<template>
  <div class="safe">
    <van-cell-group>
      <!-- 导航栏 -->
      <van-nav-bar
        title="行为安全观察问题"
        left-text="取消"
        @click-left="onClickLeft"
        style="color:#333;">
        <div @click="onright" slot="right">
          <div  style="color:#1989fa;" @click="infoData.questionLists.forEach(onClickRight)">确定</div>
        </div>
      </van-nav-bar>
      <!-- 填写行为安全观察问题 -->
      <van-cell size="large" style="color:#484848;font-weight:bold;padding-left:15px">
        <template slot="title">
          <!-- <i class="iconfont icon-shugang" style="color:#4b77af"></i> -->
          <span class="custom-title">填写行为安全观察问题 :</span>
          <van-icon name="add" class="add" @click="add" />
        </template>
      </van-cell>

      <van-field
        required
        :label="item.questionLabel"
        label-width="115px"
        label-align="center"
        input-align="center"
        style="padding:0rem; color:#333;height:40px;line-height:40px;"
        class="info"
        v-model="item.questionDesc"
        v-for="(item,index) of this.infoData.questionLists"
        :key="index"
        type="textarea"
        rows="1"
        maxlength="200"
      >
      
        <van-icon
          name="delete"
          slot="right-icon"
          @click="deleteInfo(index)"
          style="color:#ccc;padding:0px 10px 20px 0;font-size:18px;"
        />
      </van-field>
      <van-popup v-model="deleteShow" style="width:90%;height:200px;border-radius: 10px;">
        <div class="popTitle">
          <span>提示</span>
        </div>
        <div class="popContent">
          <p>{{popContent}}</p>
        </div>
        <div class="popfooter">
          <van-button
            type="info"
            v-if="deleteFlag"
            style="height:50px;line-height:30px;width:50%;background-color: #fff;color:#000;font-weight: bold;font-size: 16px;border: 1px solid #ccc;"
            @click="deleteCancel"
          >取消</van-button>
          <van-button
            type="info"
            v-if="confirmFlag"
            style="height:50px;line-height:50px;width:50%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
            @click="deleteCancel"
          >确认</van-button>
          <van-button
            type="info"
            v-if="!confirmFlag"
            style="height:50px;line-height:30px;width:50%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
            @click="deleteConfirm(delIndex)"
          >确认</van-button>
        </div>
      </van-popup>
    </van-cell-group>
  </div>
</template>
<script>
import Vue from "vue";

export default {
  name: "actionSafe",
  props:{
    keydata: {
        type: Object,
      },
  },
  data() {
    return {
      flag:true,
      infoData: {},
      recordDate: "",
      delIndex: "",
      deleteFlag: true,
      deleteShow: false,
      popContent: "",
      confirmFlag: false,
      num: "",
      adAcount: '',
      qusflag:false,
      paramsData:[],
    };
  },
  created() {
    this.init();
    // this.getparams()
  },
  methods: {
    //初始化
    init() {
        //获取ad账号
        this.$getData.getCurrent({
            method: "post",
        }).then(res => {
            this.adAcount = res.data.accountName
            this.recordDate  = this.$moment(new Date()).format("YYYY-MM-DD")
            //查询
      this.$getData
        .keyAction({
          method: "post",
          data: {
            adAcount: this.adAcount,
            recordDate: this.recordDate
          }
        })
        .then(res => {
          this.infoData = res.data;
          this.infoData.questionLists = this.$route.params.keydata
          this.paramsData = [...this.$route.params.keydata]
        });
            
        })
        console.log(this.$route.params.keydata,'data')
    },
    onClickLeft() {
      this.infoData.qusflag = false
      // this.infoData.questionLists = this.$route.params.keydata
      // this.$router.go(-1);
      this.$router.push({
            name: "keyAction",
            params: {
              safedata: this.paramsData
            }
          });
          
    },
    onright(){
      if (this.infoData.questionLists.length === 0) {
          this.$router.push({
            name: "keyAction",
            params: {
              safedata: this.infoData.questionLists
            }
          });
        }
    },
    //表单验证加保存
    onClickRight(item) {
        this.confirmFlag = true;
        this.flag = true;
        for (let i = 0; i < this.infoData.questionLists.length; i++) {
          const item = this.infoData.questionLists[i];
          if (item.questionDesc === "") {
            this.flag = false;
            this.$toast("问题不能为空");
          }
        }
        if(this.infoData.questionLists === []){
          this.flag = true;
        }
        if (this.infoData.questionLists.length > 10) {
        this.$toast('问题最多只能有十条')
      }
        if (this.flag) {
            // this.infoData.qusflag = true
          this.$router.push({
            name: "keyAction",
            params: {
              safedata: this.infoData.questionLists
            }
          });
          // this.infoData.qusflag = false
        }
    },

    //添加问题
    add() {
      if(this.infoData.questionLists.length < 10){
        this.num = this.infoData.questionLists.length + 1;

      this.infoData.questionLists.push({
        questionLabel: "问题" + this.num,
        questionDesc: ""

      });
      }
      if (this.infoData.questionLists.length >= 10) {
        this.$toast('问题最多只能有十条')
      }
    },
    //删除问题
    deleteInfo(index) {
      this.confirmFlag = false;
      this.deleteShow = true;
      this.deleteFlag = true;
      this.popContent = "确认删除此条记录吗？";
      this.delIndex = index;
    },
    //删除确认
    deleteConfirm(index) {
      this.infoData.questionLists.splice(index, 1);
      for (let i in this.infoData.questionLists) {
        this.infoData.questionLists[i].index = i;
        let j = Number(i) + 1;
        this.infoData.questionLists[i].questionLabel = "问题" + j;
      }
      this.deleteShow = false;
    },
    //删除取消
    deleteCancel() {
      this.deleteShow = false;
    },
    // getparams(){
    //   this.paramsData = this.$route.params.keydata
    //   // this.infoData.questionLists = this.$route.params.keydata
    //   // console.log(this.paramsData,'dd',this.infoData.questionLists)
    //     // if(this.$route.params.safedata !== undefined && this.$route.params.safedata !== null){
    //     //   // if(this.infoData.questionLists.qusflag === true){
    //     //     this.infoData.questionLists = this.$route.params.safedata
    //     //   // }
    //     // }
    // },
  },
//    beforeRouteEnter (to, from, next) {
//     next(vm => {
//       vm.ii = "ooo"   
//       vm.infoData.questionLists = []
//       // if(vm.$route.params.keydata !== undefined){
//       //   vm.infoData.questionLists = vm.$route.params.keydata
//       // } else {
//       //   vm.infoData.questionLists = []
        
//       // }
      
//       console.log(vm.infoData.questionLists,111,vm.ii)
//     })
// }, 
};
</script>
<style lang="scss" scoped >
//导航栏
.van-nav-bar__title {
  color: #333;
  font-weight: bold;
}
//新增问题
.van-cell {
  // padding: 0;
  padding-top: 10px;
  height: 48px;
  line-height: 48px;
}
.van-cell--large {
  padding: 0.2rem 0.2rem 0.2rem 0rem;
  line-height: 30px;
}
.van-cell--large .van-cell__title {
  text-align: left;
  font-size: 16px;
}
.icon-shugang {
  position: relative;
  right: -0.1rem;
}
/deep/.info .van-cell__value {
  border-left: 1px solid #ebedf0;
  padding: 0.05rem 0 0.05rem 0;
}

/deep/.info .van-field__label {
  position: relative;
  padding-right: 0.1rem;
  line-height: 40px;
}
/deep/.info .van-field__control{
}
.add {
  position: relative;
  right: -4rem;
  color: #4b77af;
  font-size: 18px;
}
//星号
.van-cell--required::before {
  left: 0.8rem;
}
//弹框
.popTitle {
  text-align: center;
  height: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  span {
    padding-left: 10px;
  }
}
.popContent {
  height: 40%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  p {
    font-size: 16px;
  }
}
.popfooter {
  height: 25%;
  display: flex;
  justify-content: center;
}
//禁用
.noclick {
  pointer-events: none;
}
</style>