<template>
  <div class="visitDetails">
    <van-cell-group>
      <van-cell size="large" style="color:#333;font-weight:bold;">
        <template slot="title">
          <span class="custom-title">拜访对象</span>
        </template>
      </van-cell>
      <van-field
        label-width="100px"
        input-align="right"
        label-align="left"
        label="地点"
        placeholder="请输入地点"
        v-model="vel"
      />
      <van-field
        input-align="right"
        label-width="100px"
        label-align="left"
        label="类型"
        placeholder="请选择类型"
        v-model="typevalue"
        @click="typeShow = true"
        readonly
        class="info laster"
        style=" color:#333;"
        is-link
      ></van-field>
      <!-- 弹出类型 -->
      <van-popup v-model="typeShow" position="bottom" :style="{ height: '28%',bottom: '9%' }">
        <van-list>
          <van-cell
            style="text-align:center;line-height:26px"
            v-for="(item,index) of typeColumns"
            :key="index"
            :title="item.name"
            @click="chanceType(item)"
          />
        </van-list>
      </van-popup>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      vel: "",
      typevalue: "",
      typeShow: false,
      typeColumns: [
        { name: "企业", code: 1 },
        { name: "个体户", code: 2 },
        { name: "自然人", code: 3 },
        { name: "政府机构/事业单位", code: 5 }
      ]
    };
  },
  created() {
    document.title = "回顾明细";
    this.init();
  },
  methods: {
    chanceType(value) {
      //类型
      this.visitObjectName = null;
      this.entertainPlanBodyResp.epVisitObjectId = null;
      this.typevalue = value.name;
      this.entertainPlanBodyResp.epSubjectType = value.code;
      if (this.typevalue === undefined) {
        this.targetShow = false;
      } else {
        this.targetShow = true;
        if (this.typevalue === []) {
          this.emptyShow = true;
        } else {
          this.emptyShow = false;
        }
      }
      this.typeShow = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.visitDetails {
  height: 100%;
  background: #f4f4f4;
}
</style>