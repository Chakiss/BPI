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
							v-btn(text color="error" small rounded @click="searchWarehouse()")
								v-icon(center) {{ mdiCommentEdit }}
	
	//- Barcode - Document Order
	v-col(cols="12")
		.text-caption.white--text ลำดับในเอกสาร:
		BarcodeField(:model.sync="form.orderDocument" :option="{...barcodePickerOption}" @scanned="partScanned")
	
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
		.text-caption.white--text บาร์โค๊ดสินค้า:
		BarcodeField(:model.sync="form.barcodePart" :option="{...barcodePickerOption}" @scanned="partScanned")

	//- Result 
	v-col(cols="12")
		v-row
			v-col(cols="12" sm="6")
				.text-caption.white--text ต้องการส่ง:
				v-text-field(v-model="form.needQtySend" type="text" solo flat hide-details readonly)
			v-col(cols="12" sm="6")
				.text-caption.white--text จำนวนส่ง:
				v-text-field(v-model="form.qtySend" type="text" solo flat hide-details readonly)
     

	v-col(cols="12")
		.text-caption.white--text รายการ:
		v-sheet(width="100%" color="white").rounded-lg.overflow-hidden
			v-simple-table
				template(v-slot:default)
					thead
						tr
							th.text-center ลำดับ
							th.text-center สินค้า
							th.text-center อายุเข็ม
							th.text-center ต้องการส่ง
							th.text-center จำนวนส่ง
							th.text-center -
					tbody
						tr(v-for="(item,index) in form.products" :key="index")
							td.text-right {{ index+1 }}
							td.text-left {{ form.picking.partProduct }}
							td.text-left {{ form.picking.lifeProduct }}
							td.text-left {{ form.picking.withdrawalSlipAmount }}
							td.text-left {{ item.quantity }}
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
	SearchTable(v-if="showSearhDialog" :items.sync="this.form.searchWarehouse" @closed="showSearhDialog = false")
</template>

<script>
import { mdiCalendarMonthOutline, mdiBarcodeScan, mdiTextBoxOutline, mdiTrashCanOutline, mdiCommentEdit } from "@mdi/js"
import dayjs from "@/plugins/dayjs"
import DateField from "@/components/pickers/Date.vue"
import BarcodeField from "@/components/pickers/Barcode.vue"
import SearchTable from "@/components/pickers/SearchTable.vue"

export default {
	components: { DateField, BarcodeField, SearchTable },
	data: () => ({
		showSearhDialog: false,
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
			orderDocument: null,
			productCode: null,
			productName: null,
			needQtySend: null,
			qtySend: null,
			products: [],
			searchWarehouse: [],
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
				this.form.orderDocument = parseInt(picking[0]["UD28_Number14"]) || 0
				this.form.productCode = picking[0]["UD28_ShortChar08"]
				this.form.productName = picking[0]["UD28_Character09"]
				this.form.needQtySend = picking[0]["UD28_Number04"]
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

		async partScanned(qrString) {
			try {
				const { product } = await this.$store.dispatch("transfer/checkPartByQRCode", qrString)
				if (this.form.products.some((obj) => obj.qrSerialCode == qrString)) {
					alert("QR Code นี้ถูกสแกนรับค่าแล้ว")
				} else {
					const item = product
					item.orderDocument = this.form.picking.orderDocument
					this.form.product = product
					if (product.partCodeProduct == this.form.picking.partProduct) {
						this.form.productCode = product.partCodeProduct
						this.form.productName = product.productName
						if (product.tagProductLife >= this.form.picking.lifeProduct) {
							if (product.quantity <= product.onHandQty) {
								this.form.products.push(product)
							} else {
								alert("จำนวนเข็มในระบบมีไม่พอโอนย้าย")
							}
						} else {
							alert("สินค้าอายุไม่ถึงวันที่กำหนด")
						}
					} else {
						alert("สินค้าไม่ตรงกับในใบเบิก กรุณาตรวจสอบ")
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
					const payload = {
						Company: this.form.serial?.companyCode,
						Date01: dayjs(this.form.transferDate, "YYYY-MM-DD").toISOString(),
						Key5: this.form.barcodePicking,
						Number04: this.form.products[0]?.id,
						Number14: 0,
						ShortChar08: this.form.saleOrderProductID,
						ShortChar09: this.form.serial?.wareHouseCode,
						ShortChar10: this.form.serial?.binNumber,
						ShortChar19: this.form.serial?.lotNumber,
						ShortChar20: this.form.serial?.lotNumber,
					}
					const response = await this.$store.dispatch("ship/submitEpicor", payload)
				}
				alert("ส่งข้อมูลเรียบร้อยแล้ว")
				this.resetAll()
			} catch (error) {
				alert(error.message)
			}
		},

		resetPlan() {
			this.form.barcodePicking = null
		},
		resetSaleOrder() {
			this.form.barcodeSaleOrder = null
			this.form.saleOrderSO = null
			this.form.saleOrderLine = null
			this.form.saleOrderRel = null
			this.form.saleOrderProductID = null
			this.form.saleOrderProductAmount = null
			this.form.saleOrderProductName = null
		},
		resetSerial() {
			this.form.serial = null
		},
		resetProducts() {
			this.form.products = []
		},
		resetSerialAndProducts() {
			this.resetProducts()
			this.resetSerial()
		},
		resetAll() {
			this.resetSerialAndProducts()
			this.form.barcodeProduct = null
			this.resetSaleOrder()
			this.resetPlan()
		},
	},
}
</script>
