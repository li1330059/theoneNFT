<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-treasure-category-add"
    :visible.sync="dialogVisible"
    append-to-body
    width="570px"
    title="创建藏品夹"
  >
    <div class="dialog-content">
      <div class="dialog-form">
        <div class="form-line">
          <h1>名称</h1>
          <div class="input-line">
            <el-input v-model="categoryParam.name" placeholder="请输入内容"></el-input>
          </div>
        </div>
        <div class="form-line">
          <h1>简介</h1>
          <div class="input-line">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model="categoryParam.content"
              maxlength="200"
              show-word-limit
            ></el-input>
          </div>
        </div>
        <div class="form-btns">
          <div class="v1-btn mycenter" @click="dialogVisible = false">取消</div>
          <div class="v1-btn mycenter red">确定</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      categoryParam: {
        name: "",
        content: "",
      },
    };
  },

  methods: {
    async init() {
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.page-mine-treasure-category-add {
}
</style>

<style lang="scss" scoped></style>
