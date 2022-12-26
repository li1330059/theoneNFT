<template>
  <div>
    <div class="mode-mobile"><m-header :title="'我的藏品'" :righttext="'创建'" @add="categoryAdd" /></div>
    <div class="page-mine-treasure-category">
      <div class="mode-PC">
      <div class="v1-card-title-mycenter">
        <h1>我的藏品</h1>
        <div class="justify-between">
          <div class="v1-btn mycenter red" @click="categoryAdd()">
            创建藏品夹
          </div>
          <div class="v1-btn-group-mycenter">
            <div class="btn-item bg show1"></div>
            <div class="btn-item bg show2"></div>
          </div>
        </div>
      </div>
      </div>
      <div class="category-list">
        <div class="category-item" @click.stop="goPage('/mine/treasure')">
          <div class="covers">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div class="title">
            <h1>默认藏品</h1>
            <p class="amount">1</p>
          </div>
          <div class="operate justify-between">
            <p>系统创建</p>
            <div class="more mode-PC">
              <ul>
                <li class="edit" @click.stop="editCategory">编辑</li>
                <li class="delete" @click.stop="deleteCategory">删除</li>
              </ul>
            </div>
            <div class="more" @click.stop="openDialog('id')"></div>
          </div>
        </div>
      </div>
      <categoryAdd ref="categoryAdd" @listen="listenCategoryAdd"></categoryAdd>
      <div class="opdialog" v-if="isShowDialog" @click.stop="closeDialog">
        <div class="panel">
          <div @click.stop="editCategory">编辑</div>
          <div @click.stop="deleteCategory">删除</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import categoryAdd from "@/pages/v1/mine/treasure/categoryAdd";
