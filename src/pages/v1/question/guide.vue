<template>
  <div class="page-tree-list">
	  <template v-if="!$common.isMobile()">
		  <div class="banner"></div>
		  <div class="cont">
		  	<el-tree class="tree" :data="guideList" node-key="id" :default-expanded-keys="idArr" :props="defaultProps" @node-click="handleNodeClick">
		  		<span class="custom-tree-node" slot-scope="{ node }">
		  			<span class="span fs-16" tabindex ="-1" v-if="node.level==1">{{ node.label }}</span>
		  			<span class="span fs-14" tabindex ="-1" v-else-if="node.level==2||node.level==3">{{ node.label }}</span>
		  			<span class="span fs-12" tabindex ="-1" v-else>{{ node.label }}</span>
		  		</span>
		  	</el-tree>
		  	<div class="article" v-html="articleDetail&&articleDetail.details"></div>
		  </div>
	  </template>
  </div>
</template>
<script>
export default {
  components: { },
  data() {
        return {
			guideList:[],
			articleDetail:{},
			idArr:[],
			defaultProps: {
			  children: 'childrens',
			  label: 'name'
			}
        };
      },
  created() {
	  if(this.$common.isMobile()){
		  this.$message({
		    message: "请前往PC端查看详情",
		    type: "error",
		  });
		  return;
	  }
    this.getQuestionList();
  },
  methods: {
    onShow(item) {
      item.active = !item.active;
      this.$forceUpdate();
    },
	async handleNodeClick(data) {
		console.log(data);
		try {
		  this.loading = true;
		  let result = await this.$api.service.treeNews({
			  categoryId:data.id,
			  pageSize:1,
			  pageCount:1
			});
		  this.articleDetail = result.data.data.records[0];
		} catch (error) {
		  console.log(error);
		}
	},
    async getQuestionList() {
      try {
        this.loading = true;
        let result = await this.$api.service.treeList({id:53});
        this.guideList = result.data.data;
		this.guideList.forEach(m=>{
			this.idArr.push(m.id)
		})
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.page-tree-list{
	.banner{
		width: 100%;
		height:200px;
		background: url("//static.theone.art/pc/news/guide-bar.png") no-repeat;
		background-size: cover;
		background-position: center;
	}
	.cont{
		display: flex;
		.tree{
			width: 256px;
			height: 600px;
			overflow-y: auto;
			padding: 40px 24px;
			background: #FBFBFB;
		}
		.article{
			padding: 40px 150px 40px 60px;
			flex: 1;
			::v-deep div,
			::v-deep p{
				white-space: normal!important;
				color: #333;
			}
			::v-deep h1,
			::v-deep h2,
			::v-deep h3,
			::v-deep h4,
			::v-deep h5,
			::v-deep h6{
				white-space: normal!important;
				color: #333;
				font-weight: bold;
			}
			::v-deep p{
				margin: 8px 0;
				font-size: 16px;
			}
			::v-deep font[size="1"] {
			  font-size: 10px;
			}
			
			::v-deep font[size="2"] {
			  font-size: 13px;
			}
			
			::v-deep font[size="3"] {
			  font-size: 16px;
			}
			
			::v-deep font[size="4"] {
			  font-size: 18px;
			}
			
			::v-deep font[size="5"] {
			  font-size: 24px;
			}
			
			::v-deep font[size="6"] {
			  font-size: 32px;
			}
			
			::v-deep font[size="7"] {
			  font-size: 48px;
			}
		}
	}
}
::v-deep .el-tree-node:focus>.el-tree-node__content{
  background: none;   //背景色
  color: #E61F1A;
}
::v-deep .el-tree-node__content {
	height: 33px;
	&:hover {
		background: none;
	}
}
.fs-16{
	font-size: 16px;
	color: #333;
}
.fs-14{
	font-size: 14px;
	color: #666;
}
.fs-12{
	font-size: 12px;
	color: #999;
}
.custom-tree-node{
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.span{
	&:hover {
		color: #E61F1A;
	}
	&:focus {
		color: #E61F1A;
	}
}
</style>
