// /*!
//
// =========================================================
// * Vue Argon Dashboard - v2.0.1
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-argon-dashboard
// * Copyright 2021 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/vue-argon-dashboard/blob/master/LICENSE.md)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// */
// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
// import ArgonDashboard from "./plugins/argon-dashboard";
// import "element-plus/lib/theme-chalk/index.css";
// import "datatables.net-bs4";
// import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
// import "datatables.net-buttons-bs4";
// import "datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css";
// import "datatables.net-buttons/js/buttons.colVis";
// import "datatables.net-buttons/js/buttons.flash";
// import "datatables.net-buttons/js/buttons.html5";
// import "datatables.net-buttons/js/buttons.print";

// const appInstance = createApp(App);
// appInstance.use(router);
// appInstance.use(ArgonDashboard);
// appInstance.mount("#app");

/*!

=========================================================
* Vue Argon Dashboard - v2.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/vue-argon-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/vue-argon-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ArgonDashboard from "./plugins/argon-dashboard";
import BootstrapVue from "bootstrap-vue";
//import "element-plus/lib/theme-chalk/index.css";
// import "datatables.net-bs4";
// import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
// import "datatables.net-buttons-bs4";
// import "datatables.net-buttons-bs4/css/buttons.bootstrap4.min.css";
// import "datatables.net-buttons/js/buttons.colVis";
// import "datatables.net-buttons/js/buttons.flash";
// import "datatables.net-buttons/js/buttons.html5";
// import "datatables.net-buttons/js/buttons.print";
// import "bootstrap/dist/css/bootstrap.css";
import VueSweetalert2 from "vue-sweetalert2";
// import "bootstrap-vue/dist/bootstrap-vue.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import { IconsPlugin } from "bootstrap-vue";
import { ModalPlugin } from "bootstrap-vue";
import { AppConfig } from "@/config/app-config";
Vue.component("font-awesome-icon", FontAwesomeIcon); // Register component globally
library.add(fas); // Include needed icons

Vue.use(BootstrapVue);
Vue.use(ArgonDashboard);
Vue.use(IconsPlugin);
Vue.use(ModalPlugin);
Vue.use(VueSweetalert2);

const appInstance = new Vue({
  router,
  render: (h) => h(App),
  data: AppConfig,
});
appInstance.$mount("#app");
