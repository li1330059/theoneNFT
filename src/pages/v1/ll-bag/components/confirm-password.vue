<template>
  <div class="ll-bag-body ll-max-width">
    <div class="title">请输入6位数字支付密码</div>
    <div class="des">请不要设置连续相同数字</div>
    <pay-password-input @success="success" @error="error" id="p3"></pay-password-input>
    <div class="title">请再次输入支付密码</div>
    <pay-password-input @success="success" @error="error" id="p2"></pay-password-input>
  </div>
</template>
<script>
import PayPasswordInput from "./pay-password-input.vue";
export default {
  components: { PayPasswordInput },
  data() {
    return {};
  },
  computed: {},
  created() {

  },
  methods: {
    success(){},
    error(){},
    init(){
      
    }
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.title {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 12px;
}
</style>
