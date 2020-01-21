<template>
  <div class="wrap">
    <div class="detail-main">
      <div class="img-upload">
        <div class="iu-left">
          <p class="input-t">到达拍照上传</p>
          <div class="location">
            <span class="icon local-icon"></span>
            <span
              v-if="formdata.arriveProvice"
            >{{formdata.arriveProvice}}{{formdata.arriveCity}}{{formdata.arriveAddress}}{{formdata.arriveDescribe}}</span>
            <span v-else>无位置信息</span>
          </div>
          <div>
            <span class="icon time-icon"></span>
            <span v-if="arriveTime">{{arriveTime}}</span>
            <span v-else>- -:- -:- -</span>
          </div>
        </div>
        <div class="iu-right">
          <div class="show-img" v-if="readOnly">
            <van-image
              :src="formdata.arrivePictureUrl"
              fit="cover"
              @click="showPreview(formdata.arrivePictureUrl)"
            />
          </div>
          <van-uploader capture="camera" :after-read="afterRead" name="start" v-else>
            <div class="show-img" v-if="formdata.arrivePictureUrl">
              <van-image :src="formdata.arrivePictureUrl" fit="cover" />
            </div>
            <div class="upload-btn" v-else></div>
          </van-uploader>
        </div>
      </div>
      <div class="img-upload" v-if="formdata.arrivePictureUrl">
        <div class="iu-left">
          <p class="input-t">结束拍照上传</p>
          <div class="location">
            <span class="icon local-icon"></span>
            <span
              v-if="formdata.leaveProvice"
            >{{formdata.leaveProvice}}{{formdata.leaveCity}}{{formdata.leaveAddress}}{{formdata.leaveDescribe}}</span>
            <span v-else>无位置信息</span>
          </div>
          <div>
            <span class="icon time-icon"></span>
            <span v-if="leaveTime">{{leaveTime}}</span>
            <span v-else>- -:- -:- -</span>
          </div>
        </div>
        <div class="iu-right">
          <div class="show-img" v-if="readOnly">
            <van-image
              :src="formdata.leavePictureUrl"
              fit="cover"
              @click="showPreview(formdata.leavePictureUrl)"
            />
          </div>
          <van-uploader capture="camera" :after-read="afterRead" name="end" v-else>
            <div class="show-img" v-if="formdata.leavePictureUrl">
              <van-image :src="formdata.leavePictureUrl" fit="cover" />
            </div>
            <div class="upload-btn" v-else></div>
          </van-uploader>
        </div>
      </div>
      <div class="input-solo">
        <span class="input-t">记录人</span>
        <div class="input-con">
          <van-field v-model="currentUser" disabled />
        </div>
      </div>
      <div class="input-solo" @click="gotoaddressbook">
        <span class="input-t">内部随同人员</span>
        <div class="inneruser">
          <div v-if="!formdata.retinuePersonList[0]&&!readOnly" class="gray-font">
            <span>请选择随同人员</span>
            <s></s>
          </div>
          <div v-for="(item,index) of formdata.retinuePersonList" :key="index" class="inner-user">
            <span>{{item.personName}}</span>
            <s @click="deleterRetinue(index)" v-if="!readOnly"></s>
          </div>
        </div>
      </div>
      <div class="input-solo">
        <span class="input-t">外部随同人员</span>
        <div class="input-con">
          <van-field
            v-model="formdata.outRetinueName"
            :disabled="readOnly"
            :placeholder="readOnly?'':'请输入随同人员'"
            @input="showTips(formdata.outRetinueName,200,'out')"
          />
        </div>
      </div>
      <div class="input-solo" @click="showSelect">
        <div class="input-t">
          类型
          <span class="red">*</span>
        </div>
        <div class="category-div" v-if="!categoryname">
          <span class="gray-font">请选择拜访类型</span>
          <s></s>
        </div>
        <span v-if="categoryname" class="black-font">{{categoryname}}</span>
      </div>
      <div class="detail-ul" v-show="pickershow">
        <van-list :finished="true">
          <van-cell
            v-for="item in columns"
            :key="item.id"
            :title="item.name"
            @click="onChange(item)"
          />
        </van-list>
      </div>
      <div class="input-solo" v-if="nametype">
        <span class="input-t">
          {{nametype}}名称
          <span class="red">*</span>
        </span>
        <div class="input-con">
          <a
            :class="{link:true,active:formdata.customerDetailUrl?true:false}"
            :href="formdata.customerDetailUrl?decodeURIComponent(formdata.customerDetailUrl):'javascript:;'"
            v-if="readOnly"
          >
            {{formdata.visitObjectReq.name}}
            <!-- <s></s> -->
          </a>
          <van-field
            v-else
            v-model="formdata.visitObjectReq.name"
            :title="nametype"
            @input="changeCompany"
            :disabled="readOnly"
            :placeholder="'请输入'+nametype+'名称'"
          />
        </div>
      </div>
      <div class="select-con" v-show="companyshow">
        <div class="detail-ul company-ul" ref="company" v-if="companylist[0]">
          <van-list :finished="true">
            <van-cell
              v-for="item in companylist"
              :key="item.id"
              :title="item.name"
              @click="onchangeCom(item)"
            >
              <span class="com-new" v-show="item.sources === 2">新</span>
            </van-cell>
          </van-list>
        </div>
        <div class="empty" v-else>
          <p>系统尚未查询到该公司，是否继续创建！</p>
          <div class="btns">
            <span @click="createok">确定</span>
          </div>
        </div>
      </div>
      <div class="input-solo" v-if="nametype">
        <span class="input-t">{{nametype}}地址</span>
        <div class="input-con">
          <van-field
            v-model="formdata.visitObjectReq.customerAddress"
            :disabled="readOnly"
            :placeholder="readOnly?'':'请输入'+nametype+'地址'"
            @input="showTips(formdata.visitObjectReq.customerAddress,100,'address')"
          />
        </div>
      </div>
      <div class="input-solo">
        <div class="input-t">
          对方人员
          <span class="red">*</span>
        </div>
        <div class="input-con">
          <a
            :class="{link:true,active:formdata.contactDetailUrl?true:false}"
            :href="formdata.contactDetailUrl?decodeURIComponent(formdata.contactDetailUrl):'javascript:;'"
            v-if="readOnly"
          >
            {{formdata.contactsRelationReq.userName}}
            <!-- <s></s> -->
          </a>
          <van-field
            v-else
            v-model="formdata.contactsRelationReq.userName"
            :disabled="readOnly"
            placeholder="请输入对方人员"
            @input="showTips(formdata.contactsRelationReq.userName,200,'otherside')"
          />
        </div>
      </div>
      <div class="input-solo">
        <span class="input-t">手机号</span>
        <div class="input-con">
          <van-field
            v-model="formdata.contactsRelationReq.phoneNumber"
            @input="searchPhone"
            :disabled="readOnly"
            :placeholder="readOnly?'':'请输入手机号'"
          />
        </div>
      </div>
      <div class="select-con phone-con" v-if="phone[0]">
        <div
          class="showList"
          v-for="(item,index) of phone"
          :key="index"
          @click="changephone(item)"
        >{{item.phoneNumber}}</div>
      </div>
      <div class="input-solo">
        <span class="input-t">微信号</span>
        <div class="input-con">
          <van-field
            v-model="formdata.contactsRelationReq.weChat"
            :disabled="readOnly"
            :placeholder="readOnly?'':'请输入微信号'"
            @input="showTips(formdata.contactsRelationReq.weChat,50,'wechat')"
          />
        </div>
      </div>
      <div class="text-solo">
        <div class="input-t">
          访客目的
          <span class="red" v-if="!formdata.chanceId">*</span>
        </div>
        <div>
          <van-field
            rows="4"
            type="textarea"
            class="textarea-con"
            placeholder="请输入"
            v-model="formdata.visitorsPurpose"
            v-if="!readOnly"
            @input="showTips(formdata.visitorsPurpose,500,'aim')"
          />
          <div v-else class="read-detail" v-html="formdata.visitorsPurpose">
            <!-- {{formdata.visitorsPurpose}} -->
          </div>
        </div>
      </div>
      <div class="text-solo">
        <div class="input-t">
          访客记录
          <span class="red" v-if="!formdata.chanceId">*</span>
          <span class="blue">(所交流的事项与结果)</span>
          <!-- 从访客记录进入没有modelType参数;从其他入口(如同时圈,工作计划),有modelType参数 -->
          <span
            class="fr addSupply"
            v-if="readOnly&&!this.$route.query.modelType"
            @click="addSupply"
          >添加补充</span>
        </div>
        <div>
          <van-field
            rows="4"
            type="textarea"
            class="textarea-con"
            placeholder="请输入"
            v-model="formdata.visitorsRecord"
            v-if="!readOnly"
            @input="showTips(formdata.visitorsRecord,10000,'record')"
          />
          <div v-else class="read-detail" v-html="formdata.visitorsRecord">
            <!-- {{formdata.visitorsRecord}} -->
          </div>
        </div>
      </div>
      <div class="text-solo">
        <div class="input-t">
          资源需求
          <span class="red" v-if="!formdata.chanceId">*</span>
        </div>
        <div>
          <van-field
            rows="4"
            type="textarea"
            class="textarea-con"
            placeholder="请输入"
            v-model="formdata.resourceDemand"
            v-if="!readOnly"
            @input="showTips(formdata.resourceDemand,500,'demand')"
          />
          <div v-else class="read-detail" v-html="formdata.resourceDemand">
            <!-- {{formdata.resourceDemand}} -->
          </div>
        </div>
      </div>
      <div class="input-solo">
        <span class="input-t">下次拜访</span>
        <div class="inneruser" @click="!readOnly?showCalendar():''">
          <div class="gray-font">
            <span
              v-if="readOnly"
            >{{formdata.nextVisitDate?this.$moment(formdata.nextVisitDate).format("YYYY/MM/DD"):''}}</span>
            <span
              v-else
            >{{formdata.nextVisitDate?this.$moment(formdata.nextVisitDate).format("YYYY/MM/DD"):"请选择下次拜访时间"}}</span>
            <s v-if="!readOnly"></s>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-placeholder" v-if="!readOnly">
      <div class="btn-contain">
        <div class="btn-left" @click="delayChangeOptions(2)">提交</div>
        <div class="btn-right" @click="delayChangeOptions(1)">保存</div>
      </div>
    </div>
    <!-- 添加补充-->
    <van-dialog
      v-model="isAddSupply"
      title="添加补充"
      show-cancel-button
      :before-close="addSupplyClose"
    >
      <van-field
        v-model="addSupplyMessage"
        rows="4"
        :autosize="{ maxHeight: 200}"
        type="textarea"
        placeholder="请输入补充信息"
        style="border:1px solid rgba(75,119,175,0.2);margin:10px;width:auto"
      />
    </van-dialog>
    <!-- 下次拜访日期选择 -->
    <DatetimePickerPopup ref="datetimePickerPopup" @getDateHandler="getDateHandler" />
  </div>
