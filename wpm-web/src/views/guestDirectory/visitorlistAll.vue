<template>
  <div class="wrap">
    <!-- 搜索栏 -->
    <div class="headSearch flexall-hor">
      <div class="leftScreen" @click="toggleSideBar">
        <van-icon name="filter-o" class="filter-icon" />
        <span class="filter-txt">筛选</span>
      </div>
      <div class="flex">
        <form action="/">
          <van-search
            placeholder="请输入姓名、电话、访客地址"
            v-model="searchName"
            class="search-input"
            @search="onSearch"
          />
        </form>
      </div>
    </div>
    <!-- 侧边栏筛选 -->
    <SideBar
      ref="sideBar"
      :sideBarList="sideBarList"
      @chooseListItemHandler="chooseListItemHandler"
    />
    <div class="g-ist-main">
      <VisitorListScroll
        ref="visitorListScroll"
        :searchName="searchName"
        :chooseListItem="chooseListItem"
      />
    </div>
    <div class="list-bottom" v-show="modelType != 20">
      <div class="re-contain">
        <div class="b-left">{{currentTime}}</div>
        <div class="b-right" @click="gotodetail()">+访客记录</div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import SideBar from "@/component/guestDirectory/SideBar";
import VisitorListScroll from "@/component/guestDirectory/VisitorListScroll";
import { formatTime, setlocalStorage } from "@/utils/format";
import {
  getChanceQueryStatusParam,
  listVisitorsRecordForState,
  getVisitorsListByPage
} from "@/apis/api/guestrecord";
export default {
  components: {
    SideBar,
    VisitorListScroll
  },
  data() {
    return {
      showbottom: false,
      currentTime: "--:--:--",
      guestList: [],
      total: 0, //总条数
      guestList1: [],
      year: "",
      curweek: "",
      curMonday: "",
      curSunday: "",
      curmon: "",
      cursun: "",
      title: "",
      modelType: "",
      adAcount: "",
      // 全部页面参数
      enumerationInitialData: {}, //枚举值
      searchName: "", //搜索栏参数
      sideBarList: [], // 筛选内线索来源枚举列表
      chooseListItem: [] //侧边栏选中的条件
    };
  },
  created() {
    this.$route.meta.isRefresh=false
    this.countDown();
    this.querySideBarList();
  },
  activated() {
    if (this.$route.meta.isRefresh) {
      this.searchName=''
      this.$refs.sideBar.reset()
      this.$refs.sideBar.sure()
      this.querySideBarList();
      this.$route.meta.isRefresh=false
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   from.meta.keepAlive = true;
  //   console.log(from)
  //   // if(to.path==='/visitorlistAll'){
  //   //   to.meta.keepAlive = false;
  //   // }
  //   next();
  // },
  mounted: function() {
    document.title = "访客记录";
    // let now = "";
    // if (this.$route.query.startTime) {
    //   now = Number(this.$route.query.startTime);
    //   if (this.$route.query.modelType) {
    //     this.modelType = this.$route.query.modelType;
    //     if (this.$route.query.modelType == 20 && this.$route.query.adAcount)
    //       this.adAcount = this.$route.query.adAcount;
    //   }
    // } else {
    //   now = moment().valueOf();
    // }
    // this.formatTime(now);
  },

  methods: {
    enumerationInitial(str) {
      let enumerationInitialData = {};
      for (let index in str) {
        enumerationInitialData[index] = JSON.parse(str[index]);
      }
      this.enumerationInitialData = enumerationInitialData;
    },
    // 获取侧边栏筛选条件
    querySideBarList() {
      getChanceQueryStatusParam({}).then(res => {
        if (res.code == 200) {
          if (JSON.stringify(res.enumVal) != "{}") {
            this.enumerationInitial(res.enumVal);
            this.sideBarList = this.enumerationInitialData.chanceQueryStatusEnum;
          }
        }
      });
    },

    // 搜索
    onSearch() {
      this.$refs.visitorListScroll.onRefresh(false, true);
    },
    // 切换侧边栏展示与隐藏
    toggleSideBar() {
      this.$refs.sideBar.show = !this.$refs.sideBar.show;
    },
    // 从子元素获取侧边栏筛选条件
    chooseListItemHandler(chooseListItem) {
      this.chooseListItem = chooseListItem;
      setTimeout(() => {
        this.$refs.visitorListScroll.onRefresh();
      }, 0);
    },
    countDown() {
      // 时钟
      this.currentTime = moment()
        .add("seconds", 1)
        .format("HH:mm:ss");
      setInterval(() => {
        this.currentTime = moment()
          .add("seconds", 1)
          .format("HH:mm:ss");
      }, 1000);
    },
    formatTime(t) {
      // this.curweek = this.getYearWeek(t); //获取一年的第几周
      // console.log(this.getcurDay(t))
      this.curmon = this.getcurDay(t);
      this.cursun = this.addDate(this.curmon);
      this.curMonday = moment(this.curmon).format("MM-DD");
      this.curSunday = moment(this.cursun).format("MM-DD");
      this.title =
        this.year +
        "年 第" +
        this.curweek +
        "周（" +
        this.curMonday +
        "至" +
        this.curSunday +
        "）";
      this.queryList();
    },
    getYearWeek(t) {
      this.year = moment(t).get("year");
      let dateNow = moment(t).valueOf(); //当前时间
      let yearoffirst = moment(t)
        .startOf("year")
        .valueOf(); //当前年的第一天
      let weekofday = moment(yearoffirst).format("E");
      let firstMon = "";
      //当前年第一个周一
      if (weekofday === 1) {
        firstMon = yearoffirst;
      } else {
        firstMon = moment(yearoffirst)
          .add(8 - weekofday, "days")
          .format("YYYY-MM-DD");
      }
      let dataNumber = Math.round((dateNow - yearoffirst) / 86400000);
      return Math.ceil((dataNumber - (moment(yearoffirst).get("day") - 1)) / 7);
    },
    getcurDay(t) {
      let weekofday = moment(t).format("E");
      let curday = moment(t).subtract(weekofday - 1, "days");
      this.curweek = this.getYearWeek(curday); //获取一年的第几周
      return curday;
    },
    addDate(t) {
      //加7天
      let weekLastday = moment(t).add(6, "days");
      return weekLastday;
    },
    queryList() {
      let startTime = moment(this.curmon).format("YYYY-MM-DD");
      let endTime = moment(this.cursun).format("YYYY-MM-DD");
      let adAcount = this.adAcount;
      listVisitorsRecordForState({ startTime, endTime, adAcount }).then(res => {
        this.formatarrTime(res.data);
        this.$nextTick(() => {
          let offsetTop = +sessionStorage.getItem("offsetTop");
          if (offsetTop)
            setTimeout(() => {
              document.scrollingElement.scrollTop = offsetTop;
            }, 0);
        });
      });
    },
    formatarrTime(arr) {
      arr.forEach(item => {
        item.arriveDate = formatTime(item.arriveDate, "second");
        item.leaveDate = formatTime(item.leaveDate, "second");
      });
      this.guestList = arr;
    },
    gotodetail() {
      setlocalStorage("formdata", "");
      setlocalStorage("selectedArr", "");
      sessionStorage.setItem("offsetTop", document.scrollingElement.scrollTop);
      this.$router.push("visitorDetail");
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap {
  padding-top: 60px;
  padding-bottom:100px;
}
.headSearch {
  width: auto;
  height: 60px;
  background: #4b77af;
  align-items: center;
  padding: 0 17px 0 9px;
  box-sizing: border-box;
  position: fixed;
  z-index: 3000;
  width: 100%;
  top: 0;
  left: 0;
  .leftScreen {
    width: 60px;
    margin-right: 10px;
    .filter-icon {
      color: #fff;
      font-size: 18px;
      // padding-top: 4px;
    }
    .filter-txt {
      font-size: 17px;
      // font-weight: 500;
      color: #fff;
      vertical-align: top;
    }
  }
  .search-input {
    height: 30px;
    padding: 5px;
    background: rgba(255, 255, 255, 0.3) !important;
    border-radius: 12px;
    line-height: 30px;
    /deep/ .van-search__content {
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      background: none;
      .van-cell {
        padding: 0;
        font-size: 15px;
        color: #fff;
        .van-icon-search {
          font-size: 18px;
          font-weight: bold;
        }
        .van-icon-clear {
          color: #fff;
        }
        input {
          color: #fff;
        }
        input::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #fff;
          font-weight: normal;
          font-size: 15px;
        }

        input::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #fff;
          font-weight: normal;
          font-size: 15px;
        }

        input::-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: #fff;
          font-weight: normal;
          font-size: 15px;
        }
      }
    }
  }
}

.list-bottom {
  height: 58px;
  background: #4b77af;
  color: #fff;
  border-radius: 30px;
  width: 80%;
  margin-left: 10%;
  position: fixed;
  bottom: 30px;
}
.re-contain {
  display: flex;
  font-size: 15px;
  width: 100%;
  div {
    width: 50%;
    text-align: center;
    line-height: 58px;
  }
  div.b-left {
    border-right: 1px solid #fff;
    height: 21px;
    margin-top: 18px;
    vertical-align: middle;
    line-height: 25px;
  }
}
</style>
