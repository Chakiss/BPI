<template lang="pug">
v-container
	v-row
		//- Shipping date
		v-col(cols="12")
			.text-caption.white--text วันที่ส่งสินค้า:
			DateField(:model.sync="form.shippingDate" :option="datePickerOption")
		//- Barcode - Plan
		v-col(cols="12")
			.text-caption.white--text บาร์โค๊ดแผน:
			BarcodeField(:model.sync="form.barcodePlan" :option="{...barcodePickerOption}" @scanned="planScanned")
		//- Barcode - Sale order
		v-col(cols="12")
			.text-caption.white--text บาร์โค๊ดใบเบิก:
			BarcodeField(:model.sync="form.barcodeSaleOrder" :option="{...barcodePickerOption, disabled: !form.barcodePlan}" @scanned="saleOrderScanned")
		//- Result (Barcode - Sale order)
		v-col(cols="12")
			v-row(dense)
				v-col(cols="4")
					.text-caption.white--text SO:
					v-text-field(v-model="form.saleOrderSO" type="text" solo flat hide-details readonly)
				v-col(cols="4")
					.text-caption.white--text Line:
					v-text-field(v-model="form.saleOrderLine" type="text" solo flat hide-details readonly)
				v-col(cols="4")
					.text-caption.white--text Rel:
					v-text-field(v-model="form.saleOrderRel" type="text" solo flat hide-details readonly)
				v-col(cols="8")
					.text-caption.white--text สินค้า:
					v-text-field(v-model="form.saleOrderProductID" type="text" solo flat hide-details readonly)
				v-col(cols="4")
					.text-caption.white--text จำนวน:
					v-text-field(v-model="form.saleOrderProductAmount" type="text" solo flat hide-details readonly)
				v-col(cols="12")
					.text-caption.white--text ชื่อสินค้า:
					v-text-field(v-model="form.saleOrderProductName" type="text" solo flat hide-details readonly)
		//- Barcode - Product
		v-col(cols="12" sm="8")
			.text-caption.white--text บาร์โค๊ดสินค้า:
			BarcodeField(:model.sync="form.barcodeProduct" :option="{...barcodePickerOption, disabled: !form.barcodeSaleOrder}" @scanned="productScanned")
		//- Result (Barcode - Product)
		v-col(cols="12" sm="4")
			.text-caption.white--text รหัสสินค้า:
			v-text-field(v-model="form.saleOrderProductID" solo flat hide-details readonly)
		v-col(cols="12")
			.text-caption.white--text รายการ:
			v-sheet(width="100%" color="white").rounded-lg.overflow-hidden
				v-simple-table
					template(v-slot:default)
						thead
							tr
								th.text-center Line
								th.text-center Lot
								th.text-center Qty
								th.text-center
						tbody
							tr(v-for="(item,index) in form.products" :key="index")
								td.text-right {{ index+1 }}
								td.text-left {{ item.lotNumber }}
								td.text-right {{ item.quantity }}
								td.text-center
									v-btn(text color="error" small rounded @click="$delete(form.products,index)")
										v-icon(left) {{ mdiTrashCanOutline }}
										span ลบ
		v-col(cols="12")
			v-row
				template(v-if="form.products.length > 0")
					v-col(cols="6")
						v-btn(block outlined dark x-large rounded @click="resetAll()") เริ่มใหม่
					v-col(cols="6")
						v-btn(block dark depressed color="accent" x-large rounded @click="submitEpicor()") ส่งข้อมูล
				template(v-else)
					v-col(cols="12")
						v-btn(block outlined dark x-large rounded @click="resetAll()") เริ่มใหม่
</template>

<script>
import { mdiCalendarMonthOutline, mdiBarcodeScan, mdiTextBoxOutline, mdiTrashCanOutline } from "@mdi/js"
import dayjs from "@/plugins/dayjs"
import DateField from "@/components/pickers/Date.vue"
import BarcodeField from "@/components/pickers/Barcode.vue"

