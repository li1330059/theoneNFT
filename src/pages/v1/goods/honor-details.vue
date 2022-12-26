<template>
	<div class="page-honor-details">
		<div class="honor-img" :style="`background-image:url('${honorDetail.picUrl}')`"></div>
		<div class="honor-info">
			<div class="honor-name">{{honorDetail.name}}</div>
			<div class="honor-txt">{{honorDetail.description}}</div>
		</div>
	</div>
</template>

<script>
export default {
  name: "honorDetails",
  data() {
	return {
		honorDetail:{}
	};
  },
  mounted() {
	  this.getHonorDetail();
  },
  methods: {
	  async getHonorDetail() {
	    const res = await this.$api.service.honor_detail({
	      id:  this.$route.params.id
	    });
	    if (res.data.code == 200) {
	      this.honorDetail = res.data.data;
	    }
	  },
  },
};
</script>

<style lang="scss" scoped="">
.page-honor-details{
	background: #EAEEF1;
	padding-bottom: .8rem;
	.honor-img{
		width: 100%;
		height: 10.6rem;
		background-size: 100%;
		background-repeat: no-repeat;
		background-position: center;
	}
	.honor-info{
		padding: .6rem;
		.honor-name{
			font-size: .3rem;
			font-weight: 500;
			color: #23243A;
			line-height: .36rem;
			margin: 0 auto;
			display: table;
		}
		.honor-txt{
			font-size: .28rem;
			color: #9596A4;
			line-height: .52rem;
			margin-top: .38rem;
			word-wrap:break-word;
			word-break: break-all;
		}
	}
}

</style>