import mHeader from "@/components/v1/layout/mobileHeader";
export default {
  components: { categoryAdd, mHeader },
  data() {
    return {
      isShowDialog: false
    };
  },
  created() {},
  methods: {
    categoryAdd() {
      this.$nextTick(() => {
        this.$refs.categoryAdd.init();
      });
    },
    listenCategoryAdd() {},
    goPage(path) {
      this.$router.push(path);
    },
    openDialog(){
      this.isShowDialog = true
    },
    closeDialog(){
      this.isShowDialog = false
    },
    editCategory(){
      this.closeDialog()
    },
    deleteCategory() {
      this.closeDialog()
      this.$confirm(`确认删除此藏品夹？藏品将会同步入默认藏品夹。`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {})
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (min-width: 541px) {
  .page-mine-treasure-category {
    .v1-btn-group-mycenter {
      margin-left: 16px;
      .show1 {
        background-image: url("//static.theone.art/pc/images/treasure-show1.png");
      }
      .show2 {
        background-image: url("//static.theone.art/pc/images/treasure-show2.png");
      }
    }
    .category-list {
      padding-top: 40px;
      display: flex;
      flex-wrap: wrap;
      margin: 0 -12px;
      .category-item {
        cursor: pointer;
        margin: 0 12px 24px;
        width: 260px;
        height: 352px;
        background: #f6f6f6;
        box-shadow: 0px 2px 14px 0px rgba(102, 102, 102, 0.14);
        border-radius: 4px;
        border: 1px solid #e3e3e3;
        padding: 16px;
        .covers {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -4px;
          div {
            width: 112px;
            height: 112px;
            margin: 0 2px 4px;
            background: #fff;
          }
        }
        .title {
          height: 50px;
          border-bottom: 1px solid rgba($color: #979797, $alpha: 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          h1 {
            font-size: 14px;
            color: #000000;
          }
          .amount {
            font-size: 14px;
            color: rgba($color: #000000, $alpha: 0.4);
            background: url("//static.theone.art/pc/images/treasure-pic.png")
              no-repeat left center;
            background-size: 18px 18px;
            padding-left: 26px;
          }
        }
        .operate {
          font-size: 14px;
          color: rgba($color: #000000, $alpha: 0.4);
          height: 24px;
          padding-top: 13px;
          .more {
            background: url("//static.theone.art/pc/images/treasure-more.png")
              no-repeat center center;
            background-size: 24px 24px;
            width: 24px;
            min-height: 24px;
            cursor: pointer;
            position: relative;
            &:hover {
              ul {
                display: block;
              }
            }
            ul {
              display: none;
              position: absolute;
              top: 24px;
              left: -12px;
              width: 70px;
              height: 66px;
              background: #ffffff;
              box-shadow: 0px 2px 6px 0px rgba(102, 102, 102, 0.26);
              border-radius: 2px;
              font-size: 14px;
              color: rgba($color: #000000, $alpha: 0.4);
              padding: 8px;
              > li {
                line-height: 25px;
                background: url("//static.theone.art/pc/images/treasure-edit.png")
                  no-repeat left center;
                background-size: 18px 18px;
                padding-left: 26px;
                &.delete {
                  background-image: url("//static.theone.art/pc/images/treasure-delete.png");
                }

                &:nth-child(1) {
                  &:hover {
                    color: rgba($color: #000000, $alpha: 0.7);
                    // background-image: url("//static.theone.art/pc/images/treasure-delete.png");
                  }
                }

                &:nth-child(2) {
                  &:hover {
                    color: rgba($color: #000000, $alpha: 0.7);
                  }
                }
              }
              // li:hover {
              //   color: rgba($color: #000000, $alpha: 0.7);

              // }
            }
          }
        }
      }
    }
  }
}

@media screen and (min-width: 0px) and (max-width: 540px) {
  .page-mine-treasure-category {
    padding-top: 1.42rem;
    display: flex;
    flex-wrap: wrap;
    background: #fafafa;
    .category-list {
      // padding-top: 40px;
      // margin-bottom: .32rem;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      // margin: 0 -12px;
      .category-item {
        cursor: pointer;
        // margin: 0 12px 24px;
        margin: 0 0 0.32rem 0.32rem;
        width: 3.26rem;
        min-height: 4.68rem;
        background: #f6f6f6;
        border-radius: 0.08rem;
        border: 0.02rem solid #e3e3e3;
        padding: 0.16rem 0.16rem 0.26rem 0.16rem;
        .covers {
          display: flex;
          flex-wrap: wrap;
          // justify-content: space-between;
          div {
            width: 1.4rem;
            height: 1.42rem;
            margin-right: 0.08rem;
            margin-bottom: 0.08rem;
            background: #fff;
            &:nth-child(even) {
              margin-right: 0;
            }
          }
        }
        .title {
          height: 0.74rem;
          border-bottom: 0.01rem solid rgba($color: #979797, $alpha: 0.2);
          display: flex;
          justify-content: space-between;
          align-items: center;
          h1 {
            font-size: 0.28rem;
            color: #000000;
          }
          .amount {
            font-size: 0.28rem;
            color: rgba($color: #000000, $alpha: 0.4);
            background: url("//static.theone.art/pc/images/treasure-pic.png")
              no-repeat left center;
            background-size: 0.36rem 0.36rem;
            padding-left: 0.52rem;
          }
        }
        .operate {
          font-size: 0.28rem;
          color: rgba($color: #000000, $alpha: 0.4);
          height: 0.48rem;
          padding-top: 0.26rem;
          .more {
            background: url("//static.theone.art/pc/images/treasure-more.png")
              no-repeat center center;
            background-size: 0.48rem 0.48rem;
            width: 0.48rem;
            min-height: 0.48rem;
            cursor: pointer;
            position: relative;
          }
        }
      }
    }

    .opdialog {
      width: 100%;
      position: fixed;
      top: 0;
      z-index: 9999999;
      bottom: 0;
      background: rgba($color: #000000, $alpha: 0.3);
      .panel {
        width: 100%;
        height: 2rem;
        background: #ffffff;
        border-radius: 0.08rem 0.08rem 0 0;
        position: absolute;
        bottom: 0;
        font-size: 0.28rem;
        font-weight: 500;
        color: rgba($color: #000000, $alpha: 0.7);
        > div {
          line-height: 1rem;
          padding: 0 0.32rem;
          border-bottom: 0.02rem solid rgba($color: #979797, $alpha: 0.2);
          &:nth-child(1) {
            &::before {
              content: "";
              background: url("//static.theone.art/pc/images/pic-home/edit%402x.png")
                no-repeat;
              background-size: 0.36rem 0.36rem;
              display: inline-block;
              width: 0.36rem;
              height: 0.36rem;
              vertical-align: middle;
              margin-right: 0.08rem;
            }
          }
          &:nth-child(2) {
            &::before {
              content: "";
              background: url("//static.theone.art/pc/images/pic-home/delete%402x.png")
                no-repeat;
              background-size: 0.36rem 0.36rem;
              display: inline-block;
              width: 0.36rem;
              height: 0.36rem;
              vertical-align: middle;
              margin-right: 0.08rem;
              margin-top: -0.02rem;
            }
          }
        }
      }
    }
  }
}
</style>
