<template>
  <div class="rwDetail" @touchend="touchend" @touchmove="touchmove" @touchstart="touchstart">
    <!-- 导航栏 -->
    <!-- <van-nav-bar title="回顾明细" right-text="出差回顾" @click-right="onClickRight" /> -->
    <van-nav-bar
      @click-right="onClickRight"
      @click-left="onClickLeft"
      style="color:#333;margin-bottom:10px;margin-bottom:10px;"
    >
      <div slot="left">
        <van-icon name="arrow-left" style="color:#4B77AF;padding-bottom: 0.05rem;" />
        <span style="color:#007AFF;padding-top:0.2rem;font-size:0.426667rem;">招待回顾</span>
      </div>
      <div slot="right">
        <span style="color:#007AFF;padding-top:0.2rem;font-size:0.426667rem;">出差回顾</span>
        <van-icon name="arrow" style="color:#4B77AF;padding-bottom: 0.05rem;" />
      </div>
      <div slot="title">回顾明细</div>
    </van-nav-bar>
    <div class="content">
      <!-- 回顾明细 -->
      <van-field
        label-width="100px"
        label-align="left"
        label="回顾日期"
        input-align="right"
        v-model="detailData.rdDate"
        readonly
      ></van-field>

      <van-field
        input-align="right"
        label-width="100px"
        label-align="left"
        label="类型"
        placeholder="请选择类型"
        v-model="rdType"
        @click="typeChange"
        readonly
        is-link
      ></van-field>

      <van-field
        label-width="100px"
        label-align="left"
        input-align="right"
        label="费用 (元)"
        placeholder="请输入费用"
        v-model="detailData.rdOutlay"
        maxlength="20"
        @blur="priceBlur"
      />

      <div class="txtReason">
        <p style="font-size:14px;">费用明细</p>
        <van-field
          type="textarea"
          placeholder="请输入费用明细"
          v-model="detailData.rdOutlayDes"
          class="txtarea"
          rows="4"
          maxlength="100"
        />
      </div>
    </div>
    <!-- 保存按钮 -->
    <div class="footer">
      <Button
        :title="deletetitle"
        @onclick="btnDelete"
        style="height:50px;line-height:30px;width:100%;font-weight: bold;font-size: 16px;background-color: #fff;border: 1px solid #fff;color:#D75252;"
      />
      <Button
        :title="savetitle"
        @onclick="btnsave"
        style="height:50px;line-height:30px;width:100%;font-weight: bold;font-size: 16px;background-color: #4b77af;border: 1px solid #4b77af;"
      />
    </div>
    <!-- 弹出类型 -->
    <van-popup v-model="typeShow" position="bottom" :style="{ bottom: '9%' }">
      <van-list class="typelist">
        <van-cell
          style="text-align:center;line-height:26px"
          v-for="(item,index) of typeColumns"
          :key="index"
          :title="item.name"
          @click="chanceType(item)"
        />
      </van-list>
    </van-popup>
    <van-cell
      v-if="typeShow"
      title="取消"
      style="position:fixed;bottom:0px;z-index:10000;background: #DCDCDC;text-align:center;line-height:26px"
      @click="cancelType"
    />
  </div>
</template>
<script>
  import Button from "@/component/marketingManagement/button.vue";
