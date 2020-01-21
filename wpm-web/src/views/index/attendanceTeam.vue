<template>
  <div class="attendanceTeam">
    <!-- 顶部下拉框 -->
    <van-dropdown-menu>
      <van-dropdown-item v-model="value" :options="option" @change="menuChange" />
      <van-dropdown-item ref="item" :title="dateTime">
        <van-datetime-picker type="year-month" :formatter="formatter" v-model="currentDate" @change="changePick"
          cancel-button-text=" " confirm-button-text=" " />
      </van-dropdown-item>
    </van-dropdown-menu>
    <div v-if="value==0">
      <van-loading style="text-align:center;color:#666" v-if="initLoading1" color="#666">加载中...</van-loading>
      <div class="collapse-wrap" v-else>
        <!-- <van-loading style="text-align:center;color:#666" v-if="initLoading1" color="#666">加载中...</van-loading> -->
        <!-- <div v-else> -->
          <div v-if="NextLeveList1&&NextLeveList1.length == 0||!NextLeveList1" class="noData">暂无数据</div>
          <div v-else>
            <div :class="{collapse:true,active:fold1[index1]?true:false}" v-for="(item1,index1) in NextLeveList1" :key="index1">
              <div class="collapse-handler" @click="slide(item1,index1)">
                <div class="collapse-handler-inner">
                  <span class="name"  style="font-size:17px">{{item1.name}}</span>
                  <a :href="'tel:'+ item1.cellPhone">
                    <!-- <van-icon name="phone" color="#4B77AF" size="25px" /> -->
                    <img :src="dianhuaImgUrl" alt style="vertical-align:top" />

                  </a>
                  <span
                    style="width:108px;float:right;margin-right:10px;display:inline-block;font-size: 14px;color: #D75252; text-align:center;border-radius:20px;">考勤异常{{item1.count}}次</span>
                </div>
              </div>
              <div class="collapse-content">
                <van-steps direction="vertical" active-icon="checked">
                  <van-loading style="text-align:center;color:#666" color="#666" v-if="foldLoading1[index1]">加载中...
                  </van-loading>
                  <div v-else>
                    <div v-if="item1.individualCardingRespList&&item1.individualCardingRespList.length">
                      <van-step v-for="(item1Inner,index1Inner) in item1.individualCardingRespList" :key="index1Inner">
                        <div
                          @click="goAbnormal(item1Inner.id,item1Inner.comfirmType,item1Inner.excptionTime,item1Inner.appealStatus)"
                          :class="item1Inner.comfirmType == 'CONFIRMED' && item1Inner.appealStatus == '已申诉' ? 'unconfirmedStatus' : 'abnormalStatus'">
                          <!-- <p style="float:right;margin:0;" v-if="status[item1Inner.checkinStatus] == null ">
                            {{status[item1Inner.comfirmType]}}</p>
                          <p style="float:right;margin-top:0;" v-else>{{status[item1Inner.checkinStatus]}}</p> -->
                           <p style="float:right;margin-top:0;">
                             {{status[item1Inner.checkinStatus]||status[item1Inner.abnormalCheckinStatus]}}
                           </p>
                          <h3>
                            {{item1Inner.dateToStr}}
                            <span>{{item1Inner.checkinName}}</span>
                          </h3>
                          <p>{{item1Inner.clockDateToStr}}</p>
                          <!-- <p>{{item1Inner.name}}</p> -->
                            <p  class="location-name">{{item1Inner.name}}</p>
                        </div>
                      </van-step>
                    </div>
                    <div v-else  class="noData">
                      暂无数据
                    </div>
                  </div>
                </van-steps>
              </div>
            </div>
          </div>
        <!-- </div> -->
      </div>
    </div>
    <div v-else>
      <van-loading style="text-align:center;color:#666" v-if="initLoading2" color="#666">加载中...</van-loading>
      <div class="collapse-wrap" v-else>
        <div v-if="NextLeveList2&&NextLeveList2.length == 0||!NextLeveList2" class="noData">暂无数据</div>
        <div v-else>
          <div :class="{collapse:true,active:fold2[index2]?true:false}" v-for="(item2,index2) in NextLeveList2" :key="index2">
            <div class="collapse-handler" @click="slide(item2,index2)">
              <div class="collapse-handler-inner">
                  <span class="name"  style="font-size:17px">{{item2.name}}</span>
                  <a :href="'tel:'+ item2.cellPhone">
      <img :src="dianhuaImgUrl" alt style="vertical-align:top" />

                    <!-- <van-icon name="phone" color="#4B77AF" size="25px" /> -->
                  </a>
                                  <span
                    style="width:108px;float:right;margin-right:10px;display:inline-block;font-size: 14px;color: #D75252; text-align:center;border-radius:20px;">考勤异常{{item2.count}}次</span>
              </div>
            </div>
            <div class="collapse-content">
              <van-loading style="text-align:center;color:#666" color="#666" v-if="foldLoading2[index2]">加载中...
              </van-loading>
              <div v-else>
                <div v-if="item2.NextLeveList21&&item2.NextLeveList21.length">
                  <div :class="{
                    collapse:true,sub:true,
                    active:fold21[index2]&&
                    fold21[index2].second&&
                    fold21[index2].second[index21]&&
                    fold21[index2].second[index21].show?true:false}" v-for="(item21,index21) in item2.NextLeveList21" :key="index21">
                    <div class="collapse-handler" @click="slide1(item2,index2,item21,index21)">
                      <div class="collapse-handler-inner">
                        <span class="name"  style="font-size:17px">{{item21.name}}</span>
                        <a :href="'tel:'+ item21.cellPhone">
      <img :src="dianhuaImgUrl" alt style="vertical-align:top" />

                          <!-- <van-icon name="phone" color="#4B77AF" size="25px" /> -->
                        </a>
                        <span
                          style="width:108px;float:right;margin-right:10px;display:inline-block;font-size: 14px;color: #D75252; text-align:center;border-radius:20px;">
                          考勤异常{{item21.count}}次
                        </span>
                      </div>
                    </div>
                    <div class="collapse-content">
                      <van-steps direction="vertical" active-icon="checked">
                        <van-loading style="text-align:center;color:#666" color="#666" v-if="
                        fold21[index2]&&
                        fold21[index2].second&&
                        fold21[index2].second[index21]&&
                        fold21[index2].second[index21]&&fold21[index2].second[index21].loading">加载中...
                        </van-loading>
                        <div v-else>
                          <div v-if="item21.individualCardingRespList&&item21.individualCardingRespList.length">
                            <van-step v-for="(item21Inner,index21Inner) in item21.individualCardingRespList"
                              :key="index21Inner">
                              <div
                                @click="goAbnormal(item21Inner.id,item21Inner.comfirmType,item21Inner.excptionTime,item21Inner.appealStatus)"
                                :class="item21Inner.comfirmType == 'UNCONFIRMED' ? 'unconfirmedStatus' : 'abnormalStatus'">
                                <!-- <p style="float:right;margin:0;" class="confirmed"
                                  v-if="item21Inner.comfirmType == 'CONFIRMED'">
                                  {{status[item21Inner.comfirmType] && status[item21Inner.checkinStatus]}}</p>
                                <p style="float:right;margin:0;" class="confirmed" v-else>
                                  {{status[item21Inner.comfirmType]}}</p> -->
                                    <p style="float:right;margin-top:0;">
                             {{status[item21Inner.checkinStatus]||status[item21Inner.abnormalCheckinStatus]}}
                           </p>
                                <h3>
                                  {{item21Inner.dateToStr}}
                                  <span>{{item21Inner.checkinName}}</span>
                                </h3>

                                <p>{{item21Inner.clockDateToStr}}</p>
                                <p style="float:right;margin:0;">{{item21Inner.appealStatus}}</p>
                                <!-- <p>{{item21Inner.name}}</p> -->
                                  <p  class="location-name1">{{item21Inner.name}}</p>
                              </div>
                            </van-step>
                          </div>
                          <div v-else  class="noData">
                            暂无数据
                          </div>
                        </div>
                      </van-steps>
                    </div>
                  </div>
                </div>
                <div v-else  class="noData">
                  暂无数据
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import querystring from 'querystring';
const {currentIndex=0}=querystring.parse(window.location.hash.split('?')[1])
  export default {
    name: "attendanceTeam",
    data() {
      return {
        dianhuaImgUrl:require('../../../static/imgs/dianhua.svg'),
        value: Number(currentIndex),
        switch1: false,
        switch2: false,
        currentDate: new Date(),
        option: [{
          text: "下看一层",
          value: 0
        }, {
          text: "下看两层",
          value: 1
        }],
        dateCurrent: null,
        dateTime: new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月",
        NextLeveList1: [],
        NextLeveList2: [],
        activeNames1: ["1"],
        activeNames2: ["1"],
        activeNames21: ["1"],
        status: {},
        RecordsList: [],
        // userImg: "./static/imgs/userImg.png",
        initLoading1: false, //初始化加载数据状态
        initLoading2: false, //初始化加载数据状态
        fold1: [], //存储展开标志位
        fold2: [], //存储展开标志位
        fold21: [], //存储展开标志位
        foldLoading1: [],
        foldLoading2: [],
        foldLoading21: [],
      };
    },
    created() {
      document.title = "下属异常考勤";
    },
    methods: {
      /**
       * 展开收起
       * @param item 当前展开的项数据
       * @param index 当前展开的项序号
       */
      slide(item, index) {
        const {
          account
        } = item
        if (this.value === 0) {
          this.fold1[index] = !this.fold1[index]
          if (this.fold1[index]) {
            this.getNextLeveList(account, index);
          } else {
              this.NextLeveList1[index].individualCardingRespList = []
          }
          this.$forceUpdate()
        } else {
          this.fold2[index] = !this.fold2[index]
          if (this.fold2[index]) {
            this.foldLoading2[index] = true
            this.$forceUpdate()
            this.$getData
              .abnormalAttendanceList({
                method: "post",
                data: {
                  chooseDate: this.dateCurrent,
                  chooseAdAcount: account
                }
              })
              .then(res => {
                this.foldLoading2[index] = false
                this.NextLeveList2[index].NextLeveList21 = res.data;
                this.$forceUpdate()
              }).catch(() => {})
          } else {
              this.NextLeveList2[index].NextLeveList21 = []
              this.fold2[index] = false
              this.foldLoading2[index] = false
              this.fold21[index] = null
              this.foldLoading21[index] = false
              this.$forceUpdate()

              // this.activeNames21 = ['0']
          }
        }
      },
      slide1(item2, index2, item, index) {
        const {
          account
        } = item
        if(this.fold21[index2]){
          if(this.fold21[index2].second[index]){
            this.fold21[index2].second[index].show = !this.fold21[index2].second[index].show
          }else{
            this.fold21[index2].second[index]={
                order:index,
                show:true,
                loading:true
            }
          }
        }else{
          let save={
            first:index2,
            second:[]
          }
          save.second[index]={
            order:index,
            show:true,
            loading:true
          }
          this.fold21[index2] = save
        }
        let aim=this.fold21[index2]
        if (aim.second[index].show) {
          aim.second[index].loading=true
          this.$forceUpdate()
          this.$getData
            .individualAbnormalRecordsList({
              method: "post",
              data: {
                chooseAdAcount: account,
                chooseDate: this.currentDate
              }
            })
            .then(res => {
              aim.second[index].loading=false
              this.NextLeveList2[index2].NextLeveList21[index].individualCardingRespList =
              res.data.individualCardingRespList;
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
              this.$forceUpdate()
            })
            .catch(() => {
              aim.second[index].loading=false
              this.$forceUpdate()
            })
        } else {
            this.NextLeveList2[index2].NextLeveList21[index].individualCardingRespList = []
            this.$forceUpdate()
        }

      },
      /**
       * 点击下看一层或两层
       * @param index 当前点击项序号
       */
      menuChange(index) {
          const currentHref=window.location.href.split('?')
      const newUrl = `${currentHref[0]}?currentIndex=${index}`
      window.history.replaceState(null, null, newUrl);
        this.getNextLeve(index + 1);
      },
      formatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        } else if (type === "month") {
          return `${value}月`;
        }
        return value;
      },
      //跳转到不同状态的页面
      goAbnormal(id, type, eTime, aStatus) {
        if (type == "UNCONFIRMED" && eTime == "NORMAL") {
          //以确认-正常 跳转到正常页面
          this.$router.push({
            path: "/AttendanceAffirm",
            query: {
              id: id,
              pathType: "attendanceTeam"
            }
          });
        } else if (type == "UNCONFIRMED" && eTime == "ABNORMAL") {
          //未确认-异常跳转到确认页面
          this.$router.push({
            path: "/abnormalCheck",
            query: {
              id: id,
              pathType: "attendanceTeam"
            }
          });
        } else if (type == "CONFIRMED" && aStatus == "已申诉") {
          //已确认-已申诉跳到确认页面
          this.$router.push({
            path: "/CheckAppeal",
            query: {
              id: id,
              pathType: "attendanceTeam"
            }
          });
        }
      },
      //切换时间
      changePick() {
        var date = this.currentDate;
        this.dateCurrent = date;
        this.dateTime = date.getFullYear() + "年" + (date.getMonth() + 1) + "月";
        this.getNextLeve(this.value + 1);
      },
      //查看异常考勤次数-团队
      getNextLeve(order) {
        this.reset()
        this[`initLoading${order}`] = true
        this.$getData
          .abnormalAttendanceList({
            method: "post",
            data: {
              chooseDate: this.dateCurrent,
              type:order===2?true:false
            }
          })
          .then(res => {
            this[`initLoading${order}`] = false
            this[`NextLeveList${order}`] = res.data;
            // this.NextLeveList.map((item, index) => {
            //   this.getNextLeveList(item.adAcount, index);
            // });
          }).catch((err) => {
            this[`initLoading${order}`] = false
          })
      },
      //查看下属异常考勤清单
      getNextLeveList(adAcount, index) {
        this[`foldLoading${this.value+1}`][index] = true
        this.$forceUpdate()
        this.$getData
          .individualAbnormalRecordsList({
            method: "post",
            data: {
              chooseDate: this.dateCurrent,
              chooseAdAcount: adAcount
            }
          })
          .then(res => {
            this[`foldLoading${this.value+1}`][index] = false

            this[`NextLeveList${this.value+1}`][index].individualCardingRespList =
              res.data.individualCardingRespList;
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
            this.$forceUpdate()
          });
      },
      /**
       * 重置初始化数据
       * @param index 当前点击项序号
       */
      reset() {
        this.fold1 = []
        this.fold2 = []
        this.fold21 = []
        this.foldLoading1 = []
        this.foldLoading2 = []
        this.NextLeveListList1 = []
        this.NextLeveListList2 = []
        // this.activeNames1 = ["0"]
        // this.activeNames2 = ["0"]
        // this.activeNames21 = ["0"]
      },
    },
    mounted() {
      this.getNextLeve(this.value+1);
    }
  };
