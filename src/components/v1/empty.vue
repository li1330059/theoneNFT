<template>
  <div class="com-empty">
    <div class="empty">
      <div class="">
        <img src="//static.theone.art/pc/images/ui-empty.png" alt="" />
        <p>{{ title ? title : "暂无内容" }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: function () {
        return "暂无内容";
      },
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.com-empty {
  position: relative;
  height: 100%;
  min-height: 50vh;

  .empty {
    padding: 30px 0;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    img {
      width: 80%;
      min-width: 200px;
      max-width: 500px;
      margin: 0 auto 10px;
    }
    p {
      font-size: 16px;
      color: #bcbcbc;
      line-height: 32px;
      text-align: center;
    }

    .mode-mobile {
      img {
        width: 5.2rem;
        min-width: inherit;
        max-width: inherit;
      }
      p {
        font-size: 0.28rem;
        color: rgba($color: #000000, $alpha: 0.4);
        margin-top: 0.32rem;
        text-align: center;
      }
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .com-empty {
    height: 8rem;
    .empty {
      padding: 0.3rem 0;
    }
  }
}
</style>
