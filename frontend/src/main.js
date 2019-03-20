import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueTheMask from 'vue-the-mask'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(VueTheMask)

new Vue({
  render: h => h(App),
}).$mount('#app')
