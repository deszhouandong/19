<template>
    <div id="main">
        <div id="annualSummary2020" ref="annualSummary">
            <water ref="initwart"></water>
            <div class="user">
                <van-image :src="userData.avatar" round :width="38" :height="38">
                    <template v-slot:loading>
                        <img :src="imgSrc" style="background:#fff;" />
                    </template>
                    <template v-slot:error>
                        <img :src="imgSrc" style="background:#fff;" />
                    </template>
                </van-image>
                <div class="userMessage">
                    <div>
                        {{data.userName}}<br/>
                        {{belongOrgName}}
                    </div>
                </div>
            </div>
            <h1>
                WPS系统{{aYear}}年度个人工作总结
            </h1>
            <div class="logo">
                <van-image :src="imgLogo" width="100%"></van-image>
            </div>
            <section>
                <div class="title">在线考勤</div>
                <div class="content">
                    您完成了<span class="orange">{{data.acheckinTimes}}</span>次考勤打卡，<br/>
                    <span class="surpass">超过了{{data.acheckinRanking}}%的同事。</span><br/>
                    最早时间 {{data.acheckinEarliest}}<br/>
                    最晚时间 {{data.acheckinLatest}}
                </div>
                <van-image :src="annualImg[0]" width="100%"/>
            </section>
            <section>
                <div class="title">工作计划</div>
                <div class="content">
                    您共填写了<span class="orange">{{data.aworkPlanTimes}}</span>天计划回顾，<br/>
                    <span class="surpass">超过了{{data.aworkPlanRanking}}%的同事。</span><br/>
                    全年共填写了<span class="orange">{{data.aworkPlanWordNum}}</span>字！
                </div>
                <van-image :src="annualImg[1]" width="100%"/>
            </section>
            <section>
                <div class="title">出差招待</div>
                <div class="content">
                    您今年共有<span class="orange">{{data.abusinessTripTimes}}</span>天在出差，<br/>
                    <span class="surpass">超过了{{data.abusinessTripRanking}}%的同事。</span><br/>
                    最多一次连续出差<span class="orange">{{data.abusinessTripDayNum}}</span>天！
                </div>
                <van-image :src="annualImg[2]" width="100%"/>
            </section>
            <section>
                <div class="title">访客记录</div>
                <div class="content">
                    您完成了<span class="orange">{{data.avisitorsTimes}}</span>次访客拜访，<br/>
                    <span class="surpass">超过了{{data.avisitorsRanking}}%的同事。</span><br/>
                    最多一天拜访了<span class="orange">{{data.avisitorsNum}}</span>个访客！
                </div>
                <van-image :src="annualImg[3]" width="100%"/>
            </section>

        </div>
        <van-popup
            v-model="thisImgShow"
            overlay-class="popupZIndex"
            class="myVanPopup"
        >
            <van-image :src="thisImgSrc" id="vanImg" ref="vanImg" @load="imageLoad" @error="imageError" />
        </van-popup>
        <!-- 分享按钮 -->
        <div id="share" @click.stop="share">
            <span>转发分享</span>
            <van-image :src="shareImg" width="18" height="18" class="shareImg"/>
        </div>
        <footer>@{{aYear}} 工作过程系统</footer>
    </div>
</template>

