<template>
  <div class="m-empty">
    <div class="img bg-img"></div>
    <div class="txt">{{title}}</div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    title:{
        type:String,
        default:''
    }
  },
  data() {
    return {};
  },

  created() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.m-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top:10px;
  padding-bottom: 28px;
  margin:0 auto;
  .img {
    width: 92px;
    height: 63px;
    background-image: url("//theoneart-public.oss-cn-qingdao.aliyuncs.com/pc/active/turntable/icon-empty.png");
  }
  .txt {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
  }
}
</style> 