<template lang="pug">
v-dialog(v-model="dialog" persistent content-class="rounded-lg" max-width="540px")
        v-card(rounded="lg")
                v-card-title
                        .text-subtitle-1 Search warehouse
                        v-spacer
                        v-btn(icon @click="close")
                                v-icon {{ mdiClose }}
                v-simple-table
                        template(v-slot:default)
                                thead
                                        tr
                                                th.text-center W/H
                                                th.text-center Name
                                tbody
                                        tr(v-for="item in items")
                                                td.text-center {{ item.Warehse_WarehouseCode }}
                                                td.text-center {{ item.Warehse_Company }}
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
	},
}
</script>
