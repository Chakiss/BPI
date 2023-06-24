import Vue from "vue"
import Vuex from "vuex"
import VuexPersistence from "vuex-persist"
import { mdiCash100, mdiTransfer, mdiZipBoxOutline, mdiHandshakeOutline } from "@mdi/js"
import auth from "@/store/auth"
import company from "@/store/company"
import ship from "@/store/ship"
import transfer from "@/store/transfer"
import recieveds from "@/store/recieveds"

const vuexLocal = new VuexPersistence({
	storage: window.localStorage,
})

Vue.use(Vuex)

export default new Vuex.Store({
	namespaced: true,
	state: {
		loader: false,
		mainMenuItems: [],
	},
	getters: {
		loader(state) {
			return state.loader
		},
		mainMenuItems(state) {
			return [
				//{ icon: mdiCash100, title: "แผนตอกรายวัน", option: { name: "profits" }, disabled: true },
				{ icon: mdiTransfer, title: "โอนเข็มรอขาย", option: { name: "transfers" }, disabled: false },
				{ icon: mdiZipBoxOutline, title: "ส่งสินค้า", option: { name: "ships" }, disabled: false },
				{ icon: mdiHandshakeOutline, title: "รับของที่ Site งาน", option: { name: "recieveds" }, disabled: false },
			]
		},
	},
	mutations: {
		setLoader(state, value) {
			state.loader = value
		},
		reset(state) {
			state.mainMenuItems = []
		},
	},
	actions: {
		showLoader: ({ commit }) => {
			commit("setLoader", true)
		},
		hideLoader: ({ commit }) => {
			commit("setLoader", false)
		},
		clear({ commit }) {
			commit("reset")
		},
	},
	plugins: [vuexLocal.plugin],
	modules: { company, ship, transfer, recieveds, auth },
})
