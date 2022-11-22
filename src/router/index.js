import Vue from "vue"
import VueRouter from "vue-router"
import store from "@/store"

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		name: "home",
		redirect: { name: "start" },
	},
	{
		path: "/start",
		name: "start",
		component: () => import(/* webpackChunkName: "startup" */ "../views/Startup.vue"),
		beforeEnter: (to, from, next) => {
			store.getters["company/isInitialized"] ? next({ name: "auth" }) : next()
		},
	},
	{
		path: "/auth",
		name: "auth",
		component: () => import(/* webpackChunkName: "auth" */ "../views/Auth.vue"),
		beforeEnter: (to, from, next) => {
			store.getters["company/isInitialized"] ? next() : next({ name: "start" })
		},
	},
	{
		path: "/app",
		component: () => import(/* webpackChunkName: "application" */ "../views/App.vue"),
		beforeEnter: (to, from, next) => {
			if (store.getters["company/isInitialized"]) {
				!!store.getters["company/selectedCompanyID"] && !!store.getters["company/selectedCompanySiteID"] ? next() : next({ name: "auth" })
			} else next({ name: "start" })
		},
		children: [
			{ path: "/", name: "app", component: () => import(/* webpackChunkName: "application.home" */ "../views/App/Home.vue") },
			{ path: "/profits", name: "profits" },
			{ path: "/transfers", name: "transfers" },
			{ path: "/ships", name: "ships", component: () => import(/* webpackChunkName: "application.ships" */ "../views/App/Ship.vue") },
			{ path: "/recieveds", name: "recieveds" },
		],
	},
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
})

export default router
