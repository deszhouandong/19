<template>
  <div class="workplan">
    <div id="review" :style="viewShow == 'review'?'':'display:none'">
      <van-nav-bar class="vanNavBar">
        <div slot="left" @click="workPlanClick" v-if="h3Active == 1">
          <van-icon name="arrow-left" />
          <span>第{{lastNumberOfweeks}}周</span>
        </div>
        <div slot="left" @click="workPlanClick" v-if="h3Active == 2">
          <van-icon name="arrow-left" />
          <span>计划</span>
        </div>
        <div slot="title" @click="optionDate()">
          <div class="center">
            <div class="title_h3" v-if="h3Active == 1">
              工作计划
              <!-- <div v-show="thisName" style="
                position:absolute;left:67%;top:0;bottom:0;margin:auto 0;
                font-size:12px;font-weight:400;color:rgba(72,72,72,1);line-height:15px;
                border-left:1px solid #007AFF;height:15px;padding-left:3px;
              ">{{thisName}}</div>-->
            </div>
            <div class="title_h3" v-if="h3Active == 2">
              工作回顾
              <!-- <div v-show="thisName" style="
                position:absolute;left:67%;top:0;bottom:0;margin:auto 0;
                font-size:12px;font-weight:400;color:rgba(72,72,72,1);line-height:15px;
                border-left:1px solid #007AFF;height:15px;padding-left:3px;
              ">{{thisName}}</div>-->
            </div>
            <div class="title_span">{{year}}年 第{{numberOfWeeks}}周 {{getXDate}}</div>
          </div>
        </div>
        <div slot="right" @click="workReviewClick" v-if="h3Active == 1">
          <span>回顾</span>
          <van-icon name="arrow" />
        </div>
        <div slot="right" @click="workReviewClick" v-if="h3Active == 2">
          <span>第{{nextNumberOfWeeks}}周</span>
          <van-icon name="arrow" />
        </div>
      </van-nav-bar>

      <div
        @touchstart="start($event)"
        @touchmove="moveFn($event)"
        @touchend="end($event)"
        :class="move"
        id="tabDiv"
      >
          <!-- :style="(h3Active == 2 && numberOfWeeks<numberOfWeeksNow )||(h3Active == 1 && wstatus == 3)||(h3Active == 2&&dstatus == 5)||(h3Active == 2&&wstatus != 3)||(h3Active == 1 && (numberOfWeeks<numberOfWeeksNow || numberOfWeeks>numberOfWeeksNow+3) ) ?'padding-bottom:0px;':''" -->
        <div
          class="list"
          @scroll="listScroll"
          ref="list"
        >
          <div class="first" ref="first">
            <div class="title">
              <div style="display:inline-block;vertical-align: middle;height:100%;">{{numberOfWeeks}}周</div>
              <!-- 显示访客次数 -->
              <div
                v-if="h3Active == 2 && visitNumber!=0"
                style="height:100%;width:1px;display:inline-flex;align-items:center;vertical-align: middle;"
              >
                <div style="height:18px;width:0px;border-right:1px solid #007AFF;"></div>
              </div>
              <div v-if="h3Active == 2 && visitNumber!=0" id="visitNumber" @click="toVisitorlist" class="firstTitle">
                <van-image :src="imgSrc" />
                <span class="visitNumber_span">{{visitNumber}}次拜访</span>
              </div>
              <!-- 商机 && dataBusiness -->
              <div v-if="h3Active == 2 && dataBusiness" id="business" class="firstTitle">
                <van-image :src="businessImg" width="18" height="18"/>
                <span><a :href="toBusiness('Buslist')">{{dataBusiness}}个商机</a></span>
              </div>
              <!-- 线索 && dataClue -->
              <div v-if="h3Active == 2 && dataClue" id="clue" class="firstTitle">
                <van-image :src="clueImg" width="16" height="16"/>
                <span> <a :href="toBusiness('cluelist')">{{dataClue}}条线索</a></span>
              </div>

              <!-- 出差预算 -->
              <!-- <div style="display:inline-flex;vertical-align:middle;">
                <i style="border-left:1px solid #007AFF;font-size:12px;margin-right:10px;"></i>
                <van-image :src="chuchaiImgSrc" />
                <span style="font-size:11px;font-weight:500;color:rgba(0,122,255,1);margin-left:5px;line-height:16px;">预算：400 实际：380.8</span>
              </div>-->
            </div>
            <!-- :required="(h3Active == 1 && wworkPlanReviewDes.length == 0)||(h3Active == 2 && newDate.getDay() == 5 && wworkPlanReviewDes.length == 0)?true:false"  -->
            <!-- :error-message="wworkPlanReviewDes.length == 0?'该出为必填项':''" -->
            <van-field
              class="line"
              v-model="wworkPlanReviewDes"
              :readonly="isReadonly()"
              :error-message="required?'该处为必填项':''"
              :required="required"
              type="textarea"
              :maxlength="textLength"
              @input="addLocalstorage"
              :rows="firstRows"
              style="border-radius:4px;border:1px solid rgba(75,119,175,0.2);box-sizing: border-box;min-height:63px"
              :placeholder="placeholderShow"
              @click="(wstatus != 1 && h3Active == 1) || ( h3Active == 2 && dstatus != 3 )?clickInput(wworkPlanReviewDes,numberOfWeeks+'周'):null"
              @focus="firstFocus();onFocusWorkPlan()"
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
              <div class="itemUp itemText">
                <div class="itemTextTitle">上午</div>
                <!-- :placeholder="(wstatus == 1 && butisShow()) ? '请填写当日工作计划' : ''"  -->
                <van-field
                  class="line"
                  v-if="h3Active == 1 && !item.disabledUp"
                  v-model="item.dworkPlanDesAm"
                  :placeholder="placeholderPlanShow"
                  :maxlength="textLength"
                  type="textarea"
                  :rows="3"
                  @input="addLocalstorage"
                  @click="(wstatus != 1 && h3Active == 1)?clickInput(item.dworkPlanDesAm,'周'+fontChange(index)+'  '+item.date+'日'):null"
                  :disabled="!butisShow()"
                  @focus.stop="fieldFocus($event)"
                  @blur="fieldFocus($event)"
                  style="color:#fff;"
                ></van-field>
                <!-- :readonly="wstatus != 1 && wstatus >= 3"  -->
                <van-field
                  class="line"
                  v-if="h3Active == 2 && !item.disabledUp"
                  v-model="item.dworkReviewDesAm"
                  :placeholder="placeholderReviewShow(item)"
                  :maxlength="textLength"
                  :rows="3"
                  type="textarea"
                  :disabled="disabledReview(item)"
                  @input="addLocalstorage"
                  @click="disabledReview(item)?clickInput(item.dworkReviewDesAm,'周'+fontChange(index)+'  '+item.date+'日'):null"
                  @focus.stop="onFocus(index);fieldFocus($event)"
                  @blur="fieldFocus($event)"
                ></van-field>
                <!-- 休假 -->
                <div
                  v-show="item.disabledUp"
                  style="width:340px;height:18px;background:rgba(255,232,182,1);text-align:center;font-size:12px;font-weight:600;color:rgba(255,167,0,1);line-height:17px;"
                >{{item.disabledUp}}</div>
              </div>
              <div style="height:0;width:100%;border-top:1px dashed rgba(75,119,175,0.2);"></div>
              <div class="itemDown itemText">
                <div class="itemTextTitle">下午</div>
                <van-field
                  class="line"
                  v-if="h3Active == 1 && !item.disabledDown"
                  v-model="item.dworkPlanDesPm"
                  :placeholder="placeholderPlanShow"
                  :maxlength="textLength"
                  :rows="3"
                  type="textarea"
                  :disabled="!butisShow()"
                  @input="addLocalstorage"
                  @focus.stop="fieldFocus($event)"
                  @blur="fieldFocus($event)"
                  @click="(wstatus != 1 && h3Active == 1)?clickInput(item.dworkPlanDesPm,'周'+fontChange(index)+'  '+item.date+'日'):null"
                />

                 <van-field
                  class="line"
                  v-if="h3Active == 2 && !item.disabledDown"
                  v-model="item.dworkReviewDesPm"
                  :placeholder="placeholderReviewShow(item)"
                  :maxlength="textLength"
                  :rows="3"
                  type="textarea"
                  :disabled="disabledReview(item)"
                  @input="addLocalstorage"
                  @click="disabledReview(item)?clickInput(item.dworkReviewDesPm,'周'+fontChange(index)+'  '+item.date+'日'):null"
                  @focus.stop="onFocus(index);fieldFocus($event)"
                  @blur="fieldFocus($event)"
                />
                <!-- 休假 -->
                <div
                  v-show="item.disabledDown"
                  style="width:340px;height:18px;background:rgba(255,232,182,1);text-align:center;font-size:12px;font-weight:600;color:rgba(255,167,0,1);line-height:17px;"
                >{{item.disabledDown}}</div>
              </div>
            </li>
          </ul>
          <!-- 领导的回顾审核意见 -->
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
                  <span v-if="item.wrApprovalStatus == 2" >不认同  <span class="err">(说明：当天招待/出差相关费用未被认同，费用无法报销！)</span></span>
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
          <!-- 领导的计划审核意见 -->
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
              <div>
                <p
                  @click="clickInput(wplanDreviewVerifiedOpinio(1),'管理者意见')"
                >{{wplanDreviewVerifiedOpinio(1)}}</p>
                <div>
                  <span>{{wverifiedUserName1}}</span>
                </div>
                <div>
                  <span>{{wdDate(1)}}</span>
                </div>
              </div>
              <div>
                <p
                  @click="clickInput(wplanDreviewVerifiedOpinio(2),'管理者意见')"
                >{{wplanDreviewVerifiedOpinio(2)}}</p>
                <div>
                  <span>{{wverifiedUserName2}}</span>
                </div>
                <div>
                  <span>{{wdDate(1)}}</span>
                </div>
              </div>
            </div>
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
      <div class="but_b" v-on:click.stop="butSubmit($event)" v-if="butisShow()">
        <van-button plain type="primary">提交</van-button>
        <van-button type="info">保存</van-button>
        <van-button @click.stop="toTravelPlan($event)">出差/招待计划</van-button>
      </div>
      <div class="but_b" v-on:click.stop="butSubmit($event)" v-if="(dstatus == 3 && h3Active == 2)">
        <van-button plain type="primary">提交</van-button>
        <van-button type="info">保存</van-button>
        <!-- allowSeconded -->
        <van-button v-if="allowSeconded == 1" @click.stop="toReviewDetall">出差/报销回顾</van-button>
        <van-button v-else @click.stop="toTravelPlan($event)">出差/招待回顾</van-button>
      </div>
      <div class="but_b" v-if="(wstatus == 2 && h3Active == 1)">
        <van-button
          plain
          type="primary"
          @click.stop="withdraw"
          style="width:100%;background: #4B77AF;color: #fff;"
        >撤回</van-button>
        <!-- <button class="withdraw" >撤回</button> -->
      </div>
      <div class="but_b" v-if="(dstatus == 4 && h3Active == 2)">
        <van-button
          plain
          type="primary"
          @click.stop="withdraw"
          style="width:100%;background: #4B77AF;color: #fff;"
        >撤回</van-button>
        <!-- <button class="withdraw" @click="withdraw">撤回</button> -->
      </div>

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
              class
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
        v-model="tourShow"
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
        <van-image :src="shareImg" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { CellGroup, Dialog, Toast } from "vant";
