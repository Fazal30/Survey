import Vue from "vue";
import VueRouter from "vue-router";

import store from "../store";
import Home from "../views/Home.vue";
const Login = () =>
  import(/* webpackChunkName: "login-page" */ "../views/Login.vue");
const Form = () =>
  import(/* webpackChunkName: "form-page" */ "../views/Form.vue");
const Survey = () =>
  import(/* webpackChunkName: "survey-page" */ "../views/Survey.vue");

const protectedRouteGuard = async (to, from, next) => {
  try {
    const hasPermission = await store.dispatch("checkAuth");
    if (hasPermission) next();
    else next({ name: "Login" });
  } catch (error) {
    console.log(error);
    next({ name: "Login" });
  }
};

const unProtectedRouteGuard = async (to, from, next) => {
  try {
    const hasPermission = await store.dispatch("checkAuth");
    if (!hasPermission) next();
  } catch (error) {
    console.log(error);
    next({ name: "Home" });
  }
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: protectedRouteGuard
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: unProtectedRouteGuard
  },
  {
    path: "/form/:id",
    name: "Form",
    component: Form,
    beforeEnter: protectedRouteGuard
  },
  {
    path: "/survey/:id",
    name: "Survey",
    component: Survey
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
