<template>
  <div class="address-select">
    <div class="address-item">
      <el-select v-model="provinceName" placeholder="请选择省" @change="handleChange($event,0)">
        <el-option
          v-for="item in provinceInfo"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="address-item address-item-center">
      <el-select
        v-model="cityName"
        @clear="clear"
        clearable
        placeholder="请选择市"
        @change="handleChange($event,1)"
      >
        <el-option
          v-for="item in cityInfo"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="address-item">
      <el-select
        v-model="addressName"
        @clear="clear"
        clearable
        placeholder="请选择区/县"
        @change="handleChange($event,2)"
      >
        <el-option
          v-for="item in addressInfo"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      provinceInfo: [],
      cityInfo: [],
      addressInfo: [],
      provinceName: null,
      cityName: null,
      addressName: null,
      addressCode: null
    };
  },
  mounted() {
    this.getcode({});
  },
  methods: {
    //三级联动
    async getcode(option, index) {
      const res = await this.$api.service.payChannel_queryYbAddress(option);
      if (res.data.code == 200) {
        switch (index) {
          case 0:
            res.data.data.forEach(item => {
              item.value = item.cityCode;
              item.label = item.cityName;
            });
            this.cityInfo = res.data.data;
            this.cityName = null;
            this.cityCode = null;
            this.addressName = null;
            this.addressInfo = [];
            this.addressCode = null;
            break;
          case 1:
            res.data.data.forEach(item => {
              item.value = item.districtCode;
              item.label = item.districtName;
            });
            this.addressInfo = res.data.data;
            this.addressName = null;
            this.addressCode = null;
            break;
          default:
            res.data.data.forEach(item => {
              item.value = item.provinceCode;
              item.label = item.provinceName;
            });
            this.provinceInfo = res.data.data;
            this.cityInfo = [];
            this.cityName = null;
            this.cityCode = null;
            this.addressName = null;
            this.addressInfo = [];
            this.addressCode = null;
        }
      }
    },
    handleChange(e, num) {
      let object = {};
      switch (num) {
        case 0:
          this.provinceCode = e;
          object = { provinceCode: e };
          this.getcode(object, num);
          this.listen(null);
          break;
        case 1:
          this.cityCode = e;
          object = { provinceCode: this.provinceCode, cityCode: e };
          this.getcode(object, num);
          this.listen(null);
          break;
        case 2:
          this.addressCode = e;
          this.listen(e);
          break;
      }
    },
    listen(code) {
      this.$emit("listen", code);
    }
  }
};
</script>
<style lang="scss" scoped>
.address-select {
  display: flex;
  align-content: center;
}
.address-item-center {
  margin: 0 10px;
}
</style>
<style lang="scss">
.address-select {
  .el-input__inner {
    font-size: 14px;
    padding: 0 8px;
  }
  .el-input__icon {
    width: 15px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 15px;
  }
}
</style>