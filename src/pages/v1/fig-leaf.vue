<template>
  <div class="body">
    <div class="main">
      <img
        src="https://static.theone.art/pc/update/icon-rocket.png"
      />
      <div class="title">{{updateInfo.title}}</div>
      <div class="des">{{updateInfo.pcMessage}}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed:{
      updateInfo(){
          return this.$store.state.updateInfo
      }
  }
};
</script>
<style lang="scss" scoped>
img {
  display: block;
  width: 260px;
  margin: 0 auto;
  animation: shake 2.6s ease-in-out infinite;
  animation-direction: alternate;
}

@keyframes shake {
  0% {
    transform: translateY(10px);
  }

  100% {
    transform: translateY(-10px);
  }
}

.body {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-image: url("https://static.theone.art/pc/update/update-bg.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.main {
  padding-top: 25vh;
  text-align: center;
}

.title {
  font-size: 20px;
  color: #000000;
  line-height: 28px;
  letter-spacing: 2px;
  max-width:560px;
  margin:75px auto 15px;
  padding:0 15px;
}

.des {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  line-height: 20px;
  letter-spacing: 1px;
   max-width:760px;
  padding:0 15px;
  margin:0 auto;
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  img {
    width: 50%;
  }

  .main {
    padding-top: 22vh;
  }

  body {
    background-size: contain;
    background-image: url("https://static.theone.art/pc/update/moblie-bg.png");
  }

  .title {
    margin-top: 55px;
  }
}
</style>