<template>
    <div class="page-qrcode">
        <div class="theone-main">
            <div class="contain">
                <el-dialog
                    class="add-dialog"
                    :visible.sync="dialogVisible"
                    append-to-body
                    width="428px"
                    :close-on-click-modal="showClo"
                    :close-on-press-escape="showClo"
                    :show-close="showClo"
                    >
                    <div class="theone-nav small tab-class">
                        <ul>
                            <li v-for="(item, index) in tabsParam" :key="index" @click="changeTab(index)" :class="{liClass:wstate == 0}">
                                <a :class="{ active: index == nowIndex }">{{ item }}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="Tabcenter">
                        <div v-show="nowIndex === 0">
                            <div class="qrcode-class">
                                <img class="cancel-class" src="//static.theone.art/pc/images/pic-home/icon-back.png" @click="cancelClick"/>
                                <p class="font20 title">请使用微信扫码支付</p>
                                <div class="wx-class">
                                    <div :class="{'qrcodeImg':true,'qrcodeImg-timeOut':isShowTimeOut}" id="qrcode" ref="qrcode"></div>
                                    <img class="wm-hidden-class" src="//static.theone.art/pc/images/wx-tips.png" />
                                </div>
                                
                                <div :class="{'tips':true,'showTimeOut':isShowTimeOut}">
                                    <p class="content">二维码已失效</p>
                                    <p @click="refresh" class="button">刷新</p>
                                </div>
                            </div>
                        </div>
                        <div class="qrcode-class" v-show="nowIndex === 1">
                            <img class="cancel-class" src="//static.theone.art/pc/images/pic-home/icon-back.png" @click="cancelClick"/>
                            <p class="font20 title ">请使用微信扫码支付</p>
                            <div class="goods-buy-code" v-if="imgurl">
                                <img
                                :src="'data:image/jpeg;base64,' + imgurl"
                                alt=""
                                class="wm-class"
                                />
                            </div>
                        </div>
                    </div>
                    
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
import QRCode from "qrcodejs2"
export default {
    data(){
        return {
            dialogVisible:false,
            isShowTimeOut:false,
            showClo:false,
            timer:null,
            timerCount:5,
            tabsParam:['微信','微盟'],
            nowIndex:0,
            imgurl:null,
            GoodsbuyParam:{
                id: "",
                type: 3,
            },
            orderNo:null,
            goodId:null,
            wstate:null,
            resultTimer:null,
        }
    },
    methods:{
        init(payurl,orderNo,goodId,wstate){
            this.orderNo = orderNo;
            this.dialogVisible = true;
            this.goodId = goodId;
            this.wstate = wstate;
            this.$nextTick(() => {
                this.$refs.qrcode.innerHTML = '';
                var qrcode  = new QRCode('qrcode',{
                    width: 176, 
                    height: 174, 
                    text:payurl,
                    colorDark: "#333333",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.L
                });
            });
            if(!this.imgurl && wstate == 1){
                this.goodsgobuy();
            }else{
                this.tabsParam = ['微信'];
            }
            this.timer = setInterval(() => {
                this.timerCount--;
                if(this.timerCount == 0){
                    this.isShowTimeOut = true;
                    clearInterval(this.timer);
                }
            }, 60000);
            this.getPayResult(orderNo);
        },
        async goodsgobuy() {
            this.GoodsbuyParam.id = this.goodId;
            let GoodsbuyResult = await this.$api.goodsService.goodsbuy(this.GoodsbuyParam);
            if(GoodsbuyResult.data.data == null){
                this.imgurl = null;
            }else{
                this.imgurl = GoodsbuyResult.data.data;
            }
        },
        cancelClick(){
            clearInterval(this.timer);
            clearInterval(this.resultTimer);
            this.$refs.qrcode.innerHTML = ''
            this.dialogVisible = false;
        },
        async refresh(){
            let params = {
                goodsList:[
                    {
                        goodsId:this.goodId,
                        sum:1
                    }
                ],
                payType: 1,
	            unitType: 3
            }
            let result = await this.$api.orderService.add(params);
            if(result.data.data){
                this.$refs.qrcode.innerHTML = ''
                this.init(result.data.data.payUrl,result.data.data.orderNo,this.goodId);
                this.timerCount = 5;
                this.isShowTimeOut = false;
            }else{
                this.$message({
                    type: "error",
                    message: result.data.message,
                });
            }
            this.init();
        },
        changeTab(index){
            this.nowIndex = index;
        },
        getPayResult(outTrandeNo){
            let params = {
                orderType:1,
                wechatPayType:1,
                orderNo:outTrandeNo,
                unitType:3
            };
            this.resultTimer = setInterval(async () => {
                let result = await this.$api.orderService.getPayResult(params);
                if(result.data.data == 2){
                    clearInterval(this.resultTimer);
                    this.$router.push({
                        name: 'paysuccess',
                        params:{
                            goodsId:this.goodId
                        }
                    })
                }else if(result.data.data == 3){
                    clearInterval(this.resultTimer);
                    this.$router.push({
                        name:'mine',
                        params:{
                            tabsActive:'order'
                        }
                    });
                };
            }, 1000);
        },
    },
    beforeDestroy(){
      clearInterval(this.timer);
      clearInterval(this.resultTimer);
   },
}
</script>
<style lang="scss" scoped>
.qrcode-class {
    .cancel-class {
        margin: 30px 0px 0px 30px;
    }
    img {
        cursor: pointer;
        margin: 24px;
    }
    .title {
        color: #000000;
    }
    p {
        text-align: center;
    }
    .wx-class {
        display: flex;
        
        img {
            margin: 30px auto;
            display: none;
            width: 202px;
            height: 188px;
        }
        .qrcodeImg {
            display:block;
            margin: 30px 29%;
            cursor: pointer;
        }
        .qrcodeImg-timeOut {
            opacity: 0.1;
        }
        &:hover {
            img {
                display: block;
            }
            .qrcodeImg {
                margin: 30px auto;
            }
        }
    }
    .tips {
        display: none;
        .content {
            margin-bottom: 16px;
        }
        .button {
            width: 69px;
            height: 30px;
            line-height: 30px;
            background: #6282FF;
            border-radius: 3px;
            color: #FFFFFF;
            margin: 0 auto;
            cursor: pointer;
        }
    }
    .showTimeOut {
        display: block;
        position: relative;
        top: -160px;
    }
}
.add-dialog  ::v-deep .el-dialog__header {
    padding: 0px;
}
.add-dialog  ::v-deep .el-dialog__body {
    background: #FFFFFF;
    box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 10px 20px;
    width: 428px;
    height: 358px;
    padding: 0px;
}
.tab-class {
    text-align: center;
    ul {
        width: 100%;
        text-align: center;
        li {
            width: 50%;
            .active {
                color: #000000;
                &::after {
                    content: "";
                    position: absolute;
                    width: 78px;
                    height: 2px;
                    background: #000000;
                    bottom: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
    }
}
.Tabcenter {
    .pt {
      padding-top: 93px;
    }
    > div {
      padding-bottom: 100px;
    }
    .goods-buy-code {
        text-align: center;
        .wm-class {
            width: 176px;
            height: 174px;
            margin: 30px auto;
        }
    }
}
@media screen and (max-width: 540px) {
    .add-dialog ::v-deep .el-dialog {
        margin-left: 7vh !important;
        width: 300px !important;
    }
    .add-dialog ::v-deep .el-dialog__body {
        width: 300px !important;
    }
    .qrcode-class .wx-class .qrcodeImg {
        margin: 30px 21% !important;
    } 
    .wm-hidden-class {
        display: none !important;
    }
}
.liClass {
    width: 100% !important;
}
</style>