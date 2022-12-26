<template>
  <div>
    <el-dialog
      title="银行卡和额度"
      :visible.sync="isShow"
      width="1100px"
      :before-close="() => (isShow = false)"
    >
      <div class="ui-wrap">
        <table class="ui-table">
          <thead>
            <tr>
              <th>银行名称</th>
              <th>单笔</th>
              <th>单日</th>
              <th>单月</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in list" :key="idx">
              <td>{{ item.name }}</td>
              <td>{{ item.quotaSingle }}</td>
              <td>{{ item.quotaDay }}</td>
              <td>{{ item.quotaMonth }}</td>
              <td>{{ item.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      list: [],
    };
  },
  props: {
    location: {
      type: String,
    },
  },
  created() {
   
  },
  methods: {
    async show() {
      const res = await this.$api.service.bankQuota_list();

      if (res.data.code == 200 && res.data.data) {
        this.list = res.data.data;
        this.isShow=true;
      } else {
        this.$message.error(res.data.message);
      }
    },
    hide() {
      this.isShow = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.ui-wrap {
  overflow-y: auto;
  max-height: 650px;
  ::v-deeptable {
    width: 100%;
    border-spacing: 0;
    font-size: 14px;
    font-weight: bold;

    th,
    td {
      padding: 12px 0;
      text-align: center;
      border: 0.5px solid #eeeeee;
    }

    thead {
      background-color: #e7231e;
      color: #fff;
      td {
        border-color: #e7231e;
      }
    }
  }
}

::v-deep .el-dialog__body {
  padding: 0;
}
@media screen and (max-width: 541px) {
  .ui-wrap {
    height: 60vh;
  }
}
</style>

