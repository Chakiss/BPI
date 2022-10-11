import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"
import qrcodereader from "./plugins/vue-qrcode-reader"
import dayjs from "./plugins/dayjs"
import axios from "./plugins/axios"

Vue.config.productionTip = false

new Vue({
	router,
	store,
	vuetify,
	axios,
	dayjs,
	qrcodereader,
	render: (h) => h(App),
}).$mount("#app")
