<template lang="pug">
v-container
    v-row
        //- Ship date & Car barcode
        v-col(cols="12")
            AppSection
                v-row(dense)
                    v-col(cols="12")
                        v-menu(v-model="datePicker" :close-on-content-click="false" offset-y min-width="auto")
                            template(v-slot:activator="{ on, attrs }")
                                v-text-field(v-model="form.shipDate" v-bind="attrs" v-on="on" prefix="Ship Date: " placeholder="Select" type="text" readonly :append-icon="mdiCalendarRangeOutline" outlined hide-details)
                            v-date-picker(v-model="form.shipDate" @input="datePicker = false")
                    v-col(cols="12")
                        v-text-field(v-model="form.carBarcode" prefix="Car: " placeholder="Tap to scan" type="text" readonly :disabled="!!form.carBarcode" :append-icon="mdiBarcodeScan" outlined hide-details @click="openQRScannerDialog(`carBarcode`)")
        //- Sale Order
        v-col(v-if="!!form.carBarcode" cols="12")
            AppSection
                v-row(dense)
                    v-col(cols="12")
                        v-text-field(v-model="form.soBarcode" prefix="SO Barcode: " placeholder="Tap to scan" type="text" readonly :disabled="!!form.soBarcode" :append-icon="mdiBarcodeScan" outlined hide-details @click="openQRScannerDialog(`soBarcode`)")
                    template(v-if="!!form.soOrder && !!form.soLine && !!form.soRel")
                        v-col(cols="12" sm="4")
                            v-text-field(v-model="form.soOrder" prefix="Order: " placeholder="" type="text" readonly outlined hide-details)
                        v-col(cols="12" sm="4")
                            v-text-field(v-model="form.soLine" prefix="Line: " placeholder="" type="text" readonly outlined hide-details)
                        v-col(cols="12" sm="4")
                            v-text-field(v-model="form.soRel" prefix="Rel: " placeholder="" type="text" readonly outlined hide-details)
                    v-col(v-if="soLoading" cols="12")
                        v-progress-linear(indeterminate color="primary")
                    template(v-if="!soLoading && !!form.soPart && !!form.soQuantity && !!form.soDescription")
                        v-col(cols="12" sm="6")
                            v-text-field(v-model="form.soPart" prefix="Part: " placeholder="" type="text" readonly outlined hide-details)
                        v-col(cols="12" sm="6")
                            v-text-field(v-model="form.soQuantity" prefix="Quantity: " placeholder="" type="text" readonly outlined hide-details)
                        v-col(cols="12")
                            v-text-field(v-model="form.soDescription" prefix="Description: " placeholder="" type="text" readonly outlined hide-details)
        //- Warehouse
        v-col(v-if="!!form.soBarcode" cols="12")
            AppSection
                v-row(dense)
                    v-col(cols="12")
                        v-text-field(v-model="form.whBarcode" prefix="Warehouse Barcode: " placeholder="Tap to scan" type="text" readonly :disabled="!!form.whBarcode" :append-icon="mdiBarcodeScan" outlined hide-details @click="openQRScannerDialog(`whBarcode`)")
                    v-col(v-if="whLoading" cols="12")
                        v-progress-linear(indeterminate color="primary")
                    template(v-if="!whLoading && !!form.whCode && !!form.whBin")
                        v-col(cols="12" sm="6")
                            v-text-field(v-model="form.whCode" prefix="Warehouse Code: " placeholder="" type="text" readonly outlined hide-details)
                        v-col(cols="12" sm="6")
                            v-text-field(v-model="form.whBin" prefix="Warehouse Bin: " placeholder="" type="text" readonly outlined hide-details)
        //- Part
        v-col(v-if="!!form.whBarcode" cols="12")
            AppSection
                v-row(dense)
                    v-col(cols="12")
                        v-text-field(v-model="form.partBarcode" prefix="Part Barcode: " placeholder="Tap to scan" type="text" readonly :disabled="!!form.partBarcode" :append-icon="mdiBarcodeScan" outlined hide-details @click="openQRScannerDialog(`partBarcode`)")
                    v-col(v-if="partLoading" cols="12")
                        v-progress-linear(indeterminate color="primary")
                    template(v-if="!partLoading && !!form.whCode && !!form.whBin")
                        v-col(cols="12")
                            v-text-field(v-model="form.part" prefix="Part: " placeholder="" type="text" readonly outlined hide-details)
    QRScannerDialog(v-if="QRScannerDialog" :item="currentValue" @closed="QRScannerDialogClosed" @changed="QRScannerDialogChanged")
