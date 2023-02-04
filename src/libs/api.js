import axios from "axios"

export const client = axios.create({
	//BPI_Live
	//BPI_UAT1
	baseURL: "https://erp.bpi-concretepile.co.th/BPI_Live/api",
})

client.interceptors.response.use(async ({ data }) => {
	try {
		await new Promise((resolve) => setTimeout(resolve, 1500))
		return data
	} catch (error) {
		return data
	}
})

export const getCompanies = (auth = {}) =>
	client({
		url: `/v1/BaqSvc/ADT_ComSite`,
		method: "get",
		auth: auth,
	})
export const authen = (auth = {}) =>
	client({
		url: `https://erp.bpi-concretepile.co.th/BPI_Live/TokenResource.svc/`,
		method: "post",
		headers: auth,
	})

export const getPlanByQRCode = (companyCode, companySiteID, QRCode, auth = {}) =>
	client({
		url: `/v1/BaqSvc/ADT_INVS_SINVS117_011('${companyCode}')?$select=Calculated_QRCode&UD28_ShortChar20 eq '${companySiteID}'&QRCode='${QRCode}'`,
		method: "get",
		auth: auth,
	})

export const getSalesOrderByQRCode = (companyCode, companySiteID, QRCode, BarcodePlan, auth = {}) => {
	const QRItems = String(QRCode || "").split(" ")
	const UD28_Key2 = QRItems[0] || ""
	const UD28_Key3 = QRItems[1] || ""
	const UD28_Key4 = QRItems[2] || ""

	return client({
		url: `/v1/BaqSvc/ADT_INVS_SINVS117_011('${companyCode}')?$filter=UD28_ShortChar20 eq '${companySiteID}' and UD28_Key2 eq '${UD28_Key2}' and UD28_Key3 eq '${UD28_Key3}' and UD28_Key4 eq '${UD28_Key4}'&QRCode=${BarcodePlan}`,
		method: "get",
		auth: auth,
	})
}

export const getSerialByQRCode = (companyCode, companySiteID, QRCode, auth = {}) =>
	client({
		url: `/v1/BaqSvc/ADT_INVS_SINVS117_021('${companyCode}')?$filter=UD03_Key1 eq '${QRCode}' and UD03_ShortChar20 eq '${companySiteID}'`,
		method: "get",
		auth: auth,
	})

export const getWarehoseAndBin = (companyCode, companySiteID, auth = {}) =>
	client({
		url: `/v1/BaqSvc/ADT_INVS-117_DEF_WH-BIN?$filter=PlantConfCtrl_Company eq '${companyCode}'  and PlantConfCtrl_Plant eq '${companySiteID}'`,
		method: "get",
		auth: auth,
	})

export const getProductOfSerial = (companyCode, companySiteID, partNumber, wareHouseCode, binNumber, lotNumber, auth = {}) =>
	client({
		url: `/v1/BaqSvc/ADT_CHK_QOH('${companyCode}')?$filter=PartBin_PartNum eq '${partNumber}'and PartBin_WarehouseCode eq '${wareHouseCode}' and PartBin_BinNum eq '${binNumber}' and PartBin_LotNum eq '${lotNumber}' and Warehse_Plant eq '${companySiteID}'`,
		method: "get",
		auth: auth,
	})

export const submitEpicor = (companyCode, payload = {}, auth = {}, token = "") =>
	client({
		headers: { Authorization: `Bearer ${token}` },

		url: `/v2/odata/${companyCode}/Ice.BO.UD27Svc/UD27s?API-Key=EKdMPAW8VmHV2pt0EP1lNGBKiQgZgWZ6Eqi58ukdHSrcU`,
		method: "post",
		auth: auth,
		data: payload,
	})

export const submitEpicorUD03 = (companyCode, payload = {}, auth = {}, token = "") =>
	client({
		headers: { Authorization: `Bearer ${token}` },
		url: `/v2/odata/${companyCode}/Ice.BO.UD03Svc/UD03s?API-Key=EKdMPAW8VmHV2pt0EP1lNGBKiQgZgWZ6Eqi58ukdHSrcU`,
		method: "post",
		auth: auth,
		data: payload,
	})

export const markCheckBox = (payload = {}, auth = {}, token = "") =>
	client({
		headers: { Authorization: `Bearer ${token}` },
		url: `/v2/odata/BPI/Ice.BO.UD03Svc/UD03s`,
		method: "post",
		auth: auth,
		data: payload,
	})

// Transfer
export const checkPicking = (companyCode, companySiteID, QRCode, auth = {}, token = "") =>
	client({
		headers: { Authorization: `Bearer ${token}` },
		url: `/v1/BaqSvc/ADT_INVJ_SINVJ1091_011('${companyCode}')/?QRCode='${QRCode}'&Plant='${companySiteID}'`,
		method: "get",
		auth: auth,
	})

export const searchWarehouse = (companyCode, companySiteID, auth = {}, token = "") =>
	client({
		headers: { Authorization: `Bearer ${token}` },
		url: `/v1/BaqSvc/ADT_WH('${companyCode}')/?Plant='${companySiteID}'`,
		method: "get",
		auth: auth,
	})

export const searchBin = (companyCode, companySiteID, WH, auth = {}, token = "") =>
	client({
		headers: { Authorization: `Bearer ${token}` },
		url: `/v1/BaqSvc/ADT_WHBin('${companyCode}')/?WH='${WH}'&Plant='${companySiteID}'`,
		method: "get",
		auth: auth,
	})

export const checkPart = (companyCode, companySiteID, QRCode, auth = {}, token = "") =>
	client({
		headers: { Authorization: `Bearer ${token}` },
		url: `/v1/BaqSvc/ADT_INVJ_SINVJ1091_012('${companyCode}')/?QRCode='${QRCode}'&Plant='${companySiteID}'`,
		method: "get",
		auth: auth,
	})

export const submitTransferUD26 = (companyCode, payload = {}, auth = {}, token = "") =>
	client({
		headers: { Authorization: `Bearer ${token}` },
		url: `/v2/odata/${companyCode}/Ice.BO.UD26Svc/UD26s?API-Key=EKdMPAW8VmHV2pt0EP1lNGBKiQgZgWZ6Eqi58ukdHSrcU`,
		method: "post",
		auth: auth,
		data: payload,
	})

export const submitTransferUD24 = (companyCode, payload = {}, auth = {}, token = "") =>
	client({
		headers: { Authorization: `Bearer ${token}` },
		url: `/v2/odata/${companyCode}/Ice.BO.UD24Svc/UD24s?API-Key=EKdMPAW8VmHV2pt0EP1lNGBKiQgZgWZ6Eqi58ukdHSrcU`,
		method: "post",
		auth: auth,
		data: payload,
	})

export const submitTransferUD28 = (companyCode, payload = {}, auth = {}, token = "") =>
	client({
		headers: { Authorization: `Bearer ${token}` },
		url: `/v2/odata/${companyCode}/Ice.BO.UD28Svc/UD28s?API-Key=EKdMPAW8VmHV2pt0EP1lNGBKiQgZgWZ6Eqi58ukdHSrcU`,
		method: "post",
		auth: auth,
		data: payload,
	})
