<template>
  <div class="workplan">
    <div id="review" :style="viewShow == 'review'?'':'display:none'">
      <div style="display:none">{{getXDate}}</div>
      <van-nav-bar class="vanNavBar">
        <div slot="left" @click="workPlanClick" v-if="h3Active == 1 && !isOnBusiness">
          <van-icon name="arrow-left" />
          <span>第{{lastNumberOfweeks}}周</span>
        </div>
        <div slot="left" @click="workPlanClick" v-if="h3Active == 2 && !isOnBusiness">
          <van-icon name="arrow-left" />
          <span>计划</span>
        </div>
        <div slot="title">
          <div class="center">
            <div class="title_h3" v-if="h3Active == 1">
              工作计划
              <div
                v-show="thisName"
                style="
                position:absolute;left:67%;top:0;bottom:0;margin:auto 0;
                font-size:12px;font-weight:400;color:rgba(72,72,72,1);line-height:15px;
                border-left:1px solid #007AFF;height:15px;padding-left:3px;
              "
              >{{thisName}}</div>
            </div>
            <div class="title_h3" v-if="h3Active == 2">
              工作回顾
              <div
                v-show="thisName"
                style="
                position:absolute;left:67%;top:0;bottom:0;margin:auto 0;
                font-size:12px;font-weight:400;color:rgba(72,72,72,1);line-height:15px;
                border-left:1px solid #007AFF;height:15px;padding-left:3px;
              "
              >{{thisName}}</div>
            </div>
            <div class="title_span">{{year}}年 第{{numberOfWeeks}}周 {{getXDate}}</div>
          </div>
        </div>
        <div slot="right" @click="workReviewClick" v-if="h3Active == 1 && !isOnBusiness">
          <span>回顾</span>
          <van-icon name="arrow" />
        </div>
        <div slot="right" @click="workReviewClick" v-if="h3Active == 2 && !isOnBusiness">
          <span>第{{nextNumberOfWeeks}}周</span>
          <van-icon name="arrow" />
        </div>
      </van-nav-bar>

      <div
        :class="move"
        id="tabDiv"
        @touchstart="isOnBusiness?null:start($event)"
        @touchmove="isOnBusiness?null:moveFn($event)"
        @touchend="isOnBusiness?null:end($event)"
      >
        <bTripWorkPlan
          v-if="isOnBusiness"
          :numberOfWeeks="numberOfWeeks"
          :numberOfWeeksNow="numberOfWeeksNow"
          :h3Active="h3Active"
          :onBusinessItem="onBusinessItem?onBusinessItem:{}"
          :clickInputF="clickInput"
          :wstatus="wstatus"
          :dstatus="dstatus"
          :did="did"
          :thisName="thisName"
          :year="year"
          :wid="wid"
          :adAcount="adAcount"
          :startDate="startDate"
          :wpsFrom="wpsFrom"
          :code="code"
        />
        <div v-if="!isOnBusiness">
          <div
            class="list"
            :style="!(h3Active == 1 && wstatus == 2 && isSuper == 1 && cookieName != adAcount&&!isOnBusiness)?'padding-bottom:0px;':''"
            @scroll="listScroll"
            ref="list"
            :dstatus="dstatus"
          >
            <div class="first">
              <div class="title">
                <div style="display:inline-block;vertical-align: middle;height:100%;">{{numberOfWeeks}}周 </div>

                <!-- 显示访客次数 -->
                <div v-if="h3Active == 2 && isVisit && visitNumber>0" style="height:100%;width:1px;display:inline-flex;align-items:center;vertical-align: middle;">
                  <div style="height:18px;width:0px;border-right:1px solid #007AFF;"></div>
                </div>
                <div v-if="h3Active == 2 && isVisit && visitNumber>0" id="visitNumber" @click="toVisitorlist"  class="firstTitle">
                  <van-image :src="imgSrc" />
                  <span class="visitNumber_span">{{visitNumber}}次拜访</span>
                </div>
                <!-- 商机 && dataBusiness -->
                <div v-if="h3Active == 2 && isVisit && dataBusiness" id="business" class="firstTitle">
                  <van-image :src="businessImg" width="18" height="18"/>
                  <span><a>{{dataBusiness}}个商机</a></span>
                </div>
                <!-- 线索 && dataClue -->
                <div v-if="h3Active == 2 && isVisit && dataClue" id="clue" class="firstTitle">
                  <van-image :src="clueImg" width="16" height="16"/>
                  <span> <a>{{dataClue}}条线索</a></span>
                </div>
              </div>
              <van-field
                class="line"
                v-model="wworkPlanReviewDes"
                :readonly="true"
                type="textarea"
                maxlength="200"
                :rows="firstRows"
                :placeholder="placeholderShow"
                style="border-radius:4px;border:1px solid rgba(75,119,175,0.2);box-sizing: border-box;"
                @click="(wstatus != 1 && h3Active == 1) || ( h3Active == 2 && dstatus != 3 )?clickInput(wworkPlanReviewDes,numberOfWeeks+'周'):null"
                @focus="firstFocus"
              />
            </div>
            <ul class="main">
              <li v-for="(item,index) in weekArr" :key="index">
                <div class="title">
                  <span>周{{fontChange(index)}}</span>
                  <span>{{item.date}}日</span>
                  <!-- 出差图标 -->
                  <van-image
                    v-show="item.isTrip"
                    width="17"
                    height="17"
                    :src="item.isTrip==3&&item.approvalTripStatus == 1?chuchaiImgSrc :chuchaiImgGSrc"
                    @click="()=>{$router.push(
                      h3Active == 1?{ path:'/travelPlan',query:{  id:item.imgTripId,time:item.dateAll,weekNum:numberOfWeeks,year,startDate,  } }:
                      { path:'/travelReview',query:{ id:item.imgTripId ,startDate:item.dateAll, } }
                    )}"
                  />
                  <!-- 招待图标 -->
                  <van-image
                    v-show="item.isEntertain"
                    width="17"
                    height="17"
                    :src="item.isEntertain==3&&item.approvalEntertainStatus == 1?zhaodaiImgSrc :zhaodaiImgGSrc"
                    @click="()=>{$router.push(
                      h3Active == 1?{ path:'/serverPlanList', query:{ time:item.dateAll,adAcount } }:
                      { path:'/serveReviewList', query:{ time:item.dateAll,adAcount} }
                    )}"
                  />
                </div>
                <div class="main_body">
                  <div class="itemUp itemText">
                    <div class="itemTextTitle">上午</div>
                    <van-field
                      class="line"
                      v-if="h3Active == 1 && !item.disabledUp"
                      v-model="item.dworkPlanDesAm"
                      :placeholder="placeholderPlanShow"
                      maxlength="200"
                      row="3"
                      type="textarea"
                      @click="clickInput(item.dworkPlanDesAm,'周'+fontChange(index)+'  '+item.date+'日')"
                      :readonly="true"
                    />
                    <van-field
                      class="line"
                      v-if="h3Active == 2 && !item.disabledUp"
                      v-model="item.dworkReviewDesAm"
                      :placeholder="placeholderReviewShow(item)"
                      maxlength="200"
                      row="3"
                      type="textarea"
                      :readonly="true"
                      @click="clickInput(item.dworkReviewDesAm,'周'+fontChange(index)+'  '+item.date+'日')"
                    />
                    <!-- 休假 -->
                    <div
                      v-show="item.disabledUp"
                      style="width:340px;height:18px;background:rgba(255,232,182,1);text-align:center;font-size:12px;font-weight:600;color:rgba(255,167,0,1);line-height:17px;"
                    >休假</div>
                  </div>
                  <div style="height:0;width:100%;border-top:1px dashed rgba(75,119,175,0.2);"></div>
                  <div class="itemDown itemText">
                    <div class="itemTextTitle">下午</div>
                    <van-field
                      class="line"
                      v-if="h3Active == 1 && !item.disabledDown"
                      v-model="item.dworkPlanDesPm"
                      maxlength="200"
                      row="3"
                      type="textarea"
                      :readonly="true"
                      :placeholder="placeholderPlanShow"
                      @click="clickInput(item.dworkPlanDesPm,'周'+fontChange(index)+'  '+item.date+'日')"
                    />
                    <van-field
                      class="line"
                      v-if="h3Active == 2 && !item.disabledDown"
                      v-model="item.dworkReviewDesPm"
                      :placeholder="placeholderReviewShow(item)"
                      maxlength="200"
                      row="3"
                      type="textarea"
                      :readonly="true"
                      @click="clickInput(item.dworkReviewDesPm,'周'+fontChange(index)+'  '+item.date+'日')"
                    />
                    <!-- 休假 -->
                    <div
                      v-show="item.disabledDown"
                      style="width:340px;height:18px;background:rgba(255,232,182,1);text-align:center;font-size:12px;font-weight:600;color:rgba(255,167,0,1);line-height:17px;"
                    >休假</div>
                  </div>
                  <!-- v-if="(h3Active == 2)&&item.dateAll == new Date().format('yyyy-MM-dd')&&isSuper == 1 && dstatus == 4 && this.cookieName != this.adAcount" -->
                  <!-- item.dateAll == new Date().format('yyyy-MM-dd') -->
                  <div
                    class="circleBut"
                    @click="()=>{isOnBusiness = true;onBusinessItem = item;}"
                    v-if="(h3Active == 2)&& item.did == did &&isSuper == 1 && dstatus == 4 && cookieName != adAcount"
                  >
                    <van-image :src="toBeRead" width="100%" height="100%" />
                  </div>
                </div>
              </li>
            </ul>

            <!-- 领导的计划审核意见展示 -->
            <div id="opinion" v-if="(wstatus == 3 && h3Active == 1)">
              <h3>管理者意见  第{{numberOfWeeks}}周</h3>
              <div v-if="!wverifiedUserName2">
                <div style="width:100%;border:none">
                  <p
                    @click="clickInput(wplanDreviewVerifiedOpinio(1),'管理者意见',wverifiedUserName1,wdDate(1))"
                  >
                    {{wplanDreviewVerifiedOpinio(1)}}<br/>
                    <span v-if="approvalStatus == 2">不认同  <span class="err">(说明：当天招待/出差相关费用未被认同，费用无法报销！)</span></span>
                  </p>
                  <div>
                    <span>{{wverifiedUserName1}}</span>
                    <br />
                    <span>{{wdDate(1)}}</span>
                    <!-- <div class="disagree" v-if="approvalStatus == 2">不认同</div> -->
                  </div>
                </div>
              </div>
              <div v-if="wverifiedUserName2">
                <div style="width:50%">
                  <p
                    @click="clickInput(wplanDreviewVerifiedOpinio(1),'管理者意见',wverifiedUserName1,wdDate(1))"
                  >{{wplanDreviewVerifiedOpinio(1)}}</p>
                  <div>
                    <span>{{wverifiedUserName1}}</span>
                    <br />
                    <span>{{wdDate(1)}}</span>
                  </div>
                </div>
                <div style="width:50%">
                  <p
                    @click="clickInput(wplanDreviewVerifiedOpinio(2),'管理者意见',wverifiedUserName2,wdDate(2))"
                  >{{wplanDreviewVerifiedOpinio(2)}}</p>
                  <div>
                    <span>{{wverifiedUserName2}}</span>
                    <br />
                    <span>{{wdDate(2)}}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 领导的回顾审核意见展示 -->
            <div
              id="opinion"
              v-if="(dstatus == 5 && h3Active == 2) || (dreviewVerifiedOpinionArr.length>0 && h3Active == 2)"
            >
              <h3>管理者意见  第{{numberOfWeeks}}周</h3>
              <div
                v-for="(item,index) in dreviewVerifiedOpinionArr"
                :key="index"
                :style="index!=0?'margin-top:0px;':''"
              >
                <div style="width:100%;border:none">
                  <h5 class="header">{{weekDayDate(item.dworkPlanDate)}}      &nbsp;&nbsp;&nbsp;{{new Date(item.dworkPlanDate).getDate()}}日</h5>
                  <p
                    @click="clickInput(item.dreviewVerifiedOpinion1,'管理者意见',item.dverifiedUserName1,wdDate(1,item.dreviewVerifiedDate1))"
                  >
                    {{item.dreviewVerifiedOpinion1}}<br/>
                    <span v-if="item.wrApprovalStatus == 2" >不认同  <span class="err">(说明：当天招待/出差相关费用未被认同，费用无法报销！)</span><br/></span>
                  </p>
                  <div>
                    <span>{{item.dverifiedUserName1}}</span>
                    <br />
                    <span>{{wdDate(1,item.dreviewVerifiedDate1)}}</span>
                    <!-- <div class="disagree" v-if="item.wrApprovalStatus == 2">不认同</div> -->
                  </div>
                </div>
              </div>
            </div>
            <!-- 领导审批意见填写 && dstatus != 4 -->
            <!-- 暂存条件 || (h3Active == 2 && isSuper == 1 && dstatus == 4) -->
            <!-- <div id="opinion" v-if="((h3Active == 1 && wstatus == 2 && isSuper == 1) ) && this.cookieName != this.adAcount">
              <h3>管理者意见</h3>
              <div>
                <van-field type="textarea" v-model="wplanVerifiedOpinion" placeholder="请输入意见……" :border='false'
                  :autosize='{ minHeight: 100,maxHeight:100 }'
                  style="border-radius:4px;border:1px solid rgba(75,119,175,0.2);box-sizing: border-box;"
                />
              </div>
            </div>-->
          </div>
        </div>
      </div>
      <!-- 弹出日期插件 -->
      <van-popup v-model="show" position="bottom" :style="{ height: '70%' }">
        <div>
          <calendar v-model="calendarShow"></calendar>
          <inlineCalendar @change="handelChange" :defaultDate="defaultDate" ref="popDate" />
        </div>
      </van-popup>

      <div
        class="but_b"
        v-if="h3Active == 1 && wstatus == 2 && isSuper == 1 && cookieName != adAcount&&!isOnBusiness"
      >
        <van-button
          plain
          type="primary"
          @click="audit"
          :disabled="wstatus == 3"
          :style="wstatus == 3?'background:#ccc;':''"
          class="withdraw"
          id="readOver"
        >审阅</van-button>
      </div>
      <!-- <div class="but_b" v-if="h3Active == 2 && dstatus == 4 && isSuper == 1 && this.cookieName != this.adAcount">
        <van-button plain type="primary" @click="audit" :disabled="wstatus == 5"
          :style="wstatus == 5?'background:#ccc;':''" class="withdraw"
        >已阅</van-button>
      </div>-->

      <!-- 弹出层 -->
      <van-popup
        v-model="popupShow"
        style="padding:10px;width:100%;height:100%;"
        @click="()=>{this.popupShow = false;}"
      >
        <!-- <div id="myPopup"> -->
        <ul class="main" style="padding:15px;">
          <li>
            <div class="title">
              <span>{{popupTitle}}</span>
            </div>
            <div
              class="itemUp itemText"
              style="font-size:16px;font-weight:400;color:rgba(72,72,72,1);line-height:18px; word-wrap: break-word;word-break: break-all;overflow: hidden;"
              v-html="popupText"
            ></div>
          </li>
          <div style="text-align:right;">{{popupName}}</div>
          <div style="text-align:right;">{{popupDate}}</div>
        </ul>
        <!-- </div> -->
      </van-popup>
      <!-- 遮罩层 用于加载 -->
      <van-popup
        v-model="overlayShow"
        :style="{ height: '20%',width:'35%' }"
        :close-on-click-overlay="false"
        round
      >
        <div
          style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;flex-flow:row wrap;"
        >
          <van-loading type="spinner" vertical>加载中……</van-loading>
        </div>
      </van-popup>

      <!-- 引导层 -->
      <!-- <van-popup
        v-model="tourShowAudit"
        id="tourShow"
        :style="{ height: '100%',width:'100%',backgroundColor:'transparent' }"
        :close-on-click-overlay="false"
      >
        <div slot="default" :class="`default${tourState}`">
          <template>
            <van-image :src="$data[`tour${tourState}`]" class="image" />
            <div class="click" @click="tourNext"></div>
          </template>
        </div>
      </van-popup> -->
      <!-- 分享按钮 -->
      <div id="share" @click.stop="toShare">
        <van-image :src="shareImg"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { CellGroup } from "vant";
