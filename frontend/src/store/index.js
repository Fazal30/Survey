import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";
import form from "./modules/form";
import formQuestion from "./modules/formQuestion";
import type from "./modules/type";
import survey from "./modules/survey";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { auth, form, formQuestion, type, survey }
});
