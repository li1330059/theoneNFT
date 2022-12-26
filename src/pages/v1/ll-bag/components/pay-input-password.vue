<template>
  <div class="ll-bag-body">
    <section class="input-block">
      <div class="ui-icon icon-close"></div>
      <div class="title">请输入支付密码</div>
      <div class="msg">支付金额</div>
      <div class="money">{{$common.formatMoney(price)}}</div>
      <div class="input-list">
        <div class="input-box" v-for="(item, idx) in nums" :key="idx">
          <div class="input">{{item.txt}}</div>
        </div>
      </div>
    </section>
    <keyboard @keyup="keyup" @confirm="confirm"></keyboard>
  </div>
</template>
<script>
import Keyboard from "./keyboard.vue";
export default {
  components: { Keyboard },
  props:{
    price:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      nums: [],
    };
  },
  created() {
    this.nums = [];
    for (let i = 0; i < 6; i++) {
      this.nums.push({
        txt: "",
      });
    }
  },
  methods: {
    keyup(e) {
      const idx=this.nums.findIndex(item=>!item.txt);
      if(idx>-1){
        this.nums[idx].txt=e.val
      }
    },
    confirm(){
      console.log(this.nums);

    }
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/ll-bag/common.scss";
.input-block {
  background: #ffffff;
  border-radius: 20px;
  text-align: center;
  padding: 26px;
  .title {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
  }
  .msg {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    margin-top: 26px;
  }
  .money {
    font-size: 32px;
    font-weight: 600;
    color: #333333;
    margin-top: 8px;
  }
  .input-list {
    display: flex;
    margin-top: 8px;
    .input-box {
      flex: 1;
      padding: 4.5px;
      cursor: pointer;
      .input {
        height: 40px;
        line-height:40px;
        background: #f7f7f7;
        border-radius: 4px;
        user-select: none;
      }
    }
  }
}
</style>
