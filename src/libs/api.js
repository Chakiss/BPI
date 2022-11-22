import axios from "axios"

export const client = axios.create({})

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
		url: "https://erp.bpi-concretepile.co.th/BPI_UAT/api/v1/BaqSvc/ADT_ComSite",
		method: "get",
		auth: {
			username: "Dev01",
			password: "9IJN0okm",
		},
	})
