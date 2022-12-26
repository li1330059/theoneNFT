<template>
<div class="page-body">
    <div class="bg-img">   <div class="section ui-head">
       <div  class="img1"> <img src="//static.theone.art/pc/active/title.png"/></div>
     <div class="img2"><img  src="//static.theone.art/pc/active/title2.png"/></div>
      
  </div></div>

  <div class="box-shadow section bottom1">
      <div class="title">胖脸吉祥系列数字藏品<img class="icon" src="//static.theone.art/pc/active/title-icon.png"/></div>
      <div class="txt">胖脸吉祥是一群有着可爱嘟嘟脸，穿着新潮汉服的小仕女，她们出生于长安，有着古今结合的国潮范，她们不以瘦为美、自信独立、热爱生活。胖脸吉祥从传统文化而来，携现代诙谐登场。</div>
      <div class="txt">拥有微博、公众号、抖音、B站、小红书等全网自媒体矩阵。常常被人民日报、央视网等主流官媒推荐转载，《国家宝藏》合作IP。每个女生只要有聊天群，总能看到胖脸吉祥，因此号称“国民仕女头像”！</div>
  </div>
  <div class="box-shadow section section2">
      <div class="title">报名抽签购买资格</div>
      <div class="txt" v-if="userInfo.userUuid">{{userInfo.nickname}}，您好</div>
      <div class="txt" v-else>您还未登录，请去<span @click="goLogin">登录</span></div>
  </div>
  <div class="sign-btn" :class="{'sign-btn-disabled':true}" >本次活动已结束<!-- <div class="icon"/>
  <span v-if="signStatus">已抽签</span>
  <span v-else>报名</span> -->
  </div>
   <div class="box-shadow section bottom">
       <div class="section-head">
           <div class="left">
               <div class="t1">盲盒内容</div>
               <div class="t2">Blind Box Content</div>
           </div>
           <div class="right"><span class="num">1</span></div>
       </div>
       <div class="flex-wrap">
           <div class="ui-cover">
               <img src="//static.theone.art/pc/active/p1.png"/>
               <div class="des">胖脸吉祥 01</div>
           </div>
                      <div class="ui-cover">
               <img src="//static.theone.art/pc/active/p2.png"/>
               <div class="des">胖脸吉祥 02</div>
           </div>
                      <div class="ui-cover">
               <img src="//static.theone.art/pc/active/p3.png"/>
               <div class="des">胖脸吉祥 03</div>
           </div>
                      <div class="ui-cover">
               <img src="//static.theone.art/pc/active/p4.png"/>
               <div class="des">胖脸吉祥 04</div>
           </div>
                      <div class="ui-cover">
               <img src="//static.theone.art/pc/active/p5.png"/>
               <div class="des">胖脸吉祥 05</div>
           </div>
                      <div class="ui-cover">
               <img src="//static.theone.art/pc/active/p6.png"/>
               <div class="des">胖脸吉祥 06</div>
           </div>
                      <div class="ui-cover">
               <img src="//static.theone.art/pc/active/p7.png"/>
               <div class="des">胖脸吉祥 07</div>
           </div>
       </div>
   </div>
 <div class="box-shadow section bottom">
     
    <div class="section-head">
           <div class="left">
               <div class="t1">藏品玩法</div>
               <div class="t2">Collection Playrule</div>
           </div>
           <div class="right"><span class="num">2</span></div>
       </div>
       <div class="wrap-2">
           <div class="txt">集齐七款（每款四张）合成
胖脸吉祥大唐七步妆</div>
<div class="img">
 <img src="//static.theone.art/pc/active/play-1.png"/>
