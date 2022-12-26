<template>
  <div class="help-body">
    <el-collapse v-model="activeNames" @change="handleChange" accordion>
      <el-collapse-item
        :title="item.name"
        :name="idx"
        v-for="(item, idx) in listData"
        :key="item.uuid"
      >
        <div class="help-content" v-html="item.detail"></div>
        <div></div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return { activeNames: ["1"], idx: 0, listData: [] };
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
	categoryName: {
	  type: String,
	  default: () => {
	    return "";
	  },
	},
  },
  watch: {
    list: {
      handler: function (val) {
        this.activeNames = ["1"];
        this.listData = JSON.parse(JSON.stringify(val)).map((item) => {
          item.detail = "";
          return item;
        });
      },
      deep: true,
    },
  },
  created() {
    this.listData = JSON.parse(JSON.stringify(this.list)).map((item) => {
      item.detail = "";
      return item;
    });
    this.init();
  },
  computed: {},
  methods: {
    init() {},
    handleChange(val) {
      this.idx = val;
      this.getDetail();
    },
    async getDetail() {
      try {
        const _list = JSON.parse(JSON.stringify(this.listData));
        const info = _list[this.idx];
		this.$sensors.track('hotspot_click', {
			module_name: this.categoryName,
			button_name: info.name,	
		});
        if (info && info.detail) {
          return;
        }
        if (info.uuid) {
          const res = await this.$api.service.dynamicNews_findNews({
            uuid: info.uuid,
          });

          if (res.data.code == 200) {
            const html = res.data.data.details.replace(/\\n/gi, "<br>");
            info.detail = html;
            this.listData = _list;
          } else {
            this.$message.error(res.data.message);
          }
        }
      } catch (e) {}
    },
  },
};
</script>
<style lang="scss" scoped>
.help-body {
  ::v-deep .el-collapse-item {
    overflow: hidden;
  }
  ::v-deep .el-collapse {
    border-top: none;
  }
  ::v-deep .el-collapse-item__header {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    font-weight: 400;
    color: #333333;
    border-bottom: 1px solid #f5f5f5;
    padding: 12px 0;
    word-break: break-all;
    height:initial;
    line-height:initial;
  }
  ::v-deep .el-icon-arrow-right {
    /*  transform: rotate(-90deg); */
  }
  ::v-deep .is-active {
    .el-icon-arrow-right {
      transform: rotate(90deg);
    }
  }
  ::v-deep .is-active {
    border-bottom: 1px solid #f5f5f5;
  }
  ::v-deep .el-collapse-item__wrap {
    border: none;
  }
}
.help-content {
  max-width: 700px;
  margin: 0 auto;
  font-size: 12px;
  font-weight: 400;
  color: #999;
  padding-top: 30px;
  img {
    max-width: 100%;
    display: block;
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .help-content {
    max-width: inherit;
    font-size: 0.24rem;
  }
  .help-body {
    ::v-deep .el-collapse-item__header {
      font-size: 0.3rem;
      color: #333333;
      background-color: transparent;
    }
    ::v-deep .el-icon-arrow-right {
    }
    ::v-deep .is-active {
      .el-icon-arrow-right {
      }
    }
    ::v-deep .el-collapse-item__wrap {
      background-color: transparent;
    }
  }
}
</style>
