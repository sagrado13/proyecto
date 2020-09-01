import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import StarRating from "vue-star-rating";
import vueHeadful from "vue-headful";

Vue.config.productionTip = false;
Vue.component("star-rating", StarRating);
Vue.component("vue-headful", vueHeadful);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
