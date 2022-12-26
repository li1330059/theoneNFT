<template>
  <div>
    <el-dialog
      title="银行卡和额度"
      :visible.sync="isShow"
      width="1100px"
      :append-to-body="true"
      :before-close="() => (isShow = false)"
    >
      <div class="ui-wrap">
        <div v-html="listHtml"></div>

        <!--    <table class="ui-table">
          <thead>
            <tr>
              <th>银行名称</th>
              <th>卡类型</th>
              <th>客户类型</th>
              <th>单笔限额（元）</th>
              <th>日累计限额（元）</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>工商银行</td>
              <td>储蓄卡</td>
              <td>u盾</td>
              <td>5w</td>
              <td>2w</td>
            </tr>
          </tbody>
        </table> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      listHtml: "",
    };
  },
  props: {
    location: {
      type: String,
    },
  },
  created() {},
  methods: {
    async show() {
      const res = await this.$api.service.news_list({
        location: this.location,
        pageCount: 1,
        pageSize: 20,
      });
      console.log(res.data);

      if (res.data.code == 200 && res.data.data.records) {
        if (res.data.data.records.length <= 0) {
          this.$message.warning("暂没数据");
          return;
        }

        const info = res.data.data.records[0];
        const newsInfo = await this.$api.service.dynamicNews_findNews({
          uuid: info.uuid,
        });
        if (newsInfo.data.code == 200 && newsInfo.data.data.details) {
          this.listHtml = newsInfo.data.data.details;
          this.isShow = true;
        }else{
            this.$message.error(newsInfo.data.message);
        }
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

    tr:nth-child(1) {
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

