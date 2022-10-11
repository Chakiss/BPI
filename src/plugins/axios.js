import Vue from "vue"
import axios from "axios"

const instance = axios.create({
	baseURL: process.env.VUE_APP_API_ENDPOINT,
	headers: {
		Authorization: `Basic Y29uNjo5SUpOMG9rbQ==`,
	},
})

instance.interceptors.request.use((config) => {
	config.params = { ...config.params, "API-Key": process.env.VUE_APP_API_KEY }
	return config
})

instance.interceptors.response.use((response) => {
	return response
})

Vue.prototype.$axios = instance

export default instance
