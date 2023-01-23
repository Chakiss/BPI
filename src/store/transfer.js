import { checkPicking, checkPart, searchWarehouse, searchBin, submitTransferUD26, submitTransferUD24, submitTransferUD28 } from "@/libs/api"

export default {
	namespaced: true,
	state: {},
	getters: {},
	mutations: {},
	actions: {
		checkPickingByQRCode: ({ rootGetters, dispatch }, QRString = "") =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[pickicking][start] checking`)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""

					console.log(`[pickicking][start] companyCode`, companyCode)
					console.log(`[pickicking][start] companySiteID`, companySiteID)
					console.log(`[pickicking][start] QRString`, QRString)

					dispatch("showLoader", null, { root: true })

					const { value: items = [] } = await checkPicking(companyCode, companySiteID, QRString, rootGetters["auth/auth"])

					console.log(`[pickicking][list]`, items)

					if (items.length <= 0) throw new Error("ไม่พบเลขที่เอกสารใบเบิก")

					console.log(`[pickicking][parsed]`, items)
					for (var item of items) {
						console.log("item", item)
						item.UD28_Number14 = parseInt(item.UD28_Number14)
					}
					return resolve({ picking: items })
				} catch (error) {
					console.log(`[pickicking][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),

		searchWareHouse: ({ rootGetters, dispatch }) =>
			new Promise(async (resolve, reject) => {
				try {
					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""

					dispatch("showLoader", null, { root: true })

					const { value: items = [] } = await searchWarehouse(companyCode, companySiteID, rootGetters["auth/auth"])

					console.log(`[searchWarehouse][list]`, items)

					if (items.length <= 0) throw new Error("ไม่พบเลขที่เอกสารใบเบิก")

					console.log(`[searchWarehouse][parsed]`, items)

					return resolve({ searchWareHouse: items })
				} catch (error) {
					console.log(`[searchWarehouse][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),

		searchBin: ({ rootGetters, dispatch }, WH = "") =>
			new Promise(async (resolve, reject) => {
				try {
					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""

					dispatch("showLoader", null, { root: true })

					const { value: items = [] } = await searchBin(companyCode, companySiteID, WH, rootGetters["auth/auth"])

					console.log(`[searchBin][list]`, items)

					if (items.length <= 0) throw new Error("ไม่พบเลขที่เอกสารใบเบิก")

					console.log(`[searchBin][parsed]`, items)

					return resolve({ searchBin: items })
				} catch (error) {
					console.log(`[searchBin][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),

		checkPartByQRCode: ({ rootGetters, dispatch }, QRString = "") =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[part][start] checking`)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""

					console.log(`[part][start] companyCode`, companyCode)
					console.log(`[part][start] companySiteID`, companySiteID)
					console.log(`[part][start] QRString`, QRString)

					dispatch("showLoader", null, { root: true })

					const { value: items = [] } = await checkPart(companyCode, companySiteID, QRString, rootGetters["auth/auth"])

					console.log(`[part][list]`, items)

					if (items.length <= 0) throw new Error("ไม่พบป้ายแท๊กเช็คเข็ม")

					const item = items[0]

					console.log(`[part][done]`, item)

					return resolve({ product: item })
				} catch (error) {
					console.log(`[part][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),

		submitTransferUD26: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[submit UD26][start] checking`)
					console.log(`[submit UD26][start] payload`, payload)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const response = await submitTransferUD26(companyCode, payload, rootGetters["auth/auth"], rootGetters["auth/token"])
					console.log(response)

					return resolve(true)
				} catch (error) {
					console.log(`[submit UD26][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),

		submitTransferUD24: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[submit UD24][start] checking`)
					console.log(`[submit UD24][start] payload`, payload)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const response = await submitTransferUD24(companyCode, payload, rootGetters["auth/auth"], rootGetters["auth/token"])
					console.log(response)

					return resolve(true)
				} catch (error) {
					console.log(`[submit UD24][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),

		submitTransferUD28: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[submit UD28][start] checking`)
					console.log(`[submit UD28][start] payload`, payload)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const response = await submitTransferUD28(companyCode, payload, rootGetters["auth/auth"], rootGetters["auth/token"])
					console.log(response)

					return resolve(true)
				} catch (error) {
					console.log(`[submit UD28][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
	},
	modules: {},
}
