<template>
    <div
      class="solo"
      @click="gotoDetail(item,'details')"
    >
      <div class="title">
        <span class="company-icon"></span>
        <span class="com-title">{{item.visitObjectName}}</span>
        <span class="toChanceSee" @click="gotoChance(item,'see',$event)" v-if="item.hasSeeBus">商机 ></span>
      </div>
      <div class="half border">
        <div class="info">
          <span class="gray">开始时间：</span>
          <span>{{item.arriveDate?this.$moment(item.arriveDate).format('YYYY/MM/DD HH:mm:ss'):''}}</span>
        </div>
        <div class="info">
          <span class="gray">访客地址：</span>
          <span>{{item.arriveProvice}}{{item.arriveCity}}{{item.arriveAddress}}{{item.arriveDescribe}}</span>
        </div>
      </div>
      <div class="half border">
        <div class="info">
          <span class="gray">结束时间：</span>
          <span>{{item.leaveDate?this.$moment(item.leaveDate).format('YYYY/MM/DD HH:mm:ss'):''}}</span>
        </div>
        <div class="info">
          <span class="gray">访客地址：</span>
          <span>{{item.leaveProvice}}{{item.leaveCity}}{{item.leaveAddress}}{{item.leaveDescribe}}</span>
        </div>
      </div>
      <div class="operating">
        <span v-if="item.visitState!=1&&item.nextVisitDate" class="blue" style="float:left">下次拜访:{{this.$moment(item.nextVisitDate).format("YYYY/MM/DD")}}</span>
        <span
          class="improve-info improve-create"
          @click="gotoChance(item,'create',$event)"
          v-if="item.hasCreateBus"
        >创建商机</span>
        <span class="improve-info" @click="gotoDetail(item,'perfect')" v-if="item.visitState === 1 && currentUser === item.adAcount">请点击完善信息</span>
        <span class="delete" @click="deleteRecord(item,index)" v-if="item.visitState === 1 && currentUser === item.adAcount">删除</span>
      </div>
    </div>
</template>
<script>
import { Dialog, Toast } from "vant";
import Cookie from "@/apis/cookie";
import { deleteVisitorsRecord } from "@/apis/api/guestrecord";
export default {
  data() {
    return {
      currentUser: ""
    };
  },
  props: {
    item:{
      type:Object,
      default:{}
    },
    index:{
      type:Number
    },
    deleteRecordHanlder:{
      type:Function
    }
  },
  created() {
    document.body.style.backgroundColor = "#f4f4f4";
    this.currentUser = Cookie.cookie.get("accountName");
  },

  methods: {
    // 跳转商机
    gotoChance(item, type,$event) {
      $event && $event.stopPropagation();
      let newUrl = "";
      const {
        chanceSeeUrl,
        chanceCreateUrl,
        id,
        visitObjectId,
        otherPeople,
        phoneNumber,
        visitorsRecord,

        arriveProvice,
        arriveCity,
        arriveAddress,
        arriveDescribe,
        nextVisitDate
      } = item;
      if (type === "see") {
        newUrl = decodeURIComponent(chanceSeeUrl);
      } else if (type === "create") {
        const address = `${arriveProvice}${arriveCity}${arriveAddress}${arriveDescribe}`;
        const params = `&id=${id}&visitObjectId=${visitObjectId}&otherPeople=${otherPeople}&phoneNumber=${phoneNumber}&address=${address}&visitorsRecord=${visitorsRecord}&nextVisitDate=${nextVisitDate}`;
        newUrl = `${decodeURIComponent(chanceCreateUrl)}${encodeURIComponent(
          params
        )}`;
      }
      console.log(newUrl);
      console.log(decodeURIComponent(newUrl));
      window.location.href = newUrl;
    },
    gotoDaylist() {
      if (!this.isOperate) this.$router.push("visitordaylist");
    },
    deleteRecord(item, index) {
      Dialog.confirm({
        title: "提示信息",
        message: "是否删除记录?"
      })
        .then(() => {
          this.fetchDeleterecord(item, index);
        })
        .catch(() => {
          // on cancel
        });
    },
    fetchDeleterecord(item, index) {
      let visitState = item.visitState;
      let id = item.id;
      deleteVisitorsRecord({ id, visitState }).then(res => {
        // this.guestList.splice(index, 1);
        this.$emit('deleteRecordHanlder',index)
        Toast("删除成功");
      });
    },
    gotoDetail(item, type) {
      console.log(1)
      sessionStorage.setItem("offsetTop", document.scrollingElement.scrollTop);
      let readOnly = "";
      if (item.visitState === 1 && type === "details") {
        return;
      }
      if (item.visitState !== 1) {
        readOnly = "readonly";
      }
      this.$router.push({
        name: "visitorDetail",
        query: {
          id: item.id,
          type: readOnly,
          modelType: this.$route.query.modelType
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
$border: 1px solid rgba(75, 119, 175, 0.2);

.solo {
  padding: 24px 22px;
  background: #fff;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 2px 10px rgba(199, 197, 197, 0.5);
}
.title {
  display: flex;
  margin: -5px 0 10px 0;
  position: relative;
  span {
    font-size: 17px;
    font-weight: 700;
    line-height: 20px;
  }
  .toChanceSee {
    width: 63px;
    height: 24px;
    line-height: 24px;
    color: #fff;
    background: #4b77af;
    text-align: center;
    font-size: 15px;
    border-radius: 12px 0px 0px 12px;
    font-weight: normal;
    position: absolute;
    right: -22px;
  }
}
.company-icon {
  display: inline-block;
  vertical-align: bottom;
  background: url(../../../static/imgs/company.png) no-repeat center bottom;
  background-size: 16px 17px;
  height: 20px;
  width: 17px;
  margin-right: 5px;
  flex-shrink: 0;
  margin-top: -3px;
}
.com-title {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 250px;
}
.info {
  display: flex;
  margin-top: 10px;
  overflow: hidden;
  span {
    font-size: 15px;
    font-weight: normal;
    line-height: 17px;
    min-height: 17px;
  }
  span:first-child {
    width: 150x;
    color: #7b7b7b;
  }
  span:last-child {
    padding-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.border {
  border-bottom: $border;
  padding-bottom: 12px;
}
.operating {
  // border-top: $border;
  // display: flex;

  font-size: 15px;
  @include ellipsis;
  // justify-content: flex-end;
  >span{
  // margin-bottom: -10px;
  float: right;
  margin-top: 10px;
  // margin:10px 0
  // padding-top: 10px;

  }
}
.delete {
  color: #d75252;
  padding-right: 10px;
}
.improve-info {
  color: #4b77af;
  border-left: 2px solid #4b77af;
  padding: 0 10px;
}
.improve-create {
  padding-right: 0;
}
</style>
