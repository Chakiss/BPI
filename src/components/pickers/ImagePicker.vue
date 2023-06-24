<template>
	<div>
		<ImageUploadResize :resize-options="{ width: 500, height: 500 }" :input-id="'my-file-input'" @uploaded="onImageUploaded" />
		<input type="file" id="my-file-input" style="display: none" />
	</div>
</template>

<script>
import { mdiClose } from "@mdi/js"

export default {
	props: {
		resizeOptions: {
			type: Object,
			default: () => ({}),
		},
		inputId: {
			type: String,
			default: "file-input",
		},
	},
	methods: {
		onImageUploaded(url) {
			// Handle the uploaded image URL here
		},
	},
}
</script>
