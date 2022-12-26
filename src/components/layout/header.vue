<template>
  <div>
    <div class="header-placeholder"></div>
    <div class="com-header">
      <div class="theone-main">
        <div class="header">
          <div class="header-left">
            <div class="logo">
              <router-link to="/index"
                ><img src="//static.theone.art/pc/logo.svg" alt=""
              /></router-link>
            </div>
            <div :class="{ menu: true, show: menuShowFlag }">
              <div>
                <a class="menu-btn" @click="menuShow()"></a>
                <ul>
                  <li
                    :class="{
                      active:
                        activePath == '/index' ||
                        activePath == '/' ||
                        activePath == '/second',
                    }"
                  >
                    <router-link to="/index">版权品市场</router-link>
                    <ul>
                      <li><router-link to="/index">首发市场</router-link></li>
                      <li><router-link to="/second">寄售市场</router-link></li>
                    </ul>
                  </li>
                  <li :class="{ active: activePath == '/derivative' }">
                    <router-link to="/derivative">衍生品市场</router-link>
                  </li>
                  <li :class="{ active: activePath == '/news' }">
                    <router-link to="/news">新闻动态</router-link>
                  </li>
                  
                </ul>
              </div>
            </div>
          </div>
          <div class="login">
            <div class="login-search">
              <i class="el-icon-search"></i>
              <input
                type="text"
                v-model="inputValue"
                @keyup.enter="goSearch()"
                placeholder="艺术家名称.艺术品名称"
              />
              <a class="search-btn" @click="goSearch()">搜索</a>
            </div>
            <div class="login-btns">
              <div v-if="!loginChain" class="chain" @click="loginChainShow"></div>
              <div
                v-else-if="loginChain && loginMember"
                class="chain islogin"
                @click="loginChainShow"
              ></div>
              <div v-else>
                <el-dropdown>
                  <el-avatar size="small" class="chain islogin"></el-avatar>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="admin">个人中心</el-dropdown-item>
                    <el-dropdown-item @click.native="loginChainShow"
                      >链接钱包</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div id="phoneLogin" class="phone" v-if="!loginMember" @click="login"></div>
              <div class="avatar" v-if="loginMember">
                <el-dropdown trigger="click">
                  <el-avatar size="small" :src="loginMember.photo"></el-avatar>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="admin">个人中心</el-dropdown-item>
                    <el-dropdown-item @click.native="loginout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <p></p>
              </div>
            </div>
          </div>
        </div>
        <login v-if="openLogin" ref="login" @listen="retuenData"></login>

      </div>
    </div>
  </div>
</template>

<script>

import login from "@/pages/login/login";

