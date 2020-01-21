<template>
  <div id="toBeRead">
    <!-- <van-dropdown-menu id="myDropdown" :overlay='false' :close-on-click-outside="true">
      <van-dropdown-item :title="dropdownTitle" id="dropdown-left" ref="item">
        <ul slot="default" @click="dropdownListClick($event)" class="dropdownList">
          <li>下看一级</li>
          <li>下看两级</li>
        </ul>
      </van-dropdown-item>
      <van-dropdown-item :title="dropdownTitleDate" @open="()=>{show = true;}" ref="itemRight"></van-dropdown-item>
    </van-dropdown-menu> -->
    <!-- 顶部下拉框 -->
    <van-dropdown-menu style="height:60px;" class="dropdown-home">
      <van-dropdown-item v-model="state" :options="option" @change="menuChange" />
      <van-dropdown-item ref="item" :title="dropdownTitleDate" title-class="dropdown-home-dateTime">
        <van-datetime-picker
          type="year-month"
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
    <div id="main">
      <ul class="toBeReadUl" v-if="childArr.length>0">
        <li v-for=" (item,index) in childArr" :key="index" @click="rightClick($event,item.account);toClick($event)" v-show="item.workPlanCnt">
          <div class="divChild">
            <div class="toClick">
              <!-- style="font-weight:600;color:rgba(75,119,175,1);" -->
              <span class="childName" style="font-weight:600;color:rgba(75,119,175,1);">{{item.name}}</span>
              <a :href="'tel:'+ item.cellPhone" class="cellPhone">
                <van-image :src="imgPhone" ></van-image>
              </a>
              <div class="textState" v-show="item.workPlanCnt">{{item.workPlanCnt}}个待阅</div>
            </div>
            <div class="rightClick" ></div>
          </div>
        </li>
          
      </ul>
      <!--  -->
      <div class="mainNull" v-else>暂无数据</div>
    </div>
    
    <!-- 弹出日期插件 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
      <inlineCalendar @change="handelChange" :defaultDate="defaultDate"/>
    </van-popup>
  </div>
</template>

