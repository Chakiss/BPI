<template lang="pug">
v-container
	v-row
	//- Shipping date
	v-col(cols="12")
		.text-caption.white--text วันที่ส่งสินค้า:
		DateField(:model.sync="form.transferDate" :option="datePickerOption")
	
	//- Barcode - Picking List Barcode
	v-col(cols="12")
		.text-caption.white--text Picking List Barcode:
		BarcodeField(:model.sync="form.barcodePicking" :option="{...barcodePickerOption}" @scanned="pickingListScanned")
	
	//- Result (Barcode - Sale order)
	v-col(cols="12")
		v-row(dense)
			v-col(cols="12" sm="4")
				.text-caption.white--text เลขที่เอกสาร:
				v-text-field(v-model="form.calculatedPickingList" type="text" solo flat hide-details readonly)
			v-col(cols="12" sm="4")
				.text-caption.white--text Warehouse:
				v-text-field(v-model.sync="form.calculatedWH" type="text" solo flat hide-details readonly)
					template(v-slot:append)
						v-btn(text color="error" small rounded @click="searchWarehouse()")
							v-icon(center) {{ mdiCommentEdit }}
						
			v-col(cols="12" sm="4")
				.text-caption.white--text Bin:
				v-text-field(v-model="form.calculatedBin" type="text" solo flat hide-details readonly)
					template(v-slot:append)
							v-btn(text color="error" small rounded @click="searchBin()")
								v-icon(center) {{ mdiCommentEdit }}
	
	//- Barcode - Document Order
	v-col(cols="12")
		.text-caption.white--text ลำดับในเอกสาร:
		v-select(v-model.sync="form.selectedDocument" :items="form.pickingList" item-text="UD28_Number14" @change="handleSelectChange(form.selectedDocument)" @close="handleSelectClose()" return-object solo flat hide-details)
	
	//- Result (Barcode - Product)
	v-col(cols="12")
		v-row
			v-col(cols="12" sm="6")
				.text-caption.white--text รหัสสินค้า:
				v-text-field(v-model="form.productCode" type="text" solo flat hide-details readonly)
			v-col(cols="12" sm="6")
				.text-caption.white--text ชื่อสินค้า:
				v-text-field(v-model="form.productName" type="text" solo flat hide-details readonly)
	
	//- Barcode - Part Barcode
	v-col(cols="12")
		.text-caption.white--text Part Barcode:
		BarcodeField(:model.sync="form.barcodePart" :option="{...barcodePickerOption}" @scanned="partScanned")

	//- Result 
	v-col(cols="12")
		v-row
			v-col(cols="12" sm="4")
				.text-caption.white--text ต้องการส่ง:
				v-text-field(v-model="form.needTransferQty" type="text" solo flat hide-details readonly)
			v-col(cols="12" sm="4")
				.text-caption.white--text จำนวนรวม:
				v-text-field(v-model="sumOfQty" type="text" solo flat hide-details readonly)
			v-col(cols="12" sm="4")
				.text-caption.white--text หน่วย:
				v-text-field(v-model="form.partBin_DimCode" type="text" solo flat hide-details readonly)
	

	v-col(cols="12")
		.text-caption.white--text รายการ:
		v-sheet(width="100%" color="white").rounded-lg.overflow-hidden
			v-simple-table
				template(v-slot:default)
					thead
						tr
							th.text-center ลำดับ
							th.text-center Lot
							//- th.text-center ต้องการส่ง
							th.text-center Qty
							
					tbody
						tr(v-for="(item,index) in form.products" :key="index")
							td.text-center {{ index+1 }}
							td.text-center {{ item.UD24_Character10 }}
							//- td.text-center {{ parseInt(form.selectedDocument.UD28_Number04) }}
							td.text-center {{ parseInt(item.Calculated_Qty) }}
							//- td.text-center {{ form.picking.lifeProduct }}
							//- td.text-center {{ form.picking.withdrawalSlipAmount }}
							td.text-center
								v-btn(text color="error" small rounded @click="$delete(form.products,index)")
									v-icon(left) {{ mdiTrashCanOutline }}
										span ลบ

	


	v-col(cols="12")
		v-row
			v-col(cols="6")
				v-btn(block dark depressed color="accent" x-large rounded @click="submitTransfer()") โอนย้าย
			v-col(cols="6")
				v-btn(block outlined dark x-large rounded @click="resetAll()") ยกเลิก	
	SearchTable(v-if="showSearhDialog" :items.sync="this.form.searchWarehouse" @select="handleSelectWarehouse" @closed="showSearhDialog = false")
	SearchBin(v-if="showSearhBinDialog" :items.sync="this.form.searchBin" @select="handleSelectBin" @closed="showSearhBinDialog = false")