</div>
          
       </div>
       <div class="wrap-3">
           <div>
               <img src="//static.theone.art/pc/active/play-2.png">
               <div>胖脸吉祥大唐七步妆</div>
           </div>

       </div>
 </div>

  <div class="box-shadow section bottom">
          <div class="section-head">
           <div class="left">
               <div class="t1">活动须知</div>
               <div class="t2">Activity Guidelines</div>
           </div>
           <div class="right"><span class="num">3</span></div>
       </div>
       <div class="txt">为更好服务唯一艺术平台的各位用户，唯一艺术特此公告数字藏品的二次交易细则。鉴于不同属性的数字艺术的二次交易细则各有不同，请各位用户务必审慎阅读并同意相关规则后进行相应操作，以免造成不必要损失。</div>
       <div class="txt"> 1、依据我国法律要求，特定条件下的数字藏品的二次交易不支持任何形式的变相炒作，我们坚决反对数字藏品炒作、场外交易、欺诈，或以任何其他非法、侵权方式使用的违法违规行为，请大家注意甄别上述涉嫌网络欺诈的行为及其相关风险。</div>
       <div class="txt"> 2、数字藏品为虚拟数字商品，购买以及寄售前请先完成实名认证。</div>
       <div class="txt"><b>3、数字藏品一经售出不支持退换。</b></div>

  </div>

    <div class="box-shadow section">
          <div class="section-head">
           <div class="left">
               <div class="t1">关于唯一艺术</div>
               <div class="t2">About TheOne.Art</div>
           </div>
           <div class="right"><span class="num">4</span></div>
       </div>
       <div class="txt">唯一艺术是中国一家数字艺术电商，由艺术设计圈知名公司和区块链技术团队联袂推出，公司在北京、杭州、深圳和香港等多地设有分公司，致力于打造中国较大的数字艺术品交易市场。</div>

 <div class="txt">在股东和合规性上，2021年9月唯一艺术平台收获国有资本的投资，同时获得了多项现有政策下的合规经营资质。从经营资质、合规性、用户规模、作品数量上公司已成为国内数字艺术平台中的领军企业。</div>

 <div class="txt">平台于2021年8月发起的“全球首届数字艺术创作大赛”，获得了众多海内外艺术家的积极响应，获得了业内人士和媒体的一致好评。大赛也得到了包括新华社、光明日报、环球网、China Daily在内的多家央媒的关注与报道。</div>

 <div class="txt">唯一艺术平台立足于区块链技术在知识产权领域的应用，立足于数字艺术产业的发展。平台致力于为传播中国文化、增强中国文化影响力，为中国的数字艺术产业做实做强，提供更加坚实的基础设施保障。</div>
    

  </div>
</div>
</template>
<script>

const KEY="Tli9Z6nVOTrxe3f1wUsdZMDhog4168OubqjDkFpxvkOUmFDMLCtGJ7FoOVyKvAHo"
export default {
  components: { },
  data() {
    return {
signStatus:false
    };
  },
  mounted() {
      this.getUserSignStatus();

  },
  computed: {
    userInfo() {
      return this.$store.state.user_info;
    },
  },
  methods: {
      goLogin(){
          this.$router.push('/login');
      },
      async getUserSignStatus(){
          console.log(this.userInfo);
          if(this.userInfo.userUuid){
     const res=await this.$api.service.activity_getResult({actKey:KEY});
          if(res.data.code==200&&res.data.data){
              this.signStatus=res.data.data;

          }else{
             
          }
          }

      },
      async onSign(){
          if(this.signStatus){
              this.$message.warning("您已报名！");
              return;
          }
          const res=await this.$api.service.activity_signUp({actKey:KEY});
          if(res.data.code==200&&res.data.data){
              this.getUserSignStatus();
 this.$message.success('报名成功');
          }else{
              this.$message.error(res.data.message);
          }
      }

  },
};
</script>
<style lang="scss" scoped>

