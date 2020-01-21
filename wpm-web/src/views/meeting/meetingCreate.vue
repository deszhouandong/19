<template>
  <div class="meetingCreate flexall meetingManage" >
    <div class="meetingCreate_form flex" style="padding-bottom:92px;background:rgba(244,244,244,1)">
      <van-cell-group>
        <!-- 开始时间 -->
        <van-field
          v-model="form['beginTime']"
          type="text"
          :required="required"
          readonly
          label="开始时间"
          placeholder
          @click="!isCom?dateShow('beginTime'):null"
        >
        <!-- @click-right-icon="!isCom?dateShow('beginTime'):null" -->
          <div class="form_rightIcon" slot="right-icon">
            <img :src="require('@/assets/images/dateIcon.png')" alt />
          </div>
        </van-field>
        <!-- 结束时间 -->
        <van-field
          v-model="form['endTime']"
          type="text"
          :required="required"
          readonly
          label="结束时间"
          placeholder
          @click="!isCom?dateShow('endTime'):null"
        >
          <div class="form_rightIcon" slot="right-icon">
            <img :src="require('@/assets/images/dateIcon.png')" alt />
          </div>
        </van-field>
        <!-- 会议地点 -->
        <van-field
          v-model="form['meetingPlace']"
          type="text"
          :required="required"
          readonly
          label="会议地点"
          :placeholder="!isCom?'请选择会议地点':''"
          @click="!isCom?showAddress = true:null"
          right-icon="arrow"
        ></van-field>
        <!-- 会议室 -->
        <van-field
          v-model="form['meetingRoom']"
          type="text"
          :required="required"
          :disabled="disabled"
          label="会议室"
          :placeholder="!isCom?'请选择会议室':''"
          @click-right-icon="!isCom?showRoom = true:null"
          right-icon="arrow"
        ></van-field>
        <!-- 会议名称 -->
        <van-field
          v-model="form['meetingName']"
          type="text"
          :required="required"
          :disabled="disabled"
          label="会议名称"
          :placeholder="!isCom?'请输入会议名称':''"
          @blur="formVuerify('meetingName')"
        ></van-field>
        <!-- 会议参加者 -->
        <van-field class="nameColor"
          type="text"
          :required="required"
          :disabled="disabled"
          readonly
          label="会议参加者"
          :placeholder="!isCom?'请选择会议参加者':''"
          right-icon="arrow"
          @click="!isCom?toSelect('confereeList'):null"
        >
          <div slot="input" v-if="form['confereeList'].length>0">
            <van-tag :key="key" v-for="(itm,key) in form['confereeList']" size="medium" type="success" style="margin:0 2px;">{{itm.confereeName}}</van-tag>
          </div>
        </van-field>
        <!-- 会议知会人 -->
        <van-field class="nameColor"
          type="text" label="会议知会人"
          readonly
          :placeholder="!isCom?'请选择会议知会人':''"
          :disabled="disabled"
          right-icon="arrow"
          @click="!isCom?toSelect('ccList'):null"
        >
          <div slot="input" v-if="form['ccList'].length>0">
            <van-tag :key="key" v-for="(itm,key) in form['ccList']" size="medium" type="success" style="margin:0 2px;">{{itm.ccName}}</van-tag>
          </div>
        </van-field>
        <!-- 会议类型 -->
        <van-field
          v-model="meetingType"
          type="text"
          readonly
          label="会议类型"
          :placeholder="!isCom?'请选择会议类型':''"
          @click="!isCom?showMeetingType = true:null"
          right-icon="arrow"
          :disabled="disabled"
        ></van-field>
      </van-cell-group>
      <van-cell-group>
        <!-- 会议说明 -->
        <van-field
          v-model="form['meetingExplain']"
          type="textarea"
          rows="3"
          autosize
          label="会议说明"
          :disabled="disabled"
          :placeholder="!isCom?'请输入会议说明':''"
          maxlength="100"
        ></van-field>
      </van-cell-group>
      <van-cell-group>
        <!-- 是否加密 -->
        <van-field v-model="form['isSecret']" type="text" label="是否加密" :disabled="disabled">
          <Radio
            slot="input"
            :change="val=>radioClick('isSecret',val)"
            :active="form['isSecret']"
            :dataList="[{label:'是',value:1},{label:'否',value:0}]"
            v-if="!isCom"
          />
          <div slot="input" v-if="isCom">{{form['isSecret']?"是":"否"}}</div>
        </van-field>
        <!-- 是否涉外 -->
        <van-field v-model="form['isConsultant']" type="text" label="是否涉外" :disabled="disabled">
          <Radio
            slot="input"
            :change="val=>radioClick('isConsultant',val)"
            :active="form['isConsultant']"
            :dataList="[{label:'是',value:1},{label:'否',value:0}]"
            v-if="!isCom"
          />
          <template v-if="isCom" slot="input">{{form['isConsultant']?"是":"否"}}</template>
        </van-field>
        <!-- 会议纪要 -->
        <van-field v-model="form['isSummary']" type="text" label="会议纪要" >
          <Radio
            slot="input"
            :change="val=>radioClick('isSummary',val)"
            :active="form['isSummary']"
            :dataList="[{label:'是',value:1},{label:'否',value:0}]"
            v-if="!isCom"
          />
          <template v-if="isCom && !(typeDB &&form['isSummary'] && staffType==1 && form['scheduleState'] !=3)" slot="input">{{form['isSummary']?"是":"否"}}</template>
          <van-uploader
            slot="input"
            class="uploadFile"
            :before-read="file=>beforeRead(file,'isSummary')"
            :after-read="afterRead"
            accept="*"
            v-if="(!shareType) && isCom && typeDB && form['isSummary'] && staffType==1 && form['scheduleState'] !=3"
          >
            <!-- <i class="uploadIcon"> -->
            <!-- </i> -->
            <van-image :src="uploading" style="vertical-align:text-bottom;"/>
            上传纪要
          </van-uploader>
        </van-field>
        <!-- 会议纪要文档列表 -->
        <van-collapse v-show="isCom && form['isSummary']&&((form.meetingSummaryList&&form.meetingSummaryList.length)||(meetingSummaryList&&meetingSummaryList.length))"  v-model="activeSummary" class="filesListDownload">
          <van-collapse-item title="会议纪要列表" name="1">
            <div v-for="(item,index) in meetingSummaryList" :key="'A'+index">
              <!-- <a :href="item.summaryUrl" :download="isDownload">{{item.summaryName}}</a> -->
              <a href="javascript:;" @click="viewFiles(item.summaryUrl,item.summaryName)">{{item.summaryName}}</a>
            </div>
            <div v-for="(item,index) in form.meetingSummaryList" :key="'B'+index">
              <!-- <a :href="item.summaryUrl" :download="isDownload">{{item.summaryName}}</a> -->
              <a href="javascript:;" @click="viewFiles(item.summaryUrl,item.summaryName)">{{item.summaryName}}</a>
            </div>
          </van-collapse-item>
        </van-collapse>
        <!-- 会议签到 -->
        <van-field v-model="form['isSignIn']" type="text" label="会议签到">
          <Radio
            slot="input"
            :change="val=>radioClick('isSignIn',val)"
            :active="form['isSignIn']"
            :dataList="[{label:'是',value:1},{label:'否',value:0}]"
             v-if="!isCom" 
          />
          <template v-if="isCom" slot="input">{{form['isSignIn']?"是":"否"}}</template>
        </van-field>
         <van-field
          v-model="form['bePresent']"
          type="text"
          readonly
          label="出席信息"
          v-if="isCom&&form['isSignIn']"
        ></van-field>
        <!-- 附件 -->
        <van-field v-model="form['meetingAccessoryListModel']" type="text" label="附件" v-if="(!shareType) && form['scheduleState'] !=3 && form['loginReceptionState'] !=2 && staffType==1||(!isCom)">
          <van-uploader
            slot="input"
            class="uploadFile"
            :before-read="file=>beforeRead(file,'accessoryList')"
            :after-read="afterRead"
            multiple
            accept="*"
            :max-count="10"
          >
            <!-- <i class="uploadIcon">
            </i> -->
            <van-image :src="uploading" style="vertical-align:text-bottom;"/>
            上传附件
          </van-uploader>
        </van-field>
        <!-- 附件文档列表 -->
        <van-collapse v-if="((form.meetingAccessoryList&&form.meetingAccessoryList.length)||(meetingAccessoryList&&meetingAccessoryList.length))"  v-model="activeAccessoryList" class="filesListDownload">
          <van-collapse-item title="附件列表" name="1">
            <div v-for="(item,index) in meetingAccessoryList" :key="'A'+index" >
              <!-- <a :href="item.accessoryUrl" :download="isDownload">{{item.accessoryName}}</a> -->
              <a href="javascript:;" @click="viewFiles(item.accessoryUrl,item.accessoryName)">{{item.accessoryName}}</a>
            </div>
            <div v-for="(item,index) in form.meetingAccessoryList" :key="'B'+index" >
              <!-- <a :href="item.accessoryUrl" :download="isDownload">{{item.accessoryName}}</a> -->
              <a href="javascript:;" @click="viewFiles(item.accessoryUrl,item.accessoryName)">{{item.accessoryName}}</a>
            </div>
          </van-collapse-item>
        </van-collapse>
        <div v-if="(!shareType) && typeDM&&typeDE" class="addConferee">
          <h6>新增参会人</h6>
          <div class="boxList">
            <!-- <div v-for="(item,i) in form['confereeList']" :key="i" class="item" > -->
            <div class="item" >
              <van-image :src="userImg" style="width:100%;height:100%;"/>
            </div>
            <div class="addBut item" @click="toAddSelect()">
              <van-image :src="addConferee" style="width:100%;height:100%;"/>
            </div>
          </div>
        </div>
      </van-cell-group>
    </div>
    <!-- 创建会议 -->
    <div class="meetingCreate_operate" v-if="(!shareType) && !isCom">
      <div class="sendInvite">
        <button @click="sendInvite" :disabled="sendInviteDisabled">发送会议邀请</button>
      </div>
    </div>
    <!-- 创建者 取消会议 -->
    <div class="meetingCreate_operate" v-if="(!shareType) && typeDM">
      <div class="sendInvite flexall-hor" style="display: flex;justify-content: space-between;">
        <button v-show="typeDM&&(!typeDB)" class="flex" style="color:rgba(0,122,255,1);background:rgba(244,244,244,1);" @click="cancelMeeting">取消会议</button>
        <button v-show="typeDM&&(!typeDB)" class="flex" style="background:rgba(102,155,223,1);" @click="accredit">授权代理</button>
        <button class="flex" style="background:rgba(75,119,175,1);" @click="saveSummary">保存会议纪要</button>
      </div>
    </div>
    <!-- 参会者 -->
    <div class="meetingCreate_operate" v-if="(!shareType) && typeD" @click="takeOrNo($event)">
      <div class="sendInvite flexall-hor" style="display: flex;justify-content: space-between;">
        <button v-show="form['loginPersonnelType']!=5" class="flex" style="color:rgba(0,122,255,1);background:rgba(244,244,244,1);">拒绝</button>
        <button v-show="(!typeDB)" class="flex" style="background:rgba(102,155,223,1);" @click.stop="accredit">授权代理</button>
        <button v-show="form['loginPersonnelType']!=5" class="flex" style="background:rgba(75,119,175,1);">接受</button>
      </div>
    </div>
    <!-- 日历插件 -->
    <van-popup v-model="showDatetime" position="bottom" :style="{ height: 'auto' }">
      <!-- :max-date="maxDate" -->
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        :min-hour="0"
        :max-hour="24"
        :filter="filter"
        @confirm="datetimeConfirm"
        @cancel="popup('showDatetime')"
      />
    </van-popup>
    <!-- 会议地点 -->
    <van-popup v-model="showAddress" position="bottom">
      <van-picker
        :columns="columnsAddress"
        show-toolbar
        title="请选择会议地点"
        @cancel="popup('showAddress')"
        @confirm="onConfirmAddress"
      />
    </van-popup>
    <!-- 会议室 -->
    <van-popup v-model="showRoom" position="bottom">
      <van-picker
        :columns="columnsRoom"
        show-toolbar
        title="请选择会议室"
        @cancel="popup('showRoom')"
        @confirm="onConfirmRoom"
      />
    </van-popup>
    <!-- 会议类型 -->
    <van-popup v-model="showMeetingType" position="bottom">
      <van-picker
        :columns="columnsMeetingType"
        show-toolbar
        title="请选择会议类型"
        @cancel="popup('showMeetingType')"
        @confirm="onConfirmMeetingType"
      />
    </van-popup>
    
  </div>
