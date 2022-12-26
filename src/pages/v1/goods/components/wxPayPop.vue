<template>
     <transition name="fade" v-if="isShow" @touchmove.prevent>
      <div class="m-wx">
        <div>
          <p>点击右上角 . . .</p>
          <p>选择在浏览器中打开</p>
          <p>即可正常支付</p>
        </div>
        <img src="//static.theone.art/pc/icons/icon-wx.png" alt="">
      </div>
    </transition>
</template>
<script>
export default {
    data(){
        return{
            isShow: false
        }
    },
    methods: {
        show(){
            this.isShow= true;
        },
        hide(){
            this.isShow = false;
        }
    }
}
</script>
<style lang="scss" scoped>
.m-wx {
width: 100vw;
    height: 101vh;
    position: fixed;
    top: -1px;
    left: 0;
    z-index: 100000;
    display: flex;
    justify-content: center;
    line-height: 36px;
    font-size: 18px;
    color: #fff;
    background-color: rgba(0,0,0,0.69);
    padding-top: 73px;
    img {
      width: 61px;
      height: 161px;
      position: absolute;
      top: 10px;
      right: 29px;
    }
  }
  .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;

}
    @media screen and (max-width:541px){
        .m-wx {
    top: -0.01rem;
    line-height: 0.7rem;
    font-size: 0.36rem;
    padding-top: 1.46rem;
    img {
      width: 1.22rem;
      height: 3.22rem;
      position: absolute;
      top: 0.2rem;
      right: 0.58rem;
    }
  }
    }
</style>