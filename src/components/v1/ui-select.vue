<template>
  <div class="uiSelect">
    <div class="computer">
      <el-select v-model="currentVal" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item[label]"
          :label="item[label]"
          :value="item[label]"
          @click.native="onChange(item)"
        >
        </el-option>
      </el-select>
    </div>
    <div class="phone">
      <van-field
        readonly
        clickable
        :value="currentVal"
        placeholder="请选择"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker
          :value-key="label"
          show-toolbar
          :columns="options"
          @cancel="showPicker = false"
          @confirm="onChange"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentVal: {},
      showPicker: false,
      options: [],
      label: null,
    };
  },
  props: {
    value: Number, //默认展示第几个,不传则展示展示第一个
    change: {
      type: Function,
      default: () => {},
    },
    defineLabel: String, //定义label
    selelctArr: Array, //列表，必传
  },
  created() {
    this.label = this.defineLabel;
    if (this.value) {
      this.currentVal = this.selelctArr[this.value][this.label];
    } else {
      this.currentVal =  this.selelctArr[0]?this.selelctArr[0][this.label]:{};
    }
    this.options = this.selelctArr;
  },
  watch: {
    value(val) {
      this.currentVal = this.selelctArr[val][this.label];
    },
    defineLabel(val) {
      this.label = val;
    },
    selelctArr: {
      handler(newVal) {
        this.options = newVal;
        this.currentVal = newVal[0][this.label];
      },
      deep: true,
    },
  },
  methods: {
    onChange(e) {
      this.showPicker = false;
      this.currentVal = e[this.label];
      this.$emit("listen", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.phone {
  display: none;
}
.computer {
  display: block;
}

@media screen and (max-width: 540px) {
  .phone {
    display: block;
  }
  .computer {
    display: none;
  }
}
</style>
<style lang="scss">
.uiSelect {
  .van-field__body .van-field__control {
    text-align: right !important;
  }
  .van-field__body::after {
    display: inline-block;
    content: "";
    width: 0.3rem;
    height: 0.3rem;
    background: url("https://static.theone.art/pc/icons/icon-left-direction.png")
      no-repeat center;
    background-size: contain;
    transform: rotate(-90deg);
    margin-left: 0.15rem;
  }
  .el-input--suffix .el-input__inner {
    border: none;
    text-align: right;
    padding-right: 20px;
  }
  .el-input__suffix {
    right: -5px;
  }
  .van-cell {
    display: inline-block;
    background: transparent;
    border: none;
    padding: 0;
    &::after {
      display: none;
    }
  }
}
</style>