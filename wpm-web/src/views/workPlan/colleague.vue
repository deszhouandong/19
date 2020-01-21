<template>
  <div class="workplan">
    <div id="colleague" :style="viewShow == 'colleague'?'':'display:none'">
      <div id="search">
        <!-- <input type="text" name="" id="" placeholder="搜索" :class="focus?'focus':''"
          @input="inputChange" v-model="searchText"
        />-->
        <van-search
          v-model="searchText"
          background="#4B77AF"
          style="height:60px;box-sizing:border-box;"
          placeholder="搜索"
          shape="round"
          @input="inputChange"
          @focus="searchFocus($event)"
          @blur="searchBlur($event)"
          @cancel="() => { this.searchText = '' }"
          right-icon
        >
          <div slot="left-icon" style="display:flex;align-items:center;height:100%;">
            <van-icon name="search" />
          </div>
        </van-search>
      </div>

      <div v-if="!focus" class="main">
        <van-collapse v-model="activeNames" class="myCollapse">
          <van-collapse-item name="1" size="60px">
            <div slot="title" class="collapseTitle">我的下级</div>
            <ul class="collapseUl">
              <li
                v-for="(item,index) in colleagueCircleRespList"
                :key="index" @click.stop="selSubordinatesR($event);lookSubordinate($event);"
              >
                <div class="divLi">
                  <!-- item,1,item.workPlanStatusCode -->
                  <div class="divClick" :data-isSuper="1" :data-did="item.did" :data-code="item.workPlanStatusCode" :data-adAcount="item.account" :data-name="item.name">
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
                    <div class="visitNumber" v-if="item.visitNumber>0" @click.stop="toVisitorlist(item)">{{item.visitNumber}}次拜访</div>
                  </div>
                  <div class="icon" v-if="item.isExistsStaff == 0" :data-name="item.account"></div>
                  <!-- <img :src="imgSrcJ"/> -->
                </div>

              </li>
            </ul>
          </van-collapse-item>
          <van-collapse-item name="2" size="60px">
            <div slot="title" class="collapseTitle">我的直属上级</div>
            <ul class="collapseUl">
              <li @click="superTo">
                <div class="divLi">
                  <div class="divImg">
                    <van-image :src="avatar" round :width="30" :height="30">
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
                  <div class="divName">
                    <span>{{superiorName}}</span>
                  </div>
                </div>

              </li>
            </ul>
          </van-collapse-item>
          <van-collapse-item name="3" size="60px">
            <div slot="title" class="collapseTitle">我关注的同事</div>
            <van-collapse :accordion="true" @change="collapseChange" v-model="collapseActive">
              <!-- 滑块开始组建 -->
              <van-swipe-cell
                v-for="(item,index) in concernList"
                :key="index"
                :disabled="collapseActive == (index+1)"
              >
                <!-- collapseChangeState -->
                <!-- collapseActive == (index+1) -->
                <template slot="default">
                  <van-collapse-item :name="index+1">
                    <template slot="title">
                      <!--  -->
                      <div
                        style="display:flex;align-items:center;height:100%;width:80%;"
                        @click.stop="concernToReady(item.cadAcount,item.cname)"
                      >
                        <van-image
                          :src="item.avatar"
                          round
                          :width="30"
                          :height="30"
                          style="margin-right:10px;"
                        >
                          <template v-slot:loading>
                            <!-- <div v-for="(image,index) in imgArr" :key="index">
                              <img :src="image" style="background:#fff;" />
                            </div> -->
                              <img :src="imgSrc" style="background:#fff;" />
                          </template>
                          <template v-slot:error>imgArr
                            <!-- <div v-for="(image,index) in " :key="index">
                              <img :src="image" style="background:#fff;" />
                            </div> -->
                              <img :src="imgSrc" style="background:#fff;" />
                          </template>
                        </van-image>
                        <span style="font-size:15px;">{{item.cname}}</span>
                      </div>
                    </template>
                    <ul class="collapseUl" style="border:none;" v-if="concernSubordinateList.length>0">
                      <li v-for="(it,ii) in concernSubordinateList"
                        :key="ii"
                        @click="concernToReady(it.account,it.name)"
                        style="padding-left:15px;"
                      >
                        <div class="divLi">
                          <div class="divImg">
                            <van-image :src="it.avatar" round :width="30" :height="30">
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
                          <div class="divName">{{it.name}}</div>
                        </div>
                      </li>
                    </ul>
                  </van-collapse-item>
                </template>
                <template slot="right">
                  <van-button
                    square
                    @click="cancelConcern(item)"
                    type="danger"
                    text="取消关注"
                    style="height:100%;padding:1px;margin:1px;"
                  />
                </template>
              </van-swipe-cell>
            </van-collapse>
          </van-collapse-item>
        </van-collapse>
      </div>
      <div v-if="focus" class="main">
        <ul class="collapseUl">
          <van-loading
            size="24px"
            vertical
            v-if="searchLogin"
            style="position:fixed;top:0;bottom:0;left:0;right:0;width:30%;height:20%;margin:auto;"
          >加载中...</van-loading>
          <li
            v-for="(item,index) in colleagueSearchList"
            :key="index"
            @click="item.seeWorkPlan == 1?concernTo(item):myNotify('无权限');"
          >
            <div class="divLi">
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
              <div class="divName">
                <span>{{item.name}}</span>
              </div>
              <div class="but_attention" v-if="item.isConcern == 2">
                <button @click.stop="addConcern(item,2)" :disabled="!subDisabled">关注</button>
              </div>
              <div class="but_attention_ready" v-if="item.isConcern == 1">
                <span>已关注</span>
              </div>
            </div>

          </li>
        </ul>
      </div>
    </div>
    <FootMenu/>
  </div>
