<template>
  <div :class="`m-material-wrap-${type}`" v-if="material">
    <div
      class="ui-cover"
      :class="['img responsive-img', isFinish ? '' : 'image-gray']"
      :style="`background-image:url(${material.cover})`"
      :alt="material.haveCommodityName"
    />
    <div class="info">
      <div class="ui-txt">
        <div class="txt-title">合成条件</div>
        <div class="txt">
          <div >{{ material.name }}</div>
          <div>需要*{{ material.amountNeed }}</div>
          <div>当前拥有*{{ material.amountCurrent }}</div>
          <div v-if="material.userSelect">
            当前选择：{{ material.userSelect.commoditySku.number || 0 }}/{{
              material.userSelect.commoditySku.amountNumber
            }}
          </div>
        </div>
      </div>
      <div>
        <div class="btn btn-red" v-if="isFinish" @click="onFinish(material)" :class="{'btn-have-select':btnStatus.key==1}">
          {{ btnStatus.val }}
        </div>
        <div class="btn btn-border" v-else @click="onFinish(material)">去购买</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DhMaterial",
  data() {
    return {};
  },
  props: {
    type: {
      type: String, //横向显示x/竖向显示y
      default: "x",
    },
    idx: Number,
    material: {
      //材料
      type: Object,
      default: () => {
        return {
          amountCurrent: null,
          amountHas: null,
          amountNeed: null,
          cover: "",
          id: "",
          name: "",
          userSelect: "",
        };
      },
    },
    commodity: {
      type: Object,
      default: () => {
        return {
          amountCurrent: 0,
          amountHas: 0,
          amountNeed: 0,
          cover: "",
          id: "",
          name: "",
        };
      },
    },
    way: {
      type: String,
      default: null,
    },
  },
  computed: {
    isFinish() {
      //是否收集完毕

      return (
        this.material.amountCurrent &&
        this.material.amountCurrent >= this.material.amountNeed
      );
    },
    btnStatus(){
 
      if(this.material.userSelect){
        return {key:1,val:'已选择'}
      }
      if(this.material.amountCurrent){
        if(this.material.amountCurrent > this.material.amountNeed){
          return {key:2,val:'去选择'}

        }else if(this.material.amountCurrent == this.material.amountNeed){
          return this.way==1?{key:3,val:'去合成'}:{key:4,val:'完成'}
        }
      }
      return {key:5,val:'去购买'}

    }
  },
  methods: {
    onFinish() {
       this.$emit('listen',this.material,this.idx,this.isFinish);
    },
    onGet() {
      this.$router.push(
        `/market?key=${this.material.name}&id=${this.material.id}&type=${this.material.typeMarket}`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/1.0/scss/profiteer-pub.scss";
.btn {
  width: 100%;
  min-width: 138px;
}
.ui-cover {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #fff;
  border-radius: 12px;
  min-height: 120px;
}
.m-material-wrap-y {
  width: 100%;
  .ui-cover {
    width: 100%;
  }
  .info {
    padding: 20px 0 0;
    .ui-txt {
      .txt{
        min-height: 80px;
      }
      .txt-title {
        display: none;
      }
      color: #FAB707;
      font-size: 14px;
      line-height: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
.m-material-wrap-x {
  display: flex;
  width: 100%;
  .ui-cover {
    width: 199px;
  }
  .info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 23px 0 16px 34px;
    .ui-txt {
      .txt {
        line-height: 1.8;
      }
      .txt-title {
        display: block;
        font-size: 18px;
        color: #FAB707;
        margin-bottom: 30px;
      }
    }
  }
}
.btn {
  margin-top: 20px;
}
.btn-have-select{
  background-color: #FF6400;
  color:#fff;
  border-color: #FF6400;
}
@media screen and (max-width: 540px) {

  .m-material-wrap-y {
    .ui-cover{
      img{
        width:100%;
      }
    }
    .ui-txt {
      font-size: 0.22rem;
    }
    .info {
      padding: 0.16rem 0 0;
    }
  }

  .m-material-wrap-x {
    display: block;
    .ui-cover {
      width: 100%;
    }
    .info {
      padding: 0.2rem 0 0;
      .ui-txt {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .txt {
        }
        .txt-title {
        }
      }
    }
  }
}
</style> 