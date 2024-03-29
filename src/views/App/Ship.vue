<template lang="pug">
v-container
	v-row
		//- Shipping date
		v-col(cols="12")
			.text-caption.white--text วันที่ส่งสินค้า:
			DateField(:model.sync="form.shippingDate" :option="datePickerOption")
		//- Barcode - Plan
		v-col(cols="12")
			.text-caption.white--text  บาร์โค๊ดใบเบิก:
			BarcodeField(:model.sync="form.barcodePlan" :option="{...barcodePickerOption, disabled:sumOfQty!=0}" @scanned="planScanned")
		//- Barcode - Sale order
		v-col(cols="12")
			.text-caption.white--text บาร์โค๊ด Order/Plan:
			BarcodeField(:model.sync="form.barcodeSaleOrder" :option="{...barcodePickerOption, disabled:!form.barcodePlan||sumOfQty!=0}" @scanned="saleOrderScanned" @change="handleBarcodeSaleOrderChange(form.barcodeSaleOrder)")
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
				v-col(cols="12")
					.text-caption.white--text สินค้า:
					v-text-field(v-model="form.saleOrderProductID" type="text" solo flat hide-details readonly)
				v-col(cols="12")
					.text-caption.white--text ชื่อสินค้า:
					v-text-field(v-model="form.saleOrderProductName" type="text" solo flat hide-details readonly)
		//- Barcode - Product
		v-col(cols="12" sm="12")
			.text-caption.white--text บาร์โค๊ดสินค้า:
			BarcodeField(:model.sync="form.barcodeProduct" :option="{...barcodePickerOption, disabled: !form.barcodeSaleOrder}" @scanned="productScanned")

		//- Result 
		v-col(cols="12")
			v-row(dense)
				v-col(cols="4")
					.text-caption.white--text ต้องการส่ง:
					v-text-field(v-model="form.saleOrderProductAmount" type="text" solo flat hide-details readonly)
				v-col(cols="4")
					.text-caption.white--text จำนวนรวม:
					v-text-field(v-model="sumOfQty" type="text" solo flat hide-details readonly)
				v-col(cols="4")
					.text-caption.white--text หน่วย:
					v-text-field(v-model="form.partBin_DimCode" type="text" solo flat hide-details readonly)
		
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
								th.text-center -
						tbody
							tr(v-for="(item,index) in form.products" :key="index")
								td.text-center {{ index+1 }}
								td.text-center {{ item.UD03_Key5 }}
								td.text-center {{ item.Calculated_Qty }}
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
			partBin_DimCode: null,
			UD28_Key5: null,
			defShipWhse: null,
			defShipBin: null,
			UD28_Key1: null,
			item_UD28: null,
		},
	}),
	methods: {
		async planScanned(qrString) {
			try {
				const { plan } = await this.$store.dispatch("ship/checkPlanByQRCode", qrString)
				this.form.barcodePlan = plan
				console.log("barcodePlan", this.form.barcodePlan)
				this.resetFinishSubmit()
			} catch (error) {
				this.resetPlan()
				alert(error.message)
			}
		},
		async saleOrderScanned(qrString) {
			if (this.sumOfQty > 0) {
				if (confirm("ต้องการส่งข้อมูลรายการนี้หรือไม่?")) {
					// the user clicked OK
					this.submitEpicor()
					this.resetSaleOrder()
					this.form.saleOrderProductAmount = null
				} else {
					// the user clicked Cancel
					this.resetProducts()
					this.form.barcodeProduct = null
					this.form.saleOrderProductAmount = null
					this.form.partBin_DimCode = null
				}
			} else {
				try {
					console.log("qrString", qrString)
					console.log("this.form.barcodePlan", this.form.barcodePlan)

					const data = {
						qrString: qrString,
						barcodePlan: this.form.barcodePlan,
					}

					/*
					const { SO, line, rel, productID, productAmount, productName, UD28_Key5, DefShipWhse, DefShipBin, UD28_Key1 } = await this.$store.dispatch("ship/checkSaleOrderByQRCode", data)
					this.form.saleOrderSO = SO
					this.form.saleOrderLine = line
					this.form.saleOrderRel = rel
					this.form.saleOrderProductID = productID
					this.form.saleOrderProductAmount = productAmount
					this.form.saleOrderProductName = productName
					this.form.UD28_Key5 = UD28_Key5
					this.form.defShipWhse = DefShipWhse
					this.form.defShipBin = DefShipBin
					this.form.UD28_Key1 = UD28_Key1

					id: item.RowIdent,
						SO: item["UD28_ShortChar16"] || null,
						line: item["UD28_ShortChar17"] || null,
						rel: item["UD28_ShortChar18"] || null,
						productID: item["UD28_Key2"] || null,
						productAmount: parseFloat(item["UD28_Number04"] || 0),
						productName: item["UD28_Character09"] || null,
						UD28_Key5: item["UD28_Key5"] || null,
						DefShipWhse: item["PlantConfCtrl_DefShipWhse"] || null,
						DefShipBin: item["PlantConfCtrl_DefShipBin"] || null,
						UD28_Key1: item["UD28_Key1"] || null,
					*/
					const { item } = await this.$store.dispatch("ship/checkSaleOrderByQRCode", data)

					this.form.saleOrderSO = item["UD28_ShortChar16"] || null
					this.form.saleOrderLine = item["UD28_ShortChar17"] || null
					this.form.saleOrderRel = item["UD28_ShortChar18"] || null
					this.form.saleOrderProductID = item["UD28_Key2"] || null
					this.form.saleOrderProductAmount = parseFloat(item["Calculated_Number04"] || 0)
					this.form.saleOrderProductName = item["UD28_Character09"] || null
					this.form.UD28_Key5 = item["UD28_Key5"] || null
					this.form.defShipWhse = item["PlantConfCtrl_DefShipWhse"] || null
					this.form.defShipBin = item["PlantConfCtrl_DefShipBin"] || null
					this.form.UD28_Key1 = item["UD28_Key1"] || null
					this.form.item_UD28 = item
				} catch (error) {
					this.resetSaleOrder()

					alert(error.message)
				}
			}
		},
		async handleBarcodeSaleOrderChange(item) {
			console.log("handleBarcodeSaleOrderChange", item)
		},
		async productScanned(qrString) {
			try {
				if (this.form.products.some((obj) => obj.barcode == qrString)) {
					alert("QR Code นี้ถูกสแกนรับค่าแล้ว")
				} else {
					const { item } = await this.$store.dispatch("ship/checkSerialByQRCode", qrString)

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
						if (item.UD03_Key1 != null) {
							if (item.UD03_Key2 == this.form.saleOrderProductID) {
								if (item.UD03_CheckBox01 == false) {
									console.log("this.sumOfQty", this.sumOfQty)
									console.log("this.this.form.saleOrderProductAmount", this.form.saleOrderProductAmount)
									if (this.sumOfQty >= this.form.saleOrderProductAmount) {
										alert("จำนวนเกินยอดที่ต้องการส่ง")
									} else {
										let foundObject = this.form.products.find((obj) => obj.UD03_Key5 === item.UD03_Key5 && obj.UD03_Key2 === item.UD03_Key2)
										if (foundObject) {
											const tempQTY = parseInt(foundObject.Calculated_Qty) + parseInt(item.Calculated_Qty)
											if (tempQTY <= parseInt(foundObject.PartBin_OnhandQty)) {
												foundObject.Calculated_Qty = parseInt(foundObject.Calculated_Qty) + parseInt(item.Calculated_Qty)
												foundObject.Key1Array.push(item.UD03_Key1)
												foundObject.Key2Array.push(item.UD03_Key2)
												foundObject.Key5Array.push(item.UD03_Key5)
												foundObject.Qty = item.Calculated_Qty
												this.form.partBin_DimCode = item.PartBin_DimCode
											} else {
												alert("ของในระบบมีไม่พอขาย กรุณาตรวจสอบ")
											}
										} else {
											console.log("[Prepare][ADD] ITEM", item)
											if (parseInt(item.Calculated_Qty) <= parseInt(item.PartBin_OnhandQty)) {
												item.Key1Array = []
												item.Key1Array.push(item.UD03_Key1)
												item.Key2Array = []
												item.Key2Array.push(item.UD03_Key2)
												item.Key5Array = []
												item.Key5Array.push(item.UD03_Key5)
												item.Qty = item.Calculated_Qty
												this.form.products.push(item)
												this.form.partBin_DimCode = item.PartBin_DimCode
											} else {
												alert("ของในระบบมีไม่พอขาย กรุณาตรวจสอบ")
											}
										}
									}
								} else {
									alert("แท๊กนี้ถูกส่งของแล้ว")
								}
							} else {
								alert("ข้อมูลสินค้าไม่ตรงกับ Sales Order กรุณาตรวจสอบ")
							}
						} else {
							alert("ไม่พบป้ายแท๊กสินค้า")
						}
					}
				}
			} catch (error) {
				//this.resetSerialAndProducts()
				alert(error.message)
			} finally {
			}
		},
		async submitEpicor() {
			try {
				for (const [index, product] of this.form.products.entries()) {
					for (let i = 0; i < product.Key2Array.length; i++) {
						const key1 = product.Key1Array[i]
						const key2 = product.Key2Array[i]
						const key5 = product.Key5Array[i]
						console.log("product.Key2Array", product.Key2Array)
						console.log("product.Key5Array", product.Key5Array)

						console.log("key2", key2)
						console.log("key5", key5)
						const payload = {
							Company: this.$store.getters["company/selectedCompanyCode"],
							Date01: dayjs(this.form.shippingDate, "YYYY-MM-DD").toISOString(),
							Date02: dayjs(this.form.shippingDate, "YYYY-MM-DD").toISOString(),
							Date03: dayjs(this.form.shippingDate, "YYYY-MM-DD").toISOString(),
							Key1: this.form.UD28_Key1,
							Key2: key2,
							Key3: key5,
							Key4: key1, // UD03_Key1
							Key5: this.form.item_UD28["UD28_ShortChar13"], //  UD28_ShortChar13
							Character01: this.form.item_UD28["UD28_ShortChar06"], //  UD28.ShortChar06”
							Character02: this.form.item_UD28["UD28_Character02"], //  UD28.Character02”
							Character03: this.form.defShipWhse,
							Character04: this.form.defShipBin,
							Character05: this.form.item_UD28["UD28_Character05"], //  UD28_Character05
							Character06: this.form.partBin_DimCode,
							Character07: this.$store.getters["auth/username"],
							Character08: this.$store.getters["auth/username"],
							Character09: this.form.saleOrderProductName,
							Character10: this.form.item_UD28["UD28_ShortChar16"], //  UD28_ShortChar16
							Number02: parseInt(this.form.item_UD28["UD28_ShortChar17"]), //  UD28_ShortChar17
							Number03: parseInt(this.form.item_UD28["UD28_ShortChar18"]), //  UD28_ShortChar18
							Number04: parseInt(product.Qty), // xxx Calculated_Qty
							Number09: parseInt(index + 1), // คือลำดับ Seq ใน Column Line (1,2,3,…)
							Number10: parseInt(this.form.item_UD28["Calculated_Number04"]), //  “UD28_Number04” คือ จำนวนที่ต้องการส่ง
							Number11: parseInt(product.Key2Array.length),
							ShortChar03: this.form.item_UD28["UD28_ShortChar03"], //  UD28.ShortChar03
							ShortChar04: this.form.item_UD28["Calculated_CustID"], //  Calculated_CustID
							ShortChar05: this.form.item_UD28["Calculated_ShipToNum"], //  Calculated_ShipToNum
							ShortChar06: this.form.item_UD28["UD28_ShortChar06"], //  UD28.ShortChar06
							ShortChar07: this.form.item_UD28["UD28_ShortChar07"], //  UD28.ShortChar07
							ShortChar08: this.form.item_UD28["UD28_ShortChar04"], //  UD28.ShortChar04
							ShortChar09: this.form.item_UD28["UD28_ShortChar05"], //  “UD28.ShortChar05
							ShortChar13: this.form.item_UD28["UD28_Character03"] || "", // xx UD28_Character03” ถ้ามีค่า Null lส่งค่าว่างไป
							ShortChar14: this.form.item_UD28["UD28_Character04"] || "", // xx UD28_Character04” ถ้ามีค่า Null lส่งค่าว่างไป
							ShortChar20: this.$store.getters["company/selectedCompanySiteID"],
						}
						console.log("[PAYLOAD]", payload)
						const response = await this.$store.dispatch("ship/submitEpicor", payload)

						const payloadUD03 = {
							Company: this.$store.getters["company/selectedCompanyCode"],
							Key1: key1,
							Key2: key2,
							Key5: key5,
							CheckBox01: true,
							ShortChar20: this.$store.getters["company/selectedCompanySiteID"],
						}
						const responseUD03 = await this.$store.dispatch("ship/submitEpicorUD03", payloadUD03)
					}
					//throw new Error("error here")
				}
				alert("ส่งข้อมูลเรียบร้อยแล้ว")
				this.resetFinishSubmit()
			} catch (error) {
				console.error(error)
			}
		},
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
			this.form.UD28_Key5 = null
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
			this.form.partBin_DimCode = null
		},
		resetFinishSubmit() {
			this.resetSerialAndProducts()
			this.form.barcodeProduct = null
			this.resetSaleOrder()
		},
		resetAll() {
			this.form.barcodePlan = null
			this.resetFinishSubmit()
		},
	},
	computed: {
		sumOfQty() {
			return this.form.products.reduce((acc, obj) => acc + parseInt(obj.Calculated_Qty), 0)
		},
	},
}
</script>