</template>

<script>
import { mdiCalendarMonthOutline, mdiBarcodeScan, mdiTextBoxOutline, mdiTrashCanOutline, mdiCommentEdit } from "@mdi/js"
import dayjs from "@/plugins/dayjs"
import DateField from "@/components/pickers/Date.vue"
import BarcodeField from "@/components/pickers/Barcode.vue"
import SearchTable from "@/components/pickers/SearchTable.vue"
import SearchBin from "@/components/pickers/SearchBin.vue"

export default {
	components: { DateField, BarcodeField, SearchTable, SearchBin },
	data: () => ({
		showSearhDialog: false,
		showSearhBinDialog: false,
		mdiCalendarMonthOutline: mdiCalendarMonthOutline,
		mdiTextBoxOutline: mdiTextBoxOutline,
		mdiBarcodeScan: mdiBarcodeScan,
		mdiTrashCanOutline: mdiTrashCanOutline,
		mdiCommentEdit: mdiCommentEdit,
		datePickerOption: {
			type: "text",
			prependInnerIcon: mdiCalendarMonthOutline,
			solo: true,
			flat: true,
			hideDetails: true,
		},
		barcodePickerOption: {
			type: "text",
			appendIcon: mdiBarcodeScan,
			prependInnerIcon: mdiTextBoxOutline,
			solo: true,
			flat: true,
			hideDetails: true,
		},
		form: {
			transferDate: dayjs().format("YYYY-MM-DD"),
			pickingList: [],
			calculatedPickingList: null,
			calculatedWH: null,
			calculatedBin: null,
			selectedDocument: null,
			tmpselectedDocument: null,
			needTransferQty: 0,
			productCode: null,
			productName: null,
			qtySend: null,
			products: [],
			searchWarehouse: [],
			searchBin: [],
			partBin_DimCode: null,
		},
	}),
	methods: {
		async pickingListScanned(qrString) {
			try {
				const { picking } = await this.$store.dispatch("transfer/checkPickingByQRCode", qrString)
				console.log("picking", picking)
				this.form.pickingList = picking
				this.form.calculatedPickingList = picking[0]["UD28_Key1"]
				this.form.calculatedWH = picking[0]["UD28_ShortChar14"]
				this.form.calculatedBin = picking[0]["UD28_ShortChar15"]
				// this.form.selectedDocument = picking[0]
				// this.form.tmpselectedDocument = this.form.selectedDocument
				// this.form.needTransferQty = parseInt(picking[0]["UD28_Number04"])
				// this.form.productCode = picking[0]["UD28_ShortChar08"]
				// this.form.productName = picking[0]["UD28_Character09"]
				// picking[0]["OrderDtl_Life01_c"]
			} catch (error) {
				this.resetPlan()
				alert(error.message)
			}
		},

		async searchWarehouse() {
			const { searchWareHouse } = await this.$store.dispatch("transfer/searchWareHouse")
			this.form.searchWarehouse = searchWareHouse
			console.log("this.form.searchWarehouse", this.form.searchWarehouse)
			this.showSearhDialog = true
		},

		handleSelectWarehouse(item) {
			this.showSearhDialog = false
			console.log("select item", item)
			this.form.calculatedWH = item.Warehse_WarehouseCode
			this.searchBin()
		},

		async searchBin() {
			if (this.form.calculatedWH) {
				const { searchBin } = await this.$store.dispatch("transfer/searchBin", this.form.calculatedWH)
				this.form.searchBin = searchBin
				console.log("this.form.searchBin", this.form.searchBin)
				this.showSearhBinDialog = true
			} else {
				alert("กรุณาเลือก Warehouse ก่อน")
			}
		},

		handleSelectBin(item) {
			this.showSearhBinDialog = false
			console.log("select item", item)
			this.form.calculatedBin = item.WhseBin_BinNum
		},

		async handleSelectChange(item) {
			console.log("this.form.tmpselectedDocument", this.form.tmpselectedDocument)
			console.log("this.form.selectedDocument", this.form.selectedDocument)
			console.log("selectedDocument", item)

			if (item.UD28_CheckBox01 == true) {
				if (confirm("ลำดับนี้ทำรายการไปแล้ว ต้องทำรายการซ้ำหรือไม่?")) {
				} else {
					this.resetProducts()

					return
				}
			}

			if (this.sumOfQty > 0) {
				if (confirm("รายการทั้งหมดต้องการโอนย้ายหรือไม่?")) {
					// the user clicked OK
					this.form.selectedDocument = this.form.tmpselectedDocument
					this.submitTransfer()
				} else {
					// the user clicked Cancel

					this.form.selectedDocument = this.form.tmpselectedDocument
					this.form.needTransferQty = parseInt(this.form.selectedDocument.UD28_Number04)
					this.resetProducts()
					//this.form.tmpselectedDocument = this.form.selectedDocument
				}
			} else {
				this.form.selectedDocument = item
				this.form.needTransferQty = parseInt(item.UD28_Number04)
				this.form.tmpselectedDocument = item
				this.form.productCode = item.UD28_ShortChar08
				this.form.productName = item.UD28_Character09
			}
		},

		async handleSelectClose() {
			console.log("handleSelectClose")
			this.form.selectedDocument = this.form.tmpselectedDocument
		},

		async partScanned(qrString) {
			try {
				const { product } = await this.$store.dispatch("transfer/checkPartByQRCode", qrString)

				let checkKey1 = false
				for (const product of this.form.products) {
					for (const key1 of product.Key1Array) {
						if (key1 == qrString) {
							checkKey1 = true
						}
					}
				}
				if (checkKey1 == true) {
					alert("ป้ายแท๊กนี้ถูกสแกนรับค่าแล้ว")
				} else {
					const item = product
					console.log("[scan item]", item)
					if (this.form.products.length > 0) {
						console.log("this.form.products", this.form.products[0].UD24_Key1)
					}
					//UD24_Key1
					if (item.UD24_Key1 !== null) {
						console.log("item.UD24_Key5", item.UD24_Key5)
						console.log("this.form.selectedDocument.UD28_ShortChar08", this.form.selectedDocument.UD28_ShortChar08)
						if (item.UD24_Key5 === this.form.selectedDocument.UD28_ShortChar08) {
							if (item.UD24_CheckBox01 == false) {
								if (item.Calculated_P_Life >= this.form.selectedDocument.OrderDtl_Life01_c) {
									console.log("item.Calculated_Qty", item.Calculated_Qty)
									console.log("item.PartBin_OnhandQty", item.PartBin_OnhandQty)
									if (this.sumOfQty >= this.form.needTransferQty) {
										alert("จำนวนเกินยอดที่ต้องการส่ง")
									} else {
										let foundObject = this.form.products.find(
											(obj) =>
												obj.UD24_Character10 === item.UD24_Character10 &&
												obj.UD24_Key5 === item.UD24_Key5 &&
												obj.UD24_Character03 === item.UD24_Character03 &&
												obj.UD24_Character04 === item.UD24_Character04
										)
										if (foundObject) {
											console.log("foundObject.Calculated_Qty", foundObject.Calculated_Qty)
											console.log("foundObject.PartBin_OnhandQty", foundObject.PartBin_OnhandQty)
											console.log("this.sumOfQty", this.sumOfQty)
											const tempQTY = parseInt(foundObject.Calculated_Qty) + parseInt(item.Calculated_Qty)
											if (tempQTY <= foundObject.PartBin_OnhandQty) {
												foundObject.Calculated_Qty = parseInt(foundObject.Calculated_Qty) + parseInt(item.Calculated_Qty)
												foundObject.Key1Array.push(item.UD24_Key1)
												this.form.partBin_DimCode = item.PartBin_DimCode
											} else {
												alert("จำนวนของในระบบมีไม่พอโอนย้าย กรุณาตรวจสอบ")
											}
										} else {
											console.log("[Prepare][ADD] ITEM", item)
											if (parseInt(item.Calculated_Qty) <= parseInt(item.PartBin_OnhandQty)) {
												item.Key1Array = []
												item.Key1Array.push(item.UD24_Key1)
												item.Key5Array = []
												const key = item.UD24_Key5
												const key5 = {
													key: item.PartBin_OnhandQty,
												}
												item.Key5Array.push(key5)
												console.log("Add item", item)
												this.form.products.push(item)
												this.form.partBin_DimCode = item.PartBin_DimCode
											} else {
												alert("จำนวนของในระบบมีไม่พอโอนย้าย กรุณาตรวจสอบ")
											}
										}
									}
								} else {
									alert("สินค้าอายุไม่ถึงวันที่กำหนด")
								}
							} else {
								alert("แท๊กนี้ถูกโอนย้ายแล้ว")
							}
						} else {
							alert("สินค้าไม่ตรงกับในใบเบิก กรุณาตรวจสอบ")
						}
					} else {
						alert("ไม่พบป้ายแท๊กเช็คเข็ม")
					}
				}
			} catch (error) {
				this.resetPlan()
				alert(error.message)
			}
		},

		async submitTransfer() {
			try {
				for (const [index, product] of this.form.products.entries()) {
					console.log("product", product)
					console.log("this.form.selectedDocument", this.form.selectedDocument)

					const payloadUD26 = {
						Company: product.UD24_Company,
						Key1: product.UD24_Key5,
						Key2: product.UD24_Character10,
						Key3: product.UD24_Character03,
						Key4: product.UD24_Character04,
						Key5: this.form.selectedDocument.UD28_Key1,
						Character02: this.form.selectedDocument.UD28_Key1,
						Character05: "Inv",
						Character06: this.form.partBin_DimCode,
						Character07: this.$store.getters["auth/username"],
						Character08: this.$store.getters["auth/username"],
						Character09: this.form.selectedDocument.UD28_Character09,
						Number01: parseInt(this.form.selectedDocument.UD28_Key3),
						Number02: parseInt(this.form.selectedDocument.UD28_Key4),
						Number04: parseInt(product.Calculated_Qty),
						Number10: index + 1,
						Number14: this.form.selectedDocument.UD28_Number14,
						Date01: this.form.transferDate,
						Date02: this.form.transferDate,
						Date03: this.form.transferDate,
						ShortChar09: this.form.calculatedWH,
						ShortChar10: this.form.calculatedBin,
						ShortChar15: this.form.selectedDocument.UD28_Key5,
						ShortChar16: this.form.selectedDocument.UD28_Key2,
						ShortChar20: this.$store.getters["company/selectedCompanySiteID"],
						CheckBox01: true,
					}
					const response26 = await this.$store.dispatch("transfer/submitTransferUD26", payloadUD26)
					console.log("response26", response26)

					for (const key1 of product.Key1Array) {
						const payloadUD24 = {
							Company: product.UD24_Company,
							Key1: key1,
							Key5: product.UD24_Key5,
							CheckBox01: true,
							ShortChar20: this.$store.getters["company/selectedCompanySiteID"],
						}
						const response24 = await this.$store.dispatch("transfer/submitTransferUD24", payloadUD24)
						console.log("response24", response24)
					}

					const payloadUD28 = {
						Company: product.UD24_Company,
						Key1: this.form.selectedDocument.UD28_Key1,
						Key2: this.form.selectedDocument.UD28_Key2,
						Key3: this.form.selectedDocument.UD28_Key3,
						Key4: this.form.selectedDocument.UD28_Key4,
						Key5: this.form.selectedDocument.UD28_Key5,
						Number14: this.form.selectedDocument.UD28_Number14,
						CheckBox01: true,
						ShortChar20: this.$store.getters["company/selectedCompanySiteID"],
					}
					const response28 = await this.$store.dispatch("transfer/submitTransferUD28", payloadUD28)
					console.log("response28", response28)
				}
				if (this.form.products.length > 0) {
					alert("ส่งข้อมูลเรียบร้อยแล้ว")
					this.resetAll()
				}
			} catch (error) {
				alert(error.message)
			}
		},

		resetPlan() {
			this.form.barcodePicking = null
		},

		resetProducts() {
			this.form.selectedDocument = null
			this.form.products = []
			this.form.productCode = null
			this.form.productName = null
			this.form.barcodePart = null
			this.form.partBin_DimCode = null
			this.form.needTransferQty = null
		},
		resetSerialAndProducts() {
			this.resetProducts()
		},
		resetAll() {
			this.resetProducts()
			this.form.selectedDocument = null
			//this.resetPlan()
		},
	},
	computed: {
		sumOfQty() {
			return this.form.products.reduce((acc, obj) => acc + parseInt(obj.Calculated_Qty), 0)
		},
	},
}
</script>
