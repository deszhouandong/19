<template>
    <div id="signList">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div style="background: #f4f4f4;" :class="!QRcodePropsShow?'padTop':''" >
            <div class="header"><span class="headerTitle">会议名称</span>{{meetingName}}</div>
            <div id="QRcode" v-show="QRcodeShow && QRcodePropsShow">
                <i class="close" @click="close"><van-image :src="closeImg"/></i>
                <div ref="qrCodeDiv"></div>
                <!-- <van-image width="130px" height="130px" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576468498581&di=57a50ef48cb3c4d95cb940a1db0ec5e4&imgtype=0&src=http%3A%2F%2F7.pic.pc6.com%2Fup%2F2016-12%2F20161213153647219.png"/> -->
                <!-- <van-image width="130px" height="130px" :src="`http://172.24.121.201:8080/api-att/wps/meeting/personnel/scanningSignIn?meetingNumber=${meetingNumber}`"/> -->
            </div>
            <div class="title">签到</div>
        </div>
        <ul id="list">
            <li v-for="(item,i) in list" :key="i" v-show="item.receptionState!=2">
                <span class="isSign">{{item.signInState==1?"已签到":"未签到"}}</span>
                <div class="liContext">
                    <p v-show="item.signInState">{{momentDate(item.signInTime)}}</p>
                    {{item.personnelName}}
                </div>
                <div class="dashed"></div>
                <i class="itmImg"><van-image width="12px" height="15px" :src="itmImg"/></i>
            </li>
        </ul>
        </van-pull-refresh>
    </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import moment from "moment";
export default {
    name:'signList',
    data(){
        return {
            meetingName:'工作过程需求评审',
            isLoading: false,
            list:[],
            closeImg:require("../../../static/imgs/meetingClose.svg"), // 关闭按钮图标
            QRcodeShow:true, // 决定二维码区域的显示与否 
            itmImg:require("../../../static/imgs/signIn.svg"), // 列表项的头图标
            meetingNumber:'', // 会议编码 
            timer : null,
        }
    },
    props:{
        QRcodePropsShow:{
            default:true
        },
        form:{
            type: Object,
            default:function () {
                return { }
            }
        }
    },
    mounted(){
        if(!this.QRcodePropsShow){
            this.meetingName = this.form.meetingName;
            this.meetingNumber = this.form.meetingNumber;
        }else{
            this.meetingName = decodeURIComponent(this.$route.query.name);
            this.meetingNumber = this.$route.query.number;
            this.createQRCode();
        }
        this.shareType = this.$route.query.shareType=='1'?1:0;
        this.onRefresh();
        this.IntervalFresh();
    },
    created() {
        document.title = "会议签到";
    },
    destroyed(){
        if(this.timer)clearInterval(this.timer);
    },
    methods:{
        //定时刷新
        IntervalFresh(){
            if(!this.QRcodePropsShow)return;
           this.timer = setInterval(() => {
               this.onRefresh();
            }, 5000);
        },
        close(){
            this.QRcodeShow = false;
        },
        createQRCode(){
            const {origin,pathname} = window.location;
            let text = origin+pathname;
            // const env = process.env.env_config;
            // switch(env){
            //     case "prod":
            //         text = `http://hxjf.fehorizon.com`
            //         break;
            //     default:
            //         text = `http://a.fehorizon.com/HXJFwpsTEST`
            //         break;
            // }
            text = `${text}#/meetingSignIn?${this.$route.fullPath.split('?')[1]}`
            console.log("二维码路径",text);
            new QRCode(this.$refs.qrCodeDiv, {
                text,
                width: 130 ,
                height: 130,
                colorDark: "#333333", //二维码颜色
                colorLight: "#ffffff", //二维码背景色
                correctLevel: QRCode.CorrectLevel.L//容错率，L/M/H
            })
        },
        onRefresh(){
            let str = "listMeetingSignInInfo",shareHeaders = {};
            if(this.shareType){
                str = "shareMeetingSignInInfo";
                shareHeaders = {
                    'Authorization': null
                };
            }
            this.$getData[str]({
                method:"post",
                data:{
                    meetingName:this.meetingName,
                    meetingNumber:this.meetingNumber
                },
                headers:{
                    ...shareHeaders,
                }
            }).then(res=>{
                this.isLoading = false;
                this.list = res.data.signInList
            }).catch(rej=>{
                this.isLoading = false;
            })
        },
        momentDate(date){
            return moment(date).locale('zh-cn').format("YYYY年M月D日 HH:mm:ss")
        },
    },
    // beforeRouteUpdate (to, from, next) {
    //     next("/meetingList");
    // },
    // beforeRouteLeave(to, from, next) {
    //     next({name:"meetingList"});
    // }
}
</script>

<style lang="scss">
.van-tab__pane{
    height: 100%;
}
.van-pull-refresh{
    overflow: visible;
}
.padTop{ padding-top: 16px; }
#signList{
    height: 100%;width: 100%;
    .header{
        height:52px;background:rgba(255,255,255,1);line-height: 52px;
        // 会议名称样式
        font-size:15px;font-weight:bold;color:rgba(72,72,72,1);
        .headerTitle{ margin:  0 26px 0 10px;font-weight:500;color:rgba(72,72,72,1); }
    }
    #QRcode{
        height:195px;background:rgba(255,255,255,1);position: relative;margin-top: 10px;
        display: flex;justify-content: center;align-items: center;
        .close{ position: absolute;top: 10px;right: 17px; }
    }
    .title{ height:54px;line-height: 54px;font-size:17px;font-weight:bold;color:rgba(72,72,72,1);padding-left: 10px; }
    #list{ padding: 0px 21px 0px 15px;background:#fff;
        // max-height:440px;overflow-y: scroll;
        li{ height: 95px;position: relative;border-bottom:1px solid rgba(75,119,175,.1);
            .isSign{ position: absolute;top: 10px;right: 0px;font-size:17px;font-weight:500;color:rgba(75,119,175,1);line-height:24px; }
            .liContext{ position: absolute;top: 10px;left: 32px; 
                font-size:17px;
                font-weight:500;
                color:rgba(72,72,72,1);
                line-height:24px;
            }
            .itmImg{ position: absolute;top: 10px;left: 11px; }
            .dashed{ width: 0;border-style: dashed;border-color:#4B77AF;border-width: 0 0 0 1px;position: absolute;top: 30px;bottom: 0px;left: 16px; }
        }
    }
}
</style>