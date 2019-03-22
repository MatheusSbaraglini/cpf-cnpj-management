import Vue from 'vue';
import App from './App.vue';
import BootstrapVue from 'bootstrap-vue';
import VueTheMask from 'vue-the-mask';
import router from './router';
import Notifications from 'vue-notification';

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueTheMask)
Vue.use(Notifications)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
