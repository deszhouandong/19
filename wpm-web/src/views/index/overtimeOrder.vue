<template>
  <div class="overtimeOrder flexall">
    <div class="title">
      <p class="name">加班审批</p>
      <p class="order">{{initialData.overtimeNo}}</p>
    </div>
    <div class="fieldListWrap flex">
      <FieldList
        v-for="(item,index) in list"
        :key="index"
        :label="item.label"
        :content="item.content"
      />
    </div>
  </div>
</template>

<script>
import FieldList from "@/component/punch/FieldList";
import {  Toast } from "vant";

export default {
  data() {
    return {
      queryDate:'', //查询加班时日期
      list: [],
      initialData: {
      },
      getKey: [
        { label: "createDate", text: "考勤日期" },
        { label: "dateType", text: "日期类型" },
        { label: "overtimeType", text: "加班类型" },
        { label: "startDate", text: "开始时间" },
        { label: "endDate", text: "结束时间" },
        { label: "overtimeHours", text: "加班小时数" },
        { label: "userName", text: "申请人" },
        { label: "position", text: "岗位" },
        { label: "deptOrg", text: "事业部" },
        { label: "storeOrg", text: "归属门店" },
        { label: "currServiceStoreOrg", text: "当前服务门店" }
      ]
    };
  },
  components: { FieldList },
  created() {
    this.getInitialData();
  },
  mounted() {
    document.title = "加班审批";
  },
  methods: {
    getInitialData() {
       const {
        queryDate,
        adAcount
      } = this.$route.query
      if(queryDate){
        this.queryDate = this.$moment(Number(queryDate))
      }
      if(adAcount){
        this.adAcount = adAcount
      }
        const toast = Toast.loading({
        message: "数据加载中...",
        duration: 0, // 持续展示 toast
        forbidClick: true
      });
      this.$getData
        .checkOverTime({
          method: "post",
          data: {
            queryDate: this.queryDate,
            adAcount:this.adAcount
          }
        })
        .then(res => {
          if (res.code == 200) {
            const that = this;
            this.initialData = res.data;
            let arr = [];
            this.getKey.map((item, index) => {
              const label = item.label;
              const text = item.text;
              let result = "";
              if (label === "startDate" || label === "endDate") {
                const label1=label === "startDate"?'startStatus':'endStatus'
                result = that.initialData[label]
                  ? that.$moment(that.initialData[label]).format("HH:mm")
                  : that.initialData[label1];
              } else if (label === "dateType") {
                result = that.formatDateType(that.initialData[label]);
              } else if (label === "overtimeHours") {
                result = that.initialData[label]?`${that.initialData[label]}小时`:null
              } else if(label==='createDate'){
                result=that.initialData[label]
                  ? that.$moment(that.initialData[label]).format("YYYY-MM-DD")
                  : null;
              }else {
                result = that.initialData[label];
              }
              arr.push({
                label: text,
                content: result
              });
            });
            this.list = arr;
          }
          toast.clear()
        }).catch(()=>{
          toast.clear()
        })
    },
    formatDateType(id) {
      const aim = [
        { key: 1, txt: "工作日" },
        { key: 2, txt: "周末" },
        { key: 3, txt: "节假日" }
      ];
      let save=''
      const result = aim.some((item, index) => {
        if (item.key == id) {
          save=item.txt
          return true
        }
      });
      return save;
    },
    formatQueryDate(time) {
        return this.$moment(time).format('YYYY-MM-DD')
      }
  }
};
</script>

<style lang="scss" scoped>
.overtimeOrder {
  background: #f4f4f4;
  height: 100%;
  .title {
    text-align: center;
    height: 60px;
    padding: 8px 0 11px;
    box-sizing: border-box;
    margin-bottom: 10px;
    background: #fff;
    .name {
      line-height: 24px;
      font-weight: 400;
      color: rgba(0, 0, 0, 1);
      font-size: 17px;
    }
    .order {
      line-height: 17px;
      font-size: 12px;
    }
  }
}
.fieldListWrap {
  background: #fff;
}
</style>
