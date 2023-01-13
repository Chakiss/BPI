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
                v-col(cols="6")
                    .text-caption.white--text เลขที่เอกสาร:
                    v-text-field(v-model="form.calculatedPickingList" type="text" solo flat hide-details readonly)
                v-col(cols="6")
                    .text-caption.white--text คลังปลายทาง:
                    v-text-field(v-model="form.calculatedWHAndBin" type="text" solo flat hide-details readonly)
                
        //- Barcode - Part Barcode
        v-col(cols="12" sm="6")
            .text-caption.white--text บาร์โค๊ดสินค้า:
            BarcodeField(:model.sync="form.barcodePart" :option="{...barcodePickerOption}" @scanned="partScanned")
        //- Result (Barcode - Product)
        v-col(cols="12" sm="6")
            v-row
                v-col(cols="12" sm="6")
                    .text-caption.white--text รหัสสินค้า:
                    v-text-field(v-model="form.productCode" type="text" solo flat hide-details readonly)
                v-col(cols="12" sm="6")
                    .text-caption.white--text ชื่อสินค้า:
                    v-text-field(v-model="form.productName" type="text" solo flat hide-details readonly)

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
                                td.text-right xxxxxxxxxxx
                                //- td.text-left {{ item.lotNumber }}
                                td.text-right {{ item.quantity }}
                                td.text-right {{ item.quantity }}
                                td.text-right {{ item.quantity }}
                                td.text-center
                                    v-btn(text color="error" small rounded @click="$delete(form.products,index)")
                                        v-icon(left) {{ mdiTrashCanOutline }}
                                        span ลบ
        v-col(cols="12")
            v-row
                v-col(cols="6")
                    v-btn(block dark depressed color="accent" x-large rounded @click="submitEpicor()") โอนย้าย
                v-col(cols="6")
                    v-btn(block outlined dark x-large rounded @click="resetAll()") ยกเลิก
                //- template(v-if="form.products.length > 0")
                    v-col(cols="6")
                        v-btn(block outlined dark x-large rounded @click="resetAll()") เริ่มใหม่
                    v-col(cols="6")
                        v-btn(block dark depressed color="accent" x-large rounded @click="submitEpicor()") ส่งข้อมูล
                //- template(v-else)
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
			transferDate: dayjs().format("YYYY-MM-DD"),
			calculatedPickingList: null,
			calculatedWHAndBin: null,
			picking: null,
			product: null,
			productCode: null,
			productName: null,
			products: [],
		},
	}),
	methods: {
		async pickingListScanned(qrString) {
			try {
				const { picking } = await this.$store.dispatch("transfer/checkPickingByQRCode", qrString)
				console.log("picking", picking)
				this.form.picking = picking
				this.form.calculatedPickingList = picking.calculatedPickingList
				this.form.calculatedWHAndBin = picking.calculatedWarehouse + " " + picking.calculatedBin
			} catch (error) {
				this.resetPlan()
				alert(error.message)
			}
		},

		async partScanned(qrString) {
			try {
				const { product } = await this.$store.dispatch("transfer/checkPartByQRCode", qrString)

				if (this.form.products.some((obj) => obj.qrSerialCode == qrString)) {
					alert("QR Code นี้ถูกสแกนรับค่าแล้ว")
				} else {
					this.form.product = product
					if (product.partCodeProduct == this.form.picking.partProduct) {
						this.form.productCode = product.partCodeProduct
						this.form.productName = product.productName

						if (product.tagProductLife >= this.form.picking.lifeProduct) {
							this.form.products.push(product)
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

		async submitEpicor() {
			try {
				const payload = {
					Company: this.form.serial?.companyCode,
					Date01: dayjs(this.form.transferDate, "YYYY-MM-DD").toISOString(),
					Key1: this.form.barcodePicking,
					Key2: this.form.saleOrderSO,
					Key3: this.form.saleOrderLine,
					Key4: this.form.saleOrderRel,
					ShortChar08: this.form.saleOrderProductID,
					ShortChar09: this.form.serial?.wareHouseCode,
					ShortChar10: this.form.serial?.binNumber,
					ShortChar11: this.form.serial?.lotNumber,
					Chracter09: this.form.saleOrderProductName,
					Number14: this.form.products[0]?.id,
					Number15: 0,
					ShortChar19: "Demo1",
				}
				const response = await this.$store.dispatch("ship/submitEpicor", payload)

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
