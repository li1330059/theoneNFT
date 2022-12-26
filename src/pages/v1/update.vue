<template>
  <div class="page-404">
     <p>为了给大家带来更好的体验，唯一艺术平台正在进行服务器升级扩容，预计2月18日8点升级完成，敬请期待！</p>
    <!-- <div class="pic"></div>  -->
    <!-- <a href="/" class="btn">回到首页</a> -->
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.page-404 {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20vh;
  padding-bottom: 20vh;
  .pic {
    // background: url("//static.theone.art/pc/images/update.png") no-repeat center center;
    background-size: 100% auto;
    width: 600px;
    height: 653px;
  }
  p {
    font-size: 16px;
    color: #767676;
    margin-bottom: 24px;
  }
  .btn {
    width: 155px;
    height: 45px;
    background: #b3b3b3;
    border-radius: 23px;
    font-size: 20px;
    color: #767676;
    line-height: 45px;
    text-align: center;
  }
}
@media screen and (max-width: 1200px) {
  .page-404 {
    padding: 20px 40px 60px;
    padding-top: 80px;
    .pic {
      width: 80%;
    }
  }
}
</style>
