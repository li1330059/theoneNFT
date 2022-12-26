<template>
    <div class="page-body">

<picture class="goods-img-bg-wrap">
          <source
            class="responsive-img"
            :srcset="mobile"
            media="(max-width: 540px)"
            alt="内容图片"
          />

          <img
            class="responsive-img pc-max"
            :srcset="pc"
            alt="内容图片"
          />
        </picture> 
    </div>
    </template>
    <script>
    
    export default {
      components: { },
      data() {
        return {
          pc:'',
          mobile
        };
      },
      created(){
        this.pc=this.$route.query.pc||'';
        this.mobile=this.$route.query.mobile||'';
        if(this.pc&&!this.mobile){
            this.mobile=this.pc;
        }
        if(!this.pc&&this.mobile){
            this.pc=this.mobile;
        }

      },
      mounted() {
        
    
      },
      computed: {
     
      },
      methods: {
  
    
      },
    };
    </script>
    <style lang="scss" scoped>
    .pc-max{
        max-width:1100px;
        margin:0 auto;
    }
    </style>
    