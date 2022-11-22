import Vue from "vue"
import Vuetify from "vuetify/lib/framework"
import th from "vuetify/lib/locale/th"

Vue.use(Vuetify)

export default new Vuetify({
	icons: {
		iconfont: "mdiSvg",
	},
	theme: {
		options: {
			customProperties: true,
		},
		themes: {
			light: {
				primary: "#40739e",
				secondary: "#487eb0",
				accent: "#192a56",
				error: "#c23616",
				info: "#0097e6",
				success: "#44bd32",
				warning: "#e1b12c",
			},
		},
	},
	lang: {
		locales: { th },
		current: "th",
	},
})