</script>

<style scoped lang="scss">
@import '../../assets/sass/workBench'

// .van-loading,.noData{
//   background: #fff;
// }

//   h3 {
//     margin: 0 !important;
//   }

//   .workbench {
//     background-color: #f4f4f4;
//   }

//   /deep/.van-collapse {
//     width: 100%;
//     background: #fff;

//     // margin-top: 10px !important;
//     .van-collapse-item {
//       margin: 0 17px;

//       .van-cell {
//         padding: 12px 0;
//         border-bottom: 1px solid #e0dddd;

//         .van-cell__title {
//           font-size: 17px;
//           color: #333;
//         }
//       }
//     }
//   }

//   // 10-9 Start
//   /deep/.van-steps i.van-icon-checked::before {
//     color: #4b77af !important;
//   }

//   /deep/.van-icon,
//   .van-icon-phone::before {
//     vertical-align: top;
//   }

//   // End
//   /deep/.van-icon {
//     margin-right: 12px;
//   }

//   /deep/[class*="van-hairline"]::after {
//     border: none;
//   }

//   .confirmed {
//     color: red;
//   }

//   .content {
//     padding: 10px;
//   }

//   .noData {
//     text-align: center;
//     width: 100%;
//     height: 50px;
//     line-height: 50px;
//     font-size: 16px;
//     color: #000;
//   }

