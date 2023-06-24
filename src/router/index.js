import Vue from "vue"
import VueRouter from "vue-router"
import store from "@/store"

Vue.use(VueRouter)

const routes = [
	{
		path: "/",
		name: "home",
		component: () => import(/* webpackChunkName: "startup" */ "../views/Startup.vue"),
	},
	{
		path: "/login",
		name: "login",
		component: () => import(/* webpackChunkName: "login" */ "../views/Login.vue"),
		beforeEnter: (to, from, next) => {
			if (store.getters["auth/isLoggedIn"]) next({ name: "auth" })
			else next()
		},
	},
	{
		path: "/auth",
		name: "auth",
		component: () => import(/* webpackChunkName: "auth" */ "../views/Auth.vue"),
		beforeEnter: (to, from, next) => {
			if (store.getters["auth/isLoggedIn"]) {
				if (!!store.getters["company/selectedCompanyID"] && !!store.getters["company/selectedCompanySiteID"]) next({ name: "app" })
				else next()
			} else next({ name: "login" })
			// store.getters["company/isInitialized"] ? next({ name: "app" }) : next()
		},
	},
	{
		path: "/app",
		component: () => import(/* webpackChunkName: "application" */ "../views/App.vue"),
		beforeEnter: (to, from, next) => {
			if (!!store.getters["company/selectedCompanyID"] && !!store.getters["company/selectedCompanySiteID"]) next()
			else next({ name: "auth" })
			// if (store.getters["company/isInitialized"]) {
			// 	!!store.getters["company/selectedCompanyID"] && !!store.getters["company/selectedCompanySiteID"] ? next() : next({ name: "auth" })
			// } else next({ name: "auth" })
		},
		children: [
			{ path: "/", name: "app", component: () => import(/* webpackChunkName: "application.home" */ "../views/App/Home.vue") },
			{ path: "/profits", name: "profits" },
			{ path: "/transfers", name: "transfers", component: () => import(/* webpackChunkName: "application.ships" */ "../views/App/Transfer.vue") },
			{ path: "/ships", name: "ships", component: () => import(/* webpackChunkName: "application.ships" */ "../views/App/Ship.vue") },
			{ path: "/recieveds", name: "recieveds", component: () => import(/* webpackChunkName: "application.ships" */ "../views/App/Recieveds.vue") },
		],
	},
]

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
})

export default router
