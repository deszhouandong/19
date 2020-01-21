import axios from "axios";
import { CellGroup, Dialog, Toast } from "vant";
import moment from "moment";
import Cookie from "@/apis/cookie";
import { getlocalStorage, setlocalStorage } from "@/utils/format";
let methods = {
    toBusiness(path=''){ // 跳转商机 线索界面
      let prefix;
      const environment=process.env.NODE_ENV
      switch (environment) {
        case "test":
          prefix = `http://a.fehorizon.com/HXJFwpsTEST/crm-vue#/`;
          break;
        case "production":
          prefix = `http://hxjf.fehorizon.com/crm-vue#/`;
          break;
        default:
          prefix = `localhost:8080/crm-vue#/`;
          break;
      }
      console.log('toBusiness 商机线索',prefix + path);
      return prefix + path + `?startCreateDate=${moment(this.startDate).format()}&endCreateDate=${moment(this.endDate).format()}&createUserAccount=${this.adAcount}`;
    },
    chanceStatistics() { //  商机统计
      console.log('monment',);
      let data = {
        // startCreateDate:moment(this.startDate).subtract(1000*60*60*8).format(), // 开始创建时间
        startCreateDate:moment(this.startDate).format(), // 开始创建时间
        // startCreateDate:moment(this.startDate).utc().format(), // 开始创建时间
        // startCreateDate:this.startDate, // 开始创建时间
        // endCreateDate:moment(this.endDate).add(1000*60*60*24).subtract(1000*60*60*8).format(), // 结束创建时间 
        endCreateDate:moment(this.endDate).add(1000*60*60*24).format(), // 结束创建时间 
        createUserAccount:this.adAcount
      }
      console.log("chanceStatistics data",data);
      this.$getData.chanceStatistics({
        method:"post",
        data
      }).then(res=>{
        console.log('res chanceStatistics',res);
        if(res.code == 200 && res.data){
          this.dataBusiness = res.data;
        }else{
          this.dataBusiness = 0;
        }
      }).catch(err=>{
        this.dataBusiness = 0;
      })
    },
    queryClueCountForAtt() { //  获取线索数量
      let data = {
        // queryStartCreateTime:moment(this.startDate).subtract(1000*60*60*8).format(), // 查询开始创建时间
        queryStartCreateTime:moment(this.startDate).format(), // 查询开始创建时间
        // queryEndCreateTime: moment(this.endDate).add(1000*60*60*24).subtract(1000*60*60*8).format(),// 查询结束开始时间
        queryEndCreateTime: moment(this.endDate).add(1000*60*60*24).format(),// 查询结束开始时间
        createUserAccount:this.adAcount
      }

      console.log("queryClueCountForAtt data",data);
      this.$getData.queryClueCountForAtt({
        method:"post",
        data
      }).then(res=>{
        console.log('res queryClueCountForAtt',res);
        if(res.code == 200 && res.data){
          this.dataClue = res.data;
        }else{
          this.dataClue = 0;
        }
      }).catch(err=>{
        this.dataClue = 0;
      })
    },
    checkinRecordList(data){ // 查询考勤领导是否确认
      var bl = false;
      return new Promise((resolve)=>{
        this.$getData.checkinRecordList({
          method:'post',
          data
        }).then(res =>{
          if(res.code == 200){
            bl = res.data?res.data.some(item=>{
              // comfirmTime 确认时间
              // appealTime 申述时间
              // replyTime 答复时间
              // 确认时间为空 || ( 申述时间不为空 && 答复时间为空 )
              return !item.comfirmTime || (item.appealTime && !item.replyTime)
            }):false;
            
          }
          if(bl){
            var message = ''
            switch(this.$options.name){
              case 'bTripWorkplan':
                message = '该员工今天的加班打卡记录尚未确认，请先去确认该员工的打卡记录！'
                break;
              case 'workPlan':
                message = '今天的加班打卡记录上级尚未确认，请先联系上级领导确认打卡记录！'
            }
            // if(this.$op)
            Toast({
              message,
              forbidClick: true,
              duration:2000,
              onClose: function() {
                resolve();
              }
            });
          }else{
            resolve()
          }
        }).catch(err=>{
          resolve();
        })

      })
    },
    toReviewDetall(){ // 跳转回顾明细
      console.log('点击了');
      console.log('did',this.did);
      this.$router.push({
        path:'/reviewDetail',
        query:{
          did:this.did,
          weekNum: this.numberOfWeeks,
          year: this.year,
          startDate: this.startDate,
        }
      })
    },
    isReadonly(){ // 判断周计划或回顾是否可以编辑
        let bl;
        if(this.year>this.yearNow){ // 当前年大于实际年时 过
          bl = !(  (this.numberOfWeeks + this.numberOfWeeksNum) >= this.numberOfWeeksNow && (this.numberOfWeeks + this.numberOfWeeksNum) <= this.numberOfWeeksNow + 2 )
        }else{
          bl = !(this.numberOfWeeks>=this.numberOfWeeksNow && this.numberOfWeeks<=(this.numberOfWeeksNow+3))
        }
        return (this.wstatus != 1 && this.h3Active == 1) || ( this.h3Active == 2 && this.dstatus != 3 ) || bl;
    },
    clearLocalstorage(numberOfWeeks){ // 清楚缓存
        console.log("clearLocalstorage");
        let workPlanData = getlocalStorage("workPlanData")?getlocalStorage("workPlanData"):[];
        let arr = workPlanData.filter(item=>{
          if(numberOfWeeks){
            return item.numberOfWeeks != numberOfWeeks;
          }else{
            return (new Date().getTime() - item.dataTime) < (3 * 24 * 3600 * 1000); // 清楚超过三天的缓存
          }
        })
        setlocalStorage("workPlanData",arr);
    },
    addLocalstorage(){ // 增加缓存
        let workPlanData = getlocalStorage("workPlanData")?getlocalStorage("workPlanData"):[];
        let data = {
          weekArr:this.weekArr,
          wworkReviewDes:this.wworkReviewDes,
          wworkPlanDes:this.wworkPlanDes,
          numberOfWeeks:this.numberOfWeeks,
          dataTime:new Date().getTime()
        }
        let bl = true
        workPlanData.forEach((item,index) => {
          if(item.numberOfWeeks == this.numberOfWeeks){
            bl = false;
            workPlanData[index] = data;
          }
        });
        if(bl){
          workPlanData.push(data);
        }
        setlocalStorage('workPlanData',workPlanData);
        console.log("data",data);
        console.log('workPlanData',workPlanData);
    },
    tourIs() { // 决定是否出现导图
        console.log("执行了");
        this.tourShow = !(Cookie.cookie.get("tourShow") == 0);
        console.log("tor", this.tourShow);
        this.$forceUpdate();
    },
    tourNext() { // 点击导图下一步执行的方法
        this.tourState--;
    },
    saveBefore(){ // 异常退出缓存
        console.log('触发了wstatus',this.wstatus);
        console.log('触发了dstatus',this.dstatus);
        let data = {
          "wweekNum": this.numberOfWeeks.toString(),
          "wyear": this.year.toString(),
        }
        if(this.h3Active == 1){
          if(this.wstatus != 1){
            return;
          }else{
            if (!this.wworkPlanReviewDes) {
              return;
            }
            data = { ...data,
              "oneDayPlanList": [{},{},{},{},{},{},{}],
              "wworkPlanDes": this.wworkPlanReviewDes,
              "wendDate": this.endDate,
              "wstartDate": this.startDate,
            }
            let obj = {};
            this.weekArr.map(function(item,index){
              let i = index == 6? 0 : index + 1;
              obj = {
                "dworkPlanDate": item.dateAll,
                "dworkPlanDesAm": item.dworkPlanDesAm,
                "dworkPlanDesPm": item.dworkPlanDesPm
              }
              if(item.did){
                obj.did = item.did;
              }
              data.oneDayPlanList[i] = obj;
            })
          }
        }else if(this.h3Active == 2){
          if(this.dstatus != 3){
            return;
          }else{
            if (!this.wworkPlanReviewDes && new Date().getDay() == 5) { // 只有周5周计划必填
              return;
            }

            var arr = {};
            let _this = this;
            this.weekArr.map(function(item){
              if(item.dateAll == _this.newDate.format('yyyy-MM-dd')){
                arr = item;
              }
            });
            if (!arr.dworkReviewDesAm && !arr.dworkReviewDesPm) { // 日回顾至少填一项
              return;
            }
            data = { ...data,
              "oneDayReviewReq": {
                "dworkReviewDesAm": arr.dworkReviewDesAm,
                "dworkReviewDesPm": arr.dworkReviewDesPm
              },
              "wworkReviewDes": this.wworkPlanReviewDes,
            }
            if(arr.did){
              data.oneDayReviewReq.did = arr.did;
              this.did = arr.did;
            }
          }
        }
        if(this.wid){
          data.wid = this.wid;
        }
        if(this.h3Active == 1){
          this.$getData.addWeekWorkPlan({
            method:'post',
            data
          }).then(res => {
            this.clearLocalstorage(this.numberOfWeeks);
          }).catch(err => {
          })
        }else if(this.h3Active == 2){
          console.log('缓存回顾');
          this.$getData.addWeekWorkReview({
            method:'post',
            data
          }).then( res => {
            this.clearLocalstorage(this.numberOfWeeks);
          })
        }
    },
    toShare() { // 跳转到分享页面
        let query = {
          numberOfWeeks: this.numberOfWeeks,
          year: this.year,
          adAcount: this.adAcount,
          h3Active: this.h3Active,
          thisName:this.thisName
        };
        let params = {
          save : {
            weekArr:this.weekArr,
            wworkPlanDes:this.wworkPlanDes,
            wworkReviewDes:this.wworkReviewDes
          }
        }
        this.$router.push({
          path: "/workPlanShare",
          name:'workPlanShare',
          query,
          params
        });
    },
    firstFocus() { // 头部输入框聚焦事件
        this.firstRows = 4;
        this.$refs.list.style.top = this.initialScoll + "px";
    },
    listScroll() { // 滚动事件
        // this.$refs.first.style.display = 'block';
        // if (!this.isFocusType) {
        //   this.$refs.list.style.top = this.initialScoll - 40 + "px";
        //   this.firstRows = 1;
        // }
    },
    showBtripServe() { // 决定展示计划和招待的图标
        let data = {
          endDate: this.endDate,
          queryType: this.h3Active,
          startDate: this.startDate
        };
        this.$getData
          .queryHomeDataForPerson({
            method: "post",
            data
          })
          .then(res => {
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
    toTravelPlan(e) { // 跳转到出差计划 或 回顾
        switch (e.target.innerText) {
          case "出差/招待计划":
            this.$router.push({
              path: "/travelPlan",
              query: {
                weekNum: this.numberOfWeeks,
                year: this.year,
                startDate: this.startDate,
                id: null
              }
            });
            break;
          case "出差/招待回顾":
            this.$router.push({
              path: "/travelReview",
              query: {
                weekNum: this.numberOfWeeks,
                year: this.year,
                startDate: this.startDate,
                id: null,
                isTravelReview:true
              }
            });
            break;
        }
    },

    fieldFocus(e) { // 输入框聚焦事件
        // if (e.type == "focus") {
        //   e.target.rows = 6;
        //   this.$refs.list.style.top = "0px";
        //   this.$refs.first.style.display = "none";
        //   this.isFocusType = true;
        // } else if (e.type == "blur") {
        //   this.firstRows = 4;
        //   e.target.rows = 3;
        //   this.$refs.list.style.top = this.initialScoll + "px";
        //   this.$refs.first.style.display = "block";
        //   this.isFocusType = false;
        // }
    },
    listPosition() { // 页面锚点定位
        this.$forceUpdate();
        if (this.h3Active == 1) {
          this.$el.querySelector("#tabDiv>.list").scrollTop = 0;
        } else if (this.h3Active == 2) {
          // this.dstatus == 3 &&
          if (
            this.numberOfWeeks == this.numberOfWeeksNow &&
            this.newDate.getDay() != 5
            && (Cookie.cookie.get("tourShow") == 0)
          ) {
            let i = null;
            let arr = JSON.parse(JSON.stringify(this.weekArr));
            this.weekArr.map((item, index) => {
              var it = JSON.parse(JSON.stringify(this.weekArr[index]));
              if (
                this.weekArr[index].dateAll ==
                moment(this.newDate).format("YYYY-MM-DD")
              ) {
                i = index;
                return index;
              }
            });
            let dom = this.$el.querySelector(
              `#tabDiv>.list>ul.main>li:nth-of-type(${i + 1})`
            );
            this.$el.querySelector("#tabDiv>.list").scrollTop = dom.offsetTop;
          }
        }
    },
    getWorkDay() { // 查询用户某周的请假和节假日
        let data = {
          endDate: moment(this.endDate).format(),
          startDate: moment(this.startDate).format(),
          wweekNum: this.numberOfWeeks.toString(),
          wyear: this.year.toString()
        };
        this.$getData
          .getWorkDay({
            method: "post",
            data
          })
          .then(res => {
            if (res.code == 200 && res.msg == "success") {
              let dataArr = res.data;
              this.weekArr.map((item, index) => {
                dataArr.map(value => {
                  let date = moment(value.nowDate).format("YYYY-MM-DD");
                  if (item.dateAll == date) {
                    switch (value.time) {
                      case "全天":
                        item.disabledUp = value.leaveType;
                        item.disabledDown = value.leaveType;
                        break;
                      case "上午":
                        item.disabledUp = value.leaveType;
                        break;
                      case "下午":
                        item.disabledDown = value.leaveType;
                        break;
                    }
                  }
                });
              });
            } else {
              this.visitNumber = 0;
            }
          });
    },
    toVisitorlist() { // 跳转到访客记录界面
        let query = {
          startTime: this.startDate,
          endTime: this.endDate,
          modelType: 10
        };
        this.$router.push({ path: "/visitorlist", query });
    },
    getVisitorCount() { // 获取访客记录
        this.$getData
          .getVisitorCount({
            method: "post",
            data: {
              startTime: this.startDate,
              endTime: this.endDate
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
    onFocusWorkPlan() { // 输入框聚焦 触发同步周工作计划
        if ( this.dstatus == 3 && this.h3Active == 2 && !Cookie.cookie.get("isFocusWorkPlan") || Cookie.cookie.get("isFocusWorkPlan") - new Date().getTime() > 1000 * 60 * 60 ) {
          Cookie.cookie.set("isFocusWorkPlan", new Date().getTime());
          Dialog.confirm({
            message: "确定将当周计划内容同步到日回顾吗？"
          }).then(() => {
            this.wworkReviewDes = this.wworkPlanDes;
            this.$forceUpdate();
          }).catch(() => {});
        }
    },
    onFocus(i) { // 输入框聚焦 触发同步工作计划
        if (
          this.isFocus &&
          Cookie.cookie.get("isFocus") != this.weekArr[i].dateAll
        ) {
          this.isFocus = false;
          Cookie.cookie.set("isFocus", this.weekArr[i].dateAll, 60 * 60 * 24);
          Dialog.confirm({
            message: "确定将当日计划内容同步到回顾吗？"
          })
            .then(() => {
              this.$set(
                this.weekArr[i],
                "dworkReviewDesPm",
                this.weekArr[i].dworkPlanDesPm
              );
              this.$set(
                this.weekArr[i],
                "dworkReviewDesAm",
                this.weekArr[i].dworkPlanDesAm
              );
              this.$forceUpdate();
              // this.weekArr[i].dworkReviewDesPm = this.weekArr[i].dworkPlanDesPm;
              // this.weekArr[i].dworkReviewDesAm = this.weekArr[i].dworkPlanDesAm; // 当日上午的工作计划
            })
            .catch(() => {});
        }
    },

    butisShow() { // 判断计划的提交保存按钮是否展示 过
        let bl;
        if(this.year>this.yearNow){
          bl = (this.numberOfWeeks + this.numberOfWeeksNum) >= this.numberOfWeeksNow && (this.numberOfWeeks + this.numberOfWeeksNum) <= this.numberOfWeeksNow + 2
        }else{
          bl =  (this.numberOfWeeks >= this.numberOfWeeksNow && this.numberOfWeeks <= this.numberOfWeeksNow + 2)
        }
        return ( this.wstatus == 1 && this.h3Active == 1 && bl );
    },

    clickInput(txt, title, name, date) { // 点击输入框展示内容
        // this.popupText = txt;
        console.log('233e');
        this.popupText = txt.replace(/\n/g,'<br/>');
        this.popupTitle = title;
        this.popupName = name;
        this.popupDate = date;
        const { getIsPhone } = this.commonUtils.env;
        if (this.popupText && this.popupText.length > 0) {
          // 手机显示放大框，pc隐藏
          if (getIsPhone()) {
            this.popupShow = true;
          } else {
            this.popupShow = false;
          }
        }
    },
    weekDayDate(date){
      let dddd = moment(date).format("dddd");
      let s = "";
      switch (dddd) {
        case "Monday":
          s = "一";
          break;
        case "Tuesday":
          s = "二";
          break;
        case "Wednesday":
          s = "三";
          break;
        case "Thursday":
          s = "四";
          break;
        case "Friday":
          s = "五";
          break;
        case "Saturday":
          s = "六";
          break;
        case "Sunday":
          s = "日";
          break;
      }
      return "周" + s;
    },
    weekDay(str) { // 处理当前为星期几
        let s = "";
        switch (str) {
          case "Monday":
            s = "一";
            break;
          case "Tuesday":
            s = "二";
            break;
          case "Wednesday":
            s = "三";
            break;
          case "Thursday":
            s = "四";
            break;
          case "Friday":
            s = "五";
            break;
          case "Saturday":
            s = "六";
            break;
          case "Sunday":
            s = "日";
            break;
        }
        return "星期" + s;
    },
    wdDate(i, date) { // 展示审阅的日期
        var str;
        if (date) {
          var weekDay = moment(date).format("dddd");
          return (
            moment(date).format("YYYY-MM-DD HH:mm:ss") +
            " " +
            this.weekDay(weekDay)
          );
        }
        if (this.h3Active == 1) {
          var weekDay = moment(this["wplanVerifiedDate" + i]).format("dddd");
          return (
            moment(this["wplanVerifiedDate" + i]).format("YYYY-MM-DD HH:mm:ss") +
            " " +
            this.weekDay(weekDay)
          );
        } else if (this.h3Active == 2) {
          var weekDay = moment(this["dreviewVerifiedDate" + i]).format("dddd");
          return (
            moment(this["dreviewVerifiedDate" + i]).format(
              "YYYY-MM-DD HH:mm:ss"
            ) +
            " " +
            this.weekDay(weekDay)
          );
        }
    },
    wplanDreviewVerifiedOpinio: function(i) { // 决定显示审核内容
        if (this.h3Active == 1) {
          return this["wplanVerifiedOpinion" + i];
        } else if (this.h3Active == 2) {
          return this["dreviewVerifiedOpinion" + i];
        }
    },
    placeholderReviewShow: function(item) { // 决定回顾的提示信息
        if (
          this.newDate.format("yyyy-MM-dd") == item.dateAll &&
          this.h3Active == 2 &&
          this.dstatus == 3
        ) {
          return "请填写工作回顾";
        } else if (
          new Date(item.dateAll).getTime() > this.newDate.getTime() &&
          this.h3Active == 2
        ) {
          // }else if( new Date(item.dateAll).getTime() > this.newDate.getTime() && this.h3Active == 2 && this.dstatus == 3 && this.wstatus == 3){
          return "未到回顾时间";
        } else if (
          this.h3Active == 2 &&
          item.dateAll == moment(this.newDate).format("YYYY-MM-DD")
        ) {
          if (this.wstatus < 3) {
            return "请先填写本周工作计划，并通过领导审批";
          } else if (this.dstatus > 3) {
            return "未填写";
          }
        } else if (
          this.h3Active == 2 &&
          new Date(item.dateAll).getTime() < this.newDate.getTime()
        ) {
          // }else if(this.wstatus == 1 && this.h3Active == 2 && new Date(item.dateAll).getTime() < this.newDate.getTime()){
          return "已过填写日期，无法填写";
        }
        // !disabledReview(item) ? '请填写工作回顾！' : ''
    },
    disabledReview: function(item) { // 决定非当日不能填写 回顾
        return (
          !(this.newDate.format("yyyy-MM-dd") == item.dateAll) ||
          (this.h3Active == 2 && this.dstatus != 3)
        );
    },
    // 轮播方法start
    start(e) {
        this.startX = e.touches[0].clientX;
        e.currentTarget.style.left = "0%";
        this.move = "";
    },
    moveFn(e) {
        let endX = e.changedTouches[0].clientX;
        if (endX - this.startX < -150) {
          // 向左划
          e.currentTarget.style.left = "100%";
          this.moveDire = "moveLeft";
        } else if (endX - this.startX > 150) {
          // 向右划
          e.currentTarget.style.left = "-100%";
          this.moveDire = "moveRight";
        }
    },
    end(e) {
        this.move = this.moveDire;
        if (this.move == "moveLeft") {
          this.workReviewClick();
        } else if (this.move == "moveRight") {
          this.workPlanClick();
        }
        this.moveDire = "";
    },
    // 轮播方法 end

    clearView(){ // 清除当前界面的数据
        this.wid = null;
        this.wworkPlanDes = '';
        this.wworkReviewDes = '';
        this.weekArr = JSON.parse(JSON.stringify(this.weekArrNull));
        this.wstatus = 1;
        this.dstatus = 1;
        this.dreviewVerifiedOpinionArr = [];
        this.getWorkDay();
        this.showBtripServe();
    },
    workReviewClick() { // 工作回顾点击按钮
        this.saveBefore(); // 自动保存
        if (this.h3Active == 1) {
          this.h3Active = 2;
        } else if (this.h3Active == 2) {
          this.dateRight();
          this.h3Active = 1;
        }
    },
    workPlanClick() { // 工作计划点击按钮
        this.saveBefore(); // 自动保存
        if (this.h3Active == 2) {
          this.h3Active = 1;
        } else if (this.h3Active == 1) {
          this.dateLeft();
          this.h3Active = 2;
        }
    },
    // 接口方法 start
    revokeWeekWorkReview() { // 撤回工作回顾
        this.$dialog
          .confirm({
            title: "工作回顾",
            message: "是否撤回工作回顾？"
          })
          .then(() => {
            this.$getData
              .revokeWeekWorkReview({
                method: "post",
                data: {
                  did: this.did
                }
              })
              .then(res => {
                this.subDisabled = true;
                if (res.code == 200 && res.msg == "success") {
                  this.dstatus = 3;
                  this.myNotify("撤回成功");
                  this.showBtripServe(); // 撤回成功后再查询一次图标
                }
              });
          })
          .catch(() => {
            // on cancel
          });
    },
    submitWeekWorkReview(data) { // 提交工作回顾
        this.$dialog
          .confirm({
            title: "工作回顾",
            message: "是否提交工作回顾？"
          })
          .then(() => {
            this.$getData
              .submitWeekWorkReview({
                method: "post",
                data
              })
              .then(res => {
                if (res.code == 200 && res.msg == "success") {
                  this.clearLocalstorage(this.numberOfWeeks); // 清除当前周缓存
                  this.subDisabled = true;
                  this.myNotify("回顾提交成功");
                  // this.wstatus = 4;
                  this.dstatus = 4;
                } else if (res.code == -1 && res.msg == "当前日期无工作计划") {
                  this.myNotify("当前日期无工作计划");
                }
              });
          })
          .catch(() => {
            // on cancel
          });
    },
    addWeekWorkReview(data) {// 保存工作回顾
        // this.$dialog.confirm({
        //   title: "工作回顾",
        //   message: "是否保存工作回顾？"
        // }).then(() => {
        // }).catch(() => {
        // });
        const toast = Toast.loading({
          message: "保存中...",
          forbidClick: true
        });

        this.$getData.addWeekWorkReview({
          method: "post",
          data
        }).then(res => {
          toast.clear();
          this.subDisabled = true;
          if (res.code == 200 && res.msg == "success") {
            this.clearLocalstorage(this.numberOfWeeks); // 清除当前周缓存
            // this.myNotify("回顾保存成功");
            Toast({
              message: "回顾保存成功",
              forbidClick: true,
              duration:2000,
            });
          } else if (res.code == -1 && res.msg == "当前日期无工作计划") {
            // this.myNotify("当前日期无工作计划");
            Toast({
              message: "当前日期无工作计划",
              forbidClick: true,
              duration:2000,
            });
          }
        }).catch(res=>{
          this.subDisabled = true;
          toast.clear();
        });
    },
    toRecord() {// 跳转操作记录界面
        this.$router.push({
          path: "/record",
          query: {
            data: {
              endDate: this.endDate + "T24:00:00.000Z",
              // "endDate": new Date(2019,9,14,0,0,0),
              startDate: this.startDate + "T00:00:00.000Z"
              // "startDate": new Date(2019,9,20,23,59,59)
            }
          }
        });
    },
    myNotify(str) {// 提示框方法
        this.$notify({
          message: str,
          duration: 2000,
          className: "myNotify"
        });
    },

    withdraw() {// 撤回按钮总方法
        this.subDisabled = false;
        if (this.h3Active == 1) {
          this.revokeWeekWorkPlan();
        } else if (this.h3Active == 2) {
          this.revokeWeekWorkReview();
        }
    },
    revokeWeekWorkPlan() {// 撤回工作计划
        var _this = this;
        this.$dialog
          .confirm({
            title: "工作计划",
            message: "是否撤回工作计划？"
          })
          .then(() => {
            this.$getData
              .revokeWeekWorkPlan({
                method: "post",
                data: {
                  wid: this.wid,
                  wweekNum: this.numberOfWeeks.toString(),
                  wyear: this.year.toString()
                }
              })
              .then(res => {
                this.subDisabled = true;
                if (res.code == 200 && res.msg == "success") {
                  this.wstatus = 1;
                  this.myNotify("撤回成功");
                  _this.selOneWeekPlan();
                  _this.showBtripServe(); // 撤回成功后再查询一次图标
                }
              });
          })
          .catch(() => {
            // on cancel
          });
    },
    butSubmit(e) {// 提交和保存的事件委托
        let data = {
          wweekNum: this.numberOfWeeks.toString(),
          wyear: this.year.toString()
        };
        if (this.h3Active == 1) {
          if (!this.wworkPlanReviewDes) {
            // this.myNotify('周工作计划为必填项！');
            this.$el.querySelector("#tabDiv>.list").scrollTop = 0; // 新增提示
            this.required = true;
            return;
          } else {
            this.required = false;
          }
          data = {
            ...data,
            oneDayPlanList: [{}, {}, {}, {}, {}, {}, {}],
            wworkPlanDes: this.wworkPlanReviewDes,
            wendDate: this.endDate,
            wstartDate: this.startDate
          };
          let obj = {};
          this.weekArr.map(function(item, index) {
            let i = index == 6 ? 0 : index + 1;
            obj = {
              dworkPlanDate: item.dateAll,
              dworkPlanDesAm: item.dworkPlanDesAm,
              dworkPlanDesPm: item.dworkPlanDesPm
            };
            if (item.did) {
              obj.did = item.did;
            }
            data.oneDayPlanList[i] = obj;
          });
        } else if (this.h3Active == 2) {
          if (!this.wworkPlanReviewDes && new Date().getDay() == 5) {
            // this.myNotify('周回顾为必填项！');
            this.required = true;
            this.$el.querySelector("#tabDiv>.list").scrollTop = 0; // 新增提示
            return;
          } else {
            this.required = false;
          }
          var arr = this.weekArr[4];
          let _this = this;
          this.weekArr.map(function(item) {
            if (item.dateAll == _this.newDate.format("yyyy-MM-dd")) {
              arr = item;
            }
          });
          if (!arr.dworkReviewDesAm && !arr.dworkReviewDesPm) {
            this.myNotify("回顾至少填一项！");
            return;
          }
          data = {
            ...data,
            oneDayReviewReq: {
              dworkReviewDesAm: arr.dworkReviewDesAm,
              dworkReviewDesPm: arr.dworkReviewDesPm
            },
            wworkReviewDes: this.wworkPlanReviewDes
          };
          if (arr.did) {
            data.oneDayReviewReq.did = arr.did;
            this.did = arr.did;
          }
        }
        if (this.wid) {
          data.wid = this.wid;
        }
        if (!this.subDisabled) {
          // return;
        }

        this.subDisabled = false;
        switch (e.target.innerText) {
          case "保存":
            if (this.h3Active == 1) {
              this.addWeekWorkPlan(data);
            } else if (this.h3Active == 2) {
              this.addWeekWorkReview(data);
            }
            break;
          case "提交":
            if (this.h3Active == 1) {
              this.subDisabled = false;
              this.submitWeekWorkPlan(data);
            } else if (this.h3Active == 2) {
              this.subDisabled = false;
              this.checkinRecordList({
                dayTime:moment(arr.dateAll).format(),
                adAcount:this.adAcount
              }).then(res=>{
                this.submitWeekWorkReview(data);
              })
            }
            break;
        }
    },
    submitWeekWorkPlan(data) { // 提交 计划
        this.$dialog
          .confirm({
            title: "工作计划",
            message: "确认提交工作计划吗？"
          })
          .then(() => {
            this.overlayShow = true;
            this.$getData
              .submitWeekWorkPlan({
                method: "post",
                data
              })
              .then(res => {
                this.overlayShow = false; // 加载中的状态
                this.subDisabled = true;
                if (res.code == 200) {
                  this.wstatus = 2;
                  this.wid = res.msg;
                  this.myNotify("计划提交成功");

                  this.clearLocalstorage(this.numberOfWeeks); // 清除当前周缓存
                }
              })
              .catch(error => {
                // this.wstatus = 2;
                this.overlayShow = false; // 加载中的状态
                this.subDisabled = true;
              });
          })
          .catch(() => {
            // on cancel
          });
    },
    addWeekWorkPlan(data) { //保存 计划
        var _this = this;
        // this.$dialog.confirm({
        //   title: '工作计划',
        //   message: '确认保存吗？'
        // }).then(() => {

        // }).catch(() => {
        // });
        const toast = Toast.loading({
          message: "保存中...",
          forbidClick: true
        });
        // this.overlayShow = true;
        this.$getData.addWeekWorkPlan({
          method: "post",
          data
        }).then(res => {
          // this.overlayShow = false; // 加载中的状态
          toast.clear();
          this.subDisabled = true;
          if (res.code == 200) {
            // this.myNotify("计划保存成功", res.data);
            Toast({
              message: "计划保存成功",
              forbidClick: true,
              duration:1000,
              onClose: function() {
                _this.clearLocalstorage(_this.numberOfWeeks); // 清除当前周缓存

                _this.selOneWeekPlan(); // 保存成功后再次查询数据
                _this.showBtripServe(); // 再次查询图标数据
              }
            });
          }
        }).catch(err => {
          this.subDisabled = true;
          toast.clear();
        });
    },
    selOneWeekPlan() {// 查询某周的计划 和 回顾
        let wweekNum = this.numberOfWeeks;
        let wyear = this.year;
        this.overlayShow = true;

        // 清楚数据缓存 start
        this.clearView();
        // end
        this.$getData.selOneWeekPlan({
          method: "post",
          data: {
            wweekNum: wweekNum.toString(),
            wyear: wyear.toString()
          }
        }).then(res => {
            // 将加载中隐藏
            this.overlayShow = false;
            if (res.code == 200 && res.data) {
              let data = res.data;
              this.wworkPlanDes = data.wworkPlanDes;
              this.wworkReviewDes = data.wworkReviewDes;
              this.wid = data.wid;
              this.wstatus = data.wstatus;
                // 获取缓存的计划
                let workPlanData = getlocalStorage("workPlanData")?getlocalStorage("workPlanData"):[];
                let workPlanDataFilter = workPlanData.filter(item=> (item.numberOfWeeks == this.numberOfWeeks) );
                let arr = null;
                console.log("workPlanDataFilter",workPlanDataFilter);
                if(workPlanDataFilter.length>0){
                    arr = workPlanDataFilter[0].weekArr
                }


              this.adAcount = data.adAcount; // 新增 保存adAcount
              this.allowSeconded = data.userInfo.allowSeconded; // 决定新的回顾按钮是否展示 0 不展示 1 展示
              // this.allowSeconded = 1; // 决定新的回顾按钮是否展示 0 不展示 1 展示
              if (data.wstatus >= 3) {
                this.wplanVerifiedOpinion1 = data.wplanVerifiedOpinion1;
                this.wverifiedUserName1 = data.wverifiedUserName1;
                this.wplanVerifiedOpinion2 = data.wplanVerifiedOpinion2;
                this.wverifiedUserName2 = data.wverifiedUserName2;

                this.wplanVerifiedDate1 = data.wplanVerifiedDate1;
                this.wplanVerifiedDate2 = data.wplanVerifiedDate2;
                this.approvalStatus = data.approvalStatus; // 认同状态(1:认同;2:不认同)
              }
              data.workPlanDayList.map((item, index) => {
                let i = index == 0 ? this.weekArr.length - 1 : index - 1;
                this.weekArr[i].did = item.did;


                this.weekArr[i].dworkPlanDesPm = item.dworkPlanDesPm;
                this.weekArr[i].dworkPlanDesAm = item.dworkPlanDesAm; // 当日上午的工作计划
                if(data.wstatus == 1 && arr){
                  this.weekArr[i].dworkPlanDesPm = arr[i].dworkPlanDesPm;
                  this.weekArr[i].dworkPlanDesAm = arr[i].dworkPlanDesAm; // 当日上午的工作计划
                }
                this.weekArr[i].dworkReviewDesAm = item.dworkReviewDesAm;
                this.weekArr[i].dworkReviewDesPm = item.dworkReviewDesPm;
                if (item.dworkPlanDate == this.newDate.format("yyyy-MM-dd")) {
                    this.did = item.did;
                    this.dstatus = item.dstatus;
                    if(this.dstatus == 3 && arr){
                        this.weekArr[i].dworkReviewDesAm = arr[i].dworkReviewDesAm;
                        this.weekArr[i].dworkReviewDesPm = arr[i].dworkReviewDesPm;
                    }
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

              // 拿取缓存的周计划和周回顾
              if(this.wstatus == 1 && workPlanDataFilter.length>0){
                this.wworkPlanDes = workPlanDataFilter[0].wworkPlanDes;
              }else if(this.dstatus == 3 && workPlanDataFilter.length>0){
                console.log('dstat',this.dstatus);
                this.wworkReviewDes = workPlanDataFilter[0].wworkReviewDes;
              }

              if(this.isInit && this.wstatus == 3){ // 当前初始加载页面
                this.h3Active = 2;
                this.isInit = false;
              }
            } else {
                let workPlanData = getlocalStorage("workPlanData")?getlocalStorage("workPlanData"):[];
                let bl = true;
                workPlanData.map((item,index)=>{
                    if(item.numberOfWeeks == this.numberOfWeeks){
                        bl = false;
                        this.weekArr = item.weekArr;
                        this.wworkPlanDes = item.wworkPlanDes;
                    }
                })
                if(bl){
                    this.clearView();
                }
            }
        });
    },
    // 接口方法 end

    handelChange(date) { // 选择日期方法
        console.log("date", date.$d);
        this.getWeekOfYear(date.$d);
    },
    dateFormat() { // date格式处理函数
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
    dateRight() { // 日期下一周按钮事件
        // this.getXDate(this.year,this.numberOfWeeks);
        this.numberOfWeeks++;
    },
    dateLeft() { // 日期上一周按钮事件
        this.numberOfWeeks--;
    },
    optionDate() { // 控制日期弹出组件的状态
        this.show = true;
        this.calendarShow = true;
    },
    createDate() { // 获取当前年
        var date = new Date();
        this.year = date.getFullYear();
    },
    getWeekOfYear(date) { // 返回当前是第几周
        var today;
        if (date) {
          today = date;
        } else {
          // today = new Date(); // 版本2
          today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
        }
        console.log('date 22222222',today);
        var year = today.getFullYear(); //获取选中的当前年
        var firstDay = new Date(year, 0, 1);
        var dayOfWeek = firstDay.getDay(); //返回表示星期几的数字 0~6
        var spendDay = 1;
        if (dayOfWeek != 1 && dayOfWeek != 0) {
          spendDay = 7 - dayOfWeek + 1 + 1;
        } else if (dayOfWeek == 0) {
          spendDay = 2;
        }
        firstDay = new Date(year, 0, spendDay); // 一年中第一周的开始时间 2019-01-07
        console.log(firstDay.format("yyyy-MM-dd"));
        console.log(today.format("yyyy-MM-dd"));
        // firstDay = new Date(today.getFullYear(),0, 1+spendDay);
        var d = Math.ceil((today.valueOf() - firstDay.valueOf()) / 86400000); // 计算时间差 向上取整
        // var d = (today.valueOf() - firstDay.valueOf()) / 86400000; // 计算时间差 向上取整 版本2
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
          // result = Math.ceil(d/7) ;
          result = d / 7 + 1; // 最新版本 保证周一为本周
        } else {
          result = Math.ceil(d / 7) == 0 ? 1 : Math.ceil(d / 7);
          // result = Math.ceil(d/7) + 1;
        }
        this.year = year;
        if(!this.yearNow){
          this.yearNow = year;
        }
        this.numberOfWeeks = result;
        console.log("121",this.numberOfWeeks);
        return result;
    }
}
export default methods;