//   .abnormalStatus {
//     color: #969799;
//   }

//   .unconfirmedStatus {
//     color: #000;
//   }

//   // 自定义折叠下拉列表
//   .collapse {
//     background: #fff;
//     font-size: 16px;
//     &.sub{
//       margin:0 18px;
//     }
//     &.active{
//       >.collapse-handler:before{
//         transform: rotate(-90deg);
//         -webkit-transform: rotate(-90deg);
//       }
//       >.collapse-content{
//         display: block;
//       }
//     }

//     >.collapse-handler {
//       padding: 0 18px;
//       position: relative;

//       &:before {
//         content: "\F00A";
//         -webkit-transform: rotate(90deg);
//         transform: rotate(90deg);
//         -webkit-transition: -webkit-transform .3s;
//         transition: transform .3s;
//         transition: transform .3s, -webkit-transform .3s;
//         font: 18px/1 "vant-icon";
//         position: absolute;
//         right: 16px;
//         top: 50%;
//         color: #969799;
//         height: 20px;
//         line-height: 20px;
//         margin-top: -13px;
//       }

//       .collapse-handler-inner {
//         padding:12px 0;
//         border-bottom: 1px solid #e0dddd;
//       }
//     }
//     >.collapse-content{
//       display: none;
//     }
//   }
</style>