</template>

<script>
import axios from "axios";
import { CellGroup } from "vant";
import { Toast } from "vant";
import Cookie from '@/apis/cookie';

import FootMenu from '@/component/global/FootMenu.vue';// 引入底部组件
export default {
  name: "workplan",
  data() {
    return {
      collapseChangeState:'',
      searchStyle: "height:60px;",
      imgArr: [require("../../../static/imgs/fill.png")],
      imgSrc:require("../../../static/imgs/fill.png"),
      imgSrcJ:require("../../../static/imgs/unfold.svg"),
      searchLogin: false, // 加载状态
      searchID: 0, // 请求的ID 确定当前请求的唯一性
      // 同事圈 start
      collapseActive: -1, // 关注的同事下级状态
      colleagueCircleRespList: [], // 当前用户的下级
      superiorName: "", // 当前用户的上级
      superId: "", // 当前用户上级的id
      superAccount: "", //当前用户上级的account
      colleagueSearchList: [], // 搜索获得的数据
      concernList: [], // 关注的同事列表
      concernSubordinateList: [], // 关注的同事的下级列表
      avatar: "", // 上级的头像
      // 同事圈 end

      active: 1,
      viewShow: "colleague", //顶部导航切换状态
      // review 界面的数据
      selected: "",
      year: null,
      startDate: null,
      endDate: null,
      // 弹出日期选择框的状态
      show: false,
      calendarShow: false,
      defaultDate: new Date(),
      newDate: new Date(), // 当前最新的

      h3Active: 1, // 标题“工作计划”被选中的状态
      subDisabled: true, //提交按钮是否可提交

      wid: null,
      did: null,
      wstatus: 1, // 计划状态
      dstatus: null, //回顾状态
      wplanVerifiedOpinion1: "", // 管理者 计划意见1
      dreviewVerifiedOpinion1: "", // 管理者 回顾意见1
      wverifiedUserName1: "", // 管理者1

      // #search 搜索块数据
      focus: false,
      searchText: "",
      // colleague界面的数据
      activeNames: ["1"]
    };
  },
  created() {
    this.dateFormat();
    this.createDate();
    this.getWeekOfYear();
    document.title = "同事圈";
  },
  mounted() {
    // this.selOneWeekPlan();
    this.selColleagueCircle();
    this.selConcernList();
  },
  components:{ FootMenu },
  methods: {
    toVisitorlist(item) { // 跳转到访客记录界面
      var getXDate = this.getXDate;
      console.log("wsss",this.numberOfWeeks);
      var query = {
        startTime: this.startDate,
        endTime: this.endDate,
        adAcount:item.account,
        name:item.name,
        modelType: 20
      };
      this.$router.push({ path: "/visitorlist", query });
    },
    listNextVisitorCount(adAcounts,arr){ // 获取下级人员的访客数
      return new Promise((resolve)=>{
        this.$getData.listNextVisitorCount({
          method:'post',
          data:{
            adAcounts
          }
        }).then(res=>{
          if(res.code == 200){
            for(let ad in res.data){
              arr.map((item,index)=>{
                if(item.account == ad){
                  arr[index].visitNumber = res.data[ad];
                }
              })
            }
            this.$forceUpdate();
            resolve();
          }

        })
      })
    },
    selSubordinatesR(e) { // 递归查询下级
      if(e.target.className == 'icon' ||e.target.className == 'icon active' ){
        let parent = e.target.parentElement.parentElement;
        let child = parent.querySelector('.collapseUl');
        if(child){
          let dis = child.style.display;
          if(dis == 'none'){
            child.style.display = 'block';
            e.target.className = 'icon active'
            return null;
          }else{
            child.style.display = 'none';
            e.target.className = 'icon'
          }
        }else{
          let name = e.target.dataset.name;
          e.target.className = 'icon active';
          //取消事件相关的默认行为
          // if(e.preventDefault)    //标准技术
          //     e.preventDefault();
          // if(e.returnValue)    //兼容IE9之前的IE
          //     e.returnValue=false;
          // return false;    //用于处理使用对象属性注册的处理程序
          this.$getData.selSubordinates({
            method: "post",
            data: { name }
          }).then(res => {
            if (res.code == 200 && res.msg == "success") {
              // let ul = document.createElement("<div>dfsaas</div>");
              let ul = document.createElement("ul");
              let dataArr = res.data;
              this.listNextVisitorCount(dataArr.map(item=>item.account),dataArr).then(()=>{
                ul.className = 'collapseUl';
                let iHtml = '';
                dataArr.forEach(elm => {
                  iHtml += `
                    <li>
                      <div class="divLi">
                        <div class="divClick" :data-did="${elm.id}" :data-code="${elm.workPlanStatusCode}" :data-adAcount="${elm.account}" :data-name="${elm.name}" >
                          <div class="divImg">
                            <img src="${elm.avatar?elm.avatar:this.imgSrc}" style="border-radius: 50%;"/>
                          </div>
                          <div class="divName">${elm.name}</div>
                  `;
                  if(elm.visitNumber>0){
                    // ${this.toVisitorlist(elm.account)}
                    iHtml += `<div class="visitNumber" :data-adAcount="${elm.account}" :data-name="${elm.name}">${elm.visitNumber}次拜访</div>`
                  }
                  iHtml += `</div>`;
                  if(elm.isExistsStaff == 0){
                    iHtml += `<div class="icon" data-name="${elm.account}"></div>`
                  }
                  iHtml += `</div></li>`;
                });
                // this.selSubordinatesR(${elm})
                // (()=>{this.selSubordinatesR(${elm})})()
                // let ul = "<div>dfsaas</div>";
  
  
                ul.innerHTML = iHtml;
                parent.appendChild(ul);
              })
              
            }
          });
        }
      }
    },
    searchFocus(e) {
      e.target.style = "height:30px;";
    },
    searchBlur(e) {
      e.target.style = "";
    },
    // 同事圈 start
    concernReadyJuniorTo(item) { // 已关注同事的下级的跳转
      let query = {
        adAcount: item.account,
        planReviewStatus: 1,
        thisName: item.cname
      };
      query.numberOfWeeks = this.numberOfWeeks;
      this.$router.push({ path: "/workplanAudit", query });
    },
    superTo() { // 上级跳转
      let query = {
        adAcount: this.superAccount,
        planReviewStatus: 1,
        thisName:this.superiorName
      };
      query.numberOfWeeks = this.numberOfWeeks;

      this.$router.push({ path: "/workplanAudit", query });
    },
    concernToReady(adAcount,name) {   // 已关注跳转
      let query = {
        adAcount,
        planReviewStatus: 1,
        thisName:name
      };
      query.numberOfWeeks = this.numberOfWeeks;
      this.$router.push({ path: "/workplanAudit", query });
    },
    concernTo(item, isSuper) {   // 关注跳转
      // adAccount: "yuguang"
      // id: 4
      // isConcern: "2"
      // name: "虞光"
      // seeWorkPlan: "1"
      let query = {
        did: item.did,
        adAcount: item.adAccount,
        planReviewStatus: 1,
        isSuper,
        thisName:item.name,
      };
      query.numberOfWeeks = this.numberOfWeeks;

      this.$router.push({ path: "/workplanAudit", query });
    },
    concernToNull(){

    },
    lookSubordinate(e) {      // 下级 路由跳转`
      let target = null;
      let path = e.path || (e.composedPath && e.composedPath());
      if(path && path.length>0){
        path.some(el =>{
          if(el.className == 'visitNumber'){
            target = el;
            return true;
          }else if(el.className == 'divClick'){
              target = el;
              return true;
          }
        })
      }
      if(target && target.className == 'visitNumber'){
        let account = target.dataset.adacount?target.dataset.adacount:target.getAttribute(":data-adacount");
        let name = target.dataset.name?target.dataset.name:target.getAttribute(":data-name");
        this.toVisitorlist({account,name});0
        return;
      }
      // if(target.className == 'visitNumber'){
      // }
      if(target){
        let did = target.dataset.did?target.dataset.did:target.getAttribute(":data-did");
        let adAcount = target.dataset.adacount?target.dataset.adacount:target.getAttribute(":data-adacount");
        let code = target.dataset.code?target.dataset.code:target.getAttribute(":data-code");
        let thisName = target.dataset.name?target.dataset.name:target.getAttribute(":data-name");
        let isSuper = target.dataset.issuper;
        let query = { did,adAcount,planReviewStatus: 1,isSuper,thisName };
        if (code == 1 || code == 2) {
          query.numberOfWeeks = this.numberOfWeeks + 1;
          query.planReviewStatus = 1;
        }
        if (code == 3 || code == 4) {
          if(code == 3){
            query.did = null
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

    collapseChange(i) { // 查询已关注下级
      this.collapseChangeState = i;
      if (i) {
        this.selSubordinates(this.concernList[i - 1].cadAcount);
      }
    },
    cancelConcern(item) { // 取消关注
      this.$getData
        .cancelConcern({
          method: "post",
          data: {
            cadAcount: item.cadAcount
          }
        })
        .then(res => {
          if (res.msg == "success" && res.code == 200) {
            this.selConcernList();
          }
        });
    },
    selConcernList() { // 获取关注的同事列表
      this.$getData.selConcernList({
        method: "post",
        data: {}
      }).then(res => {
        this.subDisabled = true;
        if (res.msg == "success" && res.code == 200) {
          this.concernList = res.data;
        }
      }).catch(error => {
      });
    },
    addConcern(item) {  // 添加关注
      this.subDisabled = false;
      this.$getData.addConcern({
          method: "post",
          data: {
            cadAcount: item.adAccount
          }
      }).then(res => {
        this.subDisabled = true;
        if (res.msg == "success" && res.code == 200) {
          item.isConcern = "1";
          this.selConcernList();
        }
      }).catch(error => {
        this.subDisabled = true;
      });
    },

    selSubordinates(name) { // 查询下级
      this.concernSubordinateList = "";
      let id = this.searchID;
      this.searchID += 1;
      this.$getData.selSubordinates({
          method: "post",
          data: { name }
      }).then(res => {
        if (res.code == 200 && res.msg == "success") {
          if (id == this.searchID - 1) {
            this.concernSubordinateList = res.data.length>0?res.data:[];
          }
        }
      });
    },
    inputChange() {  // 搜索框事件
      if (this.searchText.length == 0) {
        this.focus = false;
      } else {
        this.focus = true;
        this.colleagueSearchList = [];
        this.selPersonByFuzzyName();
      }
      // setTimeout()
    },
    selColleagueCircle() { // 查询同事圈数据 selColleagueCircle
      this.$getData.selColleagueCircle({
        method: "post",
        data: {}
      }).then(res => {
        if (res.code == 200 && res.msg == "success") {
          let data = res.data;
          this.superiorName = data.name;
          this.superId = data.id;
          this.superAccount = data.account;
          Cookie.cookie.set('superAccount',data.account);
          this.avatar = data.avatar;
          this.colleagueCircleRespList = data.colleagueCircleRespList;
        }
      });
    },
    selPersonByFuzzyName() { // 查询同事
      let id = this.searchID;
      this.searchID += 1;
      this.searchLogin = true;
      this.$getData.selPersonByFuzzyName({
        method: "post",
        data: {
          name: this.searchText
        }
      }).then(res => {
        if (res.code == 200 && res.msg == "success") {
          this.searchLogin = false;
          if (id == this.searchID - 1) {
            this.colleagueSearchList = res.data;
            if (!this.colleagueSearchList.length) {
              // Toast.fail('未找到该同事');
              this.myNotify("未找到该同事");
            }
          }
        }
      });
    },
    // 同事圈 end

    // 接口方法 start
    myNotify(str) {
      // 提示框方法
      this.$notify({
        message: str,
        color: "#000",
        background: "rgb(0,0,0,0.2)",
        duration: 2000,
        className: "myNotify"
      });
    },

    // 接口方法 end

    handelChange(date) {
      this.getWeekOfYear(date.$d);
      this.year = date.$y;
    },
    dateFormat() {
      // date格式处理函数
      Date.prototype.format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return fmt;
      };
    },
    optionDate() {
      // 控制日期弹出组件的状态
      this.show = true;
      this.calendarShow = true;
    },
    createDate() {
      var date = new Date();
      this.year = date.getFullYear();
    },
    getWeekOfYear(date){ // 返回当前是第几周 需使用禁止删除该方法
      var today;
      if(date){
        today = date;
      }else{
        today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
      }

      var year = today.getFullYear(); //获取选中的当前年
      var firstDay = new Date(year,0, 1);
      var dayOfWeek = firstDay.getDay();  //返回表示星期几的数字 0~6
      var spendDay= 1;
      if (dayOfWeek !=1 && dayOfWeek != 0) {
        spendDay=7-dayOfWeek+1+1;
      }else if(dayOfWeek == 0){
        spendDay = 2;
      }
      firstDay = new Date(year,0, spendDay);
      // firstDay = new Date(today.getFullYear(),0, 1+spendDay);
      var d =Math.ceil((today.valueOf()- firstDay.valueOf())/ 86400000);  // 计算时间差 向上取整
      var result;
      if(d == 0){
        result = 1;
      }else if(d < 0){
        result = -1;
        var _week;
        year--;
        var date = new Date(year, "0", "1");
        _week = date.getDay();
        if (_week != 1) {
          // 一年53周的情况
          result = 52; // 应该为53周 2018 1
        } else {
          //一年54周情况
          result = 53; // 52
        }
      } else if (d % 7 == 0) {
        result = Math.ceil(d / 7) + 1;
      } else {
        result = (Math.ceil(d/7) == 0) ? 1 : Math.ceil(d/7);
        // result = Math.ceil(d/7) + 1;
      }
      this.year = year;
      this.numberOfWeeks = result;
      return result;
    },
    submit() { // 工作计划提交按钮事件接口
    }
  },
  computed: {
    getXDate: function() {
      // 根据周数获取当前周的日期范围
      var _week;
      if (this.numberOfWeeks < 1) {
        this.year--;
        var date = new Date(this.year, "0", "1");
        var time = date.getTime();
        _week = date.getDay();
        if (_week != 0) {
          // 一年53周的情况
          this.numberOfWeeks = 52;
        } else {
          //一年54周情况
          this.numberOfWeeks = 53;
        }
      } else {
        var date = new Date(this.year, "0", "1");
        var time = date.getTime();
        _week = date.getDay();
        if (_week != 0) {
          // 一年52周的情况
          if (this.numberOfWeeks > 52) {
            this.year++;
            var date = new Date(this.year, "0", "1");
            var time = date.getTime();
            _week = date.getDay();
          }
        } else {
          //一年54周情况
          if (this.numberOfWeeks > 53) {
            this.year++;
            var date = new Date(this.year, "0", "1");
            var time = date.getTime();
            _week = date.getDay();
          }
        }
      }

      // 当这一年的1月1日为周日时则本年有54周，否则没有54周，没有则去除第54周的提示
      var cnt = 0; // 获取距离周末的天数
      switch (_week) {
        case 2:
          cnt = 5;
          break;
        case 3:
          cnt = 4;
          break;
        case 4:
          cnt = 3;
          break;
        case 5:
          cnt = 2;
          break;
        case 6:
          cnt = 1;
          break;
      }
      if (_week == 1) {
        cnt = 0;
      } else {
        cnt += 1; //加1表示以星期一为一周的第一天
      }
      var _start = date.format("MM月dd日");
      // 将这个长整形时间加上第N周的时间偏移
      time += cnt * 24 * 3600000; //第1周开始时间
      var nextYear = new Date(parseInt(this.year, 10) + 1, "0", "1"); // parseInt(str,10) 10进制解析字符串
      var nextWeek = nextYear.getDay();
      var lastcnt = 0; //获取最后一周开始时间到周末的天数
      switch (nextWeek) {
        case 0:
          cnt = 6;
          break;
        case 1:
          cnt = 0;
          break;
        case 2:
          cnt = 1;
          break;
        case 3:
          cnt = 2;
          break;
        case 4:
          cnt = 3;
          break;
        case 5:
          cnt = 4;
          break;
        case 6:
          cnt = 5;
          break;
      }

      date.setTime(time);
      // var _start = date.format("MM-dd");
      var start = time + (this.numberOfWeeks - 1) * 7 * 24 * 3600000; //第n周开始时间
      date.setTime(start);
      this.startDate = date.format("yyyy-MM-dd");
      var _start = date.format("MM-dd");
      // var arr = [];
      // arr.push(date.getDate());

      // 封印该段代码
      // this.weekArr[0].date = date.getDate();
      // this.weekArr[0].dateAll = date.format("yyyy-MM-dd");
      // for (var i = 1; i <= 6; i++) {
      //   start += 24 * 3600000;
      //   date.setTime(start);
      //   // arr.push(date.getDate());
      //   this.weekArr[i].date = date.getDate();
      //   this.weekArr[i].dateAll = date.format("yyyy-MM-dd");
      // }
      var end = start;
      var end = time + this.numberOfWeeks * 7 * 24 * 3600000 - 24 * 3600000; //第n周结束时间
      // var end = time+(this.numberOfWeeks*7 - 1)*24*3600000- 24*3600000; //第n周结束时间
      // 为日期对象 date 重新设置成时间 time
      date.setTime(end);
      this.endDate = date.format("yyyy-MM-dd");
      var _end = date.format("MM-dd");
      console.log(_start + "至" + _end);
      return _start + "至" + _end;
    },
    fontChange: function() {
      return function(i) {
        switch (i) {
          case 0:
            return "一";
          case 1:
            return "二";
          case 2:
            return "三";
          case 3:
            return "四";
          case 4:
            return "五";
          case 5:
            return "六";
          case 6:
            return "日";
        }
      };
    },
  },
  watch: {
    colleagueCircleRespList:function(val){
      this.listNextVisitorCount(val.map(item=>item.account),this.colleagueCircleRespList);
    },
    numberOfWeeks: function(val, val0) {
      // if(this.h3Active == 1){
      // this.selOneWeekPlan();
      // }else if(this.h3Active == 2){
      // }
    }
  }
};
</script>
<style lang="scss" scoped >
$blue: #4b77af;
$int: 26px;
p {
  margin: 0;
}
// 顶部导航 start
.blue {
  $h: 40px;
  background-color: $blue;
  width: 100%;
  height: $h;
  .headerUl {
    height: $h;
    padding-left: $int;
    margin: 0;
    float: left;
    li {
      float: left;
      margin-right: 10.5px;
      height: 30px;
      font-weight: 700;
      color: #8bbdde;
      height: 80%;
      font-size: 17px;
      &.active {
        border-bottom: 2px solid #fff;
        color: #fff;
      }
    }
  }
  img {
    width: 28px;
    height: 28px;
    display: inline-block;
    vertical-align: middle;
  }
  .close {
    float: right;
    margin: 0;
    padding-right: 17px;
    line-height: $h;
    height: 100%;
  }
  .record {
    float: right;
    margin-right: 20px;
    height: 100%;
    line-height: $h;
  }
}
// 顶部导航end

#search {
  // 搜索栏样式
  & > div {
    background: $blue;
  }
  height: 60px;
  background: $blue;
  text-align: center;
  line-height: 60px;
  input {
    width: 360px;
    height: 30px;
    box-sizing: border-box;
    border: 0;
    vertical-align: middle;
    border-radius: 12px;
    background-repeat: no-repeat;
    background-position: 137px center;
    background-size: 24px 24px;
    background-color: rgba(255, 255, 255, 0.3);
    display: inline-block;
    text-align: center;
    color: #fff;
    font-size: 17px;
    &::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    &.focus {
      background-position: 17px center;
      text-align: left;
      padding-left: 52px;
    }

    &:focus {
      height: 100px;
    }
  }
}
#colleague {
  // 同事圈样式
  position: fixed;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  .main {
    position: fixed;
    top: 60px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: scroll;
  padding-bottom:70px;

  }
  .collapseTitle {
    // 折叠框标题样式
    color: #4b77af;
    font-size: 17px;
  }
  .collapseIcon {
    // 折叠狂icon样式
    img {
      transform: scaleX(-1) scaleY(-1) rotate(180deg);
      background: #4b77af;
    }
  }

}
</style>
<style lang="scss">
// .van-swipe-cell__wrapper{
//   transform: none!important;
// }

#colleague {
  .collapseUl {
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


      div.divLi{
        height: $liH;border-bottom: 1px solid #ebedf0;position: relative;
        &::before {
          content: ".";
          display: block;
          height: 0;
          clear: both;
          visibility: hidden;
        }
        &>div {
          line-height: $liH;
          color: #000000;
          letter-spacing: -0.32px;

        }
        div.divClick{
          height:100%;float:left;position:absolute;top: 0;bottom: 0;left: 0;right: 40px;
        }
        div.divImg{
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
        div.divName{
          font-size:15px;
          margin-left: 12px;
          float: left;
        }
        div.icon{
          height: 100%;
          float: right;width: 40px;text-align: center;z-index: 10;
          // background-position:50% 50% ;
          // background-repeat:no-repeat ;
          // background-image:url(../../static/imgs/unfold.svg);
          background:url(../../../static/imgs/unfold.svg) no-repeat center center;
          &.active{
            background:url(../../../static/imgs/fold.svg) no-repeat center center;
          }
        }
        div.last {
          position: absolute;right: 0;
          // padding-right: 53px;
          padding-left: 138px;
          font-size: 15px;
          font-weight: 500;
          color: rgba(215, 82, 82, 1);
        }
        div.visitNumber{ // 访客数
          position: absolute;right: 94px;font-size:15px;
          font-weight:500;
          color:rgba(72,72,72,1);        
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
}
.myNotify {
  // 提示框样式
  &.van-popup.van-popup--top.van-notify.van-notify--danger {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    height: 48px;
    width: 50%;
    font: 700 17px/48px "";
    margin: auto;
    padding: 0 10px;
    display: inline-block;
    border-radius: 5px;
  }
}
// 同事圈下拉组件样式
.myCollapse.van-collapse {
  .van-cell.van-cell--clickable {
    $h: 60px;
    padding: 0;
    padding-left: 17px;
    padding-right: 23px;
    height: $h;
    line-height: $h;
    display: flex;
    align-items: center;
  }
  .van-collapse-item__content {
    padding: 0;
  }
}

</style>
