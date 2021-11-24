import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export function createRouter() {
  const router = new VueRouter({
    mode: 'history',
    routes: [
      {
        path: "/",
        redirect: "home"
      },
      {
        path: "/home",
        name: "Home",
        component: () => import("../views/home.vue")
      },
      {
        path: "/about",
        name: "About",
        component: () => import("../views/about.vue")
      }
    ]
  });
  return router
}
