<template>
  <div class="header">
    <img class="logo" src="//static.theone.art/pc/logo.svg" alt="logo" />
    <div class="login-title">{{ title }}</div>
  </div>
</template>
<script>
export default {
  name: "Header",
  props: {
    title: String,
  },
};
</script>

<style lang='scss' scoped>
.header {
  .logo {
    display: none;
  }
  .login-title {
    padding: 166px 0 24px;
    font-size: 18px;
    font-weight: bold;
    color: #e61f1a;
  }
  @media screen and (max-width: 525px) {
    display: block;
    .logo {
      display: block;
      margin: 0.94rem auto 1rem;
    }
    .login-title {
      display: none;
    }
  }
}
</style>