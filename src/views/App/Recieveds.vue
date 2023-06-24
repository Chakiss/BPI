<template lang="pug">
//- v-container(v-if="this.form.page1")
v-container
	v-row()
	
		v-col(cols="12")
			.text-caption.white--text วันที่ส่งสินค้า:
			DateField(:model.sync="form.transferDate" :option="datePickerOption")
			

		//- Barcode - Picking List Barcode
		v-col(cols="12")
			.text-caption.white--text ใบขนส่ง:
			BarcodeField(:model.sync="form.barcodeTransportSlip" :option="{...barcodePickerOption}" @scanned="transportSlipScanned")

		//- Result (Barcode - Sale order)
		v-col(cols="12")
			v-row(dense)
				v-col(cols="12" sm="4")
					.text-caption.white--text ทะเบียนรถ:
					v-text-field(v-model="form.carPlate" type="text" solo flat hide-details readonly)
				v-col(cols="12" sm="4")
					.text-caption.white--text Warehouse:
					v-text-field(v-model.sync="form.WH" type="text" solo flat hide-details readonly)
						//- template(v-slot:append)
							v-btn(text color="error" small rounded @click="searchWarehouse()")
								v-icon(center) {{ mdiCommentEdit }}
							
				v-col(cols="12" sm="4")
					.text-caption.white--text Bin:
					v-text-field(v-model="form.Bin" type="text" solo flat hide-details readonly)
						//- template(v-slot:append)
								v-btn(text color="error" small rounded @click="searchBin()")
									v-icon(center) {{ mdiCommentEdit }}

		//- Barcode - Document Order
		v-col(cols="12")
			.text-caption.white--text ลำดับ:
			v-select(v-model.sync="form.selectedProduct" :items="form.UD27List" item-text="Calculated_Number15" @change="handleSelectChange(form.selectedProduct)" @close="handleSelectClose()" return-object solo flat hide-details)

		//- Result (Barcode - Product)
		v-col(cols="12")
			.text-caption.white--text ชื่อสินค้า:
			v-text-field(v-model="form.productName" type="text" solo flat hide-details readonly)
		v-col(cols="12")
			.text-caption.white--text เลข Lot:
			v-text-field(v-model="form.lotNumber" type="text" solo flat hide-details readonly)

		//- Result (Barcode - Product)
		v-col(cols="12")
			v-row
				v-col(cols="6" sm="6")
					.text-caption.white--text จำนวนส่ง:
					v-text-field(v-model="form.sendQty" type="text" solo flat hide-details readonly)
				v-col(cols="6" sm="6")
					.text-caption.white--text ท่อน:
					v-text-field(v-model="form.sendUnit" type="text" solo flat hide-details readonly)

		//- Result (Barcode - Product)
		v-col(cols="12")
			v-row
				v-col(cols="6" sm="6")
					.text-caption.white--text จำนวนรับ:
					v-text-field(v-model="form.recieveQty" type="number" :min= 1 :max=5 solo flat hide-details)
				v-col(cols="6" sm="6")
					.text-caption.white--text ท่อน:
					v-text-field(v-model="form.sendUnit" type="text" solo flat hide-details readonly)
		//- Barcode - Document Order
		v-col(cols="12")
			.text-caption.white--text หมายเหตุ:
			v-text-field(v-model="form.remark" type="text" solo flat hide-details)

		v-col(cols="12")
			v-row
				v-col(cols="12")
					v-btn(block dark depressed color="accent" :disabled="form.recieveQty == 0 || form.sendQty == 0" x-large rounded @click="addProduct()" ) รับสินค้า
				//- v-col(cols="4")
					//- v-btn(block dark depressed color="accent" x-large rounded @click="nextPage()") ถัดไป
				//- v-col(cols="4")
					//- v-btn(block outlined dark x-large rounded @click="resetAll()") ยกเลิก	
	SearchTable(v-if="showSearhDialog" :items.sync="this.form.searchWarehouse" @select="handleSelectWarehouse" @closed="showSearhDialog = false")
	SearchBin(v-if="showSearhBinDialog" :items.sync="this.form.searchBin" @select="handleSelectBin" @closed="showSearhBinDialog = false")
	
	v-row()
		//- Shipping date
		v-col(cols="12")
			.text-caption.white--text รายการรับสินค้า:
			v-sheet(width="100%" color="white").rounded-lg.overflow-hidden
				v-simple-table
					template(v-slot:default)
						thead
							tr
								th.text-center ลำดับ
								th.text-center ชื่อสินค้า
								th.text-center Lot
								th.text-center จำนวนรับ
								th.text-center รูปภาพ
								th.text-center จัดการ
						tbody
							tr(v-for="(item,index) in form.products" :key="index")
								td.text-center {{ item.Calculated_Number15 }}
								td.text-center {{ item.UD27_Character09 }}
								td.text-center {{ item.UD27_Key3 }}
								td.text-center {{ item.recieveQty }}
								td.text-center
									v-btn(text color="accent" small rounded @click="selectimage(index)")
										v-icon(left) {{ mdiFileImage }}
										span เลือกรูป
									img(v-if="item.image" v-bind:src="item.image" alt="Image" style=" height:50px;")
									
								td.text-center
									v-btn(v-if="item.image" text color="accent" small rounded @click="uploadImage(index)")
										v-icon(left) {{ mdiFileUpload }}
										span
										
								
		v-col(cols="12")
			v-row
				
				v-col(cols="6")
					v-btn(block outlined dark x-large rounded @click="resetAll()") ยกเลิก
				//- v-col(cols="4")
					//- v-btn(block dark depressed color="accent" x-large rounded @click="takePicture()") ถ่ายรูป
				v-col(cols="6")
					v-btn(block dark depressed color="accent" x-large rounded @click="submitData()") ยืนยัน
					

