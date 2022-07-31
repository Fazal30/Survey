import Vue from "vue";
import infiniteScroll from "vue-infinite-scroll";
import dateFormat from "dateformat";
import Clipboard from "v-clipboard";

import App from "./App.vue";
import store from "./store";
import router from "./router";
import vuetify from "./plugins/vuetify";
import Vuelidate from "vuelidate";

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(infiniteScroll);
Vue.use(Clipboard);

Vue.filter("dateFormat", str => {
  if (str) {
    const datetime = new Date(str);
    if (datetime == "Invalid Date") {
      return "";
    }
    return dateFormat(datetime, "dd mmmm yyyy, h:MM:ss TT");
  }

  return "";
});

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
