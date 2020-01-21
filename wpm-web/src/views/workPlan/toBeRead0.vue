<template>
  <div class="workbench">
    <!-- 顶部下拉框 -->
    <van-dropdown-menu class="dropdown-home">
      <van-dropdown-item v-model="value" :options="option" @change="menuChange" />
      <van-dropdown-item ref="item" :title="dateTime" title-class="dropdown-home-dateTime">
        <van-datetime-picker
          type="year-month"
          :formatter="formatter"
          v-model="currentDate"
          @change="changePick"
          cancel-button-text=" "
          confirm-button-text=" "
        />
      </van-dropdown-item>
      <a :href="this.commonUtils.env.getCurrentEnvUrl()" class="toHome">
        <img :src="homeImgUrl" alt="">
      </a>
    </van-dropdown-menu>
    <!-- 中间内容 -->
    <div v-if="value==0">
      <van-loading style="text-align:center;color:#666" v-if="initLoading1" color="#666">加载中...</van-loading>
      <div class="collapse-wrap" v-else>
        <div v-if="workBrnchList1&&workBrnchList1.length == 0||!workBrnchList1" class="noData">暂无数据</div>
        <div v-else>
          <div
            :class="{collapse:true,active:fold1[index1]?true:false}"
            v-for="(item1,index1) in workBrnchList1"
            :key="index1"
          >
            <div class="collapse-handler" @click="slide(item1,index1)">
              <div class="collapse-handler-inner">
                <span class="name" style="font-size:17px">{{item1.name}}</span>
                <a :href="'tel:'+ item1.cellPhone">
                  <!-- <van-icon name="phone" color="#4B77AF" size="25px" /> -->
                  <img :src="dianhuaImgUrl" alt style="vertical-align:top" />
                </a>
                <span
                  style="width:108px;float:right;margin-right:10px;display:inline-block;font-size: 14px;color: #D75252; text-align:center;border-radius:20px;"
                >{{item1.workPlanCnt}}个待阅</span>
              </div>
            </div>
            <div class="collapse-content">
              <van-steps direction="vertical" active-icon="checked">
                <van-loading
                  style="text-align:center;color:#666"
                  color="#666"
                  v-if="foldLoading1[index1]"
                >加载中...</van-loading>
                <div v-else>
                  <div
                    v-if="item1.individualCardingRespList&&item1.individualCardingRespList.length"
                  >
                    <van-step
                      v-for="(item1Inner,index1Inner) in item1.individualCardingRespList"
                      :key="index1Inner"
                    >
                        <!-- :class="item1Inner.comfirmType == 'UNCONFIRMED' ? 'unconfirmedStatus' : 'abnormalStatus'" -->
                      <div
                        @click="toClick(item1Inner,item1.name)"
                        class="unconfirmedStatus"
                      >
                        <!-- 状态 待阅 -->
                        <!-- <p
                          style="float:right;margin:0;"
                          class="confirmed"
                          v-if="item1Inner.comfirmType == 'CONFIRMED'"
                        >{{status[item1Inner.comfirmType] && status[item1Inner.checkinStatus]}}11</p>
                        <p
                          style="float:right;margin:0;"
                          class="confirmed"
                          v-else
                        >{{status[item1Inner.comfirmType]}}22</p> -->
                        <p style="float:right;margin:0;" class="confirmed">待阅</p>
                        <h3>
                          <!-- {{item1Inner.dateToStr}} -->
                          {{item1Inner.date}}
                          <!-- <span>{{item1Inner.checkinName}}</span> -->
                          <span>{{item1Inner.workType == 1?'周计划':'(周'+ sortDate(item1Inner) +')日回顾' }}</span>
                          <!-- <span>{{item1Inner.workType == 1?'周计划':'日回顾'}}</span> -->
                        </h3>

                        <!-- <p>提交时间{{item1Inner.submitDate}}</p> -->
                        <!-- <p style="float:right;margin:0;">提交时间{{item1Inner.submitDate}}</p> -->
                        <p class="location-name">提交时间{{item1Inner.submitDate}}</p>
                        <!-- <p>{{item1Inner.clockDateToStr}}</p>
                        <p style="float:right;margin:0;">{{item1Inner.appealStatus}}</p>
                        <p class="location-name">{{item1Inner.name}}</p> -->
                      </div>
                    </van-step>
                  </div>
                  <div v-else class="noData">暂无数据</div>
                </div>
              </van-steps>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <van-loading style="text-align:center;color:#666" v-if="initLoading2" color="#666">加载中...</van-loading>
      <div class="collapse-wrap" v-else>
        <div v-if="workBrnchList2&&workBrnchList2.length == 0||!workBrnchList2" class="noData">暂无数据</div>
        <div v-else>
          <div
            :class="{collapse:true,active:fold2[index2]?true:false}"
            v-for="(item2,index2) in workBrnchList2"
            :key="index2"
          >
            <div class="collapse-handler" @click="slide(item2,index2)">
              <div class="collapse-handler-inner">
                <span class="name" style="font-size:17px">{{item2.name}}</span>
                <a :href="'tel:'+ item2.cellPhone">
                  <!-- <van-icon name="phone" color="#4B77AF" size="25px" /> -->
                  <img :src="dianhuaImgUrl" alt style="vertical-align:top" />
                </a>
                <span
                  style="width:108px;float:right;margin-right:10px;display:inline-block;font-size: 14px;color: #D75252; text-align:center;border-radius:20px;"
                >{{item2.workPlanCnt}}个待阅</span>
              </div>
            </div>
            <div class="collapse-content">
              <van-loading
                style="text-align:center;color:#666"
                color="#666"
                v-if="foldLoading2[index2]"
              >加载中...</van-loading>
              <div v-else>
                <div v-if="item2.workBrnchList21&&item2.workBrnchList21.length">
                  <div
                    :class="{
                    collapse:true,sub:true,
                    active:fold21[index2]&&
                    fold21[index2].second&&
                    fold21[index2].second[index21]&&
                    fold21[index2].second[index21].show?true:false}"
                    v-for="(item21,index21) in item2.workBrnchList21"
                    :key="index21"
                  >
                    <div class="collapse-handler" @click="slide1(item2,index2,item21,index21)">
                      <div class="collapse-handler-inner">
                        <span class="name" style="font-size:17px">{{item21.name}}</span>
                        <a :href="'tel:'+ item21.cellPhone">
                          <img :src="dianhuaImgUrl" alt style="vertical-align:top" />

                          <!-- <van-icon name="phone" color="#4B77AF" size="25px" /> -->
                        </a>
                        <span
                          style="width:108px;float:right;margin-right:10px;display:inline-block;font-size: 14px;color: #D75252; text-align:center;border-radius:20px;"
                        >{{item21.workPlanCnt}}个待阅</span>
                      </div>
                    </div>
                    <div class="collapse-content">
                      <van-steps direction="vertical" active-icon="checked">
                        <van-loading
                          style="text-align:center;color:#666"
                          color="#666"
                          v-if="
                        fold21[index2]&&
                        fold21[index2].second&&
                        fold21[index2].second[index21]&&
                        fold21[index2].second[index21]&&fold21[index2].second[index21].loading"
                        >加载中...</van-loading>
                        <div v-else>
                          <div
                            v-if="item21.individualCardingRespList&&item21.individualCardingRespList.length"
                          >
                            <van-step
                              v-for="(item21Inner,index21Inner) in item21.individualCardingRespList"
                              :key="index21Inner"
                            >
                              <div
                                @click="goAbnormal(item21Inner.id,item21Inner.comfirmType,item21Inner.excptionTime,item21Inner.appealStatus)"
                                class="unconfirmedStatus"
                              >
                                <!-- :class="item21Inner.comfirmType == 'UNCONFIRMED' ? 'unconfirmedStatus' : 'abnormalStatus'" -->
                                <p
                                  style="float:right;margin:0;"
                                  class="confirmed"
                                  v-if="item21Inner.comfirmType == 'CONFIRMED'"
                                >{{status[item21Inner.comfirmType] && status[item21Inner.checkinStatus]}}</p>
                                <p
                                  style="float:right;margin:0;"
                                  class="confirmed"
                                  v-else
                                >{{status[item21Inner.comfirmType]}}</p>
                                <h3>
                                  {{item21Inner.dateToStr}}
                                  <span>{{item21Inner.checkinName}}</span>
                                </h3>

                                <p>{{item21Inner.clockDateToStr}}</p>
                                <p style="float:right;margin:0;">{{item21Inner.appealStatus}}</p>
                                <p  class="location-name1">{{item21Inner.name}}</p>
                              </div>
                            </van-step>
                          </div>
                          <div v-else class="noData">暂无数据</div>
                        </div>
                      </van-steps>
                    </div>
                  </div>
                </div>
                <div v-else class="noData">暂无数据</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import querystring from "querystring";
