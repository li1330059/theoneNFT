<template>
  <div>
    <div class="computer-wrap">
      <span class="demonstration"> </span>
      <el-cascader
        v-model="value"
        :options="options"
        @change="handleChange"
      ></el-cascader>
    </div>
    <div class="phone-wrap">
      <van-field
        v-model="fieldValue"
        is-link
        readonly
        label="地区"
        placeholder="请选择所在地区"
        @click="isShowPhone = true"
      />
      <van-popup v-model="isShowPhone" round position="bottom">
        <van-cascader
          v-model="value"
          title="请选择所在地区"
          :options="options"
          @close="isShowPhone = false"
          @finish="onFinish"
        /> </van-popup
      > 
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      isShowPhone: false,
      value: [],
      options: [
        {
          value: "zhinan",
          label: "指南",
          text: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              text: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                  text: "一致",
                },
                {
                  value: "fankui",
                  label: "反馈",
                  text: "反馈",
                },
                {
                  value: "xiaolv",
                  label: "效率",
                  text: "反馈",
                },
                {
                  value: "kekong",
                  label: "可控",
                  text: "反馈",
                },
              ],
            },
            {
              value: "daohang",
              label: "导航",
              text: "反馈",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航",
                  text: "反馈",
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航",
                  text: "反馈",
                },
              ],
            },
          ],
        },
      ],
    };
  },
  methods: {
    onFinish() {},
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>
<style lang="scss" scoped>
.phone-wrap {
  display: none;
}
.computer-wrap {
  display: block;
}

@media screen and (max-width: 540px) {
  .phone-wrap {
    display: block;
  }
  .computer-wrap {
    display: none;
  }
}
</style>