<script>
import Cookie from '@/apis/cookie';
import moment from "moment";
export default {
  name: "toBeRead",
  data() {
    return {
      homeImgUrl:require('../../../static/imgs/home.svg'),
      currentDate: new Date(),
      option: [{ text: "下看一层", value: 0 }, { text: "下看两层", value: 1 }],
      childState:false, // 是否已查询到下级的状态
      childArr:[], // 直属下级列表
      imgPhone:require("../../../static/imgs/dianhua.svg"),
      state:0, // 决定当前下看几级的状态
      show:false, // 决定日历组件显示与否
      defaultDate: new Date(), // 日历的默认日期
      year:new Date().getFullYear(), // 当前年
      month:new Date().getMonth()+1, // 当前月
    };
  },
  created() {
    document.title = '待阅计划与回顾';
  },
  mounted(){
    this.selSubordinates();
    this.selectMouthExamineWork();
  },
  methods: {
    changePick(){
      var date = this.currentDate;
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
    },
    menuChange(index){
    },
    // 修改代码 end
    toClick(e){ // 跳转审批的方法
      let target = null;
      let path = e.path || (e.composedPath && e.composedPath());
      path.some(elm =>{
        if(elm.className == 'toClick'){
          target = elm;
          return true;
        }
      })
      if(target && (target.getAttribute("toClick") == 1)){
        // did=17387&adAcount=wangxingao&planReviewStatus=2&isSuper=1&numberOfWeeks=46
        let did = target.getAttribute("did");
        let adAcount = target.getAttribute("adacount");
        let planReviewStatus = target.getAttribute("workType");
        let numberOfWeeks = target.getAttribute("weekNum");
        let thisName = target.getAttribute("name");
        let year = target.getAttribute("year");
        let query = {did,adAcount,planReviewStatus,isSuper:1,numberOfWeeks,thisName,year};
        this.$router.push({ path: "/workplanAudit", query });
      }
    },
    rightClick(e,account){ // 下拉按钮方法
      let target = null;
      let path = e.path || (e.composedPath && e.composedPath());
      path.some(elm =>{
        if(elm.className == 'divChild' || elm.className == 'divChild active'){
          target = elm;
          return true;
        }
      })
      console.log('zh99',target);
      // if(e.target.className == 'divChild' ||e.target.className == 'divChild active' ){
      if(target){
        account = target.getAttribute('account')?target.getAttribute('account'):account;
        // let parent = e.target.parentElement.parentElement;
        let parent = target.parentElement;
        let child = parent.querySelector('.toBeReadUl');
        // let name = e.target.parentElement.querySelector('.toClick>.childName').innerText;
        let name = target.querySelector('.toClick>.childName').innerText;
        console.log('name1111',name);
        console.log('child',child);
        if(child || this.childState){
          let dis = child.style.display;
          if(dis == 'none'){
            child.style.display = 'block';
            target.className = 'divChild active'
            return null;
          }else{
            child.style.display = 'none';
            target.className = 'divChild'
          }
        }else{
          target.className = 'divChild active';
          if(this.state == 0){
            this.addDom(account,parent,name);
          }else if(this.state == 1){
            if(target.getAttribute('state') == 1){
              this.addDom(account,parent,name);
            }else{
              this.addDom1(account,parent);
            }
          }
        }
      }
    },
    addDom(adAcount,parent,name){ // 单层添加dom
      this.childState = true;
      this.$getData.selectMouthExamineWork({
        method: "post",
        data:{
          adAcount,
          "wmouth": this.month,
          "wyear": this.year
        }
      }).then(res => {
        this.childState = false;
        if (res.code == 200 && res.msg == "success") {
          let ul = document.createElement("ul");
          let dataArr = res.data;
          ul.className = 'toBeReadUl';
          let iHtml = '';
          dataArr.forEach(elm => {
            console.log('ceeeee',elm.sortDate);
            console.log('ceeeee',new Date(elm.sortDate));
            console.log('ceeeee',new Date(elm.sortDate).getDay());
            console.log('ceeeee',this.fontChange(new Date(elm.sortDate).getDay()));
            console.log('date',moment(elm.sortDate).format("d"));
            console.log('date',this.fontChange(parseInt(moment(elm.sortDate).format("d"))));
            iHtml += `
              <li>
                <div class="toClick" toClick="1" did="${elm.did}" adAcount="${elm.adAcount}" weekNum="${elm.weekNum}" workType="${elm.workType}" name="${name}" year="${elm.year}">
                  <div class="childContent" style="width:100%;position:relative;">
                    ${elm.date}. ${elm.workType == 1?'周计划':'(周'+this.fontChange(parseInt(moment(elm.sortDate).format("d")))+')  日回顾'}<br/>
                    提交时间:${elm.submitDate}
                    <div class="textState" style="position:absolute;top:0;right:0;">待阅</div>
                  </div>
                </div>
              </li>
            `;
          });
          ul.innerHTML = iHtml;
          parent.appendChild(ul);
        }
      }).catch(err =>{
        this.childState = false;
      });
    },
    addDom1(name,parent){ // 两层添加dom
      let examineWorkCntReq = {
        "wmouth": this.month,
        "wyear": this.year,
        "type":1
      };
      this.childState = true;
      this.$getData.selSubordinates({
        method: "post",
        data: { name,examineWorkCntReq }
      }).then(res => {
        this.childState = false;
        if(res.code == 200 && res.msg == 'success'){
          let arr = res.data;

          let ul = document.createElement("ul");
          let dataArr = res.data;
          ul.className = 'toBeReadUl';
          let iHtml = '';
          dataArr.forEach(elm => {
            if(elm.workPlanCnt){
              iHtml += `
                <li>
                  <div class="divChild" account="${elm.account}" state="1">
                    <div class="toClick" >
                      <span class="childName">${elm.name}</span>
                      <a href="tel:${elm.cellPhone}" class="cellPhone">
                        <img class="van-image" src="${this.imgPhone}"></img>
                      </a>
              `
              if(elm.workPlanCnt){
                iHtml += ` <div class="textState">${elm.workPlanCnt}个待阅</div> `;
              }
              iHtml +=`
                    </div>
                    <div class="rightClick"  ></div>
                  </div>

                </li>
              `;
            }

          });
          ul.innerHTML = iHtml;
          parent.appendChild(ul);
        }
      }).catch(err => {
        this.childState = false;
      });
    },
    selectMouthExamineWork(name){ // 工作简报 查询用户某年月的待阅详情
      let data = {
        "adAcount": name,
        "wmouth": this.month,
        "wyear": this.year
      }
      this.$getData.selectMouthExamineWork({
        method: "post",
        data
      }).then(res => {
      });
    },
    selSubordinates(name) { // 查询下级
      // name = name?name:Cookie.cookie.get('accountName');
      let examineWorkCntReq = {
        "wmouth": this.month,
        "wyear": this.year,
        "type":this.state + 1
      };
      this.childArr = [];
      this.$getData.selSubordinates({
        method: "post",
        data: { name,examineWorkCntReq }
      })
      .then(res => {
        if(res.code == 200 && res.msg == 'success'){
          this.childArr = res.data.filter(item => item.workPlanCnt);
          console.log('this.childArr',this.childArr);
        }
      });
    },
    dropdownListClick(e){ // 显示几级下拉选择框 标题
      this.$refs.item.toggle();
      switch(e.target.innerText){
        case '下看一级':
          this.state = 0;
          break;
        case '下看两级':
          this.state = 1;
          break;
      }
    },
    fontChange(i){ // 周序号显示处理
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
    handelChange(date){ // 日期组件选择日期后的处理方法
      this.year = date.$y;
      this.month = date.$M + 1;
      this.show = false;
      this.$refs.itemRight.toggle();
    },
    
  },
  computed:{
    dropdownTitleDate:function(){ // 展示年月标题
      return `${this.year}年${this.month}月`;
    },
    dropdownTitle:function(){ // 下拉选择框标题
      if(this.state == 0){
        return '下看一级';
      }else if(this.state == 1){
        return '下看两级';
      }
    },
  },
  watch:{

    dropdownTitleDate:function(){
      this.selSubordinates();
    },
    state:function(val){
      this.selSubordinates();
    }
  }
};
</script>
<style scoped lang='scss'>
@import "../../assets/sass/workBench";
html,body{
  height: 100%;
}
.dropdownList{ // 顶部下拉选择列表样式
  &>li{
    padding-left: 7px;height: 30px;font-size:15px;font-weight:bold;color:rgba(0,122,255,1);line-height: 30px;
  }
}
#main{
  padding:0 21px 0 15px;background:#fff;position: absolute;top: 61px;left: 0;right: 0;bottom: 0;overflow-y: scroll;
  .mainNull{
    text-align: center;
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ebedf0;
  }
}
#toBeRead{
  background: #ececec;position: absolute;top: 0;left: 0;right: 0;bottom: 0;
}
#myDropdown{
  &>div.van-dropdown-menu__item{ // 下拉菜单按钮样式
    padding-left: 27px;background: red;
  }
  margin-bottom: 10px;box-shadow:0px 2px 4px 0px rgba(75,119,175,0.1);height:60px;
  #dropdown-left.van-dropdown-item.van-dropdown-item--down{
    width: 85px;box-shadow:0px 0px 6px 1px rgba(0,122,255,0.12);height: 60px;left: 19px;
  }
}