import moment from "moment";
import Cookie from "@/apis/cookie";
import methods from "@/views/workPlan/workPlanJ.js";
import { getlocalStorage, setlocalStorage } from "@/utils/format";

export default {
  name: "workPlan",
  data() {
    return {
      dataBusiness:0, // 商机数据
      dataClue:0, // 线索数据

      businessImg:require("@static/imgs/workPlan/business.png"),// 商机图标
      clueImg:require("@static/imgs/workPlan/clue.png"), // 线索图标

      allowSeconded:0, // 决定是否展示出差报销回顾按钮

      isInit:true, // true 当前第一次加载页面
      // 引导图
      tourState: 3, // 引导图状态
      tour3: require("../../../static/imgs/tour.png"),
      tour2: require("../../../static/imgs/tour0.png"), // 飞机
      tour1: require("../../../static/imgs/tour1.png"), // 分享

      tourShow: false,
      shareImg: require("../../../static/imgs/share.svg"), // 分享按钮图标

      isFocusType: false, // 判断所有输入框是否聚焦
      adAcount: "", // 当前用户的adAcount
      initialScoll: null, //填写列表距离顶部的距离
      firstRows: 4, // 头部框所占行数

      thisName: localStorage.getItem("personName"),
      zhaodaiImgSrc: require("../../../static/imgs/zhaodai.svg"),
      zhaodaiImgGSrc: require("../../../static/imgs/zhaodai-zhihui.svg"),
      chuchaiImgSrc: require("../../../static/imgs/chuchai.svg"),
      chuchaiImgGSrc: require("../../../static/imgs/chuchai-zhihui.svg"),
      required: false, // 表单效验
      visitNumber: 0, //拜访次数
      imgSrc: require("../../../static/imgs/visit.png"), // 拜访次数的icon

      isFocus: true, // 判断回顾输入框是否已聚焦过

      textLength: 1000, // 输入框的可输入最大字符长度

      overlayShowTime: null, //login的计时器
      overlayShow: false, // 遮罩层状态

      onceStr: "未填写",
      dreviewVerifiedOpinionArr: [], // 领导审核回顾意见列表

      // 弹出层状态
      popupObj: {}, // 弹出层展示数据
      popupShow: false,
      popupText: "",
      popupTitle: "",
      popupName: "",
      popupDate: "",

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
      yearNow:null, // 当前的年数
      numberOfWeeks: 0, // 当前周数
      numberOfWeeksNow: 1, // 当前周数
      wworkPlanDes: "", // 周计划
      wworkReviewDes: "", // 周回顾
      startDate: null,
      endDate: null,
      // 弹出日期选择框的状态
      show: false, // 决定日期组件的显示与否
      calendarShow: false,
      defaultDate: new Date(),
      newDate: new Date(moment(new Date()).format("YYYY-MM-DD")), // 当前最新的

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
      activeNames: ["1"]
    };
  },
  created() {
    this.dateFormat();
    this.createDate();
    this.numberOfWeeksNow = this.getWeekOfYear(); // 缓存当前周数
    document.title = "计划与回顾";

    this.clearLocalstorage(); // 清理工作计划填写缓存
  },
  mounted() {
    this.initialScoll = this.$refs.list.offsetTop; // 获取页面初始化top
    // this.initialScoll = this.$refs.list.style.top; // 获取页面初始化top

    let obj = this.$route.query;
    this.adAcount = obj.adAcount
      ? obj.adAcount
      : Cookie.cookie.get("accountName");
    this.did = obj.did;
    if (obj.planReviewStatus == 1) {
      this.h3Active = 1;
      this.numberOfWeeks = obj.numberOfWeeks
        ? obj.numberOfWeeks
        : this.numberOfWeeks + 1;
    } else if (obj.planReviewStatus == 2) {
      this.h3Active = 2;
      this.numberOfWeeks = obj.numberOfWeeks
        ? obj.numberOfWeeks
        : this.numberOfWeeks;
    }

    this.showBtripServe(); // 查询出差和招待的图标
    this.tourIs(); // 决定是否出现导图
    console.log("wstatus", this.wstatus);

  },

  updated() {
    // this.listPosition();
  },
  methods: {
    ...methods
  },
  computed: {
    numberOfWeeksNum:function(){ // 当前年的总周数
      if(new Date(this.yearNow, "0", "1").getDay() != 1){
        return 52;
      }else{
        return 53;
      }
    },
    placeholderPlanShow: function() { // 决定当日计划的提示信息 过
      let bl
      if(this.year > this.yearNow){
        bl = (this.numberOfWeeks + this.numberOfWeeksNum) >= this.numberOfWeeksNum && (this.numberOfWeeks + this.numberOfWeeksNum) <= this.numberOfWeeksNow + 2
      }else{
        bl = this.numberOfWeeks >= this.numberOfWeeksNow && this.numberOfWeeks <= this.numberOfWeeksNow + 2
      }
      if (this.wstatus == 1 && this.butisShow()) {
        return "请填写当日工作计划";
      } else if ( bl && this.h3Active == 1 && this.wstatus != 1 ) {
        return "未填写";
      }
    },
    placeholderShow: function() { // 决定周计划和回顾的提示信息 过
      let numberOfWeeks = this.numberOfWeeks;
      if(this.year > this.yearNow){
        numberOfWeeks = this.numberOfWeeks + this.numberOfWeeksNum;
      }
      if (  !(    (this.wstatus != 1 && this.h3Active == 1) || (this.h3Active == 2 && this.dstatus != 3) ) ) {
        if (this.h3Active == 1 && this.butisShow()) {
          return "请填写本周重点工作";
        } else if (this.h3Active == 2) {
          return "请填写本周总结报告";
        }
      } else if (this.h3Active == 2 && numberOfWeeks > this.numberOfWeeksNow ) {
        //
        // }else if(this.h3Active == 2 && this.wstatus == 3 && this.numberOfWeeks > this.numberOfWeeksNow){
        return "未到回顾时间";
      } else if (this.h3Active == 2 && this.dstatus > 3) {
        return "已过填写日期，无法填写";
      } else if ( this.h3Active == 2 && this.numberOfWeeksNow > numberOfWeeks ) {
        return "已过填写日期，无法填写";
      } else if ( this.h3Active == 2 && this.numberOfWeeksNow <= numberOfWeeks && this.wstatus < 3 ) {
        return "请先完成本周工作计划，并通过领导审批";
      } else {
        return "";
      }
    },
    lastNumberOfweeks: function() { // 上一周展示按钮
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
    nextNumberOfWeeks: function() { // 下一周展示按钮
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
    // wplanVerifiedOpinion dreviewVerifiedOpinion

    wworkPlanReviewDes: { // 展示周计划 或 回顾
      set: function(newValue) {
        newValue = newValue.replace(/(^\s*)|(\s*$)/g, "");
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
    getXDate: function() { // 根据周数获取当前周的日期范围
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
    fontChange: function() { // 根据索引决定星期几
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
    h3ActiveS: { // h3Active 的特殊算法
      set: function(newValue) {
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
    weekArr: function(val) {
      console.log("更改了111");
    },
    tourState: function(val) {
      if (val <= 0) {
        this.tourShow = false;
        Cookie.cookie.set("tourShow", 0);
      }
    },
    h3Active: function(val, val0) {
      this.$nextTick(function() {
        // 在下次 DOM 更新循环结束之后执行延迟回调。
        this.listPosition();
        this.showBtripServe(); // 查询出差和招待的图标
      });
      this.required = false;
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
          console.log('this.errSrc',this.errSrc);
          _this.$router.push({
            path:"worke",params:{ src:this.errSrc }
          });
        }, 20000);
      } else {
        clearTimeout(this.overlayShowTime);
      }
    },
    numberOfWeeks: function(val, val0) {
      this.selOneWeekPlan();
      this.getWorkDay();
    }
  },
  beforeRouteLeave (to, from, next) { // 局部路由守卫
    let save = {
      weekArr:this.weekArr,
      wworkPlanDes:this.wworkPlanDes,
      wworkReviewDes:this.wworkReviewDes
    }
    // Cookie.cookie.set('save',JSON.stringify(save)); // 缓存即将分享的内容
    // setlocalStorage('save',JSON.stringify(save));
    setlocalStorage('save',save);
    this.saveBefore();
    next();
  },
    beforeDestroy() {
        clearTimeout(this.overlayShowTime);
  },
};
</script>

<style lang="scss" scoped >
@import "workplanC";
</style>

<style lang="scss">
.van-field--disabled .van-field__control,
.van-field__right-icon {
  // 修改输入框的disabled文字样式
  -webkit-color: #000;
  -moz-color: #000;
  -o-color: #000;
  color: #000;
  -webkit-opacity: 1;
  -moz-opacity: 1;
  -o-opacity: 1;
  opacity: 1;
}

// vue 解决disabled的样式问题
#tabDiv .list textarea[disabled],
textarea:disabled,
textarea.disabled {
  // -webkit-text-fill-color:#000;  //会将提示文字也修改掉
  -webkit-text-fill-color: initial;
  -webkit-color: #000;
  -moz-color: #000;
  -o-color: #000;
  color: #000;
  -webkit-opacity: 1;
  -moz-opacity: 1;
  -o-opacity: 1;
  opacity: 1;
}
// vue 解决disabled的样式问题 end

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