<script>
import { Toast } from "vant";
import html2canvas from "html2canvas";
import { getCookie, setCookie } from "@/apis/cookie1";
import water from "@/component/global/watermarker";
export default {
    name:'annualSummary2020',
    components:{
        water
    },
    data(){
        return{
            thisImgSrc: "",
            thisImgShow: false,
            shareImg: require("@static/imgs/annualSummary/2020/share.png"), // 分享按钮图标
            userData:{},
            aYear:2019,
            data:{},
            imgLogo:require("@static/imgs/annualSummary/2020/logo.png"),
            avatar:'',
            imgSrc:require("../../../static/imgs/fill.png"), // 未加载出来头像的 默认头像
            annualImg:[
                require("@static/imgs/annualSummary/2020/0.png"),
                require("@static/imgs/annualSummary/2020/1.png"),
                require("@static/imgs/annualSummary/2020/2.png"),
                require("@static/imgs/annualSummary/2020/3.png"),
            ],
        }
    },
    methods:{
        imageError(error){ // 图片加载失败
            this.showMask=false
            if(this.thisImgSrc){
                Toast('图片加载失败,请重新分享')
            }
        },
        base64URLtoFile(base64Data, filename) {
            var arr = base64Data.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        },
        imageLoad() { // 图片生成事件
            this.showMask=true
            Toast.clear();
            this.$toast({
                message: "长按图片进行分享",
                getContainer: () => this.$refs.vanImg.$el,
                duration: 1000
            });
        },
        share() { // 生成图片方法
            this.showMask=false
            console.log('el',this.$el);
            this.$el.scrollTop = 0;
            Toast.loading({
                message: "图片生成中...",
                duration: 0, // 持续展示 toast
                forbidClick: true
            });
            html2canvas(this.$refs.annualSummary, {
                useCORS: true,
                width: window.screen.availWidth,
                widowWidth: document.body.scrollWidth,
                widowHeight: document.body.scrollHeight,
                scale: 2
            }).then(canvas => {
                const fileName=`${new Date().getTime()}.jpg`
                const file=this.base64URLtoFile(canvas.toDataURL("image/jpeg",0.6),fileName)
                const  params = new FormData();
                params.append("file", file);
                console.log(file)
                this.$getData.uploadImg({
                    method: "post",
                    data: params
                }).then(res => {
                    console.log(res)
                    if(res.code==200){
                        this.thisImgSrc = res.data
                        this.thisImgShow = true;
                    }
                }).catch(() => {
                    Toast.clear();
                    this.showMask=false
                });
            })
        },
        selUserAnnual(){ // 获取用户年报
            this.$getData.selUserAnnual({
                method:'post'
            }).then(res=>{
                console.log("selUserAnnual res",res);
                if(res.code == 200){
                    this.aYear = res.data.ayear;
                    this.data = res.data;
                }
            }).catch(err=>{

            })
        },
        queryPersonUnitMsgByAd(){ // 获取user信息
            this.$getData.queryPersonUnitMsgByAd({
                method:'post',
                data:{
                    name:this.data.adAcount
                }
            }).then(res=>{
                console.log('res',res);
                if(res.code == 200){
                    this.userData = res.data;
                }
            })
        },

    },
    mounted(){
        this.$refs.initwart.initWaterMark(getCookie("accountName"));
        this.queryPersonUnitMsgByAd();
        this.selUserAnnual();
    },
    computed:{
        belongOrgName:function(){
            return this.userData.belongOrgName?this.userData.belongOrgName.replace(',','-'):''
        }
    }
}
</script>
<style lang="scss" scoped>

#main{
    height: 100%;overflow-y:scroll;
    &>footer{
        margin-top: 45px;margin-bottom: 14px;
        font-size:11px;
        font-weight:500;
        color:rgba(75,119,175,1);
        line-height:16px;
        text-align: center;
    }
}
#share{ // 分享按钮样式
    width:240px;
    height:42px;
    background:rgba(75,119,175,1);
    border-radius:21px;
    margin: 0 auto;

    font-size:17px;
    font-weight:500;
    color:rgba(255,255,255,1);
    line-height:42px;
    text-align: center;
    &>span{
        vertical-align: middle;
    }
    &>.shareImg{
        vertical-align: middle;
    }

}
#annualSummary2020{
    background:linear-gradient(270deg,rgba(249,250,255,1) 0%,rgba(255,255,255,1) 21%,rgba(255,255,255,1) 81%,rgba(249,250,255,1) 100%);
    .user{ padding-top:23px;padding-left:26px;display: flex;justify-content: flex-start;
        .userMessage{ margin-left: 6px;
            font-size:12px;
            font-weight:500;
            color:rgba(75,119,175,1);
            line-height:17px;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
    }
    &>h1{
        margin: 0 auto;text-align: center;
        margin-top: 108px;width: 305px;
        font-size:36px;
        font-weight:500;
        color:rgba(75,119,175,1);
        line-height:50px;
        margin-bottom: 129px;
    }
    .logo{ margin-bottom: 81px; }
    &>section{
        margin-bottom: 50px;
        .title{
            font-size:24px;
            font-weight:530;
            color:rgba(75,119,175,1);
            line-height:33px;
            text-align: center;
            margin-bottom: 26px;
        }
        .content{
            .orange{
                color: #FF8C00;
            }
            .surpass{ // 超出百分比样式
                font-weight:600;
            }
            margin-left: 26px;
            font-size:20px;
            font-weight:500;
            color:rgba(75,119,175,1);
            line-height:28px;
            margin-bottom: 45px;
        }
    }

}
</style>
<style lang="scss">
.watermark{ // 水印样式
    height:20000px;
}
</style>
