import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store";
const load = (pathName) => {
  return () => import(/*webpackChunkName: "[request]" */`@/pages/v1/${pathName}`)
}
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const routes = [
  {
    path: "/update",
    component: r => require.ensure([], () => r(require(`@/pages/v1/update`)), 'group-index2'),
    meta: {
      requireAuth: true,
    }
  },
  {
    path: "*",
    redirect: "/update",
  },
 



    
  

]



const router = new VueRouter({
  mode: 'history', // add 'history' mode
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  // if (to.path == "/login" || flag ) {
  const fromName = from.meta.style || "";
  const toName = to.meta.style || "";
  if (fromName) {
    document.documentElement.classList.remove(`html-${fromName}`); //remove className
  }
  if (toName) {
    document.documentElement.classList.add(`html-${toName}`); //add className
  }
  store.commit('restApis');
  //首先判断哪些页面需要用户信息
  if (to.meta.requireAuth) {
    if (JSON.stringify(store.state.user_info) == "{}") {
      let theone_member = localStorage.getItem("THEONE_MEMBER");
      if (theone_member) {
        theone_member = JSON.parse(theone_member);
        await store.dispatch("getUserInfo");
        //获取用户基本信息
      } else {
        //去登录(目前只判断个人中心)
        if (to.path.indexOf("/mine") !== -1) {
          /*   console.log(to,from);
            return 
            const redirect=`${window.location.origin}/${window.location.pathname}/${window.location.search}`
            next(`/login?redirect=${encodeURIComponent(redirect)}`); */
        }
      }
    }
  }

  next();
});

export default router