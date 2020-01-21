<template>
  <ul class="cardList">
    <li v-for="(item,index) in reCardListProps" :key="index">
      <label for class="fl">{{item.label}}：<i></i></label>
      <!-- <div class="content fl" :style="{color:item.color}">{{item.content}}</div> -->
      <div class="content fl" :style="{color:item.color}">{{item.content}}</div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    cardListProps: {
      type: Object
    },
    isOneSelf: {
      type: Boolean
    },
    comfirmType: {
      type: String
    },
    message: {
      type: Object
    },
    status: {
      type: Object
    }
  },
  data() {
    return {};
  },

  computed: {
    reCardListProps() {
      let aim;
      const that = this;
      const { tag, list } = this.cardListProps;
      if ((this.isOneSelf === false && this.comfirmType === "UNCONFIRMED")) {
        aim = [];
        list.map((item, index) => {
          if (item.key === "comfirmTimeToStr") {
            item.content = "- -：- -：- -";
          } else if (item.key === "currentOpinion") {
            item.content = "暂无意见";
          } else if (item.key === "checkinStatus") {
            item.content = "待确认";
            item.color = "#D75252";
          } else {
            item.content = that.message[item.key];
          }
          aim.push(item);
        });
      } else if(tag==='finalOption1'){
        aim=[]
         list.map((item, index) => {
          if (item.key === "replyTimeToStr") {
            item.content = "- -：- -：- -";
          } else if (item.key === "finalOpinion") {
            item.content = "暂无意见";
          } else if (item.key === "checkinStatus") {
            item.content = "待确认";
            item.color = "#D75252";
          } else {
            item.content = that.message[item.key];
          }
          aim.push(item);
        });
      }else {
        aim = [];
        list.map((item, index) => {
          if (item.key === "checkinStatus") {
            const {
              abnormalCheckinStatus,
              checkinStatus
            } = that.message;
             if (tag === "leaderOption") {
               item.content=that.status[abnormalCheckinStatus]||that.status[that.message[item.key]]
             }else{
               item.content =that.status[that.message[item.key]];
             }
            // if (tag === "leaderOption" && checkinStatus != "NORMAL"&& checkinStatus != "VACATION") {
            //   item.content =that.status[abnormalCheckinStatus];
            // } else {
            //   item.content =that.status[that.message[item.key]];
            // }
          } else {
            item.content = that.message[item.key];
          }
          aim.push(item);
        });
      }
      return aim;
    }
  }
};
</script>

<style lang="scss" scoped>
.cardList {
  padding-bottom: 20px;
  li {
    @include clear;
    font-size: 15px;
    line-height: 18px;
    font-weight: 400;
    color: #484848;
    margin-bottom: 10px;
    padding: 0 20px;

    label{
      text-align: justify;
      width:80px;
        height: 20px;
    overflow: hidden;
      i{
        display: inline-block;
        width:100%;
      }
    }
    .content{
      width:250px;
      word-break: break-all;
      text-align: justify;
    }
  }
}
</style>
