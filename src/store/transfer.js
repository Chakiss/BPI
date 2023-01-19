import { checkPicking, checkPart, searchWarehouse } from "@/libs/api"

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

					if (items.length <= 0) throw new Error("ไม่พบ Plan นี้ในระบบ")

					console.log(`[pickicking][parsed]`, items)

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

					if (items.length <= 0) throw new Error("ไม่พบ Plan นี้ในระบบ")

					console.log(`[searchWarehouse][parsed]`, items)

					return resolve({ searchWareHouse: items })
				} catch (error) {
					console.log(`[searchWarehouse][error]`, error)
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

					const payload = {
						id: item.RowIdent,
						qrSerialCode: item["UD24_Key1"] || null,
						partCodeProduct: item["UD24_Key5"] || null,
						warehouse: item["UD24_Character03"] || null,
						bin: item["UD24_Character04"] || null,
						productName: item["UD24_Character09"] || null,
						lot: item["UD24_Character10"] || null,
						quantity: parseFloat(item["Calculated_Qty"]) || null,
						onHandQty: parseFloat(item["PartBin_OnhandQty"]) || null,
						unit: item["PartBin_DimCode"] || null,
						tagProductLife: parseFloat(item["Calculated_P_Life"]) || null,
						site: item["UD24_ShortChar20"] || null,
					}

					console.log(`[part][parsed]`, payload)

					return resolve({ product: payload })
				} catch (error) {
					console.log(`[part][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),

		submitTransfer: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[submit][start] checking`)
					console.log(`[submit][start] payload`, payload)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const response = await submitTransfer(payload, rootGetters["auth/auth"], rootGetters["auth/token"])
					console.log(response)

					return resolve(true)
				} catch (error) {
					console.log(`[submit][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
	},
	modules: {},
}
