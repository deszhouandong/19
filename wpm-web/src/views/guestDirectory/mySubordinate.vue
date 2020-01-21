<template>
  <div class="mySubordinate" id="mySubordinate">

    <!-- 顶部下拉框 -->
    <van-dropdown-menu class="dropdown-home">
      <van-dropdown-item disabled title="我的下属" />

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
        <img :src="homeImgUrl" alt />
      </a>
    </van-dropdown-menu>
    <!-- 中间内容 -->
    <div>
      <van-loading style="text-align:center;color:#666" v-if="initLoading1" color="#666">加载中...</van-loading>
      <div class="collapse-wrap" v-else>
        <div
          v-if="colleagueCircleRespList&&colleagueCircleRespList.length == 0||!colleagueCircleRespList"
          class="noData"
        >暂无数据</div>
        <div v-else>
          <ul class="collapseUl">
            <li
              v-for="(item,index) in colleagueCircleRespList"
              :key="index"
              @click.stop="selSubordinatesR($event);lookSubordinate($event);"
            >
              <div class="divLi">
                <!-- item,1,item.workPlanStatusCode -->
                <div
                  class="divClick"
                  :data-isSuper="1"
                  :data-did="item.did"
                  :data-code="item.workPlanStatusCode"
                  :data-adAcount="item.account"
                  :data-name="item.name"
                >
                  <div class="divImg">
                    <van-image round :src="item.avatar" :width="30" :height="30">
                      <template v-slot:loading>
                        <div v-for="(image,index) in imgArr" :key="index">
                          <img :src="image" style="background:#fff;" />
                        </div>
                      </template>
                      <template v-slot:error>
                        <div v-for="(image,index) in imgArr" :key="index">
                          <img :src="image" style="background:#fff;" />
                        </div>
                      </template>
                    </van-image>
                  </div>
                  <div class="divName">{{item.name}}</div>
                  <div class="last">{{item.workPlanStatus}}</div>
                </div>
                <div class="icon" v-if="item.isExistsStaff == 0" :data-name="item.account"></div>
                <!-- <img :src="imgSrcJ"/> -->
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initLoading1: false,
      colleagueCircleRespList: [],
      dateTime:
        new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月",
      currentDate: new Date(),
      homeImgUrl:require('../../../static/imgs/home.svg'),
      imgArr: [require("../../../static/imgs/fill.png")],
    };
  },
  methods: {
    // 初始化数据
    getInitial() {
      this.initLoading1 = true;
      this.$getData
        .selColleagueCircle({
          method: "post",
          data: {}
        })
        .then(res => {
          if (res.code == 200) {
            this.initLoading1 = false;
            const { colleagueCircleRespList = [] } = res.data;
            this.colleagueCircleRespList = colleagueCircleRespList;
          }
        })
        .catch(error => {
          this.initLoading1 = false;
        });
    },
    selSubordinatesR(e) {
      // 递归查询下级
      if (e.target.className == "icon" || e.target.className == "icon active") {
        let parent = e.target.parentElement.parentElement;
        let child = parent.querySelector(".collapseUl");
        if (child) {
          let dis = child.style.display;
          if (dis == "none") {
            child.style.display = "block";
            e.target.className = "icon active";
            return null;
          } else {
            child.style.display = "none";
            e.target.className = "icon";
          }
        } else {
          let name = e.target.dataset.name;
          e.target.className = "icon active";
          //取消事件相关的默认行为
          // if(e.preventDefault)    //标准技术
          //     e.preventDefault();
          // if(e.returnValue)    //兼容IE9之前的IE
          //     e.returnValue=false;
          // return false;    //用于处理使用对象属性注册的处理程序
          this.$getData
            .selSubordinates({
              method: "post",
              data: { name }
            })
            .then(res => {
              if (res.code == 200 && res.msg == "success") {
                // let ul = document.createElement("<div>dfsaas</div>");
                let ul = document.createElement("ul");
                let dataArr = res.data;
                ul.className = "collapseUl";
                let iHtml = "";
                dataArr.forEach(elm => {
                  iHtml += `
                  <li>
                    <div class="divLi">
                      <div class="divClick" :data-did="${elm.id}" :data-code="${
                    elm.workPlanStatusCode
                  }" :data-adAcount="${elm.account}" :data-name="${elm.name}" >
                        <div class="divImg">
                          <img src="${
                            elm.avatar ? elm.avatar : this.imgSrc
                          }" style="border-radius: 50%;"/>
                        </div>
                        <div class="divName">${elm.name}</div>
                      </div>
                `;
                  if (elm.isExistsStaff == 0) {
                    iHtml += `<div class="icon" data-name="${elm.account}"></div>`;
                  }
                  iHtml += `</div></li>`;
                });
                // this.selSubordinatesR(${elm})
                // (()=>{this.selSubordinatesR(${elm})})()
                // let ul = "<div>dfsaas</div>";

                ul.innerHTML = iHtml;
                parent.appendChild(ul);
              }
            });
        }
      }
    },
    lookSubordinate(e) {
      // 下级 路由跳转`
      console.log("下级跳转eee path", e.path);
      console.log("下级跳转eee", e);
      let target = null;
      let path = e.path || (e.composedPath && e.composedPath());
      console.log("event.composedPath", event.composedPath);
      console.log("event.composedPath()", event.composedPath());
      if (path && path.length > 0) {
        path.some(el => {
          if (el.className == "divClick") {
            target = el;
            return 0;
          }
        });
      }
      if (target) {
        let did = target.dataset.did
          ? target.dataset.did
          : target.getAttribute(":data-did");
        let adAcount = target.dataset.adacount
          ? target.dataset.adacount
          : target.getAttribute(":data-adacount");
        let code = target.dataset.code
          ? target.dataset.code
          : target.getAttribute(":data-code");
        let thisName = target.dataset.name
          ? target.dataset.name
          : target.getAttribute(":data-name");
        let isSuper = target.dataset.issuper;
        let query = { did, adAcount, planReviewStatus: 1, isSuper, thisName };
        if (code == 1 || code == 2) {
          query.numberOfWeeks = this.numberOfWeeks + 1;
          query.planReviewStatus = 1;
        }
        if (code == 3 || code == 4) {
          if (code == 3) {
            query.did = null;
          }
          query.numberOfWeeks = this.numberOfWeeks;
          query.planReviewStatus = 2;
        }
        if (code == 5 || code == 6) {
          query.numberOfWeeks = this.numberOfWeeks;
          query.planReviewStatus = 1;
        }
        // query.numberOfWeeks = item.numberOfWeeks?item.numberOfWeeks:this.numberOfWeeks;
        this.$router.push({ path: "/workplanAudit", query });
      }
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
    }
  },
  created() {
    document.title = "下属访客记录";
    this.getInitial();
  }
};
</script>
<style lang="scss" scoped>
  .toHome{
    float: right;
    margin-top:10px;
    padding:5px 17px;
  }