export default {
	components: { DateField, BarcodeField },
	data: () => ({
		mdiCalendarMonthOutline: mdiCalendarMonthOutline,
		mdiTextBoxOutline: mdiTextBoxOutline,
		mdiBarcodeScan: mdiBarcodeScan,
		mdiTrashCanOutline: mdiTrashCanOutline,
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
			shippingDate: dayjs().format("YYYY-MM-DD"),
			barcodePlan: null,
			barcodeSaleOrder: null,
			barcodeProduct: null,
			saleOrderSO: null,
			saleOrderLine: null,
			saleOrderRel: null,
			saleOrderProductID: null,
			saleOrderProductAmount: null,
			saleOrderProductName: null,
			serial: null,
			products: [],
		},
	}),
	methods: {
		async planScanned(qrString) {
			try {
				await this.$store.dispatch("ship/checkPlanByQRCode", qrString)
			} catch (error) {
				this.resetPlan()

				alert(error.message)
			}
		},
		async saleOrderScanned(qrString) {
			try {
				const { SO, line, rel, productID, productAmount, productName } = await this.$store.dispatch("ship/checkSaleOrderByQRCode", qrString)

				this.form.saleOrderSO = SO
				this.form.saleOrderLine = line
				this.form.saleOrderRel = rel
				this.form.saleOrderProductID = productID
				this.form.saleOrderProductAmount = productAmount
				this.form.saleOrderProductName = productName
			} catch (error) {
				this.resetSaleOrder()

				alert(error.message)
			}
		},
		async productScanned(qrString) {
			try {
				if (this.form.products.some((obj) => obj.barcode == qrString)) {
					alert("QR Code นี้ถูกสแกนรับค่าแล้ว")
				} else {
					const { serial, product, error } = await this.$store.dispatch("ship/checkSerialByQRCode", qrString)

					console.log("product.partNumber", product.partNumber)
					console.log("product.lotNumber", product.lotNumber)
					if (error.length > 0) {
						alert(error)
					} else {
						let checkDuplication = false
						this.form.products.forEach((p) => {
							console.log("checking....", p.partNumber, p.lotNumber)
							if (p.partNumber == product.partNumber && p.lotNumber == product.lotNumber) {
								console.log("FOUND!!!!")
								checkDuplication = true
								p.quantity += 1
							}
						})
						if (checkDuplication == false) {
							this.form.serial = serial
							this.form.products.push(product)
						}
					}
				}
			} catch (error) {
				this.resetSerialAndProducts()

				alert(error.message)
			} finally {
				this.form.barcodeProduct = null
			}
		},
		async submitEpicor() {
			try {
				for (const [index, product] of this.form.products.entries()) {
					const payload = {
						Company: product.companyCode,
						Date01: dayjs(this.form.shippingDate, "YYYY-MM-DD").toISOString(),
						Key1: product.barcode,
						Key2: this.form.saleOrderSO,
						Key3: this.form.saleOrderLine,
						Key4: this.form.saleOrderRel,
						ShortChar08: this.form.saleOrderProductID,
						ShortChar09: this.form.wareHouseCode,
						ShortChar10: this.form.binNumber,
						ShortChar11: this.form.lotNumber,
						Character09: this.form.saleOrderProductName,
						Number14: index + 1,
						Number15: 0,
						ShortChar19: this.$store.getters["auth/username"],
					}
					const response = await this.$store.dispatch("ship/submitEpicor", payload)
					//throw new Error("error here")
				}
				alert("ส่งข้อมูลเรียบร้อยแล้ว")
				this.resetAll()
			} catch (error) {
				console.error(error)
			}
		},
		//async submitEpicor() {
		// try {
		// 	const payload = {
		// 		Company: this.form.serial?.companyCode,
		// 		Date01: dayjs(this.form.shippingDate, "YYYY-MM-DD").toISOString(),
		// 		Key1: this.form.barcodePlan,
		// 		Key2: this.form.saleOrderSO,
		// 		Key3: this.form.saleOrderLine,
		// 		Key4: this.form.saleOrderRel,
		// 		ShortChar08: this.form.saleOrderProductID,
		// 		ShortChar09: this.form.serial?.wareHouseCode,
		// 		ShortChar10: this.form.serial?.binNumber,
		// 		ShortChar11: this.form.serial?.lotNumber,
		// 		Character09: this.form.saleOrderProductName,
		// 		Number14: 1,
		// 		Number15: 0,
		// 		ShortChar19: this.$store.getters["auth/username"],
		// 	}
		// 	const response = await this.$store.dispatch("ship/submitEpicor", payload)

		// 	alert("ส่งข้อมูลเรียบร้อยแล้ว")
		// 	this.resetAll()
		// } catch (error) {
		// 	alert(error.message)
		// }
		//},
		resetPlan() {
			this.form.barcodePlan = null
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
