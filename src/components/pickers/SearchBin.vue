<template lang="pug">
v-dialog(v-model="dialog" persistent content-class="rounded-lg" max-width="540px")
        v-card(rounded="lg")
                v-card-title
                        .text-subtitle-1 Search bin
                        v-spacer
                        v-btn(icon @click="close")
                                v-icon {{ mdiClose }}
                v-simple-table
                        template(v-slot:default)
                                thead
                                        tr
                                                th.text-center Bin
                                                th.text-center Name
                                tbody
                                        tr(v-for="item in items" @click="handleRowClick(item)")
                                                td.text-center {{ item.WhseBin_BinNum }}
                                                td.text-center {{ item.WhseBin_Description }}
</template>

<script>
import { mdiClose } from "@mdi/js"

export default {
	props: ["items"],
	data: () => ({
		dialog: true,
		mdiClose: mdiClose,
	}),
	methods: {
		close() {
			this.$emit("closed")
		},

		handleRowClick(item) {
			this.$emit("select", item)
		},
	},
}
</script>
