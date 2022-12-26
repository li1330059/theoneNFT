<template>
  <div class="address-pc-body">
  <div class="head">
	<div class="message-warning">已经保存了{{list.length}}条地址，还能保存{{20 - list.length}}条地址</div>
	<div>
	  <div class="ui-btn ui-btn-red" @click="onSetting()"><span class="icon" />+ 添加收货地址</div>
	</div>
  </div>
   <section class="list-wrap" v-if="list&&list.length>0">
      <table class="table">
        <thead>
          <tr class="table-head">
            <th class="pd-l">收货人</th>
            <th>手机号</th>
            <th>收货地址	</th>
            <th>操作</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in list" :key="index">
            <td class="pd-l">{{item.contactsName}}</td>
            <td>{{item.contactsPhone}}</td>
            <td class="address-txt">{{item.province}} {{item.city}} {{item.area}} {{item.addressDetail}}</td>
            <td>
              <div class="ui-btn ui-btn-link" @click="onSetting(item)">编辑</div>
			  <div class="td-line">|</div>
              <div class="ui-btn ui-btn-link" @click="delAddress(item)">删除</div>
            </td>
            <td class="center">
				<div class="ui-btn ui-btn-warning" v-if="item.isDefault">默认地址</div>
				<div class="ui-btn ui-btn-link" v-if="!item.isDefault" @click="setDefault(item)">设为默认</div>
			</td>
          </tr>
        </tbody>
      </table>
    </section>
	<div v-if="list.length==0" class="empty">
		  <div class="img"></div>
		  <div>您还没有地址哦，快来添加吧～</div>
	</div>
	<editor-address ref="editorAddress"></editor-address>
  </div>
</template>
<script>
import EditorAddress from "./components/editor-address.vue";
export default {
  components: {
    EditorAddress
  },
  props: {},
  data() {
    return {
		list:[]
	};
  },
  mounted() {
  	this.getList()
  },
  methods: {
	  onSetting(item) {
		  if(this.list.length>=20){
			  this.$message.warning("最多创建20个地址");
			  return;
		  }
		  if(item){
			  this.$refs['editorAddress'].init(item);
		  }else{
			  this.$refs['editorAddress'].init();
		  }
	  },
	  async getList() {
	    const res = await this.$api.service.address_list();
	    console.log(res);
	    if (res.data.code == 200) {
			this.list = res.data.data;
	    }else{
			this.$message.error(res.data.message)
		}
	  },
		delAddress(item) {
		  this.$confirm(`确定要删除该地址么？`, "提示", {
		    confirmButtonText: "确定",
		    cancelButtonText: "取消",
		  })
		    .then(async () => {
				const res = await this.$api.service.address_delete({uuid:item.uuid});
				console.log(res);
				if (res.data.code == 200) {
					this.$message.success("删除成功")
					this.getList();
				}else{
					this.$message.error(res.data.message)
				}
			})
		    .catch(() => {});
	  },
	  async setDefault(item) {
	  	item.isDefault = 1;
	    const res = await this.$api.service.address_update(item);
	    if (res.data.code == 200) {
	  			this.$message.success("设置默认地址成功");
	  			this.getList();
	    }else{
	  			this.$message.error(res.data.message)
	  		}
	  },
  },
};
</script>
<style lang="scss" scoped>
.message-warning {
  font-size: 14px;
  color: #f4a33a;
}
.head{
  display: flex;
  justify-content: space-between;
  padding:30px 0;

}
.center{
	text-align: center;
}
.empty{
	font-size: 14px;
	font-weight: 400;
	color: #999999;
	text-align: center;
	position: absolute;
	top: 30%;
	left: 30%;
	.img{
		background-image: url("~@/assets/1.0/images/address_no.png");
		width: 228px;
		height: 147px;
		background-size: 100%;
		margin-bottom: 16px;
	}
}
.table {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-collapse: collapse;
  text-align: left;
  .table-head {
    th {
      background: #f4f4f4;
      font-size: 12px;
      color: #999999;
      line-height: 39px;
      border: none;
	  padding: 0 10px;
    }
  }
  tbody {
    tr {
      border-bottom: 1px solid #e5e5e5;
    }
    td {
      font-size: 14px;
      color: #4d4d4d;
      padding: 30px 0;
      line-height: 19px;
	  padding: 32px 10px;
    }
  }
}
.address-txt{
	max-width: 300px;
	word-wrap: break-word
}
.ui-btn{
	padding: 0;
	min-width: auto;
}
.td-line{
	color: #E5E5E5;
	display: inline-block;
	margin: 0 8px;
}
.ui-btn-link {
  font-size: 14px;
  font-weight: 500;
  color: #397fe7;
  cursor: pointer;
}
.ui-btn-warning {
  background: rgba(244, 163, 58, 0.1);
  border-radius: 15px;
  border: 1px solid #f4a33a;
  font-size: 14px;
  color: #f4a33a;
  min-width: 96px;
}
.ui-btn-red{
	background: linear-gradient(90deg, #FF7A64 0%, #E61F1A 100%);
	border-radius: 15px;
	font-size: 14px;
	color: #ffffff;
	width: 144px;
}
.pd-l{
	padding-left: 30px!important;
}
</style>
