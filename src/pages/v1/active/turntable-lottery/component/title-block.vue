<template>
  <div class="title-body">
    <div class="title-wrap bg-img">
      <div class="bg-wrap">
        <img :src="left" />
        <div class="img-md img-bg" :style="`background-image:url(${md})`"></div>
        <img :src="right" />
      </div>
      <div class="info-wrap">
        <span class="ui-icon" :style="`background-image:url(${icon})`"></span>
        <div class="txt hidden-one" :style="`color:${color}`">{{ title }}</div>
        <span class="ui-icon" :style="`background-image:url(${icon})`"></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
    md: {
      type: String,
      default: "",
    },
    left: {
      type: String,
      default: "",
    },
    right: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#6d3f0b",
    },
  },
};
</script>
<style lang="scss" scoped>
.title-body {
  display: flex;
  justify-content: center;
}
.ui-icon {
  width: 26px;
  height: 18px;
}
.title-wrap {
  padding: 0 30px;
  position: relative;
  top: -6px;
  left: 0;
  margin: 0 auto;
  .info-wrap {
    position: relative;
    background-size: contain;
    padding: 10px 24px 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bg-wrap {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    * {
      height: 100%;
    }
    .img-md {
      flex: 1;
      background-repeat: repeat-x;

      background-size: auto 100%;
    }
  }
  .txt {
    font-size: 20px;
    font-weight: 500;
    min-width: 180px;
    text-align: center;
    padding: 0 10px;
  }
  @media screen and (max-width: 540px) {
    padding: 0.15rem 0.4rem 0.06rem;

    margin: 0 auto;
    top: -0.12rem;
    min-width: 4.8rem;
    .info-wrap {
      padding: 0.05rem 0.24rem 0.06rem;
    }
    .txt {
      max-width: 3.4rem;
      padding: 0 0.1rem;
      min-width: 2rem;
      font-size: 0.26rem;
    }
  }
}
</style>
