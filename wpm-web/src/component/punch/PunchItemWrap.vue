<template>
  <ul class="punchItemWrap">
    <li v-for="(item,index) in checkinRecordRespList" :key="index">
      <PunchItem
        :punchItemProps="item"
        :status="status"
        :enumerationInitialData="enumerationInitialData"
        :isShowRangeList="showTagIsrangeList[index]"
        :order="index"
        @toggleRangeList="toggleRangeList"
        @toggleAddressLoading="toggleAddressLoading"
        :allowSeconded="allowSeconded"
        :addressLoading="addressLoading[index]"
      />
    </li>
  </ul>
</template>

<script>
import PunchItem from "./PunchItem";
export default {
  name: "PunchItemWrap",
  components: {
    PunchItem
  },
  props: {
    checkinRecordRespList: {
      type: Array,
      default: []
    },
    status: {
      type: Object,
      default: {}
    },
    enumerationInitialData: {
      type: Object,
      default: {}
    },
    allowSeconded:{
      type:Number,
      default:null
    }
  },
  data() {
    return {
      showTagIsrangeList: [], //是否显示地址列表
      addressLoading:[] //地址loading
    };
  },
  mounted() {
    document.addEventListener("click", this.documentHandler);
  },
  destroyed() {
    document.addEventListener("click", this.documentHandler);
  },
  methods: {
    // 切换下拉列表展示状态
    toggleRangeList(params) {
      const { index, mold, $event } = params;
      $event && $event.stopPropagation();
      if (mold === "hideOther") {
        let saveItem=this.showTagIsrangeList[index]
        let arr = JSON.parse(JSON.stringify(this.showTagIsrangeList)).fill(false);
        arr[index]=!saveItem
        this.showTagIsrangeList = arr;
      } else {
        this.showTagIsrangeList = [];
      }
      this.$forceUpdate();
    },
    // 点击空白处
    documentHandler() {
      this.showTagIsrangeList = [];
    },
    // 更改地址loading
    toggleAddressLoading(params){
      const {order,isEnd}=params
      this.addressLoading[order]=isEnd
      this.$forceUpdate()
    }
  }
};
</script>
