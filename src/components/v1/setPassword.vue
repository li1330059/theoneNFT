 <template>
  <el-dialog
    class="theone-dialog page-login dialogContain"
    :visible.sync="show"
    append-to-body
    width="570px"
    title="设置登录密码"
  >
    <div class="line" />
    <div class="des">为了您的账号更加安全请设置登录密码</div>
    <div class="form">
      <div class="title">密码</div>
      <div class="input-block">
        <input type="password" placeholder="请输入密码" v-model="password" />
      </div>
      <div class="title">确认密码</div>
      <div class="input-block">
        <input
          type="password"
          placeholder="请确认密码"
          v-model="confirm_password"
        />
      </div>
      <div class="footer">
        <div class="sub-btn" @click="onSubmit">确定</div>
      </div>
    </div>
  </el-dialog>
</template>
    
<script>
import { checkUserPassword } from "@/utils/common";

export default {
  name: "setPassword",
  data() {
    return {
      password: "",
      confirm_password: "",
    };
  },
  computed: {
    show: {
      get() {
        return this.$store.state.is_show_set_password;
      },
      set(val) {
        this.$store.dispatch("toggleSetPassWord", val);
        this.$store.dispatch("getUserInfo");
      },
      /*  */
    },
  },
  methods: {
    hide() {
      this.$store.dispatch("toggleSetPassWord", false);
      
    },
    async onSubmit() {
      const self = this;
      if (checkUserPassword(this.password)) {
        if (this.password == this.confirm_password) {
          const res = await this.$api.service.operation_initialPw({
            password: self.password,
          });
          if (res && res.data.code == 200 && res.data.data) {
            //设置成功
            this.$store.commit("toggleSetPassWord", false);
            this.$store.dispatch("getUserInfo");
          } else {
            this.$message({
              message: res ? res.data.message : "error",
              type: "error",
            });
          }
        } else {
          this.$message({
            message: "两次密码不一致",
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: "密码英文数字下划线，至少8位",
          type: "warning",
        });
      }
    },
  },
};
</script> 
  
<style lang="scss" scoped>
.des {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 16px;
}
.input-block {
  line-height: 44px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  input {
    padding: 0 16px;
    display: block;
    width:100%;
  }
}
.title {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.4);
  margin-bottom: 8px;
}
.line {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-top: -30px;
  margin-bottom: 16px;
}
.footer {
  display: flex;
  justify-content: flex-end;
  .sub-btn {
    background: linear-gradient(90deg, #ff7a64 0%, #e61f1a 100%);
    border-radius: 15px;
    width: 96px;
    line-height: 30px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    text-align: center;
    cursor: pointer;
  }
}
</style>