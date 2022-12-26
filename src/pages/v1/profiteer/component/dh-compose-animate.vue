<template>
  <transition name="fade">
    <div class="" v-if="isShow">
     
    </div>
  </transition>
</template>
<script>
export default {
  name: "DhComposeAnimate",
  props: {

  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
  },
};
</script>
<style lang="scss" scoped>

</style>