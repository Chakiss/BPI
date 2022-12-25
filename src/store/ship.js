import { getPlanByQRCode, getSalesOrderByQRCode, getSerialByQRCode, getProductOfSerial, submitEpicor } from "@/libs/api"

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

					const { value: items = [] } = await getPlanByQRCode(companyCode, companySiteID, QRString)

					console.log(`[plan][list]`, items)

					if (items.length <= 0) throw new Error("ไม่พบ Plan นี้ในระบบ")

					const item = items[0]

					console.log(`[plan][done]`, item)

					return resolve(item)
				} catch (error) {
					console.log(`[plan][error]`, error)
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
		checkSaleOrderByQRCode: ({ rootGetters, dispatch }, QRString = "") =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[sale order][start] checking`)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const { value: items = [] } = await getSalesOrderByQRCode(companyCode, companySiteID, QRString)

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

					const { value: items = [] } = await getSerialByQRCode(companyCode, companySiteID, QRString)

					console.log(`[serial][list]`, items)

					if (items.length <= 0) throw new Error("ไม่พบ Serial นี้ในระบบ")

					const item = items[0]

					console.log(`[serial][done]`, item)

					const serialPayload = {
						id: item.RowIdent,
						quantity: parseFloat(item.Calculated_Number13),
						companyCode: item.UD03_Company,
						barcode: item.UD03_Key1,
						companySiteID: item.UD03_ShortChar20,
						partNumber: item.UD03_Key2,
						wareHouseCode: item.UD03_Key3,
						binNumber: item.UD03_Key4,
						lotNumber: item.UD03_Key5,
					}

					console.log(`[serial][parsed]`, serialPayload)

					console.log(`[product] checking...`)
					const { value: products = [] } = await getProductOfSerial(
						companyCode,
						companySiteID,
						serialPayload.partNumber,
						serialPayload.wareHouseCode,
						serialPayload.binNumber,
						serialPayload.lotNumber
					)
					console.log(`[product][list]`, products)

					if (products.length <= 0) throw new Error("ไม่พบสินค้านี้ในระบบ")

					const product = products[0]
					console.log(`[product][done]`, product)

					const productPayload = {
						id: product.RowIdent,
						binNumber: product.PartBin_BinNum,
						companyCode: product.PartBin_Company,
						lotNumber: product.PartBin_LotNum,
						quantity: parseFloat(product.PartBin_OnhandQty),
						partNumber: product.PartBin_PartNum,
						wareHouseCode: product.PartBin_WarehouseCode,
						companySiteID: product.Warehse_Plant,
					}
					console.log(`[product][parsed]`, productPayload)

					return resolve({ serial: serialPayload, product: productPayload })
				} catch (error) {
					return reject(error)
				} finally {
					dispatch("hideLoader", null, { root: true })
				}
			}),
		submitEpicor: ({ rootGetters, dispatch }, payload = {}) =>
			new Promise(async (resolve, reject) => {
				try {
					console.log(`[submit][start] checking`)
					console.log(`[submit][start] payload`, payload)

					const companyCode = rootGetters["company/selectedCompanyCode"] || ""
					const companySiteID = rootGetters["company/selectedCompanySiteID"] || ""
					dispatch("showLoader", null, { root: true })

					const response = await submitEpicor(payload)
					console.log(response)

					// console.log(`[submit][list]`, items)

					// if (items.length <= 0) throw new Error("ไม่พบ Plan นี้ในระบบ")

					// const item = items[0]

					// console.log(`[submit][done]`, item)

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
