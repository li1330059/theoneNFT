<template>
  <transition name="fade">
    <div class="content flex" v-if="isShow">
      <div class="center flex">
        <img
          class="close"
          src="//static.theone.art/pc/dunhuang/icon-close.png"
          alt
          @click="hide()"
        />
        <div class="loading">
          <div class="loadEffect">
            <span v-for="(item,index) in 8" :key="index"></span>
          </div>
          <p>正在合成{{name}}</p>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "DhLoading",
  props: {
    name: {  //合成物名称
      type: String,
      // default: 'B款敦煌（静态）'
    } 
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.loadEffect {
  width: 100px;
  height: 100px;
  position: relative;
  margin: 0 auto;
  margin-top: 100px;
}
.loadEffect span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #aaa;
  position: absolute;
  -webkit-animation: load 1.04s ease infinite;
}
@-webkit-keyframes load {
  0% {
    -webkit-transform: scale(1.5);
    background: #d3583f;
  }
  50% {
    -webkit-transform: scale(1);
    background: #d3583f;
  }
  51% {
    -webkit-transform: scale(1);
    background: #aaa;
  }
  100% {
    -webkit-transform: scale(1);
    background: #aaa;
  }
}
.loadEffect span:nth-child(1) {
  left: 0;
  top: 50%;
  margin-top: -5px;
  -webkit-animation-delay: 0.13s;
}
.loadEffect span:nth-child(2) {
  left: 14px;
  top: 14px;
  -webkit-animation-delay: 0.26s;
}
.loadEffect span:nth-child(3) {
  left: 50%;
  top: 0;
  margin-left: -5px;
  -webkit-animation-delay: 0.39s;
}
.loadEffect span:nth-child(4) {
  top: 14px;
  right: 14px;
  -webkit-animation-delay: 0.52s;
}
.loadEffect span:nth-child(5) {
  right: 0;
  top: 50%;
  margin-top: -px;
  -webkit-animation-delay: 0.65s;
}
.loadEffect span:nth-child(6) {
  right: 14px;
  bottom: 14px;
  -webkit-animation-delay: 0.78s;
}
.loadEffect span:nth-child(7) {
  bottom: 0;
  left: 50%;
  margin-left: -6px;
  -webkit-animation-delay: 0.91s;
}
.loadEffect span:nth-child(8) {
  bottom: 14px;
  left: 14px;
  margin-top: -5px;
  -webkit-animation-delay: 1.04s;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.content {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.43);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
.center {
  background-color: #fff7e9;
  width: 60%;
  height: 75%;
  border-radius: 10px;
  position: relative;
}
.close {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 36px;
  right: 41px;
  cursor: pointer;
}
.loading {
  text-align: center;
  font-size: 18px;
  color: #d3583f;
 p {
   margin-top: 100px;
 }
}

@media screen and (max-width: 540px) {
  .center {
    width: 90%;
    height: 50%;
  }
  .close {
    top: 20px;
    right: 18px;
  }
}
@media screen and (max-width: 540px) {
  .loading {
    font-size: 0.24rem;
    p {
      margin-top: 1rem;
    }
  }
  .close {
    width: 0.44rem;
    height: 0.44rem;
  }
  .loadEffect {
    transform: scale(0.8);
    margin-top: 0.7rem;
  }
}
</style>