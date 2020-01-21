<template>
    <div id="meetingInfo">
        <van-tabs color="#007AFF" title-inactive-color="#4B77AF" title-active-color="#007AFF" line-width="56px" :sticky="true" :class="[isSignIn?'':'tabOne']" style="height:100%;position:relative;" @change="tableChange">
            <van-tab title="会议信息" class="gray">
                <MeetingCreate :isCom="true" :formProps="form" @isQRcode="setQRcode"/>
                <!-- v-if="showQRcode" -->
                <div v-show="isSignIn&&(!shareType)&&showQRcode&&(showQRcode==1||showQRcode==2)" class="QRcode" @click="showQRcode==1?toSignList():scanQRCode()">
                    <!-- <div></div> -->
                    <van-image :src="scan" />
                </div>
                <div v-show="(!shareType)&&showShare" class="QRcode shareCode" @click="shareFun">
                    <!-- <div></div> -->
                    <van-image :src="share" />
                </div>
            </van-tab>
            <van-tab v-if="isSignIn" title="签到信息">
                <SignList ref="signListCont" :QRcodePropsShow="false" :form="form"/>
            </van-tab>
        </van-tabs>
        <van-popup
            v-model="showSharePopup"
            class="showSharePopup"
            closeable
            close-icon="close"
            position="bottom"
            :style="{ height: '20%' }"
        >
        <div class="title">复制当前链接</div>
        <div class="shareUrl">{{shareUrl}}</div>
        </van-popup>
    </div>
</template>

<script>
import MeetingCreate from './meetingCreate';
import SignList from './signList';
import { getlocalStorage, setlocalStorage } from "@/utils/format";
import fetch from '@/apis/fetch'
import { getUrlparams } from '@/utils/env'
import wx from "weixin-js-sdk"; // 引入企业微信的sdk
export default {
    name:'meetingInfo',
    components:{ SignList,MeetingCreate },
    data(){
        return {
            form:{},
            id:null,
            scan:require("../../../static/imgs/meeting/scan.png"),
            share:require("../../../static/imgs/share.svg"),
            showQRcode:false,
            showShare:false,
            showSharePopup: false,
            shareUrl:"",
            meetingDetail:{},
            shareType: 0,
            isSignIn: 1, //1签到 0 不签到
        }
    },
    computed:{
        routeQuery(){
            const {id,name,number } = this.$route.query;
            let meetingName = decodeURIComponent(name),
            meetingNumber = decodeURIComponent(number);
            return {
                id,meetingName,meetingNumber
            }
        }
    },
    beforeRouteEnter(to, from, next){
        if(from.name != 'meetingSelect' && !(from.name == null&&getlocalStorage("viewFiles"))){
            setlocalStorage("meetingAccessoryList",[]);
            setlocalStorage("meetingSummaryList",[]);
        }
        setlocalStorage("viewFiles",'');
        next();
    },
    mounted(){
        const storageFormdata = getlocalStorage("formdata");
        // this.form = storageFormdata?storageFormdata:this.routeQuery;
        this.form = this.routeQuery;
        const {search,hash}=getUrlparams();
        if(search&&search.state){
            this.form.id = search.state;
        }
        //转化分享链接
        const {id,shareType} = this.$route.query;
        const {origin,pathname} = window.location;
        this.shareUrl = origin + pathname + "#/meetingInfo?shareType=1&id="+this.form.id;
        this.shareType = shareType=='1'?1:0;
    },
    methods:{
        // tab切换触发
        tableChange(index,title){
            if(title == "签到信息"){
                setTimeout(() => {
                    this.$refs.signListCont.onRefresh();
                }, 0);
            }
        },
        //跳转到签到页
        toSignList(){
            this.$router.push({
                name:'signList',
                query:{
                    id:this.form.id,
                    name:encodeURIComponent(this.form.meetingName),
                    number:encodeURIComponent(this.form.meetingNumber),
                },
            })
        },
        setQRcode(infoData){ // 设置进入二维码界面的按钮权限
            const {state,name,number,showShare,isSignIn} = infoData;
            this.showQRcode = state;
            this.showShare = showShare;
            this.isSignIn = isSignIn;
            this.$set(this.form,'meetingName',name)
            this.$set(this.form,'meetingNumber',number)
        },
        shareFun(){
            this.showSharePopup = true;
        },
        scanQRCode(){ // 扫一扫
            console.log("扫一扫");
            // alert("sss")
            wx.scanQRCode({
                desc: 'scanQRCode desc',
                needResult: 0, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
                scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function(res) {
                    // 回调
                    console.log("res qr1",res);
                    console.log("res.resultStr",res.resultStr);
                    // alert("res.resultStr",res.resultStr);

                    // fetch({
                    //     url:res
                    // }).then(res=>{
                    //     console.log("fetch res",res);
                    // }).catch(err=>{
                    //     console.log("fetch err",err);
                    // })
                },
                error: function(res) {
                    console.log("err res");
                    if (res.errMsg.indexOf('function_not_exist') > 0) {
                        alert('版本过低请升级')
                    }
                }
            });
        }
    },
    beforeRouteLeave (to, from, next) {
        // setlocalStorage("formdata",this.form);
        switch(to.name){
            case "meetingCreate":
                next("/meetingList");
                break;
            default:
                next();
        }

        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
    }
}
</script>

<style lang="scss" scoped>
.gray{
    color:#f4f4f4;height: 100%;
    // position: absolute;
    // bottom: 0px;
}
#meetingInfo{
    height: 100%;width: 100%;
    // overflow-y:scroll;
    // background:#f4f4f4;
    .van-tabs.van-tabs--line .van-sticky{
        box-shadow:0px 2px 4px 0px rgba(75,119,175,0.1);
    }
}
.QRcode{
    box-shadow:0px 1px 3px 0px rgba(75,119,175,0.6);
    border-radius: 50%;
    width: 46px;height: 46px;position:fixed;right: 11px;bottom: 65px;background:rgba(255,255,255,1);
    display: flex;justify-content:center;align-items: center;
}
/deep/.QRcode.shareCode{
    box-shadow: none;
    background: transparent;
    img{
        border: none;
    }
}
.showSharePopup{
    .title{
        margin-top: 5px;
        line-height: 40px;text-align: center;
        font-size: 18px;
    }
    .shareUrl{
        padding: 10px 40px 20px;
        word-break: break-all;
        word-wrap: break-word;
        font-size: 16px;
        color: rgb(75, 119, 175);
    }
}
</style>
<style lang="scss">
#meetingInfo{
    // background: rgb(244, 244, 244);
    .van-sticky{
        // margin-bottom: 10px;
    }
    .van-tabs__content{
        // margin-top: 10px;
    }
    .van-tabs__nav{
        font-weight: 500;
        .van-tab{
            font-size: 15px;
        }
    }
    .tabOne{
        .van-tabs__wrap{
            // padding-bottom: 10px;
        }
        .van-tabs__nav{
            .van-tabs__line{
                display: none;
            }

        }
    }
}
#meetingInfo .van-tabs.van-tabs--line {
    .van-sticky{
        box-shadow:0px 2px 4px 0px rgba(75,119,175,0.1);
    }
    .van-tabs__nav{
        z-index: 3;
    }
    .van-tabs__content{
        position: absolute;bottom: 0px;top: 45px;left: 0px;right: 0px;
    }
}
</style>
