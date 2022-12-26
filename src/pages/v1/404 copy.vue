<template>
  <div class="page-404">
    <div class="pic"></div>
    <p>你所找的页面不在这！</p>
    <a href="/" class="btn">回到首页</a>
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
    background: url("//static.theone.art/pc/images/404.png") no-repeat center center;
    background-size: 100% auto;
    width: 748px;
    height: 335px;
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
    padding: 20px 0px 60px;
    .pic {
      width: 80%;
    }
  }
}
</style>