</style>

<style lang="scss">
#mySubordinate .collapseUl {
  padding-left: 17px;
  overflow: scroll;
  border-top: 1px solid #ebedf0;
  border-left: 1px solid #ebedf0;
  li {
    $liH: 60px;
    // height: $liH;
    min-height: $liH;
    border-bottom: 1px solid #ebedf0;
    text-align: left;
    font-size: 17px;

    div.divLi {
      height: $liH;
      border-bottom: 1px solid #ebedf0;
      position: relative;
      &::before {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
      }
      & > div {
        line-height: $liH;
        color: #000000;
        letter-spacing: -0.32px;
      }
      div.divClick {
        height: 100%;
        float: left;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 40px;
      }
      div.divImg {
        $w: 30px;
        float: left;
        width: $w;
        line-height: $liH;
        text-align: center;
        display: flex;
        align-items: center;
        height: $liH;

        img {
          width: 100%;
          height: $w;
          margin: 0 auto;
          // display: inline-block;
          vertical-align: middle;
        }
      }
      div.divName {
        font-size: 15px;
        margin-left: 12px;
        float: left;
      }
      div.icon {
        height: 100%;
        float: right;
        width: 40px;
        text-align: center;
        z-index: 10;
        // background-position:50% 50% ;
        // background-repeat:no-repeat ;
        // background-image:url(../../static/imgs/unfold.svg);
        background: url(../../../static/imgs/unfold.svg) no-repeat center center;
        &.active {
          background: url(../../../static/imgs/fold.svg) no-repeat center center;
        }
      }
      div.last {
        position: absolute;
        right: 0;
        // padding-right: 53px;
        padding-left: 138px;
        font-size: 15px;
        font-weight: 500;
        color: rgba(215, 82, 82, 1);
      }

      div.but_attention {
        float: right;
        padding-right: 23px;
        display: flex;
        align-items: center;
        height: $liH;
        button {
          border: 1px solid #4b77af;
          height: 28px;
          line-height: 28px;
          float: right;
          border-radius: 12px;
          color: #4b77af;
          background: #fff;
          width: 60px;
          padding: 0;
          text-align: center;
          // vertical-align: middle;
        }
      }
      div.but_attention_ready {
        float: right;
        padding-right: 36px;
        height: $liH;
        line-height: $liH;
        font-size: 17px;
        color: rgba(75, 119, 175, 0.3);
        letter-spacing: -0.32px;
        text-align: right;
      }
    }
  }
}
</style>
