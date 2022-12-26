<template>
  <div class="m-title grayscale"><span /><slot></slot><span /></div>
</template>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/active/tom.scss";
.m-title {
  display: flex;
  font-size: 20px;
  color: $base-font-color;
  justify-content: center;
  align-items: center;
  margin:42px auto 45px;
  font-weight: bold;
  span{
    display: none;
    width:52px;
    height:18px;
    background:url("//static.theone.art/pc/dunhuang/icon-title.png") no-repeat center;
    background-size: contain;
    margin:0 27px;
  }
}
@media screen and (max-width: 540px){
  .m-title {
    font-size: .24rem;
    margin: .52rem 0;
    span {
      width: 1.06rem;
      height: .36rem;
      margin: 0 .66rem;
    }
  }
  
}
</style> 