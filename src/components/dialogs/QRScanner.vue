<template lang="pug">
v-dialog(v-model="dialog" persistent content-class="rounded-lg" max-width="540px")
	v-card(rounded="lg")
		v-card-title
			.text-subtitle-1 Scan QR Code
			v-spacer
			v-btn(icon @click="close")
				v-icon {{ mdiClose }}
		v-card-text.pa-0.black
			v-alert(v-if="!!error" outlined type="error" border="left") {{ error }}
			qrcode-stream(v-show="!error" @decode="onDecode" @init="onInit")
</template>

<script>
import { mdiClose } from "@mdi/js"

export default {
	props: ["item"],
	data: () => ({
		dialog: true,
		mdiClose: mdiClose,
		error: null,
	}),
	methods: {
		async onInit(promise) {
			try {
				await promise
			} catch (error) {
				if (error.name === "NotAllowedError") {
					this.error = "ERROR: you need to grant camera access permission"
				} else if (error.name === "NotFoundError") {
					this.error = "ERROR: no camera on this device"
				} else if (error.name === "NotSupportedError") {
					this.error = "ERROR: secure context required (HTTPS, localhost)"
				} else if (error.name === "NotReadableError") {
					this.error = "ERROR: is the camera already in use?"
				} else if (error.name === "OverconstrainedError") {
					this.error = "ERROR: installed cameras are not suitable"
				} else if (error.name === "StreamApiNotSupportedError") {
					this.error = "ERROR: Stream API is not supported in this browser"
				} else if (error.name === "InsecureContextError") {
					this.error = "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP."
				} else {
					this.error = `ERROR: Camera error (${error.name})`
				}
			}
		},
		close() {
			this.$emit("closed")
		},
		onDecode(value) {
			this.$emit("changed", {
				key: this.item,
				value: value,
			})
		},
	},
}
</script>
