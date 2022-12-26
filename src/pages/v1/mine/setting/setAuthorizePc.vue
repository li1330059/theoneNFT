<template>
  <div class="authcont">
    <div class="authitem" v-for="(item,index) in authlist" :key="index">
  	  <div class="imgurl" :style="`background-image:url(${item.appInfo.iconUrl})`"></div>
  	  <div class="info">
  		  <div class="name">{{item.appInfo.name}}</div>
  		  <div class="scope">・<span v-for="(subitem,idx) in item.scopes" :key="idx">{{subitem.name}}<span v-if="idx<item.scopes.length-2">、</span><span v-if="idx==item.scopes.length-2">和</span>
		  </span></div>
  	  </div>
  	  <div class="btn" @click="deAuth(item)">解除授权</div>
    </div>
	<div class="empty" v-if="!authlist||authlist.length==0">暂无通过唯一艺术授权的平台</div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      authlist:[]
    };
  },
  created() {
    this.getList();
  },
  computed: {},

  methods: {
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
.authcont{
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	padding-bottom: 6px;
	max-height: 358px;
	overflow: auto;
	.authitem{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 14px;
		padding: 16px;
		background: #F5F5F5;
		border-radius: 4px;
		margin-bottom: 14px;
		.imgurl{
			width: 43px;
			height: 43px;
			border: 1px solid #FFFFFF;
			border-radius: 100%;
			background-size: 100%;
			background-repeat: no-repeat;
			background-position: center;
			margin-right: 12px;
		}
		.info{
			.name{
				color: #333333;
				margin-bottom: 2px;
			}
			.scope{
				font-size: 12px;
				color: #666666;
			}
		}
		.btn{
			color: #397FE7;
			width: 80px;
			text-align: right;
			background-image: url("~@/assets/1.0/images/authtag.png");
			background-size: 20px 20px;
			background-repeat: no-repeat;
			background-position: left;
			padding-top: 2px;
			margin-left: auto;
			cursor: pointer;
		}
	}
	.empty{
		background-image: url("~@/assets/1.0/images/auth_empty.png");
		background-size: 100% 200px;
		background-repeat: no-repeat;
		background-position: top;
		width: 282px;
		height: 228px;
		color: rgba(0, 0, 0, 0.4);
		display: flex;
		justify-content: center;
		align-items: flex-end;
		margin: 60px auto;
	}
}
</style>