.a{
    color:royalblue;
}
.bg-img{
    background-image: url("//static.theone.art/pc/active/bg1.png");
    background-repeat: no-repeat;
    background-position: center right;
    background-size: contain;

    @media screen and (min-width: 0px) and (max-width: 540px) {
        background-image: inherit;
    }

}
.wrap-3{
    display: flex;
    justify-content: flex-end;
    margin-top:33px;
    >div{
        color:rgba(34, 22, 6, .88);
        font-size: 20px;
        width:46%;
        text-align: center;
        img{
            display: block;
            width:100%;
            margin-bottom:14px;
        }
    }
       @media screen and (min-width: 0px) and (max-width: 540px) {
        display: block;
        >div{
            width:90%;
            margin:0 auto;
        }
    }
    }
.wrap-2{
    display: flex;
    align-items: flex-end;
    .txt{
        flex:2
    }
    .img{
        flex:3;
        img {
            display: block;
            width:90%;
            margin: 0 auto;
        }
    }
     @media screen and (min-width: 0px) and (max-width: 540px) {
  display: block;
    }
}
.ui-cover{
    width:25%;
    margin-bottom:20px;
    padding:0 40px;
    img{
        display: block;
        width:100%;
    }
    .des{
        font-size: 16px;
font-weight: 400;
color: #000000;
text-align: center;
margin-top:14px;
    }
 @media screen and (min-width: 0px) and (max-width: 540px) {
   width:100%;
    }
}
.flex-wrap{
    display: flex;
    flex-wrap: wrap;
    margin:0 -40px;
}
.section-head{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom:55px;
    .t1{
        font-size: 26px;
font-weight: normal;
color: #221606;
    }
    .t2{
        font-size: 20px;
font-weight: normal;
color: #221606;
    }
}
.num{
    font-size: 90px;
font-weight: bold;
color:rgba(0, 0, 0, 0.07)
}
.sign-btn{
    width: 600px;
line-height: 60px;
text-align: center;
background: linear-gradient(184deg, #A47D4B, #694619);
border-radius: 40px;
margin:30px auto 160px;
display: flex;
align-items: center;
justify-content: center;
font-size: 20px;
font-weight: normal;
color: #FFFFFF;
user-select: none;
cursor: pointer;
.icon{
    display: flex;
    width:22px;
    height:22px;
    background-image:url("//static.theone.art/pc/active/icon-sign.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-right:6px;
}
     @media screen and (min-width: 0px) and (max-width: 540px) {

         width:90%;
         margin:.3rem auto 1.6rem;
     }
}
.sign-btn-disabled{
    background:rgba(97, 97, 97, 0.4);
}
.page-body{
    background:linear-gradient(90deg, #E5CEAD, #D9C09D); ;
}
.ui-head{
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding:200px 0 200px;
    img{
        display: block;
        width: 100%;
    }
    .img1 {
        max-width:655px;
        width:50%;
    }
        .img2 {
            width:30%;
        max-width:255px;
    }
@media screen and (min-width: 0px) and (max-width: 540px) {
    padding:1rem 0 1.6rem;
    display: block;
              .img1 {
        max-width:inherit;
        width:86%;
        margin:0 auto 1rem;
    }
    .img2{
        width:70%;
        margin:.4rem auto;
    }
        }
}

    .box-shadow{
        background: linear-gradient(232deg, #E5CEAD, #D9C09D);
box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.03);
border-radius: 5px;
padding:57px 54px 88px;
.title{
    font-size: 26px;
font-weight: normal;
color: #221606;
display: flex;
align-items: center;
margin-bottom:43px;
.icon{
    width:53px;
    margin-left: 20px;
}
}
.txt{
    font-size: 16px;
font-weight: normal;
color: rgba(34, 22, 6, .88);
margin-bottom:30px;
line-height: 25px;
}
    }
    .section{
        max-width:1066px;
        margin:0 auto;
    }
    .bottom1{
    margin-bottom:30px;
}
.section2{
    padding-bottom:37px;
}
.bottom{
    margin-bottom:200px;
}
        @media screen and (min-width: 0px) and (max-width: 540px) {
          .box-shadow{
              padding:.5rem .6rem .8rem;
          }
        }
</style>
