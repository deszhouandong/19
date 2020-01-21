<template>
  <div class="punch">
    <!-- 日历 -->
    <PunchDate @getDateHandler="getDateHandler" />
    <!-- 地图 -->
    <div class="baidumap-wrap">
      <div class="baidumap" id="allmap"></div>
    </div>
    <div class="content flexall">
      <!-- <p class="myRecord whiteBg">
        <span style="padding-left:15px;">下一级考勤记录</span>
      </p>-->
      <van-dropdown-menu class="myRecord">
        <van-dropdown-item v-model="value1" :options="option1" @change="menuChange" />
      </van-dropdown-menu>
      <template>
        <van-loading style="text-align:center;color:#666" v-if="initLoading" color="#666">加载中...</van-loading>
        <div class="checkRecord-wrap flex" v-else>
          <div v-if="!nextLeveList.length" class="punch-noData">
            <p class="empty-text">暂无下级记录</p>
          </div>
          <div
            v-else
            class="checkRecord clear"
            v-for="(item,index) in nextLeveList"
            :key="index"
            @click="goDetail(item.adAcount)"
          >
            <div class="clear record">
              <!-- <p class="name"><img style="background:url:('../static/imgs/userImg.png')  no-repeat"/>{{item.userName}}</p> -->
              <p class="name">
                <img :src="item.avatar" alt v-if="item.avatar" class="head" />
                <van-icon name="user-circle-o" v-else />
                <span
                  style="display:inline-block;vertical-align:middle;width:70px;"
                >{{item.userName}}</span>
                <span style="font-size:15px;vertical-align:middle">{{item.clockDateToStr}}</span>
              </p>

              <p class="status" v-if="item.unconfirmedCount != null">{{item.unconfirmedCount}}</p>
              <p class="hide" v-else></p>
            </div>
            <!-- <p class="address"><img :src="hotImg" class="hotImg" style="background:url('./static/imgs/adress.png') no-repeat;"/>{{item.name}}</p> -->
            <p class="address">
              <van-icon name="location" />
              {{item.name}}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import PunchDate from "@/component/punch/PunchDate";
import url from "url";
import querystring from "querystring";
import Vue from "vue";
import { Toast } from "vant";

