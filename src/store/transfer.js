import { checkPicking, checkPart } from "@/libs/api"

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

					const item = items[0]

					console.log(`[pickicking][done]`, item)

					const payload = {
						id: item.RowIdent,
						qrCodePickingList: item["UD28_Key1"] || null,
						calculatedPickingList: item["Calculated_PickingList"] || null,
						calculatedBin: item["Calculated_Bin"] || null,
						calculatedWarehouse: item["Calculated_Warehouse"] || null,
						warehouseName: item["Warehse_Description"] || null,
						binName: item["WhseBin_Description"] || null,
						withdrawalSlipAmount: item["UD28_Number04"] || null,
						orderDocument: item["UD28_Number14"] || null,
						orderDocument: item["UD28_Number14"] || null,
						partProduct: item["UD28_ShortChar08"] || null,
						lifeProduct: parseFloat(item["OrderDtl_Life01_c"]) || null,
						site: item["UD28_ShortChar20"] || null,
						carLicense: item["UD28_Key5"] || null,
						soPack: item["UD28_ShortChar16"] || null,
						soLinePackline: item["UD28_ShortChar17"] || null,
						soRelease: item["UD28_ShortChar18"] || null,
						packSO: item["UD28_Character01"] || null,
						systemDate: item["Calculated_SysDate"] || null,
					}

					console.log(`[pickicking][parsed]`, payload)

					return resolve({ picking: payload })
				} catch (error) {
					console.log(`[pickicking][error]`, error)
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
						quantity: item["Calculated_Qty"] || null,
						onHandQty: item["PartBin_OnHandQty"] || null,
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
	},
	modules: {},
}
