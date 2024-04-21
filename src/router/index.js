import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
// import CallView from "../views/CallView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/call",
    name: "call",
    // component: CallView,
    component: () =>
      import(/* webpackChunkName: "call" */ "../views/CallView.vue"),
    props: (route) => ({
      userName: route.query.userName,
      roomID: route.query.roomID,
    }),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
