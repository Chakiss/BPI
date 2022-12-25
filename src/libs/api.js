import axios from "axios"

export const client = axios.create({
	baseURL: "https://erp.bpi-concretepile.co.th/BPI_UAT/api",
	auth: {
		username: "Dev01",
		password: "9IJN0okm",
	},
})

client.interceptors.response.use(async ({ data }) => {
	try {
		await new Promise((resolve) => setTimeout(resolve, 1500))
		return data
	} catch (error) {
		return data
	}
})

export const getCompanies = () =>
	client({
		url: `/v1/BaqSvc/ADT_ComSite`,
		method: "get",
	})

export const getPlanByQRCode = (companyCode, companySiteID, QRCode) =>
	client({
		url: `/v1/BaqSvc/ADT_INVS_SINVS117_011('${companyCode}')?$select=UD28_Key1&$filter=UD28_Key1 eq '${QRCode}' and UD28_ShortChar20 eq '${companySiteID}'`,
		method: "get",
	})

export const getSalesOrderByQRCode = (companyCode, companySiteID, QRCode) => {
	const QRItems = String(QRCode || "").split(" ")
	const UD28_Key2 = QRItems[0] || ""
	const UD28_Key3 = QRItems[1] || ""
	const UD28_Key4 = QRItems[2] || ""

	return client({
		url: `/v1/BaqSvc/ADT_INVS_SINVS117_011('${companyCode}')?$filter=UD28_Key2 eq '${UD28_Key2}' and UD28_Key3 eq '${UD28_Key3}' and UD28_Key4 eq '${UD28_Key4}' and UD28_ShortChar20 eq '${companySiteID}'`,
		method: "get",
	})
}

export const getSerialByQRCode = (companyCode, companySiteID, QRCode) =>
	client({
		url: `/v1/BaqSvc/ADT_INVS_SINVS117_021('${companyCode}')?$filter=UD03_Key1 eq '${QRCode}' and UD03_ShortChar20 eq '${companySiteID}'`,
		method: "get",
	})

export const getProductOfSerial = (companyCode, companySiteID, partNumber, wareHouseCode, binNumber, lotNumber) =>
	client({
		url: `/v1/BaqSvc/ADT_CHK_QOH('${companyCode}')?$filter=PartBin_PartNum eq '${partNumber}'and PartBin_WarehouseCode eq '${wareHouseCode}' and PartBin_BinNum eq '${binNumber}' and PartBin_LotNum eq '${lotNumber}' and Warehse_Plant eq '${companySiteID}'`,
		method: "get",
	})

export const submitEpicor = (payload = {}) =>
	client({
		url: `/v2/odata/BPI/Ice.BO.UD27Svc/UD27s`,
		method: "post",
		data: payload,
	})
