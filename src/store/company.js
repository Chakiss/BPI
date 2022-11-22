import { getCompanies } from "@/libs/api"

export default {
	namespaced: true,
	state: {
		companies: [],
		selectedCompanyID: null,
		selectedCompanySiteID: null,
		isInitialized: false,
	},
	getters: {
		companies(state) {
			return state.companies
		},
		companySites(state) {
			const company = state.companies.find((i) => i.id === state.selectedCompanyID)
			return company?.sites || []
		},
		selectedCompanyID(state) {
			return state.selectedCompanyID
		},
		selectedCompanySiteID(state) {
			return state.selectedCompanySiteID
		},
		isInitialized(state) {
			return state.isInitialized
		},
	},
	mutations: {
		setCompany(state, items) {
			state.companies = items
		},
		setSelectedCompanyID(state, value) {
			state.selectedCompanyID = value
			state.selectedCompanySiteID = null
		},
		setSelectedCompanySiteID(state, value) {
			state.selectedCompanySiteID = value
		},
		setInitialized(state, value) {
			state.isInitialized = value
		},
		reset(state) {
			state.companies = []
			state.selectedCompanyID = null
			state.selectedCompanySiteID = null
		},
	},
	actions: {
		getCompanies: ({ commit, dispatch }) =>
			new Promise(async (resolve, reject) => {
				try {
					dispatch("showLoader", null, { root: true })
					commit("reset")

					const { value: companies = [] } = await getCompanies()
					let items = []
					for (const company of companies) {
						const companyIndex = items.findIndex((i) => i.code === company.Company_Company)
						if (companyIndex < 0) items.push({ id: company.RowIdent, code: company.Company_Company, title: company.Company_Name, sites: [] })

						const index = items.findIndex((i) => i.code === company.Company_Company)
						if (index >= 0)
							items[index]["sites"].push({
								id: company.Plant_Plant,
								title: company.Plant_Name,
							})
					}

					commit("setCompany", items)
					dispatch("setInitialized", true)

					return resolve(items)
				} catch (error) {
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
		setSelectedCompanyID: ({ commit }, value) => {
			commit("setSelectedCompanyID", value)
		},
		setSelectedCompanySiteID: ({ commit }, value) => {
			commit("setSelectedCompanySiteID", value)
		},
		setInitialized: ({ commit }, value) => {
			commit("setInitialized", value)
		},
	},
	modules: {},
}
