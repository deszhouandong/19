<template>
  <div class="workbench">
    <!-- 顶部下拉框 -->
    <van-dropdown-menu class="dropdown-home">
      <van-dropdown-item v-model="value" :options="option" @change="menuChange"/>
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
            <div class="collapse-handler"  @click="slideDefault(item1,index1)">
              <div class="collapse-handler-inner">
                <span class="name" style="font-size:17px">{{item1.name}}</span>
                <a :href="'tel:'+ item1.cellPhone">
                  <!-- <van-icon name="phone" color="#4B77AF" size="25px" /> -->
                  <img :src="dianhuaImgUrl" alt style="vertical-align:top" />
                </a>
                <span
                  style="width:108px;float:right;margin-right:10px;display:inline-block;font-size: 14px;color: #D75252; text-align:center;border-radius:20px;"
                >待确认{{item1.count}}次</span>
              </div>
            </div>
            <div class="collapse-content">
              <van-steps direction="vertical" active-icon="checked">
                <div>
                  <div
                    v-if="item1.individualCardingRespList&&item1.individualCardingRespList.length"
                  >
                    <van-step
                      v-for="(item1Inner,index1Inner) in item1.individualCardingRespList"
                      :key="index1Inner"
                    >
                      <div
                        @click="goAbnormal(item1Inner.id,item1Inner.comfirmType,item1Inner.excptionTime,item1Inner.appealStatus)"
                        :class="item1Inner.comfirmType == 'UNCONFIRMED' ? 'unconfirmedStatus' : 'abnormalStatus'"
                      >
                        <p
                          style="float:right;margin:0;"
                          class="confirmed"
                          v-if="item1Inner.comfirmType == 'CONFIRMED'"
                        >{{status[item1Inner.abnormalCheckinStatus]}}</p>
                        <p
                          style="float:right;margin:0;"
                          class="confirmed"
                          v-else
                        >{{status[item1Inner.comfirmType]}}</p>
                        <h3>
                          {{item1Inner.dateToStr}}
                          <span>{{item1Inner.checkinName}}</span>
                        </h3>

                        <p>{{item1Inner.clockDateToStr}}</p>
                        <p style="float:right;margin:0;">{{item1Inner.appealStatus}}</p>
                        <p class="location-name">{{item1Inner.name}}</p>
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
                >待确认{{item2.count}}次</span>
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
                        >待确认{{item21.count}}次</span>
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
                                :class="item21Inner.comfirmType == 'UNCONFIRMED' ? 'unconfirmedStatus' : 'abnormalStatus'"
                              >
                                <p
                                  style="float:right;margin:0;"
                                  class="confirmed"
                                  v-if="item21Inner.comfirmType == 'CONFIRMED'"
                                >{{status[item21Inner.abnormalCheckinStatus]}}</p>
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

const { currentIndex = 0 } = querystring.parse(
  window.location.hash.split("?")[1]
);
export default {
  name: "workbench",
  data() {
    return {
      homeImgUrl:require('../../../static/imgs/home.svg'),
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
    document.title = "待确认考勤";
  },
  methods: {
     /**
     * 下看一层展开收起，只切换状态，不调用后台加载数据
     * @param item 当前展开的项数据
     * @param index 当前展开的项序号
     */
    slideDefault(item, index) {
     this.fold1[index] = !this.fold1[index];
     this.$forceUpdate()
    },
    /**
     * 展开收起
     * @param item 当前展开的项数据
     * @param index 当前展开的项序号
     */
    slide(item, index) {
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
    //待确认考勤次数-团队
    getUnconfirmed(order) {
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
          if(order==1){
            this.fold1=new Array(this[`workBrnchList${order}`].length).fill(true)
          }
          // this.workBrnchList.map((item, index) => {
          //   this.getRecordsList(item.account, index);
          // });
        })
        .catch(err => {
          this[`initLoading${order}`] = false;
        });
    },
    //获取单个考勤详情
    getRecordsList(adAcount, index) {
      this[`foldLoading${this.value + 1}`][index] = true;
      this.$forceUpdate();
      this.$getData
        .unconfirmedRecordsList({
          method: "post",
          data: {
            chooseAdAcount: adAcount,
            chooseDate: this.currentDate
          }
        })
        .then(res => {
          this[`foldLoading${this.value + 1}`][index] = false;
          this[`workBrnchList${this.value + 1}`][
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

  mounted() {
    this.getUnconfirmed(this.value + 1);
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/sass/workBench";
</style>
