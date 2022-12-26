<template>
  <el-dialog
    class="v1-dialog-mycenter page-mine-setting-nameVerified content-responsive"
    :visible.sync="dialogVisible"
    append-to-body
    width="500px"
    :title="`授权管理`"
	center="true"
    :fullscreen="isPc ? false : true"
  >
    <div class="authcont">
      <div class="authitem" v-for="(item,index) in authlist" :key="index">
    	  <div class="imgurl" :style="`background-image:url(${item.appInfo.iconUrl})`"></div>
    	  <div class="info">
    		  <div class="name">{{item.appInfo.name}}</div>
    		  <div class="scope"><span class="point">・</span><span v-for="(subitem,idx) in item.scopes" :key="idx">{{subitem.name}}<span v-if="idx<item.scopes.length-2">、</span><span v-if="idx==item.scopes.length-2">和</span>
    		  </span></div>
    	  </div>
    	  <div class="btn" @click="deAuth(item)">解除授权</div>
      </div>
    	<div class="empty" v-if="!authlist||authlist.length==0">暂无通过唯一艺术授权的平台</div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      authlist:[]
    };
  },
  beforeDestroy() {
  },
  methods: {
    async init() {
      this.dialogVisible = true;
      this.isPc = !this.$common.isMobile();
	  this.getList();
    },
    async getList() {
        const res = await this.$api.service.authedapp({});
        if (res.data.code == 200 && res.data.data) {
          this.authlist = res.data.data;
        } else {
          this.$message.error(res.data.message);
        }
    },
    async deAuth(item) {
      let warn = `解除授权后，“${item.appInfo.name}”无法继续获得您的相关信息或权限。`
      this.$confirm(warn, "是否确认解除授权？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      }).then(async () => {
        const res = await this.$api.service.deauthorize({
          appId: item.appInfo.appId,
        });
        if (res.data.code == 200 && res.data.data) {
    	  this.getList();
          this.$message.success(res.data.message);
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/mineSettings.scss";
.v1-dialog-mycenter{
	background: #FAFAFA;
}
.authcont{
	.authitem{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: .28rem;
		padding: .32rem;
		background: #ffffff;
		border-radius: .08rem;
		margin-top: .32rem;
		.imgurl{
			width: .86rem;
			height: .86rem;
			border: 1px solid #DDDDDD;
			border-radius: 100%;
			background-size: 100%;
			background-repeat: no-repeat;
			background-position: center;
			margin-right: .24rem;
		}
		.info{
			.name{
				color: #333333;
				margin-bottom: .04rem;
			}
			.scope{
				font-size: .24rem;
				color: #666666;
			}
		}
		.btn{
			color: #397FE7;
			width: 1.6rem;
			text-align: right;
			background-image: url("~@/assets/1.0/images/authtag.png");
			background-size: .4rem .4rem;
			background-repeat: no-repeat;
			background-position: left;
			padding-top: .04rem;
			margin-left: auto;
			cursor: pointer;
		}
	}
	.empty{
		background-image: url("~@/assets/1.0/images/auth_empty.png");
		background-size: 100% 2.76rem;
		background-repeat: no-repeat;
		background-position: top;
		width: 3.9rem;
		height: 3.22rem;
		color: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		margin: 1.8rem auto;
	}
}
</style>
<style>
.form-line-color .el-input__inner {
  border: 1px solid #e7211c;
}
</style>