export default {
  name: "attendanceRecord",
  components: {
    PunchDate
  },
  data() {
    return {
      days: [],
      defaultDate: new Date(),
      latitude: "",
      longitude: "",
      active: 0,
      nextLeveList: [], // 下一级人员列表
      location: null, //经纬度
      value1: 0, //默认选中下看一层
      // 下看层数列表
      option1: [
        { text: "下看一层记录", value: 0 },
        { text: "下看两层记录", value: 1 }
      ],
      initLoading: true
    };
  },
  created() {
    const { floorIndex = 0 } = this.$route.query;
    this.value1 = Number(floorIndex);
    // document.title = "打卡考勤";
  },
  mounted() {
    this.baiduMap();
    this.getAttendanceMap(this.value1 + 1);
  },
  methods: {
    /**
     * 点击下看一层或两层
     * @param index 当前点击项序号
     */
    menuChange(index) {
      const currentHref = window.location.href;
      let str = currentHref
        .replace(/&floorIndex=.*$/gi, "")
        .replace(/floorIndex=.*?(&|$)/gi, "");

      const aim = url.parse(str).hash;
      let newUrl =''
      if(aim.indexOf('?')==-1){
        newUrl=`${str}?floorIndex=${index}`
      } else{
        if(aim.split("?")[1]){
          newUrl=`${str}&floorIndex=${index}`
        }else{
          newUrl=`${str}floorIndex=${index}`
        }
      }
      window.history.replaceState(null, null, newUrl);
      this.getAttendanceMap(index + 1);
    },
    getDateHandler(params) {
      this.defaultDate = params;
      this.getAttendanceMap(this.value1 + 1);
    },

    //绘制百度地图
    baiduMap() {
      let _self = this;
      var map = new BMap.Map("allmap"); // 创建地图实例
      var point = new BMap.Point(121.465978, 31.174226); // 创建点坐标
      map.centerAndZoom(point, 13); // 初始化地图，设置中心点坐标和地图级别
      // map.setCurrentCity("上海");
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          // 定位成功事件
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            for (let i = 0; i < _self.nextLeveList.length; i++) {
              if (_self.nextLeveList[i].lat) {
                var marker = new BMap.Marker(
                  new BMap.Point(
                    _self.nextLeveList[i].lng,
                    _self.nextLeveList[i].lat
                  )
                );
                var point = new BMap.Point(
                  _self.nextLeveList[i].lng,
                  _self.nextLeveList[i].lat
                );
                map.addOverlay(marker);
              }
            }
          }
        },
        {
          enableHighAccuracy: true
        }
      );
    },

    // 在线考勤地图
    getAttendanceMap(order) {
      this.initLoading = true;
      this.nextLeveList=[]
      this.$getData
        .attendanceMap({
          method: "post",
          data: {
            chooseDate: this.defaultDate,
            type: order === 2 ? true : false
          }
        })
        .then(res => {
          if (res.code == 200) {
            this.initLoading = false;
            this.nextLeveList = res.data.nextLevelAttendanceRecords
              ? res.data.nextLevelAttendanceRecords
              : [];
            this.baiduMap();
          }
        })
        .catch(() => {
          this.initLoading = false;
        });
    },
    //跳转到地图详情
    goDetail(adAcount) {
      console.log("到地图时间" + this.defaultDate);
      this.$router.push({
        path: "/mapDetail",
        query: {
          abnomalAdAcount: adAcount,
          chooseDate: Date.parse(this.defaultDate),
          currentIndex: 1
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.punch {
  background-color: #f4f4f4;
  // padding-top: 296px;

  .baidumap-wrap {
    position: fixed;
    top: 66px;
    width: 100%;
  }

  .baidumap {
    height: 200px;
    // margin: 0 8px;
  }
}

.content {
  position: fixed;
  top: 266px;
  right: 0;
  left: 0;
  height: calc(100% - 316px);
  background: #f4f4f4;
  .checkRecord {
    // height: 100px;
    background: #ffffff;
    box-shadow: 0 2px 10px 0 rgba(199, 197, 197, 0.5);
    border-radius: 12px;
    margin: 10px 0;

    .record {
      width: 100%;
      height: 30px;
      line-height: 24px;
      padding: 12px 0;
      // padding-top: 15px !important;
      // padding-bottom: 8px;
      border-bottom: 1px solid rgba(75, 119, 175, 0.1);

      .name {
        float: left;
        font-size: 15px;
        color: #4b77af;
        font-weight: bolder;
        margin: 0 !important;
        display: table;
        padding: 0;

        .van-icon {
          margin-right: 10px;
          font-size: 16px;
          vertical-align: middle;
          text-align: center;

          &:before {
            font-size: 26px;
          }
        }

        .head {
          margin-right: 10px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }

      .status {
        float: right;
        padding: 0 8px;
        font-size: 14px;
        margin: 0 !important;
        border: 1px solid #d75252;
        color: #d75252;
        border-radius: 15px;
        text-align: center;
        box-sizing: border-box;
      }
    }

    .address {
      color: #1989fa;
      line-height: 24px;
      font-size: 15px;
      color: #000000;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .van-icon {
      color: #4b77af;
      margin-right: 6px;
      font-size: 16px;
      vertical-align: middle;
      text-align: center;
    }
  }
}

.checkRecord-wrap {
  // height: 265px;
  // overflow: auto;
}

.checkRecord p {
  padding: 12px 0;
}

.van-icon,
.van-icon::before {
  font-size: 16px;
  display: inline-block;
}

.whiteBg {
  background: #fff;
}

.myRecord {
  height: 36px;
  line-height: 36px;
  width: 100%;
  // background: #fff;
  font-size: 16px;
  // font-weight: 700;
  padding: 0 8px;
  /deep/ .van-dropdown-menu__item {
    flex: none;
  }
}

.hide {
  display: none;
}

.aa {
  text-align: center;
}

.date {
  height: 115px;
  // color: #fff;
  background-color: #719cd2;
}

.date p {
  margin: 0;
}

.date .month {
  padding-top: 10px;
}

.date .month .year {
  font-size: 15px;
  line-height: 24px;
  text-align: center;
  width: 90%;
  color: #fff;
}

.month .last {
  float: left;
  /* height: 30px; */
  margin-top: 7px;
  width: 10%;
  text-align: center;
  color: #fff;
}

.month .next {
  float: right;
  margin-top: -17px;
  width: 10%;
  text-align: center;
  color: #fff;
}

.date .weekdays {
  display: flex;
  font-size: 13px;
  margin-top: 15px;
  color: #fff;
}

.date .weekdays li {
  flex: 1;
  line-height: 24px;
  font-size: 16px;
  text-align: center;
  float: left;
}

.date .weekdays .six {
  color: red;
}

.date .weekdays .date .weekdays .days {
  display: flex;
  color: #fff;
}

.days li {
  flex: 1;
  font-size: 14px;
  text-align: center;
  margin-top: 5px;
  line-height: 30px;
  width: 14.28%;
  float: left;
  color: #fff;
}

.days .active {
  display: inline-block;
  width: 30px;
  height: 30px;
  color: #fff;
  border-radius: 50%;
  background-color: #4b77af;
}

.date .weekdays .days .other-month {
  color: #4a77b0;
}

.days li:nth-last-child(1),
.days li:nth-last-child(2) {
  color: red;
}

.clear {
  clear: both;
}

.checkRecord {
  // height: 70px;
  padding-left: 15px;
  padding-right: 10px;
}
.punch-noData {
  color: #484848;
  text-align: center;
  font-weight: 500;
  line-height: 25px;
  font-size: 18px;
  margin-top: 106px;
}
</style>
<style lang="scss">
.layer-punchDate-mask {
  z-index: 3000 !important;
}

.layer-punchDate-popup {
  z-index: 3001 !important;
}
</style>