import { logout } from "@/api/user";
import Vue from "vue";
export default {
  components: { login},
  data() {
    return {
      inputValue: "",
      openLogin: false,
      openLoginChain: false,
      loginMember: null,
      loginChain: null,
      activePath: "",
      menuShowFlag: false,
    };
  },
  watch: {
    $route: function (to, from) {
      // console.log(`to`, to);
      this.activePath = to.path;
    },
  },
  created() {
    this.getLoginMember();
  },
  async mounted() {
    //window.ethereum ? (this.isMetaMaskInstall = true) : (this.isMetaMaskInstall = false);
  },
  methods: {
    menuShow() {
      this.menuShowFlag = !this.menuShowFlag;
    },
    admin() {
      this.$router.push("/mine");
    },
    async goSearch() {
      if (!this.inputValue) {
        this.$message.error("请输入关键字");
        return;
      }
      this.$router.push({
        name: "search",
        params: {
          name: this.inputValue,
        },
      });
    },
    loginChainShow() {
      this.openLoginChain = true;
      this.$nextTick(() => {
        this.$refs.loginChain.init();
      });
    },
    async loginChainListen() {
      await this.getLoginMember();
    },
    login() {
      this.openLogin = true;
      this.$nextTick(() => {
        this.$refs.login.init();
      });
    },
    async getLoginMember() {
      let loginMember = localStorage.getItem("THEONE_MEMBER");
      if (loginMember) {
        this.loginMember = JSON.parse(loginMember);
        if (this.$route.path == "/mine") {
          this.$router.go(0);
        } else if (this.$route.path.indexOf("/goods/") != -1) {
          let tempItem = localStorage.getItem("tempItem");
          if (tempItem) {
            document.getElementById("loginCallBackBuy").click();
            localStorage.removeItem("tempItem");
          } else {
            document.getElementById("loginCallBack").click();
          }
        } else if (this.$route.path.indexOf("/writer/") != -1) {
          document.getElementById("loginCallBack").click();
        }
      }

 /*      let loginChain = await chain.getLoginInfo();
      if (loginChain) {
        this.loginChain = loginChain;
      } else {
        this.loginChain = null;
      } */
    },
    retuenData() {
      this.getLoginMember();
    },
    loginout() {
      this.$confirm(`确定退出吗？`, "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        // type: "warning",
      })
        .then(async () => {
          this.$router.push("/index");
          logout().then();
          localStorage.removeItem("THEONE_MEMBER");
          localStorage.removeItem("authorization");
           localStorage.removeItem('THEONE_USER');
           localStorage.removeItem('VERIFY-LIST-V2');
          this.loginMember = null;
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.header-placeholder {
  height: 90px;
}
.com-header {
  padding: 28px 0px;
  position: fixed;
  width: 100%;
  z-index: 1000;
  top: 0px;
  background: #fff;
  box-shadow: 0px 2px 10px 0px rgba(87, 87, 87, 0.1);

  .header {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-left {
    display: flex;
    align-items: center;
    .logo {
      width: 221px;
      height: 24px;
      margin-right: 28px;
    }
    .logo img {
      width: 100%;
    }
    ul {
      display: flex;
      position: relative;
      li {
        font-size: 14px;
        font-weight: 500;
        line-height: 30px;
        margin-right: 16px;
        &.active {
          a {
            color: rgba($color: #000000, $alpha: 0.8);
          }
        }
        a {
          color: rgba($color: #000000, $alpha: 0.4);
        }
        &a:focus {
          opacity: 1;
          font-size: 700;
        }
        &:hover {
          > ul {
            display: flex;
          }
        }
        > ul {
          display: none;
          position: absolute;
          flex-direction: column;
          background: #fff;
          left: -20px;
          top: 30px;
          li {
            line-height: 40px;
            padding: 0 20px;
            margin-right: 0px;
            &.active {
              a {
                color: rgba($color: #000000, $alpha: 0.8);
              }
            }
            a {
              color: rgba($color: #000000, $alpha: 0.4) !important;
            }
            &a:focus {
              opacity: 1;
              font-size: 700;
            }
          }
        }
      }
    }
  }

  .login {
    display: flex;
    justify-content: space-between;
    .login-search {
      height: 30px;
      box-shadow: 0px 2px 8px 0px rgba(84, 84, 84, 0.4);
      border-radius: 4px;
      border: 1px solid rgba($color: #050101, $alpha: 0.4);
      display: flex;
      align-items: center;
      .search-btn {
        display: block;
        height: 30px;
        width: 50px;
        background: #000;
        color: #fff;
        line-height: 30px;
        text-align: center;
        border-radius: 0 4px 4px 0px;
        cursor: pointer;
      }
      i {
        margin: 9px;
      }
      input {
        width: 250px;
        border-radius: 4px;
      }
      input::-webkit-input-placeholder,
      input:-moz-placeholder,
      input::-moz-placeholder,
      input:-ms-input-placeholder {
        color: #b2b2b2;
        font-size: 10px;
      }
    }
    .login-btns {
      display: flex;
      height: 30px;
      > div {
        width: 30px;
        height: 30px;
        margin-left: 17px;
        border-radius: 100%;
      }
      .phone {
        background: url("../../assets/img/9.png") no-repeat;
        background-size: cover;
      }
      .chain {
        background: url("../../assets/img/23.png") no-repeat;
        background-size: cover;
        &.islogin {
          background-image: url("//static.theone.art/pc/images/wallet-icon-login.png");
        }
      }
    }
  }
  @media screen and (min-width: 0px) and (max-width: 960px) {
    .header-left {
      flex-direction: column;
      align-items: flex-start;
      .logo {
        margin-bottom: 20px;
      }
    }

    .login {
      flex-direction: column;
      justify-content: flex-end;
      .login-search {
        margin-bottom: 10px;
      }
      .login-btns {
        justify-content: flex-end;
      }
    }
  }

  @media screen and (min-width: 0px) and (max-width: 650px) {
    .login {
      .login-search input {
        width: 100px;
      }
    }
  }
}
@media screen and (min-width: 0px) and (max-width: 960px) {
  .header-placeholder {
    height: 126px;
  }
}
@media screen and (min-width: 0px) and (max-width: 540px) {
  .header-placeholder {
    height: 110px;
  }
  .login {
    position: absolute;
    right: 10px;
    top: 28px;
    flex-direction: column-reverse !important;
    .login-btns {
      margin-bottom: 10px;
    }
  }

  .header-left {
    .menu {
      position: relative;
      &.show {
        ul {
          display: block;
          li {
            font-size: 0.3rem;
            padding: 0.2rem 0;
            &:nth-child(1){
              padding-bottom: 0;
            }
            >ul{
              display: block;
              position:static; 
              padding-left: 0.5rem; 
              li{
                padding: 0.2rem 0 !important;
                line-height: 100%;
              }
            }
          }
        }
      }
      .menu-btn {
        background: url(../../assets/img/menubtn.png) no-repeat center center;
        background-size: 100% 100%;
        width: 0.48rem;
        height: 0.48rem;
        display: block;
        margin-bottom: 0.2rem;
      }
      ul {
        display: none;
      }
    }
  }
}
</style>
