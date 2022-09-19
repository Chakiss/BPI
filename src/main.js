import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import "vuetify/dist/vuetify.min.css";
import axios from 'axios';

Vue.prototype.$http = axios;

const opts = {
  icons: {
    iconfont: "mdi"
  }
};
Vue.use(Vuetify)

new Vue({
  vuetify: new Vuetify(opts),
  render: h => h(App),
}).$mount('#app')
