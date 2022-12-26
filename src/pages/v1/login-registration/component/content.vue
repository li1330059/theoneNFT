<template>
  <div class="body-wrap">
    <div class="theme-img grayscale"></div>
    <div class="content grayscale" id='box'>
      <slot></slot>
    </div>
  </div>
</template>
<script>

import collisionAnimation from './collisionAnimation'
export default {
  beforeDestroy(){
    if(this.collisionAnimationDestory){
      this.collisionAnimationDestory();
    }
  },
  mounted() {
    this.collisionAnimationDestory=collisionAnimation({
      id:'#box',
      imgs:[
        {
          src:'//static.theone.art/pc/login/round-1.png'
        },
        {
          src:'//static.theone.art/pc/login/round-2.png'
        },
        {
          src:'//static.theone.art/pc/login/round-3.png'
        },{
          src:'//static.theone.art/pc/login/round-4.png'
        },{
          src:'//static.theone.art/pc/login/round-5.png'
        }
      ]

    });
  },
 

};
</script>
<style lang='scss' scoped>
.body-wrap {
  min-height: calc(100vh - 80px);
  background-color: #fbfbfb;
  display: flex;
  .theme-img {
    flex: 4;
    background: url("//static.theone.art/pc/login/login-painting4.png")
      no-repeat center;
    background-size: cover;
  }
  .content {
    position: relative;
    top:0;
    left:0;
    flex: 6;
    display: flex;
    justify-content: center;
  }
  @media screen and (max-width: 525px) {
    display: block;
    .theme-img {
      display: none;
    }
    .content {
      display: block;
      width: 100%;
    }
  }
}
</style>