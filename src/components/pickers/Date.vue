<template lang="pug">
v-dialog(ref="dialog" v-model="modal" :return-value.sync="date" persistent :width="$vuetify.breakpoint.smAndUp ? `450px` : `290px`")
    template(v-slot:activator="{ on, attrs }")
        v-text-field(:value="formattedDate" readonly v-bind="{attrs,...option}" v-on="on")
    v-sheet(width="100%").rounded-xl.overflow-hidden
        v-date-picker(v-model="date" scrollable flat full-width :landscape="$vuetify.breakpoint.smAndUp")
            v-btn(text color="primary" @click="modal = false" rounded min-width="120px") ยกเลิก
            v-spacer
            v-btn(dark depressed color="primary" @click="$refs.dialog.save(date)" rounded min-width="120px") เลือก
</template>

<script>
import dayjs from "@/plugins/dayjs"

export default {
	props: ["model", "option"],
	data: () => ({
		date: null,
		modal: false,
	}),
	computed: {
		formattedDate() {
			return !!this.date ? dayjs(this.date, "YYYY-MM-DD").format("วันddddที่ D MMMM พ.ศ.BBBB") : "ไม่ระบุวันที่"
		},
	},
	methods: {
		setDefaultValue() {
			if (!!this.model) this.date = this.model
		},
	},
	mounted() {
		this.setDefaultValue()
	},
	watch: {
		date(value) {
			this.$emit("update:model", value)
		},
	},
}
</script>
