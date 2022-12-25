<template lang="pug">
v-dialog(v-model="modal" content-class="rounded-xl" scrollable max-width="690px" max-height="90vh")
    template(v-slot:activator="{ on, attrs }")
        v-text-field(:value="decodedString" placeholder="กดเพื่อแสกนคิวอาร์โค๊ด" readonly v-bind="{attrs,...option}" v-on="on")
    v-card(rounded="xl" dark)
        v-card-title
            v-spacer
            | แสกนคิวอาร์โค๊ด
            v-spacer
        v-card-text.px-0
            QrcodeStream(v-if="modal" :camera="camera" @decode="onDecode" @init="onInit")
        v-card-actions
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader"

export default {
	props: ["model", "option"],
	components: {
		QrcodeStream,
		QrcodeDropZone,
		QrcodeCapture,
	},
	data: () => ({
		modal: false,
		decodedString: null,
		camera: "auto",
		showScanConfirmation: false,
	}),
	methods: {
		async onInit(promise) {
			try {
				await promise
			} catch (error) {
				alert(error.message)
			} finally {
				this.showScanConfirmation = this.camera === "off"
			}
		},
		async onDecode(decodedString) {
			try {
				if (!!decodedString) {
					this.decodedString = decodedString

					this.pause()
					await this.timeout(500)
					this.unpause()

					this.modal = false

					this.$emit("scanned", this.decodedString)
				}
			} catch (error) {
				alert(error.message)
			}
		},
		unpause() {
			this.camera = "auto"
		},

		pause() {
			this.camera = "off"
		},

		timeout(ms) {
			return new Promise((resolve) => {
				window.setTimeout(resolve, ms)
			})
		},
	},
	watch: {
		model(value) {
			this.decodedString = value
		},
		decodedString(value) {
			this.$emit("update:model", value)
		},
	},
}
</script>