</template>
<script>
import moment from "moment";
import lrz from "lrz"; //压缩图片
import Radio from "@/component/meeting/radio";
import { getlocalStorage, setlocalStorage } from "@/utils/format";
export default {
  name: "meetingCreate",
  data() {
    return {
      placeId:0, // 会议地点id
      userImg:require("../../../static/imgs/userImg.png"), // 人员头像加载失败
      addConferee:require("../../../static/imgs/meeting/addConferee.png"), // 新增人员图标
      uploading:require("../../../static/imgs/meeting/uploading.png"), // 下载图标
      staffType:0, // 决定当前查看人员类型：1、创建会议者；2、参加会议者;3、知会人
      isDownload: window.navigator.userAgent.toLowerCase().match(/micromessenger/i) != 'micromessenger',
      required:true, // 决定表单是否必填 星号展示
      disabled:false, // 决定表单是否可编辑

      sendInviteDisabled: false, //发送按钮置灰

      id:null,
      form: {
        isSummary:1,
        isSignIn:1,
        isSecret:0,
        isConsultant:0,
      },
      files: null, //上传文档
      meetingSummaryList: [],//会议纪要文档
      meetingAccessoryList: [],
      activeSummary: [],
      activeAccessoryList: [],
      timer: "",//定义一个定时器的变量
      currentTime: new Date(), // 获取当前时间
      // 日期参数
      showDatetime: false, //日历显示
      minDate: new Date(),
      maxDate: new Date(moment().add(1, "months")),
      currentDate: new Date(),
      //地址参数
      showAddress: false,
      // columnsAddress: ["杭州", "宁波", "温州", "嘉兴", "湖州"],
      columnsAddress: [], // 会议地点列表
      showRoom: false,
      // columnsRoom: ["A001", "A002", "A003", "A004", "A005"],
      columnsRoom: [], // 会议室列表
      showMeetingType:false,
      columnsMeetingType:['部门工作会议','项目例会','评审会议','招待会议','其他会议'],
      shareType: 0,//是否是分享来的 0不是 1是
    };
  },
  props:{
    isCom:{ // 判断组件是否可编辑 true不可编辑
      default:false
    },
    formProps:{
      type:Object
    }
  },
  components: { Radio },
  created(){
    document.title = "会议管理";
    if(this.isCom){ // 当该页面为info的组件时
      var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
      this.timer = setInterval(function() {
        _this.currentTime = new Date()//修改数据date
      }, 1000);
      if(this.$route.params.form){
        this.id = this.$route.params.form.id;
      }
      if(this.formProps.id){
        this.id = this.formProps.id
      }
      this.shareType = this.$route.query.shareType=='1'?1:0;
      // this.form = this.setForm(this.$route.params.form);
      // this.form = this.setForm(this.$route.params.form);
    }else{
      this.form = getlocalStorage("meetingForm")?getlocalStorage("meetingForm"):this.form;
      this.listMeetingPlace();
    }
    this.meetingAccessoryList = getlocalStorage("meetingAccessoryList")||[];
    this.meetingSummaryList = getlocalStorage("meetingSummaryList")||[];
    this.initList(); // 拿缓存人员信息
  },
  beforeRouteEnter(to, from, next){
    if(from.name != 'meetingSelect' && !(from.name == null&&getlocalStorage("viewFiles"))){
        setlocalStorage("meetingAccessoryList",[]);
        setlocalStorage("meetingSummaryList",[]);
    }
    setlocalStorage("viewFiles",'');
    next();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  mounted() {
    this.init();
  },
  
  vuerify: {
    form: {
      beginTime: {
        required: true,
        message: "请选择开始时间"
      },
      endTime: {
        required: true,
        message: "请选择结束时间"
      },
      meetingPlace: {
        required: true,
        message: "请选择会议地点"
      },
      meetingRoom: {
        required: true,
        message: "请选择会议室"
      },
      meetingName: [
        {
          required: true,
          message: "请输入会议名称"
        },
        {
          test: /^.{1,16}$/,
          message: "会议名称不超过16个汉字"
        }
      ],
      confereeList: {
        required: true,
        message: "请选择会议参加者"
      },
      meetingExplain: {
        test: /^\S{0,100}$/,
        message: "会议说明不超过100个汉字"
      },
    }
  },
  computed: {
    typeC:function(){ // 当前是创建页面

    },
    typeDM:function(){ // 当前是详情页面 创会者
      return this.isCom && (this.staffType == 1) && (this.form['scheduleState'] != 3);
    },
    typeDB(){
      return this.currentTime>=new Date(moment(this.form['beginTime']));
    },
    typeDE(){
      return this.currentTime<=new Date(moment(this.form['endTime']));
    },
    typeD:function(){ // 当前是详情页面 参会者
      return this.isCom && (this.staffType == 2 || this.staffType == 5) && (this.form['scheduleState'] != 3) && (!this.form['loginReceptionState']) && this.typeDE;
    },
    meetingType:{
      set(val){
        this.meetingType = val;
      },
      get(val){
        let i =  this.form['meetingType'] - 1;
        return this.columnsMeetingType[i];
      }
    },
  },
  methods: {
    viewFiles(url,fileName){
      setlocalStorage("viewFiles",1);
      let downloadElement = document.createElement('a');
      downloadElement.href = url;
      if(this.isDownload){
        downloadElement.download = fileName; //下载后文件名
      }
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      setTimeout(()=>{
        document.body.removeChild(downloadElement); //下载完成移除元素
      },100)
    },
    listMeetingRoom(){ // 获取会议室
      this.$getData.listMeetingRoom({
        method:"post",
        data:{
          parentId:this.placeId
        }
      }).then(res=>{
        console.log("listMeetingRoom res",res);
        if(res.code == 200){
          this.columnsRoom = res.data.map(itm=>{
            return {
              ...itm,
              text:itm.address
            }
          })
        }
      })
    },
    listMeetingPlace(){ // 获取会议地点接口
      this.$getData.listMeetingPlace({
        method:"post",
      }).then(res=>{
        console.log("listMeetingPlace data");
        if(res.code == 200){
          this.columnsAddress = res.data.map(itm=>{
            return {
              ...itm,
              text:itm.address,
            }
          });
        }
      })
    },

    toAddSelect(){ // 跳转到添加人员页面
      console.log('点击了');
      let isAdd = {
        beginTime:moment(this.form.beginTime).format(),
        endTime:moment(this.form.endTime).format(),
        meetingNumber:this.form.meetingNumber,
        meetingName:this.form.meetingName
      }
      console.log('is',isAdd);
      this.$router.push({ name: 'meetingSelect', params: { isAdd }});
    },
    accredit(){ // 授权代理方法
    const text = `会议是否授权他人${this.form.loginPersonnelType==1?'主持':'参加'}会议？`
      this.$dialog.confirm({
        title: '提示信息',
        message: text
      }).then(() => {
        this.$router.push({
          name:"meetingSelect",
          params:{
            isAccredit:true, // 决定是以授权代理的方式进入页面
            form:{
              beginTime:moment(this.form['beginTime']).format(),
              endTime:moment(this.form['endTime']).format(),
              meetingNumber:this.form.meetingNumber,
              meetingName:this.form.meetingName
            },
            staffType:this.staffType
          }
        })
      }).catch(()=>{});
    },
    takeOrNo({target}){ // 接受或拒绝会议
      let receptionState = false;
      switch(target.innerText){
        case '接受': receptionState = 1;break;
        case '拒绝': receptionState = 2;break;
      }
      if(receptionState){
        let { meetingNumber,meetingName } = this.form;
        this.$getData.receiveOrRefuseTheMeeting({
          method:'post',
          data:{
            meetingNumber,
            receptionState,
            // receptionState	接收状态-0：未接收；1：已接收；2：不接收；	
            meetingName
          }
        }).then(res=>{
          window.location.reload();
          // this.$router.push('/meetingCreate');
        })
      }
    },
    setForm(form){
      // this.form = {}
      let resData = {
        ...form,
        beginTime:moment(form.beginTime).format('YYYY-MM-DD HH:mm'),
        endTime:moment(form.endTime).format('YYYY-MM-DD HH:mm')
      }
      this.form = JSON.parse(JSON.stringify(resData));
    },
    initList(){ // 获取参会或知会人员的缓存
      if(getlocalStorage("confereeList")){ // 同步参会人员
        this.form['confereeList'] = getlocalStorage("confereeList").map(itm=>{
          return {
            confereeAcount:itm.account,
            confereeName:itm.personName
          }
        })
        this.$forceUpdate()
      }else{
        this.form.confereeList = [];
      }
      if(getlocalStorage("ccList")){ // 同步知会人员
        this.form.ccList = getlocalStorage("ccList").map((itm)=>{
          return {
            ccAcount:itm.account,
            ccName:itm.personName
          }
        })
      }else{
        this.form.ccList = [];
      }
      
      
    },
    toSelect(listName){ // 跳转搜索人员页面
      setlocalStorage("meetingForm",this.form);
      this.$router.push({ name: 'meetingSelect', params: { listName }})
    },
    cancelMeeting(){ // 取消会议
    this.$dialog.confirm({
        title: '提示信息',
        message: '是否取消发起的会议？'
      }).then(() => {
        this.$getData.cancelMeeting({
          method:"post",
          data:{ id:this.form.id }
        }).then(res =>{
          if(res.code == 200){
            this.$toast('取消会议成功');
            window.location.reload();
            // this.$router.push('/meetingList');
          }
        })
      }).catch(()=>{});
    },
    async getList(){ // 获取会议详情
      let res = null;
      if(this.shareType){
        res = await this.$getData.meetingShare({
          method:"get",
          data:{id:this.id},
          headers: {
            'Authorization': null
          },
        });
      }else{
        res = await this.$getData.getMeetingList({method:"post",data:{id:this.id}});
      }
      if(res.code == 200){
        let data = res.data;
        // this.form = setForm(data);
        this.form = JSON.parse(JSON.stringify(data));
        this.form["beginTime"] = moment(data.beginTime).format('YYYY-MM-DD HH:mm');
        this.form["endTime"] = moment(data.endTime).format('YYYY-MM-DD HH:mm');
        // this.form['isSignIn'] = this.isNum(data.isSignIn)
        // this.form['isSummary'] = this.isNum(data.isSummary)
        // this.form['isSecret'] = this.isNum(data.isSecret)
        // this.form['isConsultant'] = this.isNum(data.isConsultant)
        this.form['confereeList'] = data.confereeList; // 会议参加者
        this.form['ccList'] = data.ccList;
        this.form['meetingSummaryList'] = data.meetingSummaryList;
        this.form['meetingAccessoryList'] = data.meetingAccessoryList;
        this.$forceUpdate();
      }
    },
    isNum(num){ // 数据转换显示
      return num == 1?'是':'否'
    },
    init(){ // 初始化方法
      if(this.isCom){ // 当为info的组件时
        this.required = false;
        this.disabled = true;

        if(!(this.id === null)){
          this.getList();
        }
      }else{
        this.conflictPersonnelInfo();
      }
    },
    // 会议冲突人员校验接口
    conflictPersonnelInfo(){
      const {listName} = this.$route.params;
      if(listName == "confereeList"){
        const personnelList = this.form['confereeList'].map(item=>{
            return {
              personnelAcount:item.confereeAcount,
              personnelName:item.confereeName,
            }
          });
        if(!(this.form['beginTime']&&this.form['endTime'])){
          return this.$toast('请先选择会议开始结束时间')
        }
        const par = {
          beginTime:moment(this.form['beginTime']).format(),
          endTime:moment(this.form['endTime']).format(),
          personnelList,
        }
        this.$getData.listMeetingConflictPersonnelInfo({
          method:'post',
          data:par
        }).then(res=>{
          if(res.code == 200){
            if(res.data&&res.data.conflictPersonnel){
              this.$toast(res.data.conflictPersonnel)
            }
          }
        })
      }
    },
    //时间过滤
    filter(type, options) {
      // if (type === "minute") {
      //   return options.filter(option => option % 5 === 0 || option == 0);
      // }
      return options;
    },
    //显示日历
    dateShow(str) {
      if (str == "beginTime") {
        // this.maxDate =
        //   (this.form.endTime && new Date(this.form.endTime)) ||
        //   new Date(moment().add(1, "months"));
      } else {
        // this.maxDate = new Date(moment().add(1, "months"));
        // this.minDate =
        //   (this.form.beginTime && new Date(this.form.beginTime)) || new Date();
      }
      this.popup("showDatetime");
      this.dateStr = str;
    },
    // 显示关闭弹层
    popup(name) {
      this[name] = !this[name];
    },
    //确定日期
    datetimeConfirm(val) {
      const date = moment(val).format("YYYY-MM-DD HH:mm");
      console.log(date,"-------确定日期-------")
      this.$set(this.form, this.dateStr, date);
      this.popup("showDatetime");
    },
    //会议地点变更
    meetingPlaceChanage(val) {
      this.$set(this.form, "meetingRoom", "");
    },
    //会议地点弹层确认
    onConfirmAddress(name, index) {
      if (name !== this.form.meetingPlace) {
        this.meetingPlaceChanage(name);
      }
      this.placeId = name.id;
      console.log('name',name);
      this.$set(this.form, "meetingPlace", name.text);
      this.popup("showAddress"); // 关闭弹出层
    },
    onConfirmRoom(name, index) {
      this.$set(this.form, "meetingRoom", name.text);
      this.popup("showRoom");
    },
    onConfirmMeetingType(name,index){
      this.$set(this.form, "meetingType", index + 1);
      this.popup("showMeetingType");
    },
    // 单选赋值
    radioClick(name, val) {
      this.$set(this.form, name, val);
    },
    // 上传校验返回布尔值
    beforeRead(file,name) {
      // if (file.type !== "image/jpeg") {
      //   this.$toast("请上传 jpg 格式图片");
      //   return false;
      // }
      // this.files = file;
      if(name)this.fileName = name;
      if(file.size/(1024*1024)>6){
        this.$toast('请选择小于6M的文件');
        return false;
      }
      return true;
    },
    //上传
    afterRead(files) {
      if(Object.prototype.toString.call(files) === '[object Array]'){
        files.map(file=>this.afterReadLrz(file.file))
      }else{
        this.afterReadLrz(files.file)
      }
    },
    //压缩图片
    afterReadLrz(file) {
      const _this = this;
      // gif|jpg|jpeg|png|GIF|JPG|PNG
      if(/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)){
        lrz(file, {
          // width: 500,
          quality: 0.5 //自定义使用压缩方式
        })
        .then(function(rst) {
          console.log("压缩成功", rst);
          _this.uploadFile(rst,true)
        })
        .catch(function(error) {
          console.log("压缩失败", error);
          _this.$toast("压缩失败");
        });
      }else{
        this.uploadFile(file)
      }
    },
    async uploadFile(file,lrzBtn) {
      const toast1 = this.$toast.loading({
        message: '文件添加中...',
        duration: 0, // 持续展示 toast
        forbidClick: true
      });
      let params = null;
      if(lrzBtn){
        params = file.formData; //创建form对象
      }else{
        params = new FormData();
        params.append("file", file);
      }
      try {
        const data = await this.$getData.uploadFile({
          method: "post",
          data:params,
        });
        toast1.clear();
        this.$toast('文件添加成功');
        if(this.fileName == "accessoryList"&&data.data){
          this.meetingAccessoryList.push({
            accessoryName: data.data.docName,
            accessoryUrl: data.data.docUrl,
          })
        }
        if(this.fileName == "isSummary"&&data.data){
          this.meetingSummaryList=[{
            summaryName: data.data.docName,
            summaryUrl: data.data.docUrl,
          }]
        }
        setlocalStorage("meetingAccessoryList",this.meetingAccessoryList);
        setlocalStorage("meetingSummaryList",this.meetingSummaryList);
      } catch(err) {
        toast1.clear();
      }
    },
    // 显示错误
    showError(msg) {
      if (msg) return;
      setTimeout(() => {
        this.$toast(msg);
      }, 2000);
    },
    // form单个校验
    formVuerify(name) {
      this.$vuerify.check([{ form: [name] }]).then(data => {
        const { checked, message } = data;
        if (!checked) {
          this.$toast(message);
        }
      });
    },
    // 发送邀请
    sendInvite() {
      if(moment(this.form['beginTime'])>=moment(this.form['endTime'])){
        return this.$toast('开始时间必须小于结束时间');
      }
      this.sendInviteDisabled = true;
      // console.log(this.form['beginTime'],this.form['endTime'])
      this.$vuerify.check().then(data0 => {
        const { checked, message } = data0;
        if (checked) {
          // this.sendInviteDisabled = true;
          let data = {
            ...this.form,
            meetingAccessoryList: this.meetingAccessoryList,
            beginTime:moment(this.form['beginTime']).format(),
            endTime:moment(this.form['endTime']).format()
          }
          this.$getData.sendInvitations({
            method:'post',
            data
          }).then(res =>{
            this.sendInviteDisabled = false;
            if(res.code == 200){
              this.$toast('会议发起成功');
              setlocalStorage("meetingForm","")
              this.meetingAccessoryList = [];
              let resData = {
                ...res.data,
                beginTime:moment(res.data.beginTime).format('YYYY-MM-DD HH:mm'),
                endTime:moment(res.data.endTime).format('YYYY-MM-DD HH:mm')
              }
              // if(resData.remark)this.$toast(resData.remark);
              // setlocalStorage("meetingForm",resData); // 保存表单数据
              this.$router.push({
                name:'meetingList',
              })
              // this.$router.push({
              //   name:'meetingInfo',
              //   // params:{ form:resData },
              //   query:{ 
              //     id:resData.id,
              //     name:encodeURIComponent(resData.meetingName),
              //     number:encodeURIComponent(resData.meetingNumber),
              //   }
              // });
            }
          }).catch(rej=>{
            this.sendInviteDisabled = false;
          })
        } else {
          this.sendInviteDisabled = false;
          this.$toast(message);
        }
      });
    },
    //保存会议纪要
    async saveSummary(){
      if((JSON.stringify(this.meetingSummaryList) == "[]"||!this.meetingSummaryList)&&(JSON.stringify(this.meetingAccessoryList) == "[]"||!this.meetingAccessoryList)){
        // this.$toast('请先添加会议纪要或附件');
        this.$toast('未更新纪要或附件，保存失败');
        return;
      }
      const params = {
        meetingNumber: this.form.meetingNumber,
        meetingName: this.form.meetingName,
        // beginTime:this.form['beginTime'],
        // endTime:this.form['endTime'],
        beginTime:moment(this.form['beginTime']).format(),
        endTime:moment(this.form['endTime']).format(),
        meetingSummaryList:this.meetingSummaryList,
        meetingAccessoryList:this.meetingAccessoryList,
      }
      const data =await this.$getData.saveMeetingSummary({
            method:'post',
            data:params,
          })
      this.meetingSummaryList = [];
      this.meetingAccessoryList = [];
      window.location.reload();
      this.$toast('会议纪要或附件已成功');
    }
  },
  watch:{
    placeId:function(val){ // 监听会议地点id
      this.listMeetingRoom();
    },
    form:function(val){
      this.staffType = val.loginPersonnelType; // 获取权限
      const infoData = {
        state : val['scheduleState']==3||(!this.typeDE)?0:this.staffType,
        name : val['meetingName'],
        number: val['meetingNumber'],
        showShare: (!this.typeDE) && val.scheduleState!=3 && val.loginReceptionState !=2,
        isSignIn: val.isSignIn,
      }
      this.$emit("isQRcode",infoData);
      // if(this.staffType === 1){
      //   this.$emit("isQRcode",true);
      // }
      if(this.form.beginTime&&this.form.endTime==undefined){
        this.form.endTime = moment(this.form.beginTime).add(1,"hour").format('YYYY-MM-DD HH:mm')
      }
    }
  }
};
</script>