import moment from "moment";
const { currentIndex = 0 } = querystring.parse(
  window.location.hash.split("?")[1]
);
export default {
  name: "workbench",
  data() {
    return {
      isInit:true, // 是否第一次进入页面的状态
      homeImgUrl:require('../../../static/imgs/home.svg'),
      currentDate: new Date(),
      option: [{ text: "下看一层", value: 0 }, { text: "下看两层", value: 1 }],
      childState:true, // 是否已查询到下级的状态
      childArr:[], // 直属下级列表
      imgPhone:require("../../../static/imgs/dianhua.svg"),
      state:0, // 决定当前下看几级的状态
      show:false, // 决定日历组件显示与否
      defaultDate: new Date(), // 日历的默认日期
      year:new Date().getFullYear(), // 当前年
      month:new Date().getMonth()+1, // 当前月
      // myData end


      dianhuaImgUrl: require("../../../static/imgs/dianhua.svg"),
      value: Number(currentIndex),
      currentDate: new Date(),
      option: [{ text: "下看一层", value: 0 }, { text: "下看两层", value: 1 }],
      dateTime:
        new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月",
      activeNames1: ["0"],
      activeNames2: ["0"],
      activeNames21: ["0"],
      workBrnchList1: [],
      workBrnchList2: [],
      chooseAdAcount: "",
      status: {},
      dateCurrent: null,
      RecordsList: [],
      initLoading1: false, //初始化加载数据状态
      initLoading2: false, //初始化加载数据状态
      fold1: [], //存储展开标志位
      fold2: [], //存储展开标志位
      fold21: [], //存储展开标志位
      foldLoading1: [],
      foldLoading2: [],
      foldLoading21: []
    };
  },
  created() {
    document.title = "待阅工作计划";
  },
  methods: {
    sortDate:function(item1Inner){
      return this.fontChange(parseInt(moment(item1Inner.sortDate).format("d")   ))
    },
    toClick(item,thisName){ // 跳转审批的方法
      console.log(item);
      let did = item.did;
      let adAcount = item.adAcount;
      let planReviewStatus = item.workType;
      let numberOfWeeks = item.weekNum;
      let year = item.year
      let query = {did,adAcount,planReviewStatus,isSuper:1,numberOfWeeks,thisName,year}
      console.log('query',query);
      this.$router.push({ path: "/workplanAudit", query });
    },
    fontChange:function(i){ // 周序号显示处理
      switch(i){
        case 0:
          return "日";
        case 1:
          return "一";
        case 2:
          return "二";
        case 3:
          return "三";
        case 4:
          return "四";
        case 5:
          return "五";
        case 6:
          return "六";
      }
    },
    /**
     * 展开收起
     * @param item 当前展开的项数据
     * @param index 当前展开的项序号
     */
    slide(item, index) { // 下看两级 指数
      console.log('执行了');
      const { account } = item;
      if (this.value === 0) {
        this.fold1[index] = !this.fold1[index];
        if (this.fold1[index]) {
          this.getRecordsList(account, index);
        } else {
          this.workBrnchList1[index].individualCardingRespList = [];
        }
        this.$forceUpdate();
      } else {
        this.fold2[index] = !this.fold2[index];
        if (this.fold2[index]) {
          this.foldLoading2[index] = true;
          this.$forceUpdate();
          this.$getData.unconfirmedList({
            method: "post",
            data: {
              chooseDate: this.dateCurrent,
              chooseAdAcount: account
            }
          }).then(res => {
            this.foldLoading2[index] = false;
            this.workBrnchList2[index].workBrnchList21 = res.data;
            this.$forceUpdate();
          }).catch(() => {});
        } else {
          this.workBrnchList2[index].workBrnchList21 = [];
          this.fold2[index] = false;
          this.foldLoading2[index] = false;
          this.fold21[index] = null;
          this.foldLoading21[index] = false;
          this.$forceUpdate();
        }
      }
    },
    slide00(item, index) {
      console.log('执行了');
      const { account } = item;
      if (this.value === 0) {
        this.fold1[index] = !this.fold1[index];
        if (this.fold1[index]) {
          this.getRecordsList(account, index);
        } else {
          this.workBrnchList1[index].individualCardingRespList = [];
        }
        this.$forceUpdate();
      } else {
        this.fold2[index] = !this.fold2[index];
        if (this.fold2[index]) {
          this.foldLoading2[index] = true;
          this.$forceUpdate();
          this.$getData
            .unconfirmedList({
              method: "post",
              data: {
                chooseDate: this.dateCurrent,
                chooseAdAcount: account
              }
            })
            .then(res => {
              this.foldLoading2[index] = false;
              this.workBrnchList2[index].workBrnchList21 = res.data;
              this.$forceUpdate();
            })
            .catch(() => {});
        } else {
          this.workBrnchList2[index].workBrnchList21 = [];
          this.fold2[index] = false;
          this.foldLoading2[index] = false;
          this.fold21[index] = null;
          this.foldLoading21[index] = false;
          this.$forceUpdate();
        }
      }
    },
    slide1(item2, index2, item, index) {
      const { account } = item;
      if (this.fold21[index2]) {
        if (this.fold21[index2].second[index]) {
          this.fold21[index2].second[index].show = !this.fold21[index2].second[
            index
          ].show;
        } else {
          this.fold21[index2].second[index] = {
            order: index,
            show: true,
            loading: true
          };
        }
      } else {
        let save = {
          first: index2,
          second: []
        };
        save.second[index] = {
          order: index,
          show: true,
          loading: true
        };
        this.fold21[index2] = save;
      }
      let aim = this.fold21[index2];
      if (aim.second[index].show) {
        aim.second[index].loading = true;
        this.$forceUpdate();
        this.$getData
          .unconfirmedRecordsList({
            method: "post",
            data: {
              chooseAdAcount: account,
              chooseDate: this.currentDate
            }
          })
          .then(res => {
            aim.second[index].loading = false;
            this.workBrnchList2[index2].workBrnchList21[
              index
            ].individualCardingRespList = res.data.individualCardingRespList;
            var arr = res.enumVal.ComfirmEnum;
            arr = JSON.parse(arr);
            for (var i = 0; i < arr.length; i++) {
              this.status[arr[i].enumValue] = arr[i].description;
            }
            arr = res.enumVal.CheckinEnum;
            arr = JSON.parse(arr);
            for (var i = 0; i < arr.length; i++) {
              this.status[arr[i].enumValue] = arr[i].description;
            }

            this.$forceUpdate();
          })
          .catch(() => {
            aim.second[index].loading = false;
            this.$forceUpdate();
          });
      } else {
        this.workBrnchList2[index2].workBrnchList21[
          index
        ].individualCardingRespList = [];
        this.$forceUpdate();
      }
    },
    /**
     * 点击下看一层或两层
     * @param index 当前点击项序号
     */
    menuChange(index) {
      const currentHref = window.location.href.split("?");
      const newUrl = `${currentHref[0]}?currentIndex=${index}`;
      window.history.replaceState(null, null, newUrl);
      this.getUnconfirmed(index + 1);
    },

    //跳转到不同状态的页面
    goAbnormal(id, type, eTime, aStatus) {
      if (type == "UNCONFIRMED" && eTime == "NORMAL") {
        this.$router.push({
          path: "/AttendanceAffirm",
          query: {
            id: id,
            pathType: "workbench"
          }
        });
      } else if (type == "UNCONFIRMED" && eTime == "ABNORMAL") {
        this.$router.push({
          path: "/abnormalCheck",
          query: {
            id: id,
            pathType: "workbench"
          }
        });
      } else if (type == "CONFIRMED" && aStatus == "已申诉") {
        this.$router.push({
          path: "/CheckAppeal",
          query: {
            id: id,
            pathType: "workbench"
          }
        });
      }
    },
    
    getUnconfirmed(order) { //待确认考勤次数-团队
      console.log(typeof order);
      console.log("order",order);
      this.reset();
      this[`initLoading${order}`] = true;
      console.log(order, this[`initLoading${order}`]);
      let examineWorkCntReq = {
        "wmouth": this.month,
        "wyear": this.year,
        "type": order
      };
      this.childArr = [];
      this.$getData.selSubordinates({
        method: "post",
        data: { name,examineWorkCntReq }
      }).then(res => {
        this[`initLoading${order}`] = false;
        this[`workBrnchList${order}`] = res.data.filter(item => item.workPlanCnt);
        // this[`workBrnchList${order}`] = res.data;

        if(this.isInit){
          console.log('isInit');
          this[`workBrnchList${order}`].map((item,index)=>{
            console.log(index);
            this.slide(item,index);
          })
        }
        console.log('查询到下级了');

        // if(res.code == 200 && res.msg == 'success'){
        //   this.childArr = res.data.filter(item => item.workPlanCnt);
        //   console.log('this.childArr',this.childArr);
        // }
      }).catch(err => {
        console.log(11222);
        this[`initLoading${order}`] = false;
      });
     
    },
    //待确认考勤次数-团队
    getUnconfirmed0(order) {
      console.log(typeof order);
      console.log("order",order);
      this.reset();
      this[`initLoading${order}`] = true;
      console.log(order, this[`initLoading${order}`]);
      this.$getData
        .unconfirmedList({
          method: "post",
          data: {
            chooseDate: this.dateCurrent,
            type: order === 2 ? true : false
          }
        })
        .then(res => {
          this[`initLoading${order}`] = false;
          this[`workBrnchList${order}`] = res.data;
          console.log('000');
          // this.workBrnchList.map((item, index) => {
          //   this.getRecordsList(item.account, index);
          // });
        })
        .catch(err => {
          this[`initLoading${order}`] = false;
        });
    },
    getRecordsList(adAcount, index) { //获取单个考勤详情
      console.log('ye执行了');
      this[`foldLoading${this.value + 1}`][index] = true;
      this.$forceUpdate();

      this.$getData.selectMouthExamineWork({ // 查询待阅详情
        method: "post",
        data:{
          adAcount,
          "wmouth": this.month,
          "wyear": this.year
        }
      }).then(res => {
        this[`foldLoading${this.value + 1}`][index] = false;
        if (res.code == 200 && res.msg == "success") {
          console.log('getRecordsList res',res);
          this[`workBrnchList${this.value + 1}`][
            index
          ].individualCardingRespList = res.data;
          
          var arr = res.enumVal.ComfirmEnum;
          arr = JSON.parse(arr);
          for (var i = 0; i < arr.length; i++) {
            this.status[arr[i].enumValue] = arr[i].description;
          }
          arr = res.enumVal.CheckinEnum;
          arr = JSON.parse(arr);
          for (var i = 0; i < arr.length; i++) {
            this.status[arr[i].enumValue] = arr[i].description;
          }
          this.$forceUpdate();

        }
      }).catch(err =>{
        this[`foldLoading${this.value + 1}`][index] = false;
        this.$forceUpdate();
      });

      
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    //选中日期
    changePick() {
      var date = this.currentDate;
      this.dateCurrent = date;
      this.dateTime = date.getFullYear() + "年" + (date.getMonth() + 1) + "月";

      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;

      this.getUnconfirmed(this.value + 1);
    },
    /**
     * 重置初始化数据
     * @param index 当前点击项序号
     */
    reset() {
      this.fold1 = [];
      this.fold2 = [];
      this.fold21 = [];
      this.foldLoading1 = [];
      this.foldLoading2 = [];
      this.workBrnchList1 = [];
      this.workBrnchList2 = [];
    }
  },
  computed:{
    
  },
  mounted() {
    this.getUnconfirmed(this.value + 1);
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/sass/workBench";
</style>
