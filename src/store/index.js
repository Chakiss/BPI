import Vue from "vue"
import Vuex from "vuex"
import { mdiCash100, mdiTransfer, mdiZipBoxOutline, mdiHandshakeOutline } from "@mdi/js"
import company from "@/store/company"

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		loader: false,
		mainMenuItems: [
			{ icon: mdiCash100, title: "แผนตอกรายวัน", option: { name: "profits" }, disabled: true },
			{ icon: mdiTransfer, title: "โอนเข็มรอขาย", option: { name: "transfers" }, disabled: true },
			{ icon: mdiZipBoxOutline, title: "ส่งสินค้า", option: { name: "ships" }, disabled: false },
			{ icon: mdiHandshakeOutline, title: "รับของที่ Site งาน", option: { name: "recieveds" }, disabled: true },
		],
	},
	getters: {
		loader(state) {
			return state.loader
		},
		mainMenuItems(state) {
			return state.mainMenuItems
		},
	},
	mutations: {
		setLoader(state, value) {
			state.loader = value
		},
	},
	actions: {
		showLoader: ({ commit }) => {
			commit("setLoader", true)
		},
		hideLoader: ({ commit }) => {
			commit("setLoader", false)
		},
	},
	modules: { company },
})