// box-shadow:0px 2px 4px 0px rgba(181,181,181,1);
</style>
<style lang="scss">
.toBeReadUl{
  // border-top:2px solid #f4f4f4;
  li{ $liH:60px;border-bottom:2px solid #f4f4f4;min-height: $liH; position: relative;
    .divChild{ height: $liH; }
    .toClick{ padding-left: 8px;
      position: absolute;top:0;left:0;right:60px;
      display:flex;align-items:center;
      height: $liH;
      .van-image{
        // position: absolute;
        // left: 78px;
      }
      .cellPhone{
        height: 20px;
        position: absolute;
        left: 78px;
      }
      .childContent{
        font-size:13px;
        font-weight:500;
        color:rgba(21,21,21,1);
        line-height:18px;
      }
      .childName{
        font-size: 17px;line-height: 60px;margin-right: 19px;
        // font-weight:500;
        color: #333;
        // color:rgba(72,72,72,1);
      }
      .textState{
        position: absolute;
        right: 0;
        text-align: right;
        font-size:13px;
        font-weight:500;
        color:rgba(215,82,82,1);
      }
    }
    .rightClick{
      float: right;width: 60px;height: $liH;background: url(../../../static/imgs/unfold.svg) no-repeat center center;
      &.active{
        background: url(../../../static/imgs/fold.svg) no-repeat center center;
      }
    }
  }
}

#myDropdown{
  &>div.van-dropdown-menu__item{ // 下拉菜单按钮样式
    &:nth-of-type(1){ padding-left: 27px;justify-content: flex-start;
      &>span.van-dropdown-menu__title{padding-left: 0;}
    }
    &:nth-of-type(2){ padding-right: 17px;justify-content: flex-end;
      &>span.van-dropdown-menu__title{padding-right: 15px;}
      &>span.van-dropdown-menu__title::after{ right: 0; }
    }
    box-sizing: border-box;font-size:15px;font-weight:bold;
    &>span.van-dropdown-menu__title{color:rgba(0,122,255,1);}
  }
}
</style>
