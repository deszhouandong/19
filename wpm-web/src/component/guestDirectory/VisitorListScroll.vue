<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <van-list
      class="van-clearfix"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <div class="list-con">
        <VisitorListItem
          v-for="(item,index) in guestList"
          :key="index"
          :item="item"
          :index="index"
          @deleteRecordHanlder="deleteRecordHanlder"
        />
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<script>
import { List, PullRefresh } from "vant";
import VisitorListItem from "./VisitorListItem";
import { getVisitorsListByPage } from "@/apis/api/guestrecord";
export default {
  components: {
    VisitorListItem
  },
  data() {
    return {
      startPage: 0, //初始化页数
      total: 0, //总条数
      guestList: [], //列表
      isLoading: true, //列表是否下拉刷新中
      loading: true ////列表是否加载中
    };
  },
  props: {
    // 搜索栏参数
    searchName: {
      type: String,
      default: ""
    },
    // 侧边栏选中的条件
    chooseListItem: {
      type: Array,
      default: []
    }
  },
  created() {
    this.getList();
  },
  computed: {
    finished: function() {
      const total = this.total;
      const len = this.guestList.length;
      return this.loading?false:len >= total;
    }
  },
  methods: {
    // 过滤掉数组中空元素
    filterArr(arr) {
      const saveArr = arr.filter((item, index) => {
        const aim = item != undefined || item != null;
        return aim;
      });
      return saveArr;
    },
    //删除记录
    deleteRecordHanlder(index) {
      this.guestList.splice(index, 1);
    },
    getList(params = {}) {
      const { isNext, isRefresh } = params;
      if (isNext) {
        this.startPage += 1;
      } else {
        this.guestList = [];
        this.startPage = 1;
      }
      this.loading = true;
      getVisitorsListByPage({
        startPage: this.startPage,
        searchName: this.searchName,
        chanceStatusArr:
          this.filterArr(this.chooseListItem) &&
          this.filterArr(this.chooseListItem).length
            ? this.filterArr(this.chooseListItem)
            : null,
            adAcount:this.$route.query.adAcount
      })
        .then(res => {
          if (res.code == 200) {
            this.total = res.total;
            this.isLoading = false;
            this.loading = false;
            this.guestList.push(...res.data);
            if (isRefresh) {
              // this.$toast("刷新成功");
            }
          }
        })
        .catch(() => {
          this.loading = false;
          this.isLoading = false;
        });
    },
    onLoad() {
      this.getList({
        isNext: true
      });
    },
    onRefresh() {
      this.isLoading = true;
      this.getList({
        isRefresh: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list-con {
  // margin-bottom: 50px;
}
</style>
