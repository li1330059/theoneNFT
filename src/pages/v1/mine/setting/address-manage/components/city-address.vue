<template>
  <div class="address-select">
    <div class="address-item">
      <el-select v-model="provinceName" value-key="value" placeholder="省" @change="handleChange($event,0)">
        <el-option
          v-for="item in provinceInfo"
          :key="item.value"
          :label="item.label"
          :value="item"
        ></el-option>
      </el-select>
    </div>
    <div class="address-item address-item-center">
      <el-select
        v-model="cityName"
		value-key="value"
        placeholder="市"
        @change="handleChange($event,1)"
      >
        <el-option
          v-for="item in cityInfo"
          :key="item.value"
          :label="item.label"
          :value="item"
        ></el-option>
      </el-select>
    </div>
    <div class="address-item">
      <el-select
        v-model="addressName"
		value-key="value"
        placeholder="区"
        @change="handleChange($event,2)"
      >
        <el-option
          v-for="item in addressInfo"
          :key="item.value"
          :label="item.label"
          :value="item"
        ></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
		editItem:null,
      provinceInfo: [],
      cityInfo: [],
      addressInfo: [],
      provinceName: null,
      cityName: null,
      addressName: null,
      addressCode: null,
	  province:null,
	  city:null
    };
  },
  mounted() {
    this.getcode({});
  },
  methods: {
	  async init(item) {
		  this.editItem = item;
		// this.provinceName = item.province;
		// this.cityName = item.city;
		// this.addressName = item.area;
		this.getcode({});
	  },
    //三级联动
    async getcode(option, index,ifedit) {
		console.dir(index)
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
			if(this.editItem&&ifedit){
				this.cityName = {value:Number(this.editItem.cityCode),label:this.editItem.city}
				this.getcode({ provinceCode: this.provinceName.value,cityCode: this.cityName.value},1,"edit");
			}
            break;
          case 1:
            res.data.data.forEach(item => {
              item.value = item.districtCode;
              item.label = item.districtName;
            });
            this.addressInfo = res.data.data;
            this.addressName = null;
            this.addressCode = null;
			if(this.editItem&&ifedit){
				this.addressName = {value:Number(this.editItem.areaCode),label:this.editItem.area}
			}
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
			if(this.editItem){
				this.provinceName = {value:Number(this.editItem.provinceCode),label:this.editItem.province}
				this.getcode({ provinceCode: this.provinceName.value },0,"edit");
			}
        }
      }
    },
    handleChange(e, num) {
      let object = {};
      switch (num) {
        case 0:
          this.provinceCode = e.value;
		  this.province = e.label;
          object = { provinceCode: e.value };
          this.getcode(object, num);
          this.listen(null);
          break;
        case 1:
          this.cityCode = e.value;
		  this.city = e.label;
          object = { provinceCode: this.provinceCode, cityCode: e.value };
          this.getcode(object, num);
          this.listen(null);
          break;
        case 2:
          this.addressCode = e.value;
          this.listen({
			  province:this.province,
			  provinceCode:this.provinceCode,
			  city:this.city,
			  cityCode:this.cityCode,
			  area:e.label,
			  areaCode:e.value
		  });
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
@media screen and (min-width: 541px) {
	.address-item-center {
	  margin: 0 10px;
	}
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