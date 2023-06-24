import { authen } from "@/libs/api"

export default {
	namespaced: true,
	state: {
		username: null,
		password: null,
		token: null,
	},
	getters: {
		username(state) {
			return state.username
		},
		password(state) {
			return state.password
		},
		token(state) {
			return state.token
		},
		auth(state) {
			return {
				username: state.username,
				password: state.password,
			}
		},
		isLoggedIn(state) {
			return !!state.username && !!state.password && !!state.token
		},
	},
	mutations: {
		setUsername(state, username) {
			state.username = username
		},
		setPassword(state, password) {
			state.password = password
		},
		setToken(state, token) {
			state.token = token
		},
		reset(state) {
			state.username = null
			state.password = null
			state.token = null
			localStorage.clear()
		},
	},
	actions: {
		login: ({ commit, dispatch, getters }, auth) =>
			new Promise(async (resolve, reject) => {
				try {
					dispatch("showLoader", null, { root: true })
					dispatch("reset")

					const { AccessToken: token } = await authen(auth)
					dispatch("setUsername", auth.username)
					dispatch("setPassword", auth.password)
					dispatch("setToken", token)

					return resolve(getters)
				} catch (error) {
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
		setUsername: ({ commit }, value) => {
			commit("setUsername", value)
		},
		setPassword: ({ commit }, value) => {
			commit("setPassword", value)
		},
		setToken: ({ commit }, value) => {
			commit("setToken", value)
		},
		reset({ commit }) {
			commit("reset")
		},
	},
	modules: {},
}
