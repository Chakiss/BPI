import { getPlanByQRCode, getSalesOrderByQRCode, getSerialByQRCode, getProductOfSerial, submitEpicor, submitEpicorUD03, getWarehoseAndBin } from "@/libs/api"

export default {
	namespaced: true,
	state: {},
	getters: {},
	mutations: {},
	actions: {
		checkPlanByQRCode: ({ rootGetters, dispatch }, QRString = "") =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[plan][start] checking`)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const { value: items = [] } = await getPlanByQRCode(companyCode, companySiteID, QRString, rootGetters["auth/auth"])

					console.log(`[plan][list]`, items)

					if (items.length <= 0) throw new Error("ไม่พบเลขที่เอกสารใบเบิก")

					const item = items[0]

					console.log(`[plan][done]`, item.Calculated_QRCode)

					return resolve({ plan: item.Calculated_QRCode })
				} catch (error) {
					console.log(`[plan][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
		checkSaleOrderByQRCode: ({ rootGetters, dispatch }, data = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[sale order][start] checking`, data.qrString)
					console.log(`[sale order][start] BarcodePlan`, data.barcodePlan)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const { value: items = [] } = await getSalesOrderByQRCode(companyCode, companySiteID, data.qrString, data.barcodePlan, rootGetters["auth/auth"])

					console.log(`[sale order][list]`, items)

					if (items.length <= 0) throw new Error("ไม่พบ Sale Order นี้ในระบบ")

					const item = items[0]

					console.log(`[sale order][done]`, item)

					const payload = {
						id: item.RowIdent,
						SO: item["UD28_Key2"] || null,
						line: item["UD28_Key3"] || null,
						rel: item["UD28_Key4"] || null,
						productID: item["UD28_ShortChar08"] || null,
						productAmount: parseFloat(item["UD28_Number04"] || 0),
						productName: item["UD28_Character09"] || null,
						UD28_Key5: item["UD28_Key5"] || null,
						DefShipWhse: item["PlantConfCtrl_DefShipWhse"] || null,
						DefShipBin: item["PlantConfCtrl_DefShipBin"] || null,
						UD28_Key1: item["UD28_Key4"] || null,
					}

					console.log(`[sale order][parsed]`, payload)

					return resolve(payload)
				} catch (error) {
					console.log(`[sale order][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
		checkSerialByQRCode: ({ rootGetters, dispatch }, QRString = "") =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[serial][start] checking`)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const { value: items = [] } = await getSerialByQRCode(companyCode, companySiteID, QRString, rootGetters["auth/auth"])

					console.log(`[serial][list]`, items)

					if (items.length <= 0) throw new Error("ไม่พบ Serial นี้ในระบบ")

					const item = items[0]

					return resolve({ item: item })

					// console.log(`[serial][done]`, item)

					// console.log(`[serial][checking]`)
					// console.log(`[serial][checking] QRString`, QRString)
					// console.log(`[serial][checking] item.UD03_Key1`, UD03_Key1)

					// if (QRString == UD03_Key1) {
					// 	console.log("เหมือนกัน")
					// } else {
					// 	console.log("ไม่เหมือนกัน")
					// }

					// const { value: wh_bins = [] } = await getWarehoseAndBin(companyCode, companySiteID, rootGetters["auth/auth"])

					// if (wh_bins.length <= 0) throw new Error("ข้อมูลสินค้าไม่ตรง กรุณาตรวจสอบ")

					// const wh_bin = wh_bins[0]

					// console.log(`[wh-bin][result]`, wh_bin)
					// console.log(`[wh-bin][PlantConfCtrl_DefShipWhse]`, wh_bin.PlantConfCtrl_DefShipWhse)
					// console.log(`[wh-bin][PlantConfCtrl_DefShipBin]`, wh_bin.PlantConfCtrl_DefShipBin)

					// const serialPayload = {
					// 	id: item.RowIdent,
					// 	quantity: parseFloat(item.Calculated_Qty_QRCode),
					// 	companyCode: item.UD03_Company,
					// 	barcode: item.UD03_Key1,
					// 	companySiteID: item.UD03_ShortChar20,
					// 	partNumber: item.UD03_Key2,
					// 	wareHouseCode: wh_bin.PlantConfCtrl_DefShipWhse,
					// 	binNumber: wh_bin.PlantConfCtrl_DefShipBin,
					// 	lotNumber: item.UD03_Key5,
					// }

					// console.log(`[serial][parsed]`, serialPayload)

					// console.log(`[product] checking...`)
					// const { value: products = [] } = await getProductOfSerial(
					// 	companyCode,
					// 	companySiteID,
					// 	serialPayload.partNumber,
					// 	serialPayload.wareHouseCode,
					// 	serialPayload.binNumber,
					// 	serialPayload.lotNumber,
					// 	rootGetters["auth/auth"]
					// )
					// console.log(`[product][list]`, products)

					// if (products.length <= 0) throw new Error("ข้อมูลสินค้าไม่ตรงกับ Sales Order กรุณาตรวจสอบ")

					// const product = products[0]
					// console.log(`[product][done]`, product)

					// console.log(`[product][qty]`, parseFloat(product.PartBin_OnhandQty))
					// console.log("serialPayload qty onhand", serialPayload.quantity)
					// if (serialPayload.quantity >= parseFloat(product.PartBin_OnhandQty)) {
					// 	return resolve({ serial: serialPayload, product: product, error: "สินค้าไม่พอเบิก" })
					// } else {
					// 	const productPayload = {
					// 		id: product.RowIdent,
					// 		barcode: serialPayload.barcode,
					// 		binNumber: product.PartBin_BinNum,
					// 		companyCode: product.PartBin_Company,
					// 		lotNumber: product.PartBin_LotNum,
					// 		quantity: serialPayload.quantity,
					// 		partNumber: product.PartBin_PartNum,
					// 		wareHouseCode: product.PartBin_WarehouseCode,
					// 		companySiteID: product.Warehse_Plant,
					// 	}
					// 	console.log(`[product][parsed]`, productPayload)

					// }
				} catch (error) {
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
		submitEpicor: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[submitUD27s][start] checking`)
					console.log(`[submitUD27s][start] payload`, payload)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const response = await submitEpicor(companyCode, payload, rootGetters["auth/auth"], rootGetters["auth/token"])
					console.log(response)

					return resolve(true)
				} catch (error) {
					console.log(`[submitUD27s][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),

		submitEpicorUD03: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[submitEpicorUD03][start] checking`)
					console.log(`[submitEpicorUD03][start] payload`, payload)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const response = await submitEpicorUD03(companyCode, payload, rootGetters["auth/auth"], rootGetters["auth/token"])
					console.log(response)

					return resolve(true)
				} catch (error) {
					console.log(`[submitEpicorUD03][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
	},
	modules: {},
}