</template>
<script>
import _ from "lodash";
import { getWxClient } from "@/utils/env";
import { Dialog, Toast ,ImagePreview} from "vant";
import wx from "weixin-js-sdk"; // 引入企业微信的sdk
import lrz from "lrz"; //压缩图片
import {
  visitorsUpload,
  saveOrUpdateVisitorsRecord,
  searchVisitName,
  selectRecordById,
  getContactsRelation,
  appendVisitorDetails
} from "@/apis/api/guestrecord";
import DatetimePickerPopup from "@/component/guestDirectory/DatetimePickerPopup";
import {
  formatTime,
  returnArr,
  getlocalStorage,
  setlocalStorage,
  handleReturnname,
  debounce
} from "@/utils/format";
export default {
  components: {
    DatetimePickerPopup
  },
  data() {
    return {
      cardTimer: null,
      cardClickTimer: null,
      currentUser: "",
      value: "",
      pickershow: false,
      companyshow: false,
      columns: [],
      companylist: [],
      formdata: {
        //新增访客参数
        visitType: null,
        visitObjectReq: {
          sources: 3
        },
        arrivePictureUrl: "",
        arriveProvice: "",
        arriveCity: "",
        arriveAddress: "",
        arriveDescribe: "",
        arriveLng: "",
        arriveLat: "",
        arriveDate: "",
        leavePictureUrl: "",
        leaveProvice: "",
        leaveCity: "",
        leaveAddress: "",
        leaveDescribe: "",
        leaveLng: "",
        leaveLat: "",
        leaveDate: "",
        retinuePersonList: [],
        outRetinueName: "",
        contactsRelationReq: {
          visitObjectId: "",
          userName: "",
          phoneNumber: "",
          weChat: ""
        },
        visitorsPurpose: "",
        visitorsRecord: "",
        resourceDemand: "",
        operationStatus: 0,
        nextVisitDate: ""
      },
      localData: {
        //上传文件参数
        file: null,
        lng: "",
        lat: ""
      },
      privewImg: "",
      finishImg: "",
      categoryname: "",
      nametype: "",
      arriveTime: "",
      leaveTime: "",
      phone: [],
      readOnly: false,
      isClick: true,
      isAddSupply: false, //是否展示添加补充弹窗
      addSupplyMessage: "", //添加补充信息
      clearCache: false
    };
  },
  created() {
    this.getDeny();
    this.delayChangeOptions = _.debounce(this.changeOptions, 300); //点击手动打卡
    document.body.style.backgroundColor = "#ffffff";
    document.title = "访客记录";
    this.columns = returnArr("columns");
    if (this.$route.query.type) this.readOnly = true;
  },
  // beforeRouteLeave(to,from,next){
  //   if(this.clearCache){
  //     to.meta.keepAlive=false
  //   }
  //   next()
  // },
  beforeCreate() {
    document.title = "";
  },
  mounted() {
    this.currentUser = localStorage.getItem("personName");
    //获取请求的数据
    if (this.$route.query.id) {
      let id = this.$route.query.id;
      this.getDetail(id);
    } else {
      //获取本地数据
      if (getlocalStorage("formdata")) {
        this.formdata = JSON.parse(getlocalStorage("formdata"));
        if (getlocalStorage("selectedArr")) {
          this.formdata.retinuePersonList = getlocalStorage("selectedArr");
        }
        this.handleDefaultdata();
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.cardTimer);
    clearInterval(this.cardClickTimer);
  },
  methods: {
    // 展示弹窗
    showCalendar() {
      this.$refs.datetimePickerPopup.show = true;
    },
    // 获取选择时间
    getDateHandler(date) {
      this.formdata.nextVisitDate = date;
    },
    // 获取定位授权
    getDeny() {
      wx.ready(function() {
        wx.getLocation({
          type: "gcj02",
          success: function(response) {},
          complete: function(response) {},
          fail: function(error) {
            const { errMsg, err_Info, err_reason } = error;

            // 用户没有开启定位权限
            if (
              errMsg == "getLocation:user deny" ||
              (errMsg == "getLocation:fail" &&
                err_Info == "error" &&
                err_reason == "user denied to authorize the LBS permissions.")
            ) {
              window.location.reload();
              // Dialog.alert({
              //   message: "请开启手机授权地理位置"
              // }).then(() => {

              // });
            }
          },
          cancel: function(response) {}
        });
      });
    },
    // 添加补充
    addSupply() {
      this.isAddSupply = true;
    },
    // 添加补充
    addSupplyClose(action, done) {
      if (action === "confirm") {
        if (this.addSupplyMessage) {
          appendVisitorDetails({
            id: this.$route.query.id ? this.$route.query.id : "",
            visitorsRecord: this.addSupplyMessage
          })
            .then(res => {
              if (res.code == 200) {
                this.addSupplyMessage = ""; //置空
                this.getDetail(this.$route.query.id);
                done();
              }
            })
            .catch(() => {
              this.addSupplyMessage = ""; //置空
              done();
            });
        } else {
          this.addSupplyMessage = ""; //置空
          done();
        }
      } else {
        this.addSupplyMessage = ""; //置空
        done();
      }
    },
    getDetail(id) {
      selectRecordById({ id }).then(res => {
        this.formdata = res.data;
        this.currentUser = res.data.userName;
        this.handleDefaultdata();
      });
    },
    handleDefaultdata() {
      if (this.formdata.arriveDate)
        this.arriveTime = formatTime(this.formdata.arriveDate, "second");
      if (this.formdata.leaveDate)
        this.leaveTime = formatTime(this.formdata.leaveDate, "second");
      this.sourceFrom();
      this.categoryname = handleReturnname(this.formdata.visitType, "columns");
      this.nametype = this.nameTypehandle(
        handleReturnname(this.formdata.visitType, "columns")
      );
    },
    showPreview(image) {
      ImagePreview([image]);
    },
    getLocationLat(rst, type) {
      const that = this;
      let hideFailToast = false;
      let num = 0;
      if (getWxClient() === "other") {
        Toast.clear();
      }

      clearTimeout(this.cardTimer);
      this.cardTimer = setTimeout(() => {
        Toast("网络异常，获取经纬度失败，请重新上传");
        hideFailToast = true; //已经超过规定时间，不允许wx.getLocation的success,fail提示
      }, 20000);
      clearInterval(this.cardClickTimer);
      // wx.ready(function() {
      // 部分安卓或ios手机点击一次，无法获取经纬度，需要快速多次点击才可以，模拟200ms触发一次获取经纬度
      // 部分安卓或ios手机重复点击，无法获取经纬度，只需一次点击才可以，模拟2s后再执行一次，不重复触发
      this.cardClickTimer = setInterval(() => {
        num++;
        if (num >= 10) {
          clearInterval(this.cardClickTimer);
          console.log(num, "定时器清除");
        }

        if (hideFailToast) {
          clearTimeout(that.cardTimer);
          clearInterval(this.cardClickTimer);
        } else {
          //    setTimeout(() => {
          //      hideFailToast=true

          //    }, 2000);
          // return
          wx.getLocation({
            type: "gcj02",
            success: function(response) {
              if (hideFailToast) {
                return;
              }
              const { latitude, longitude } = response;
              if (latitude && longitude) {
                hideFailToast = true;
                that.localData.lat = latitude; // 纬度，浮点数，范围为90 ~ -90
                that.localData.lng = longitude; // 经度，浮点数，范围为180 ~ -180。
                that.handleUpload(rst, type);
                clearTimeout(that.cardTimer);
                clearInterval(that.cardClickTimer);
                // 关闭自定义未授权弹窗
                Dialog.close();
              }
            },
            complete: function(response) {},
            fail: function(error) {
              const { errMsg } = error;
              // 用户没有开启定位权限
              if (
                errMsg == "getLocation:user deny"
                // ||
                // errMsg == "getLocation:nopermission" ||
                // errMsg == "getLocation:permission denied"
              ) {
                clearTimeout(that.cardTimer);
                clearInterval(that.cardClickTimer);
                Toast.clear();

                Dialog.alert({
                  message: "请开启手机授权地理位置"
                }).then(() => {
                  // on close
                  window.location.reload();
                });
              } else {
                // 网络或其他问题获取位置失败
                // Toast("网络异常，获取经纬度失败，请重新打卡。");
              }
            },
            cancel: function(response) {
              console.log(response, "cancel");

              clearTimeout(that.cardTimer);
              clearInterval(that.cardClickTimer);
              Toast.clear();
              Dialog.close();

              // that.Sentry.captureException({
              //   type: "cancel",
              //   error: response
              // });

              // 用户首页安装时候开启定位权限了，后面如果在应用管理里面关闭后台权限，会走到cancel回调函数
              // {errMsg:'getLocation:cancel'}
              Dialog.alert({
                message: "请开启手机授权地理位置."
              }).then(() => {
                window.location.reload();
              });
            }
          });
        }
      }, 200);
    },
    // getLocationLat(rst, type) {
    //   //获取经纬度
    //   let that = this;
    //   // that.localData.lat = "31.17226500";
    //   // that.localData.lng = "121.47045800";
    //   // that.handleUpload(rst, type);
    //   // wx.ready(function() {
    //     wx.getLocation({
    //       type: "gcj02",
    //       success: function(response) {
    //         that.localData.lat = response.latitude; // 纬度，浮点数，范围为90 ~ -90
    //         that.localData.lng = response.longitude; // 经度，浮点数，范围为180 ~ -180。
    //         that.handleUpload(rst, type);
    //       },
    //       fail: function(response) {
    //         Toast.clear()
    //         Dialog.alert({
    //           message: "请开启手机授权地理位置"
    //         }).then(() => {
    //           window.location.reload();
    //         });
    //       },
    //       cancel: function(response) {
    //         Toast.clear()
    //         Dialog.alert({
    //           message: "请开启手机授权地理位置"
    //         });
    //       }
    //     });
    //   // });
    // },
    //压缩图片
    afterRead(file, type) {
      Toast.loading({
        message: "图片上传中...",
        duration: 0, // 持续展示 toast
        forbidClick: true
        // className:'layer-toast',
        // loadingType: 'spinner'
      });
      let that = this;
      lrz(file.file, {
        width: 500,
        quality: 0.5 //自定义使用压缩方式
      })
        .then(function(rst) {
          console.log("压缩成功", rst);
          that.getLocationLat(rst, type);
        })
        .catch(function(error) {
          console.log("压缩失败", error);
          Toast("压缩失败");
        });
    },
    //上传图片
    handleUpload(file, type) {
      let params = file.formData; //创建form对象
      params.append("lng", this.localData.lng);
      params.append("lat", this.localData.lat);
      visitorsUpload(params)
        .then(res => {
          Toast.clear();
          if (res.code == 200) {
            this.handlePhotoinfo(res.data, type);
          }
        })
        .catch(() => {
          Toast.clear();
        });
    },
    handlePhotoinfo(data, type) {
      //上传返回数据处理
      if (type.name === "start") {
        //区分到达还是结束拍照
        this.formdata.arrivePictureUrl = data.file;
        this.formdata.arriveProvice = data.province;
        this.formdata.arriveCity = data.city;
        this.formdata.arriveAddress = data.district;
        this.formdata.arriveDescribe = data.street;
        this.formdata.arriveLng = data.lng;
        this.formdata.arriveLat = data.lat;
        this.formdata.arriveDate = data.uploadTime;
        this.arriveTime = formatTime(data.uploadTime, "second");
      } else {
        this.formdata.leavePictureUrl = data.file;
        this.formdata.leaveProvice = data.province;
        this.formdata.leaveCity = data.city;
        this.formdata.leaveAddress = data.district;
        this.formdata.leaveDescribe = data.street;
        this.formdata.leaveLng = data.lng;
        this.formdata.leaveLat = data.lat;
        this.formdata.leaveDate = data.uploadTime;
        this.leaveTime = formatTime(data.uploadTime, "second");
      }
      this.formdata = { ...this.formdata };
    },
    nameTypehandle(value) {
      if (value !== "项目") {
        value = "客户";
      }
      return value;
    },
    sourceFrom() {
      this.formdata.visitObjectReq.sources = this.formdata.visitObjectReq
        .sources
        ? this.formdata.visitObjectReq.sources
        : 3;
    },
    showTips(value, num, type) {
      //禁止输入表情
      let emojiReg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
      let txt = `请输入0-${num}个字符`;
      value = value.replace(emojiReg, "");
      switch (type) {
        case "out":
          this.formdata.outRetinueName = value;
          if (value.length > num) {
            this.formdata.outRetinueName = value.substr(0, num);
            Toast(txt);
          }
          break;
        case "otherside":
          this.formdata.contactsRelationReq.userName = value;
          if (value.length > num) {
            this.formdata.contactsRelationReq.userName = value.substr(0, num);
            Toast(txt);
          }
          break;
        case "wechat":
          this.formdata.contactsRelationReq.weChat = value;
          if (value.length > num) {
            this.formdata.contactsRelationReq.weChat = value.substr(0, num);
            Toast(txt);
          }
          break;
        case "aim":
          this.formdata.visitorsPurpose = value;
          if (value.length > num) {
            this.formdata.visitorsPurpose = value.substr(0, num);
            Toast(txt);
          }
          break;
        case "record":
          this.formdata.visitorsRecord = value;
          if (value.length > num) {
            this.formdata.visitorsRecord = value.substr(0, num);
            Toast(txt);
          }
          break;
        case "demand":
          this.formdata.resourceDemand = value;
          if (value.length > num) {
            this.formdata.resourceDemand = value.substr(0, num);
            Toast(txt);
          }
          break;
        case "pname":
          this.formdata.visitObjectReq.name = value;
          if (value.length > num) {
            this.formdata.visitObjectReq.name = value.substr(0, num);
            Toast(txt);
          }
          break;
        case "address":
          this.formdata.visitObjectReq.customerAddress = value;
          if (value.length > num) {
            this.formdata.visitObjectReq.customerAddress = value.substr(0, num);
            Toast(txt);
          }
          break;
      }
    },
    gotoaddressbook() {
      if (this.readOnly) return;
      setlocalStorage("formdata", JSON.stringify(this.formdata));
      this.setSelectedarr();
      this.$router.push("addressbook");
    },
    deleterRetinue(index) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation();
      this.formdata.retinuePersonList.splice(index, 1);
      this.setSelectedarr();
    },
    setSelectedarr() {
      setlocalStorage("selectedArr", this.formdata.retinuePersonList);
    },
    showSelect() {
      if (this.readOnly) return;
      this.pickershow = true;
    },
    onChange(value) {
      this.categoryname = value.name;
      this.nametype = this.nameTypehandle(value.name);
      this.formdata.visitType = value.id;
      this.formdata.visitObjectReq.name = "";
      this.pickershow = false;
      this.companyshow = false;
    },
    searchVisit: debounce(
      function() {
        let name = this.formdata.visitObjectReq.name;
        let visitType = this.formdata.visitType;
        if (name && visitType) {
          searchVisitName({ name, visitType }).then(res => {
            this.companyshow = true;
            this.companylist = res.data;
            if (this.formdata.visitObjectReq.name === "")
              this.companyshow = false;
            this.$nextTick(() => {
              if (this.$refs.company) {
                this.$refs.company.scrollTop = 0;
              }
            });
          });
        }
      },
      500,
      true
    ),
    changeCompany() {
      if (this.formdata.visitObjectReq.name === "") this.companyshow = false;
      this.showTips(this.formdata.visitObjectReq.name, 50, "pname");
      this.searchVisit();
    },
    onchangeCom(value) {
      this.formdata.visitObjectReq.name = value.name;
      this.formdata.visitObjectReq = value;
      this.companyshow = false;
      this.sourceFrom();
    },
    searchPhone() {
      let visitObjectId = this.formdata.visitObjectReq.id;
      let phoneNumber = this.formdata.contactsRelationReq.phoneNumber;
      phoneNumber = phoneNumber.replace(/[^0-9]+/g, "");
      phoneNumber = phoneNumber.substr(0, 11);
      this.formdata.contactsRelationReq.phoneNumber = phoneNumber;
      if (phoneNumber.length === 11)
        getContactsRelation({ visitObjectId, phoneNumber }).then(res => {
          if (res.data) this.phone = [...this.phone, ...res.data];
        });
    },
    changephone(value) {
      if (!this.formdata.contactsRelationReq.userName)
        this.formdata.contactsRelationReq.userName = value.userName;
      if (!this.formdata.contactsRelationReq.weChat)
        this.formdata.contactsRelationReq.weChat = value.weChat;
      this.phone = [];
    },
    createok() {
      this.formdata.visitObjectReq.sources = 3;
      this.companyshow = false;
    },
    changeOptions(type) {
      this.formdata.operationStatus = type;
      if (this.isClick) this.saveRecord();
    },
    saveRecord() {
      const toast = Toast.loading({
        message: this.formdata.operationStatus === 1 ? "保存中" : "提交中...",
        duration: 0, // 持续展示 toast
        forbidClick: true
        // className:'layer-toast',
        // loadingType: 'spinner'
      });
      this.isClick = false;
      saveOrUpdateVisitorsRecord(this.formdata)
        .then(res => {
          toast.clear();
          let txt = "提交成功";
          if (this.formdata.operationStatus === 1) txt = "保存成功";
          Toast({ message: txt, duration: 600 });
          setlocalStorage("formdata", "");
          setlocalStorage("selectedArr", "");
          setTimeout(() => {
            this.clearCache = true;
            this.$router.push("visitorlist");
            // this.$router.go(-1); //返回上一层
            this.isClick = true;
          }, 600);
        })
        .catch(error => {
          toast.clear();
          this.isClick = true;
        });
    }
  }
};
</script>
<style lang="scss">
.input-con {
  .link {
    font-size: 15px;
    color: #333;
    margin-right: 17px;
    position: relative;
    max-width:200px;
    display: inline-block;
@include ellipsis;
    &.active {
      color: #4b77af;
      // text-decoration: underline;
      s {
        display: block;
      }
    }
    s {
      position: absolute;
      right: -16px;
      top:0;
      margin-top:0!important;
      display: none;
      z-index: 1;
    }
  }
  .van-cell {
    line-height: 32px;
  }
  .van-field__control {
    text-align: right;
  }
}
.textarea-con {
  .van-cell {
    padding: 5px;
    textarea {
      font-size: 15px;
    }
  }
}
.show-img {
  .van-image {
    border-radius: 4px;
    width: 108px;
    height: 68px;
  }
}
.input-con {
  input {
    font-size: 15px;
  }
}
.input-con {
  .van-field__control:disabled {
    color: #333;
    -webkit-text-fill-color: #333;
    background-color: transparent;
    opacity: 1;
  }
}
.company-ul {
  .van-cell__value {
    width: 30px;
    flex: none;
    flex-shrink: 1;
  }
  .van-list__placeholder {
    height: 20px;
  }
}
</style>
<style lang="scss" scoped>
$border: 1px solid rgba(75, 119, 175, 0.2);
.wrap {
  padding-bottom: 100px;
}
.detail-main {
  margin: 0 26px;
}
.img-upload {
  border-bottom: $border;
  display: flex;
  justify-content: space-between;
}
.upload-btn {
  width: 108px;
  height: 68px;
  background: #eeeeee url(../../../static/imgs/photo.png) no-repeat center;
  background-size: 22px 19px;
  border-radius: 4px;
}
.show-img {
  width: 108px;
  height: 68px;
  border-radius: 4px;
  overflow: hidden;
}
.show-loadding {
  text-align: center;
  line-height: 68px;
}
.iu-right {
  margin: 10px 5px 20px 0;
}
.iu-left {
  span {
    color: #848484;
  }
}
.icon {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  width: 12px;
}
.location {
  margin-bottom: 5px;
}
.local-icon {
  background: url(../../../static/imgs/local.png) no-repeat center;
  background-size: 12px 14px;
  height: 14px;
}
.time-icon {
  background: url(../../../static/imgs/time.png) no-repeat center;
  background-size: 12px 12px;
  height: 12px;
}
.inneruser {
  font-size: 15px;
  max-width: 210px;
  height: 50px;
  display: flex;
  overflow-x: auto;
  div {
    display: flex;
    flex-shrink: 0;
    margin-left: 6px;
  }
  .inner-user s {
    background: #4b77af url(../../../static/imgs/close-c.png) no-repeat center;
    background-size: 15px 15px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-top: 19px;
    margin-left: 2px;
  }
}
.input-solo {
  display: flex;
  height: 52px;
  line-height: 52px;
  border-bottom: $border;
  justify-content: space-between;
  s {
    background: url(../../../static/imgs/trangel.png) no-repeat center;
    width: 12px;
    height: 20px;
    background-size: 12px 20px;
    margin-top: 16px;
  }
}
.category-div {
  display: flex;
  line-height: 50px;
  s {
    display: block;
    margin-left: 5px;
  }
}
.com-new {
  color: #d75252;
  border: 1px solid #d75252;
  border-radius: 7px;
  font-size: 12px;
  padding: 0 6px;
  margin: -2px 0;
  flex-shrink: 0;
}
.red {
  color: #ff0000;
  padding-left: 3px;
  display: inline-block;
  vertical-align: middle;
}
.blue {
  color: #4b77af;
}
.input-t {
  flex-shrink: 0;
  font-size: 15px;
  font-weight: 700;
}
.input-con {
  width: 100%;
  text-align: right;
  input {
    font-size: 15px;
  }
}
.text-solo {
  padding-top: 15px;
}
.textarea-con {
  margin-top: 15px;
  border: $border;
  border-radius: 4px;
}
.bottom-placeholder {
  height: 52px;
}
.btn-contain {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -1px 8px #3488c2;
  div {
    width: 50%;
    float: left;
    height: 42px;
    font-size: 20px;
    line-height: 42px;
    font-weight: 600;
    border: 0;
    text-align: center;
  }
  .btn-left {
    background: #fff;
    color: #4b77af;
  }
  .btn-right {
    background: #4b77af;
    color: #fff;
  }
}