import Vue from "vue"
export default {
  data() {
    return {
      rdType: "",
      detailData: {
        rdDate: this.$moment(new Date()).format("YYYY-MM-DD"),
        rdType: null,
        rdOutlay: null,
        rdOutlayDes: null
      },
      typeColumns: [{ name: "正常", code: "1" }, { name: "技工", code: "3" }],
      typeShow: false, //类型
      savetitle: "保存", //按钮
      deletetitle: "删除",
      showTime: false //时间弹框
    };
  },
  components: {
    Button
  },
  created() {
    document.title = "回顾明细";
    this.init();
  },
  methods: {
    init() {
      this.find()
    },
    onClickRight() {
      this.$router.push({
        name: "travelReview",
        query: this.$route.query
      });
    },
    onClickLeft() {
      this.$router.push({
        name: "serveReview",
        query: this.$route.query
      });
    },
    typeChange() {
      this.typeShow = true;
      if (
        this.$moment(new Date()).format("YYYY-MM-DD") === this.getBeforeDate(6) || this.$moment(new Date()).format("YYYY-MM-DD") === this.getBeforeDate(5)
      ) {
        this.typeColumns = [
          { name: "正常", code: "1" },
          { name: "路途", code: "2" },
          { name: "技工", code: "3" }
        ];
      }
    },
    chanceType(item) {
      //类型改变
      this.rdType = item.name;
      this.detailData.rdType = item.code;
      this.typeShow = false;
    },
    //点击取消
    cancelType() {
      this.typeShow = false;
    },
    priceBlur() {
      //费用失焦
      let rag = /(^[0-9]\d{0,20}$)|(^\.\d{1,2}$)|(^[0-9]\d{0,20}\.\d{1,2}$)/;
      if (!rag.test(this.detailData.rdOutlay)) {
        this.$toast("预计费用格式错误");
      }
    },

    //校验
    check() {
      let flag = false;
      let rag = /(^[0-9]\d{0,20}$)|(^\.\d{1,2}$)|(^[0-9]\d{0,20}\.\d{1,2}$)/;
      if (this.detailData.rdDate === null) {
        this.$toast("请选择回顾日期");
      } else if (this.detailData.rdType === null) {
        this.$toast("请选择类型");
      } else if (this.detailData.rdOutlay === null) {
        this.$toast("请输入费用");
      } else if (!rag.test(this.detailData.rdOutlay)) {
        this.$toast("费用格式错误");
      } else if (this.detailData.rdOutlayDes === null) {
        this.$toast("请输入费用明细");
      } else {
        flag = true;
        return flag;
      }
    },
    find(){
      let par = {};
      par.rdDate = this.detailData.rdDate;
      if (this.$route.query.did > 0) {
        par.did = this.$route.query.id;
        this.$getData
          .reviewDetailFind({
            method: "post",
            data: par
          })
          .then(res => {
            if(res.data !==null){
              this.detailData = res.data;
              if (this.detailData.rdType === "1") {
              this.rdType = "正常";
            } else if (this.detailData.rdType === "2") {
              this.rdType = "路途";
            } else if (this.detailData.rdType === "3") {
              this.rdType = "技工";
            }
            }
          });
      }
    },
    tips(name){
      this.$toast({
          message: name,
          forbidClick: true,
          duration: 1000
        });
        let that = this
        setTimeout(function () {
      //要延时执行的代码
      that.$router.push('/workplan')
      }, 1000) //延迟时间
    },
    btnsave() {
      //保存
      let par = this.detailData;
      // if(this.$route.query.id > 0){
      //   par.did = this.$route.query.id
      // }
      par.did = this.$route.query.did;
      this.check();
      let flag = this.check();
      if (flag === true) {
        this.$getData
          .reviewDetailSave({
            method: "post",
            data: par
          })
          .then(res => {
            if (res.code === 200) {
              this.tips('保存成功')
            }
          });
      }
    },
    btnDelete() {
      let par = {}
      par.did = this.$route.query.did;
        this.$getData
          .reviewDetailDelete({
            method: "post",
            data: par
          })
          .then(res => {
            if (res.code === 200) {
              this.tips('删除成功')
            }
          });
    },
    //获取开始日期后n天
    getBeforeDate(n) {
      var date = new Date(this.$route.query.startDate);
      var year, month, day;
      date.setDate(date.getDate() + n);
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
      let s =
        year +
        "-" +
        (month < 10 ? "0" + month : month) +
        "-" +
        (day < 10 ? "0" + day : day);
      return s;
    },
    //滑动跳转
    touchstart() {
      this.startX = event.changedTouches[0].pageX;
    },
    touchend() {},
    touchmove() {
      // 如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
      // event.preventDefault();
      this.moveEndX = event.changedTouches[0].pageX;
      if (this.moveEndX - this.startX < -150) {
        this.$router.push({
          name: "travelReview",
          query: this.$route.query
        });
      } else if (this.moveEndX - this.startX > 150) {
        this.$router.push({
          name: "serveReview",
          query: this.$route.query
        });
      }
    },
  },

};
</script>
<style lang="scss" scoped>
.rwDetail {
  background: #f4f4f4;
  height: 100%;
}
//导航
.van-nav-bar .van-icon {
  color: #4b77af;
  font-size: 24px;
}
.van-nav-bar__title {
  font-weight: bold;
}
.content {
  padding-top: 15px;
}
.txtReason {
  //费用明细
  background-color: #fff;
  color: #333;
  p {
    font-size: 16px;
    padding: 10px 0 0 16px;
  }
}
.txtarea /deep/.van-field__body {
  line-height: 25px;
  // margin: 10px;
  padding: 0px 10px 0 10px;
  height: 110px;
  border: 1px solid #ebedf0;
  overflow: auto;
}
//提交按钮
.footer {
  padding-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0px;
  z-index: 101;
}

</style>