import Cookie from "@/apis/cookie";
import moment from "moment";
import bTripWorkPlan from "./bTripWorkPlan";
import { getlocalStorage, setlocalStorage } from "@/utils/format";
import methods from "@/views/workPlan/workPlanJ.js";
export default {
  name: "workPlanAudit",
  data() {
    return {
      dataBusiness:0, // 商机数据
      dataClue:0, // 线索数据

      businessImg:require("@static/imgs/workPlan/business.png"),// 商机图标
      clueImg:require("@static/imgs/workPlan/clue.png"), // 线索图标

      tourState:2, // 引导图状态
      tourShowAudit:false, // 决定导图是否展示
      tour2: require("../../../static/imgs/tour0.png"), // 飞机
      tour1: require("../../../static/imgs/tour1.png"), // 分享
      tour0:require('../../../static/imgs/tour2.png'), // 回顾导图

      shareImg:require('../../../static/imgs/share.svg'), // 分享按钮图标

      hideVisit: false,
      code: null, // 判断是否从消息进入
      wpsFrom: null,
      isFirstRequest: false, // 是否第一次请求数据了
      firstRows: 4, // 头部框所占行数
      initialScoll: null, // 当前list据顶部的距离
      // 招待 出差图标
      zhaodaiImgSrc: require("../../../static/imgs/zhaodai.svg"),
      zhaodaiImgGSrc: require("../../../static/imgs/zhaodai-zhihui.svg"),
      chuchaiImgSrc: require("../../../static/imgs/chuchai.svg"),
      chuchaiImgGSrc: require("../../../static/imgs/chuchai-zhihui.svg"),

      thisName: null,

      onBusinessItem: null, // 待阅的当前回顾
      isOnBusiness: false,
      toBeRead: require("../../../static/imgs/toBeRead.svg"), // 回顾待阅按钮图标
      isVisit: true, // 决定访客记录是否显示
      visitNumber: 0, //拜访次数
      imgSrc: require("../../../static/imgs/visit.png"), // 拜访次数的icon

      overlayShowTime: null, //login的计时器
      overlayShow: false, // 遮罩层状态

      dreviewVerifiedOpinionArr: [], // 领导审核回顾意见列表

      cookieName: "",

      isSuper: 2, // 当该页面同

      // 弹出层状态
      popupObj: {}, // 弹出层展示数据
      popupShow: false,
      popupText: "",
      popupTitle: "",
      popupName: "",
      popupDate: "",

      wplanVerifiedOpinion: "", // 领导填写意见

      // 轮播图
      move: null,
      startX: null,
      moveDire: "",

      // 同事圈 start
      colleagueCircleRespList: [], // 当前用户的下级
      superiorName: "", // 当前用户的上级
      colleagueSearchList: [], // 搜索获得的数据
      concernList: [], // 关注的同事列表
      // 同事圈 end

      active: 1,
      viewShow: "review", //顶部导航切换状态
      // review 界面的数据
      selected: "",
      weekArrNull: [
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        }
      ],
      weekArr: [
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        },
        {
          date: "",
          disabledUp: false, // 是否可编辑
          disabledDown: false, // 是否可编辑
          dworkPlanDesAm: "", // 当日上午的工作计划
          dworkPlanDesPm: "" // 当日下午的工作计划
        }
      ],
      year: null,
      numberOfWeeks: 0, // 当前周数
      umberOfWeeksNow: 1, // 当前周数
      wworkPlanDes: "", // 周计划
      wworkReviewDes: "", // 周回顾
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

      approvalStatus:null, // 决定工作计划的认同与否
      wplanVerifiedOpinion1: "", // 管理者 计划意见1
      wverifiedUserName1: "", // 管理者1
      wplanVerifiedOpinion2: "", // 管理者 计划意见2
      wverifiedUserName2: "", // 管理者2
      wplanVerifiedDate1: "",
      wplanVerifiedDate2: "",

      dreviewVerifiedOpinion1: "", // 管理者 回顾意见1
      dreviewVerifiedOpinion2: "", // 管理者 回顾意见2
      dreviewVerifiedDate1: "",
      dreviewVerifiedDate2: "",

      dverifiedUserName1: "",
      dverifiedUserName2: "",

      // #search 搜索块数据
      focus: false,
      searchText: "",
      // transpond界面的状态
      transpondList: [1, 2, 3, 4],
      // colleague界面的数据
      activeNames: ["1"],
      adAcount: "", //查看更多传来的ad账号
      chooseDate: "" //查看更多传来的时间
    };
  },
  components: { bTripWorkPlan },
  created() {
    this.dateFormat();
    this.createDate();
    this.numberOfWeeksNow = this.getWeekOfYear(); // 缓存当前周数
    document.title = "计划与回顾";
    this.cookieName = Cookie.cookie.get("accountName");
    console.log('toReviewDetall11111111111111111111',this.tourNext);
  },
  mounted() {
    let obj = this.$route.query;
    console.log("路由参数 不要删除",obj);
    this.code = window.location.search.indexOf("code"); // 判断是否从消息进入
    this.adAcount = obj.adAcount;
    this.thisName = obj.thisName; // 传入姓名
    this.wpsFrom = obj.wpsFrom; // 决定是否跳转到同事圈
    if(obj.year){
      this.year = obj.year;
    }
    if(obj.numberOfYears){
      this.year = obj.numberOfYears;
    }
    if (typeof obj.did == "string") {
      this.did = obj.did.replace(",", "");
    } else {
      this.did = obj.did;
    }
    if (obj.planReviewStatus == 1) {
      // this.numberOfWeeks = obj.numberOfWeeks ? obj.numberOfWeeks :this.numberOfWeeks + 1;
      this.numberOfWeeks = obj.numberOfWeeks
        ? obj.numberOfWeeks
        : this.numberOfWeeks;
      this.h3Active = 1;
    } else if (obj.planReviewStatus == 2) {
      this.numberOfWeeks = obj.numberOfWeeks
        ? obj.numberOfWeeks
        : this.numberOfWeeks;
      this.h3Active = 2;
    }
    if (obj.chooseDate) {
      // 判断王甲戊是否串时间过来
      this.getWeekOfYear(new Date(parseInt(obj.chooseDate)));
    }
    this.isSuper = obj.isSuper ? obj.isSuper : 2;
    // this.selOneWeekPlan();
    console.log("this.adAcount",this.adAcount);
    if (Cookie.cookie.get("superAccount") == this.adAcount) {
      // 当查看上级时不显示访客记录入口
      this.isVisit = false;
    }

    this.showBtripServe(); // 查询出差和招待的图标
    this.queryPersonUnitMsgByAd(); // 获取用户name
    this.initialScoll = this.$refs.list.offsetTop; // 获取页面初始化top
    console.log("dstatus", this.dstatus);
    // this.tourIs();
  },
  methods: {
    ...methods,
    tourNext(){ // 导图点击事件
      this.tourState--;
      if(-1 == this.tourState){
        this.tourShowAudit = false;
        Cookie.cookie.set("tourShowAudit",true);
      }
    },
    tourIs(){ // 决定导图是否展示
      this.tourShowAudit = !(Cookie.cookie.get("tourShowAudit"));
    },


    queryPersonUnitMsgByAd() { // 获取用户name
      this.$getData
        .queryPersonUnitMsgByAd({
          method: "post",
          data: {
            name: this.adAcount
          }
        })
        .then(res => {
          console.log("res", res);
          if(res.data){
            this.thisName = res.data.personName;
            if(this.cookieName == res.data.leaderAdAccId){
              this.isSuper = 1;
            }
          }
        });
    },
    listPosition() { // 页面锚点定位
      // (h3Active == 2)&& item.did == did &&
      // isSuper == 1 && dstatus == 4 && cookieName != adAcount
      this.$forceUpdate();
      if (this.h3Active == 1) {
        this.$refs.list.scrollTop = 0;
      } else if (this.h3Active == 2 && !this.tourShowAudit) {
        // this.dstatus == 3 &&
        // this.numberOfWeeks == this.numberOfWeeksNow &&  this.newDate.getDay()!=5 历史if条件
        console.log('this.$nextTick',this.$nextTick);
        if (this.isSuper == 1 && this.cookieName != this.adAcount) {
          console.log('this.$nextTick',this.$nextTick);
          this.$nextTick(()=> {
            let i = null;
            let arr = JSON.parse(JSON.stringify(this.weekArr));
            // this.weekArr.map((item,index)=>{
            console.log('arr.map',arr.map);
            arr.map((item, index) => {
              var it = JSON.parse(JSON.stringify(this.weekArr[index]));
              if (this.weekArr[index].did == this.did) {
                i = index;
                return index;
              }
            });
            let dom = this.$el.querySelector(
              `#tabDiv .list>ul.main>li:nth-of-type(${i + 1})`
            );
            console.log('dom',dom);
            this.$refs.list.scrollTop = dom.offsetTop;
          });
        }
      }
    },
    firstFocus() { // 头部输入框聚焦事件
      this.firstRows = 4;
      this.$refs.list.style.top = this.initialScoll + "px";
    },
    listScroll() { // 滚动事件
      // this.$refs.list.style.top = this.initialScoll - 40 + "px";
      // this.firstRows = 1;
    },
    isJudge(name1, name2) { // 决定审核权方法
      let acountCookie = Cookie.cookie.get("accountName");
      if (acountCookie == name1 || acountCookie == name2) {
        this.isSuper = 1;
      } else {
        this.isSuper = 2;
      }
    },
    showBtripServe() { // 决定展示计划和招待的图标
      let data = {
        adCount: this.adAcount,
        endDate: this.endDate,
        queryType: this.h3Active,
        startDate: this.startDate
      };
      console.log("show Data", data);
      this.$getData
        .queryHomeDataForPerson({
          method: "post",
          data
        })
        .then(res => {
          console.log("res", res);
          if (res.code == 200 && res.msg == "success") {
            let { entertain, trip } = res.data;

            this.weekArr.map(el => {
              entertain.length <= 0
                ? (el.isEntertain = false)
                : entertain.map(item => {
                    // 招待
                    if (item.itemDate == el.dateAll) {
                      if (item.num != 0) {
                        el.isEntertain = item.status;
                        el.imgEntertainId = item.id;
                        el.approvalEntertainStatus = item.approvalStatus;
                      } else {
                        el.isEntertain = false;
                      }
                    }
                  });
              trip.length <= 0
                ? (el.isTrip = false)
                : trip.map(item => {
                    // 出差
                    if (item.itemDate == el.dateAll) {
                      if (item.num != 0) {
                        el.imgTripId = item.id;
                        el.isTrip = item.status;
                        el.approvalTripStatus = item.approvalStatus;
                      } else {
                        el.isTrip = false;
                      }
                    }
                  });
            });
            this.$forceUpdate();
          }
        });
    },
    toVisitorlist() { // 跳转到访客记录界面
      var query = {
        startTime: this.startDate,
        endTime: this.endDate,
        adAcount: this.adAcount,
        modelType: 20,
        name:this.thisName
      };
      this.$router.push({ path: "/visitorlist", query });
    },
    getVisitorCount() { // 获取访客记录
      this.$getData
        .getVisitorCount({
          method: "post",
          data: {
            startTime: this.startDate,
            endTime: this.endDate,
            adAcount: this.adAcount
          }
        })
        .then(res => {
          if (res.code == 200 && res.msg == "success") {
            this.visitNumber = res.data.visitorCount;
          } else {
            this.visitNumber = 0;
          }
        });
    },
    placeholderReviewShow: function(item) { // 决定回顾的提示信息
      if (
        new Date(item.dateAll).getTime() > this.newDate.getTime() &&
        this.h3Active == 2 &&
        this.dstatus == 3
      ) {
        return "未到回顾时间";
      } else if (
        new Date(item.dateAll).getTime() < this.newDate.getTime() &&
        this.h3Active == 2
      ) {
        return "未填写";
      } else if (
        this.h3Active == 2 &&
        this.wstatus == 3 &&
        new Date(item.dateAll).getTime() > this.newDate.getTime()
      ) {
        return "未到回顾时间";
      } else if (
        this.wstatus == 1 &&
        this.h3Active == 2 &&
        new Date(item.dateAll).getTime() < this.newDate.getTime()
      ) {
        return "未填写";
      }
    },

    clickInput(txt, title, name, date) { // 点击输入框展示内容
      // this.popupText = txt;
      this.popupText = txt?txt.replace(/\n/g,'<br/>'):''; // 更改报错
      this.popupTitle = title;
      this.popupName = name;
      this.popupDate = date;
      if (this.popupText && this.popupText.length > 0) {
        this.popupShow = true;
      }
    },
    audit() { // 已阅按钮点击事件
      this.isOnBusiness = true;
      // if(this.h3Active == 1 && this.wstatus == 2){
      //   this.examineWeekWorkPlan();
      // }else if(this.h3Active == 2 && this.dstatus == 4){
      //   this.examineWeekWorkReview(this.wplanVerifiedOpinion);
      // }else{
      //   this.$router.push({
      //     path:'/colleague'
      //   })
      // }
    },
    examineWeekWorkReview(str) { // 审核回顾
      var _this = this;
      let data = {
        did: this.did
      };
      if (str) {
        data.wplanVerifiedOpinion = str;
      }
      this.$dialog
        .confirm({
          title: "审核工作回顾",
          message: "是否提交审核？"
        })
        .then(() => {
          this.$getData
            .examineWeekWorkReview({
              method: "post",
              data
            })
            .then(res => {
              if (res.code == 200 && res.msg == "success") {
                this.wstatus = 1;
                this.myNotify("审批成功");
                this.subDisabled = true;
                _this.selOneWeekPlan();
              }
            });
        })
        .catch(() => {});
    },
    examineWeekWorkPlan() { // 领导审核周计划和日计划
      var _this = this;
      this.$dialog
        .confirm({
          title: "审核工作计划",
          message: "是否提交审核？"
        })
        .then(() => {
          this.$getData
            .examineWeekWorkPlan({
              method: "post",
              data: {
                wid: this.wid,
                // "wid": 99,
                wplanVerifiedOpinion: this.wplanVerifiedOpinion,
                wweekNum: this.numberOfWeeks.toString(),
                wyear: this.year.toString()
              }
            })
            .then(res => {
              this.myNotify("审批成功");
              this.wstatus = 3;
              this.subDisabled = true;
              _this.selOneWeekPlan();
            });
        })
        .catch(() => {});
    },


    clearView() { // 清除当前界面的数据
      this.wworkPlanDes = "";
      this.wworkReviewDes = "";

      this.weekArr = JSON.parse(JSON.stringify(this.weekArrNull));
      this.wstatus = 1;
      this.dstatus = 1;
      this.dreviewVerifiedOpinionArr = [];
    },
    workReviewClick() { // 工作回顾点击按钮
      if (this.h3Active == 1) {
        this.h3Active = 2;
      } else if (this.h3Active == 2) {
        this.dateRight();
        this.h3Active = 1;
      }
    },
    workPlanClick() { // 工作计划点击按钮
      if (this.h3Active == 2) {
        this.h3Active = 1;
      } else if (this.h3Active == 1) {
        this.dateLeft();
        this.h3Active = 2;
      }
      // this.selOneWeekPlan();
    },
    // 接口方法 start
    myNotify(str) { // 提示框方法
      this.$notify({
        message: str,
        duration: 2000,
        className: "myNotify"
      });
    },
    selOneWeekPlan() { // 查询某周的计划 和 回顾
      this.overlayShow = true;
      // 清楚数据缓存 start
      this.clearView();
      // end
      this.$getData
        .selOneWeekPlan({
          method: "post",
          data: {
            wweekNum: this.numberOfWeeks.toString(),
            wyear: this.year.toString(),
            adAcount: this.adAcount
          }
        })
        .then(res => {
          this.isFirstRequest = true; // 第一次请求数据了
          this.overlayShow = false;
          if (res.code == 200 && res.data) {
            let data = res.data;
            this.isJudge(data.wverifiedAdAcount1, data.wverifiedAdAcount2); // 决定审核权 adAcount
            this.wworkPlanDes = data.wworkPlanDes;
            this.wworkReviewDes = data.wworkReviewDes;
            this.wid = data.wid;
            this.wstatus = data.wstatus;
            this.thisName = data.userName;
            if (data.wstatus >= 3) {
              this.wplanVerifiedOpinion1 = data.wplanVerifiedOpinion1;
              this.wverifiedUserName1 = data.wverifiedUserName1;
              this.wplanVerifiedOpinion2 = data.wplanVerifiedOpinion2;
              this.wverifiedUserName2 = data.wverifiedUserName2;

              this.approvalStatus = data.approvalStatus; // 认同状态(1:认同;2:不认同)
              this.wplanVerifiedDate1 = data.wplanVerifiedDate1;
              this.wplanVerifiedDate2 = data.wplanVerifiedDate2;
            }

            data.workPlanDayList.forEach((item, index) => {
              let i = index == 0 ? this.weekArr.length - 1 : index - 1;
              this.weekArr[i].did = item.did;
              this.weekArr[i].dworkPlanDesPm = item.dworkPlanDesPm;
              this.weekArr[i].dworkPlanDesAm = item.dworkPlanDesAm; // 当日上午的工作计划
              this.weekArr[i].dworkReviewDesAm = item.dworkReviewDesAm;
              this.weekArr[i].dworkReviewDesPm = item.dworkReviewDesPm;
              if (
                (!this.did &&
                  item.dworkPlanDate == this.newDate.format("yyyy-MM-dd")) ||
                (this.did && this.did == item.did)
              ) {
                this.did = item.did;
                this.dstatus = item.dstatus;
                this.isJudge(item.dverifiedAdAcount1,item.dverifiedAdAcount2);
                console.log(this.dstatus, "dst");
                this.dreviewVerifiedOpinion1 = item.dreviewVerifiedOpinion1;
                this.dreviewVerifiedOpinion2 = item.dreviewVerifiedOpinion2;
                this.dreviewVerifiedDate1 = item.dreviewVerifiedDate1;
                this.dreviewVerifiedDate2 = item.dreviewVerifiedDate2;
                this.dverifiedUserName1 = item.dverifiedUserName1;
                this.dverifiedUserName2 = item.dverifiedUserName2;
              }
              if (item.dreviewVerifiedOpinion1) {
                let verifObj = {
                  dreviewVerifiedOpinion1: item.dreviewVerifiedOpinion1,
                  dreviewVerifiedOpinion2: item.dreviewVerifiedOpinion2,
                  dreviewVerifiedDate1: item.dreviewVerifiedDate1,
                  dreviewVerifiedDate2: item.dreviewVerifiedDate2,
                  dverifiedUserName1: item.dverifiedUserName1,
                  dverifiedUserName2: item.dverifiedUserName2,
                  wrApprovalStatus: item.wrApprovalStatus, // 1 认同 2 不认同
                  dworkPlanDate:item.dworkPlanDate // 审批的回顾对应日期
                };
                this.dreviewVerifiedOpinionArr.push(verifObj);

              }
            });
          }else{
            this.clearView();
          }
        }).catch(err =>{
          console.log('err',err);
          if (err.code == -1 && err.msg == "无权限") {
            this.visitNumber = -1;
            this.isVisit = false;
          }
          this.overlayShow = false;
        })
    },
    // 接口方法 end

    handelChange(date) {
      this.getWeekOfYear(date.$d);
      this.year = date.$y;
    },
    createDate() {
      // 获取当前年
      var date = new Date();
      this.year = date.getFullYear();
    },
    getWeekOfYear(date) { // 返回当前是第几周
      var today;
      if (date) {
        today = date;
      } else {
        today = new Date();
      }
      var year = today.getFullYear(); //获取选中的当前年
      var firstDay = new Date(year, 0, 1);
      var dayOfWeek = firstDay.getDay(); //返回表示星期几的数字 0~6
      var spendDay = 1;
      if (dayOfWeek != 1 && dayOfWeek != 0) {
        spendDay = 7 - dayOfWeek + 1 + 1;
      } else if (dayOfWeek == 0) {
        spendDay = 2;
      }
      firstDay = new Date(year, 0, spendDay);
      // firstDay = new Date(today.getFullYear(),0, 1+spendDay);
      var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000); // 计算时间差 向上取整
      var result;
      if (d == 0) {
        result = 1;
      } else if (d < 0) {
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
        result = Math.ceil(d / 7) == 0 ? 1 : Math.ceil(d / 7);
        // result = Math.ceil(d/7) + 1;
      }
      this.year = year;
      this.numberOfWeeks = result;
      return result;
    },

  },
  computed: {
    placeholderPlanShow: function() {
      // 决定当日计划的提示信息
      if (
        this.numberOfWeeks >= this.numberOfWeeksNow &&
        this.numberOfWeeks <= this.numberOfWeeksNow + 3 &&
        this.h3Active == 1 &&
        this.wstatus != 1
      ) {
        return "未填写";
      }
    },
    placeholderShow: function() {
      // 决定周计划和回顾的提示信息
      if (
        this.h3Active == 2 &&
        this.wstatus == 3 &&
        this.numberOfWeeks > this.numberOfWeeksNow
      ) {
        return "未到回顾时间";
      } else if (this.h3Active == 2 && this.dstatus > 3) {
        return "未填写";
      } else if (
        this.h3Active == 2 &&
        this.numberOfWeeksNow > this.numberOfWeeks
      ) {
        return "未填写";
      } else {
        return "";
      }
    },
    lastNumberOfweeks: function() {
      // 上一周展示按钮
      var last = this.numberOfWeeks - 1;
      if (last < 1) {
        var year = this.year;
        var date = new Date(year - 1, "0", "1");
        var _week = date.getDay();
        if (_week != 1) {
          // 一年53周的情况
          last = 52; // 应该为53周 2018 1
        } else {
          //一年54周情况
          last = 53; // 52
        }
      }
      return last;

      var _week;
      var year = this.year;
      var date = new Date(year, "0", "1");

      if (this.numberOfWeeks < 1) {
        this.year--;
        var time = date.getTime();
        _week = date.getDay();
      } else {
        if (_week != 1) {
          // 一年52周的情况
          if (this.numberOfWeeks > 52) {
            this.year++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year, "0", "1");
            var time = date.getTime();
            _week = date.getDay();
          }
        } else {
          //一年53周情况
          if (this.numberOfWeeks > 53) {
            this.year++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year, "0", "1");
            var time = date.getTime();
            _week = date.getDay();
          }
        }
      }
    },
    nextNumberOfWeeks: function() {
      // 下一周展示按钮
      var next = parseInt(this.numberOfWeeks) + 1;
      var year = this.year;
      var date = new Date(year + 1, "0", "1");
      var _week = date.getDay();

      if (_week != 1) {
        // 一年52周的情况
        if (next > 52) {
          next = 1;
        }
      } else {
        //一年53周情况
        if (next > 53) {
          next = 1;
        }
      }
      return next;
    },
    wworkPlanReviewDes: {
      // 展示周计划 或 回顾
      set: function(newValue) {
        if (this.h3Active == 1) {
          this.wworkPlanDes = newValue;
        } else if (this.h3Active == 2) {
          this.wworkReviewDes = newValue;
        }
      },
      get: function() {
        if (this.h3Active == 1) {
          return this.wworkPlanDes;
        } else if (this.h3Active == 2) {
          return this.wworkReviewDes;
        }
      }
    },
    getXDate: function() {
      // 根据周数获取当前周的日期范围
      var _week;
      if (!this.year) {
        return "";
      }
      var year = this.year;
      var date = new Date(year, "0", "1");
      var time = date.getTime();
      _week = date.getDay();
      if (this.numberOfWeeks < 1) {
        this.year--;
        // let _week0 = new Date(this.year,"0","1").getDay();

        var date = new Date(this.year, "0", "1");
        var time = date.getTime();
        _week = date.getDay();
        // date = new Date(this.year,"0","1");
        // _week = date.getDay();
        if (_week != 1) {
          // 一年53周的情况
          this.numberOfWeeks = 52; // 应该为53周 2018 1
        } else {
          //一年54周情况
          this.numberOfWeeks = 53; // 52
        }
      } else {
        // var _week0 = new Date((this.year-1),"0","1").getDay();
        if (_week != 1) {
          // 一年52周的情况
          if (this.numberOfWeeks > 52) {
            this.year++;
            this.numberOfWeeks = 1;
            var date = new Date(this.year, "0", "1");
            var time = date.getTime();
            _week = date.getDay();
          }
        } else {
          //一年54周情况
          if (this.numberOfWeeks > 53) {
            this.year++;
            this.numberOfWeeks = 1;
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
      var nextYear = new Date(parseInt(year, 10) + 1, "0", "1"); // parseInt(str,10) 10进制解析字符串
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
      this.weekArr[0].date = date.getDate();
      this.weekArr[0].dateAll = date.format("yyyy-MM-dd");
      this.weekArrNull[0].dateAll = date.format("yyyy-MM-dd");
      for (var i = 1; i <= 6; i++) {
        start += 24 * 3600000;
        date.setTime(start);
        // arr.push(date.getDate());
        this.weekArr[i].date = date.getDate();
        this.weekArr[i].dateAll = date.format("yyyy-MM-dd");
        this.weekArrNull[i].dateAll = date.format("yyyy-MM-dd");
      }
      // this.weekArr = arr;
      var end = start;
      var end = time + this.numberOfWeeks * 7 * 24 * 3600000 - 24 * 3600000; //第n周结束时间
      // var end = time+(this.numberOfWeeks*7 - 1)*24*3600000- 24*3600000; //第n周结束时间
      // 为日期对象 date 重新设置成时间 time
      date.setTime(end);
      this.endDate = date.format("yyyy-MM-dd");
      var _end = date.format("MM-dd");
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
    h3ActiveS: {
      set: function(newValue) {
        // if(newValue == 0){
        //   this.h3Active = 2;
        // }else if(newValue == 3){
        //   this.h3Active = 1;
        // }else{
        //   this.h3Active = newValue;
        // }
        this.h3Active = newValue;
      },
      get: function() {
        if (this.h3Active == 0) {
          this.h3Active = 2;
        } else if (this.h3Active == 3) {
          this.h3Active = 1;
        }
        return this.h3Active;
      }
    }
  },
  watch: {
    h3Active: function(val) {
      console.log("val", val);
      this.$nextTick(function() {
        // 在下次 DOM 更新循环结束之后执行延迟回调。
        if (val == 2 && this.isFirstRequest) {
          this.listPosition();
        }
        this.showBtripServe(); // 查询出差和招待的图标
        this.isOnBusiness = false; // 是否展示审阅界面
        this.firstFocus(); // 更改是否聚焦
        console.log("改变了");
      });
      // this.required = false;
    },
    dstatus: function() {
      console.log(156);
    },
    getXDate: function() {
      this.getVisitorCount(); // 获取访客记录数
      this.queryClueCountForAtt() //  获取线索数量
      this.chanceStatistics(); //  商机统计
    },
    overlayShow: function(val, val0) {
      let _this = this;
      if (val) {
        this.overlayShowTime = setTimeout(function() {
          _this.myNotify("数据加载失败");
          _this.overlayShow = false;
        }, 5000);
      } else {
        clearTimeout(this.overlayShowTime);
      }
    },
    numberOfWeeks: function(val, val0) {
      // if(this.h3Active == 1){
      // }else if(this.h3Active == 2){
      this.selOneWeekPlan();
      // this.getWorkDay(); // 获取请假信息
      // }
    },
    isFirstRequest: function() {
      // 监听是否第一次请求数据了
      this.listPosition();
    }
  },
  beforeRouteLeave (to, from, next) { // 局部路由守卫
    let save = {
      weekArr:this.weekArr,
      wworkPlanDes:this.wworkPlanDes,
      wworkReviewDes:this.wworkReviewDes
    }
    setlocalStorage('save',save);
    next();
  }
};
</script>
<style lang="scss" scoped >
@import "workplanC";
</style>
<style lang="scss">
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
    margin: auto;
    font-size: 17px;
    line-height: 48px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    background: #7f7f7f;
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

#myVanTabs {
  // 切换框样式
  position: fixed;
  left: 0;
  right: 0;
  top: 60px;
  bottom: 46px;
  & > div.van-tabs__wrap.van-hairline--top-bottom {
    display: none;
  }
  & > div.van-tabs__content.van-tabs__content--animated {
    height: 100%;
  }
  .van-tab__pane {
    height: 100%;
    & > div {
      height: 100%;
    }
  }
}
</style>
