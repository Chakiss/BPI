import { checkTransportSlip, importImage, getDataReceiveTranferOnSite, patchReceiveTranferOnSite, submitReceiveTranferOnSite } from "@/libs/api"

export default {
	namespaced: true,
	state: {},
	getters: {},
	mutations: {},
	actions: {
		checkTransportSlipBarcode: ({ rootGetters, dispatch }, QRString = "") =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[TransportSlip][start] checking`)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""

					console.log(`[TransportSlip][start] companyCode`, companyCode)
					console.log(`[TransportSlip][start] companySiteID`, companySiteID)
					console.log(`[TransportSlip][start] QRString`, QRString)

					dispatch("showLoader", null, { root: true })

					const { value: items = [] } = await checkTransportSlip(companyCode, companySiteID, QRString, rootGetters["auth/auth"])

					console.log(`[TransportSlip][list]`, items)

					if (items.length <= 0) throw new Error("ไม่พบเลขที่เอกสารใบขนส่ง")

					console.log(`[TransportSlip][parsed]`, items)
					// for (var item of items) {
					// 	console.log("item", item)
					// 	item.UD28_Number14 = parseInt(item.UD28_Number14)
					// }
					return resolve({ slip: items })
				} catch (error) {
					console.log(`[TransportSlip][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),

		uploadImage: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[importImage][start] checking`)
					console.log(`[importImage][start] payload`, payload)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""

					const apiKey = rootGetters["company/apiKey"] || ""
					console.log("apiKey", apiKey)

					dispatch("showLoader", null, { root: true })

					const response = await importImage(companyCode, payload, rootGetters["auth/auth"], rootGetters["auth/token"], apiKey)
					console.log(response)

					return resolve(true)
				} catch (error) {
					console.log(`[importImage][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
		getReceiveTranferOnSite: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""

					const apiKey = rootGetters["company/apiKey"] || ""
					console.log("apiKey", apiKey)

					dispatch("showLoader", null, { root: true })
					console.log("Number14", payload.Number14)
					console.log("Number15", payload.Number15)
					const response = await getDataReceiveTranferOnSite(companyCode, payload.Number14, payload.Number15, rootGetters["auth/auth"], rootGetters["auth/token"], apiKey)

					console.log(`[getReceiveTranferOnSite][parsed]`, response)

					return resolve({ data: response })
				} catch (error) {
					console.log(`[getReceiveTranferOnSite][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
		patchReceiveTranferOnSite: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					const apiKey = rootGetters["company/apiKey"] || ""
					console.log("apiKey", apiKey)
					dispatch("showLoader", null, { root: true })
					console.log("patchReceiveTranferOnSite Number14", payload.Number14)
					console.log("patchReceiveTranferOnSite Number15", payload.Number15)
					console.log("patchReceiveTranferOnSite Data", payload.data)
					const response = await patchReceiveTranferOnSite(companyCode, payload.Number14, payload.Number15, payload.data, rootGetters["auth/auth"], rootGetters["auth/token"], apiKey)

					console.log(`[patchReceiveTranferOnSite][parsed]`, response)

					return resolve({ data: response })
				} catch (error) {
					console.log(`[patchReceiveTranferOnSite][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
		submitReceiveTranferOnSite: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[submitReceiveTranferOnSite][start] checking`)
					console.log(`[submitReceiveTranferOnSite][start] payload`, payload)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					const apiKey = rootGetters["company/apiKey"] || ""
					console.log("apiKey", apiKey)
					dispatch("showLoader", null, { root: true })

					const response = await submitReceiveTranferOnSite(companyCode, payload, rootGetters["auth/auth"], rootGetters["auth/token"], apiKey)
					console.log(response)

					return resolve(true)
				} catch (error) {
					console.log(`[submitUD27s][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
	},
	modules: {},
}