.detail-ul {
  border-top: none;
  height: 150px;
  overflow: auto;
  box-shadow: 0 1px 4px #a0bcde;
  margin-bottom: 4px;
}
.company-ul {
  max-height: 300px;
  overflow: scroll;
}
.select-con {
  height: 130px;
  box-shadow: 0 1px 4px #a0bcde;
  overflow: hidden;
  position: relative;
  margin-bottom: 5px;
}
.phone-con {
  height: 40px;
}
.showList {
  line-height: 40px;
  font-size: 15px;
  text-align: center;
}
.black-font {
  font-size: 15px;
  padding-right: 15px;
}
.cate-font {
  padding-right: 15px;
}
.gray-font {
  span {
    padding-right: 5px;
  }
  font-size: 15px;
  color: #999;
}
.empty {
  margin-top: 30px;
  p {
    text-align: center;
    font-size: 15px;
    // padding: 30px 0;
  }
  .btns {
    display: flex;
    margin-top: 30px;
    justify-content: center;
    span {
      width: 66px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      border-radius: 30px;
      border: 1px solid #4b77af;
      color: #4b77af;
      font-size: 16px;
    }
    .cancel {
      border: 1px solid #d75252;
      color: #d75252;
      margin-right: 23px;
    }
  }
}
.read-detail {
  font-size: 15px;
  padding: 10px 0;
  border: none;
  border-bottom: $border;
  word-break: break-all;
}
.addSupply {
  color: #4b77af;
  font-size: 15px;
  font-weight: normal;
}
</style>