</template>

<script>
import { mdiCalendarRangeOutline, mdiBarcodeScan } from "@mdi/js"
import AppSection from "@/components/AppSection.vue"
import QRScannerDialog from "@/components/dialogs/QRScanner.vue"
import dayjs from "@/plugins/dayjs"

export default {
	components: { AppSection, QRScannerDialog },
	data: () => ({
		currentStep: 1,
		mdiCalendarRangeOutline: mdiCalendarRangeOutline,
		mdiBarcodeScan: mdiBarcodeScan,
		form: {
			shipDate: dayjs().format("YYYY-MM-DD"),
			carBarcode: null,
			soBarcode: null,
			soOrder: null,
			soLine: null,
			soRel: null,
			soPart: null,
			soQuantity: null,
			soDescription: null,
			whBarcode: null,
			whCode: null,
			whBin: null,
			partBarcode: null,
			part: null,
		},
		datePicker: null,
		QRScannerDialog: false,
		currentValue: null,
		soLoading: false,
		whLoading: false,
		partLoading: false,
	}),
	methods: {
		openQRScannerDialog(key) {
			this.$set(this.form, key, null)
			this.currentValue = key
			this.QRScannerDialog = true
		},
		QRScannerDialogClosed() {
			this.QRScannerDialog = false
			this.currentValue = null
		},
		QRScannerDialogChanged(payload) {
			if (payload.key === "carBarcode") {
				this.$set(this.form, payload.key, payload.value)
			} else if (payload.key === "soBarcode") {
				const values = payload.value.split("/")
				this.$set(this.form, payload.key, payload.value)
				this.$set(this.form, "soOrder", values[0])
				this.$set(this.form, "soLine", values[1])
				this.$set(this.form, "soRel", values[2])
				this.getSODetail(values[0], values[1], values[2])
			} else if (payload.key === "whBarcode") {
				const values = payload.value.split(" ")
				this.$set(this.form, payload.key, payload.value)
				this.getWHDetail(values[0], values[1])
			} else if (payload.key === "partBarcode") {
				const values = payload.value.split(" ")
				this.$set(this.form, payload.key, payload.value)
				this.getPartDetail(values[0], values[1])
			}

			this.QRScannerDialog = false
			this.currentValue = null
		},
		async getSODetail(soOrder, soLine, soRel) {
			try {
				this.soLoading = true
				const { data } = await this.$axios.get(`/api/v2/odata/BPI/Erp.BO.SalesOrderSvc/OrderRels('BPI',${soOrder},${soLine},${soRel})`)
				console.log("getSODetail", data)
				this.$set(this.form, "soPart", data?.PartNum || "")
				this.$set(this.form, "soQuantity", parseFloat(data?.SellingReqQty || 0) - parseFloat(data?.TotalJobStockShipped || 0))
				this.$set(this.form, "soDescription", data?.OrderLineLineDesc || "")
			} catch (error) {
				console.error("error", error)
			} finally {
				setTimeout(() => {
					this.soLoading = false
				}, 1500)
			}
		},
		async getWHDetail(value1, value2) {
			try {
				this.whLoading = true
				const { data } = await this.$axios.get(`/api/v2/odata/BPI/Erp.BO.WhseBinSvc/WhseBins('BPI','${value1}','${value2}')`)
				console.log("getWHDetail", data)
				this.$set(this.form, "whCode", data?.WarehouseCode || "")
				this.$set(this.form, "whBin", data?.BinNum || "")
			} catch (error) {
				console.error("error", error)
			} finally {
				setTimeout(() => {
					this.whLoading = false
				}, 1500)
			}
		},
		async getPartDetail(value1, value2) {
			try {
				this.partLoading = true
				const { data } = await this.$axios.get(`/api/v1/BaqSvc/ADT_Partbin(BPI)?$filter=PartBin_PartNum eq '${value1}' and PartBin_LotNum eq '${value2}'`)
				console.log("getPartDetail", data)
				this.$set(this.form, "part", data?.WarehouseCode || "")
			} catch (error) {
				console.error("error", error)
			} finally {
				setTimeout(() => {
					this.partLoading = false
				}, 1500)
			}
		},
	},
}
</script>