<style lang="scss">
// @import "reset";
.nameColor{ // 人员表单项的样式
  .van-cell__value .van-field__body input{
    font-size:15px;font-weight:400;color:rgba(75,119,175,1);
  }
}
</style>
<style scoped lang='scss'>
.addConferee{ // 新增参会人员
  min-height: 89px;padding:10px 20px 0px 20px;
  h6{ 
    font-size: 15px;
    line-height: 21px;
    font-weight: bold;
    color: rgba(72,72,72,1);
    margin-bottom: 10px; }
  .boxList{
    display: flex;
    .item{ width:40px;height: 40px;margin-right: 9px; }
    .addBtn{ 

    }

  }
}
/deep/.filesListDownload .van-collapse-item .van-collapse-item__content{
  padding: 10px 16px;
}
.filesListDownload{
  .van-collapse-item{
    .van-collapse-item__content>*{
      white-space: nowrap;
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-top: 10px;
      &:first-child{
        margin-top: 0;
      }
    }
    a{
      color: #007aff;
    }
  }
}
.meetingCreate {
  .van-cell:not(:last-child)::after {
    border-color: rgba(75, 119, 175, 0.2);

  }
  .form_rightIcon {
    img {
      width: 18px;
      vertical-align: middle;
      margin-top: -3px;
    }
  }
  .van-cell {
    font-size: 15px;
    color: #484848;
    padding: 14px 20px;
  }
  .uploadFile {
    font-size: 15px;
    color: #007aff;
    line-height: 21px;
    font-weight: 500;
    .uploadIcon {
    }
  }
}
.meetingCreate_operate {
  position: fixed;
  height: 46px;
  bottom: 0;
  width: 100%;
  button {
    width: 100%;
    border: none;
    height: 46px;
    line-height: 45px;
    background-color: #4b77af;
    box-shadow: 2px -1px 4px 0px rgba(104, 160, 232, 0.4);
    font-size: 17px;
    // font-weight: 600;
    color: #fff;
    &[disabled="disabled"]{
      background-color: #ccc;
    }
  }
}
/deep/.meetingCreate {
  .van-field__control {
    text-align: right;
    color: #484848;
    &:disabled{
      -webkit-text-fill-color: #484848;
    }
  }
  .van-field__right-icon {
    color: #dbe4ef;
  }
  .van-cell-group + .van-cell-group {
    margin-top: 10px;
  }
}
</style>