</template>

<script>
import { mdiCalendarMonthOutline, mdiBarcodeScan, mdiTextBoxOutline, mdiTrashCanOutline, mdiCommentEdit, mdiFileUpload, mdiFileImage } from "@mdi/js"
import dayjs from "@/plugins/dayjs"
import DateField from "@/components/pickers/Date.vue"
import BarcodeField from "@/components/pickers/Barcode.vue"
import SearchTable from "@/components/pickers/SearchTable.vue"
import SearchBin from "@/components/pickers/SearchBin.vue"
import Camera from "simple-vue-camera"
import axios from "axios"

export default {
	components: { DateField, BarcodeField, SearchTable, SearchBin, "simple-v-camera": Camera },
	data: () => ({
		showSearhDialog: false,
		showSearhBinDialog: false,
		mdiCalendarMonthOutline: mdiCalendarMonthOutline,
		mdiTextBoxOutline: mdiTextBoxOutline,
		mdiBarcodeScan: mdiBarcodeScan,
		mdiTrashCanOutline: mdiTrashCanOutline,
		mdiCommentEdit: mdiCommentEdit,
		mdiFileUpload: mdiFileUpload,
		mdiFileImage: mdiFileImage,
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
			barcodeTransportSlip: null,
			UD27List: null,
			UD27Object: null,
			selectedProduct: null,
			tmpselectedProduct: null,
			carPlate: null,
			WH: null,
			Bin: null,
			productName: null,
			lotNumber: null,
			sendQty: null,
			sendUnit: null,
			recieveQty: null,
			recieveUnit: null,
			remark: null,
			page1: true,
			products: [],
		},
	}),
	methods: {
		async transportSlipScanned(qrString) {
			try {
				const { slip } = await this.$store.dispatch("recieveds/checkTransportSlipBarcode", qrString)

				console.log("slip", slip)
				// clear Value
				this.form.UD27List = slip
				this.form.UD27Object = slip[0]
				this.form.carPlate = this.form.UD27Object["UD27_Key5"]
				this.form.WH = this.form.UD27Object["UD27_ShortChar13"]
				this.form.Bin = this.form.UD27Object["UD27_ShortChar14"]
			} catch (error) {
				this.resetPlan()
				alert(error.message)
			}
		},

		async handleSelectChange(item) {
			console.log("this.form.tmpselectedDocument", this.form.tmpselectedProduct)
			console.log("this.form.selectedDocument", this.form.selectedProduct)
			console.log("selectedDocument", item)
			this.form.productName = this.form.selectedProduct["UD27_Character09"]
			this.form.lotNumber = this.form.selectedProduct["UD27_Key3"]
			this.form.sendQty = this.form.selectedProduct["Calculated_Number11"]
			this.form.sendUnit = this.form.selectedProduct["UD27_Character06"]
			this.form.recieveQty = this.form.selectedProduct["recieveQty"] ? this.form.selectedProduct["recieveQty"] : 0
		},

		async handleSelectClose() {
			console.log("handleSelectClose")
			this.form.selectedProduct = this.form.tmpselectedProduct
		},

		async addProduct() {
			if (this.form.recieveQty > this.form.sendQty) {
				alert("จำนวนรับมากกว่าจำนวนส่ง ระบบจะแก้ไขให้จำนวนรับเท่ากับจำนวนส่ง")
			}
			let foundObject = this.form.UD27List.find((obj) => obj.Calculated_Number15 === this.form.selectedProduct.Calculated_Number15)
			if (foundObject) {
				console.log("foundObject", foundObject)
				if (this.form.recieveQty > this.form.sendQty) this.form.recieveQty = this.form.sendQty
				foundObject.recieveQty = this.form.recieveQty
				console.log("products", this.form.products.length)
				let productInList = this.form.products.find((obj) => obj.Calculated_Number15 == foundObject.Calculated_Number15)
				console.log("productInList", productInList)

				if (productInList) {
					const currentIndex = this.form.products.indexOf(foundObject)
					this.form.products.splice(currentIndex, 1, foundObject)
				} else {
					foundObject.count = 1
					this.form.products.push(foundObject)
					let index = this.form.products.indexOf(foundObject)
					this.form.products[index].imagesUrl = []
				}
			} else {
				console.log("ERRORRR!!")
			}
			/*
			this.form.selectedProduct = null
			this.form.productName = null
			this.form.lotNumber = null
			this.form.sendQty = null
			this.form.sendUnit = null
			this.form.recieveQty = null
			*/
		},

		selectimage(index) {
			console.log("INDEX", index)
			// input(type="file" accept="image/*" @change="handleImage")
			const input = document.createElement("input")
			input.type = "file"
			input.accept = "image/*"
			input.onchange = (e) => {
				var files = e.target.files || e.dataTransfer.files
				if (!files.length) return
				const reader = new FileReader()
				reader.onload = (event) => {
					this.imageString = event.target.result
					this.form.products[index].image = this.imageString
					this.form.products.splice(index, 1, this.form.products[index])
					this.form.products[index].imageFile = files[0]
				}
				reader.readAsDataURL(files[0])
			}
			input.click()
		},

		handleImage(e, index) {
			console.log(index)
			var files = e.target.files || e.dataTransfer.files
			if (!files.length) return
			this.createBase64Image(files[0])
		},
		createBase64Image(fileObject) {
			var reader = new FileReader()
			reader.onload = (e) => {
				this.imageString = e.target.result
			}
			reader.readAsDataURL(fileObject)
		},

		async uploadImage(index) {
			const url = "https://webapp.bpi-concretepile.co.th:21242/uploadfile/api/uploads/upload-files"
			const appKey = "107864EF-16CA-4AFF-829F-5A1E65EAD950"

			const formData = new FormData()
			formData.append("FileDetails", this.form.products[index].imageFile)

			const config = {
				headers: {
					appKey: appKey,
					"Content-Type": "multipart/form-data",
				},
				body: {
					FileDetails: this.form.products[index].imageFile,
				},
			}

			axios
				.post(url, formData, config)
				.then((response) => {
					this.form.products[index].imagesUrl.push(response.data.result.files[0].fileurl)
					let indexxx = this.form.products[index].imagesUrl.indexOf(response.data.result.files[0].fileurl)
					alert("Image " + (indexxx + 1) + " uploaded successfully")
				})
				.catch((error) => {
					console.error("Error uploading image:", error)
					throw error
				})
		},

		async importImage(index) {
			try {
				let imageString = this.form.products[index].image
				let product = this.form.products[index]
				const imageStringArray = imageString.split(",")
				var stringLength = imageStringArray[1].length

				const imgType = imageString.split(";")[0].split("/")[1]
				var sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812
				var sizeInKb = sizeInBytes / 1000
				let width = 0
				let height = 0
				let img = new Image()
				img.src = this.imageString
				console.log(imgType)
				await img.decode().then(() => {
					width = img.width
					height = img.height
					// Do something with dimensions
				})

				const payload = {
					imageID: product["UD27_ShortChar15"] + "-" + product["UD27_Key2"] + "-" + product["UD27_Key3"] + "-" + String(product.count).padStart(3, "0"),
					fileNames: [this.form.products[0].imageUrl],
					images: [""],
					imgWidth: [width],
					imgHeight: [height],
					imgSize: [parseInt(sizeInKb)],
					imgType: [imgType],
					removeExtensions: true,
					renameDuplicates: true,
					updateDuplicates: true,
					categoryID: "",
					subcategoryID: "",
					importCategories: [""],
					importCategoryInfo: true,
				}
				console.log("[PAYLOAD]", payload)
				const response = await this.$store.dispatch("recieveds/uploadImage", payload)
				alert("ส่งข้อมูลเรียบร้อยแล้ว")
				this.form.products[index].image = null
				this.form.products[index].count = this.form.products[index].count + 1
				this.form.products.splice(index, 1, this.form.products[index])
			} catch (error) {
				console.error(error)
			}
		},
		async submitData() {
			try {
				if (this.form.products.length == 0) {
					alert("ยังไม่มีข้อมูล")
				} else {
					for (const [index, product] of this.form.products.entries()) {
						const payload = {
							Company: this.$store.getters["company/selectedCompanyCode"],
							Date01: dayjs(this.form.shippingDate, "YYYY-MM-DD").toISOString(),
							Date02: dayjs(new Date(), "YYYY-MM-DD").toISOString(),
							Date03: dayjs(new Date(), "YYYY-MM-DD").toISOString(),
							Key1: product.UD27_Key2,
							Key2: product.UD27_Key3,
							Key3: product.UD27_ShortChar13,
							Key4: product.UD27_ShortChar14,
							Key5: product.UD27_ShortChar15,
							Character05: "Rcv",
							Character06: product.UD27_Character06,
							Character07: this.$store.getters["auth/username"],
							Character08: this.$store.getters["auth/username"],
							Character09: product.UD27_Character09,
							Number04: parseInt(product.recieveQty), // xxx Calculated_Qty
							Number11: parseInt(product.Calculated_Number11),
							Number15: parseInt(product.Calculated_Number15),
							ShortChar09: product.UD27_Character03, //  “UD28.ShortChar05
							ShortChar10: product.UD27_Character04,
							ShortChar17: this.form.remark,
							ShortChar20: this.$store.getters["company/selectedCompanySiteID"],
							//URL_Pic01: product.imageUrl,
						}
						for (var i = 0; i < 10; i++) {
							payload["URL_Pic" + (i + 1).toString().padStart(2, "0")] = product.imagesUrl[i] ?? ""
						}

						console.log("[PAYLOAD]", payload)

						const response = await this.$store.dispatch("recieveds/submitReceiveTranferOnSite", payload)
						console.log("submitReceiveTranferOnSite", response)

						const payload2 = {
							Number14: product.Calculated_Number14,
							Number15: product.Calculated_Number15,
						}
						const response2 = await this.$store.dispatch("recieveds/getReceiveTranferOnSite", payload2)
						console.log("getReceiveTranferOnSite", response2.data)

						const patchData = response2.data
						patchData.ADT_TransferdQty_c = product.recieveQty
						patchData.ADT_TransferdDate_c = dayjs(this.form.shippingDate, "YYYY-MM-DD").toISOString()
						const payload3 = {
							Number14: product.Calculated_Number14,
							Number15: product.Calculated_Number15,
							data: patchData,
						}
						console.log("[PAYLOAD PATCH]", payload3)
						const response3 = await this.$store.dispatch("recieveds/patchReceiveTranferOnSite", payload3)
						console.log("patchReceiveTranferOnSite", response3)
					}
					alert("ส่งข้อมูลเรียบร้อยแล้ว")
					this.resetAll()
				}
			} catch (error) {
				console.error(error)
			}
		},
		nextPage() {
			this.form.page1 = false
		},

		previousPage() {
			this.form.page1 = true
		},

		resetPlan() {
			this.form.barcodePicking = null
		},

		resetProducts() {
			this.form.barcodeTransportSlip = null
			this.form.UD27List = null
			this.form.UD27Object = null
			this.form.selectedProduct = null
			this.form.tmpselectedProduct = null
			this.form.carPlate = null
			this.form.WH = null
			this.form.Bin = null
			this.form.productName = null
			this.form.lotNumber = null
			this.form.sendQty = null
			this.form.sendUnit = null
			this.form.recieveQty = null
			this.form.recieveUnit = null
			this.form.remark = null
			this.form.page1 = true
			this.form.products = []
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
