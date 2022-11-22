<template lang="pug">
v-main(app).primary
    v-container.fill-height
        v-row(no-gutters justify="center")
            v-col(cols="11" sm="6" md="5" lg="4" xl="3")
                v-row
                    v-col(cols="12").text-center
                        v-avatar(color="primary lighten-2" size="80")
                    v-col(cols="12").text-center
                        .text-h6.white--text
                            span.font-weight-bold สวัสดี
                            span , ระบุข้อมูลเพื่อดำเนินการต่อ
                    v-col(cols="12")
                        v-row(dense)
                            v-col(cols="12")
                                v-select(v-model="selectedCompanyID" placeholder="เลือกบริษัท" :items="companies" item-value="id" item-text="title" :prepend-inner-icon="mdiDomain" solo flat hide-details clearable)
                            v-col(cols="12")
                                v-select(v-model="selectedCompanySiteID" placeholder="เลือกไซต์" :items="companySites" item-value="id" item-text="title" :prepend-inner-icon="mdiNetworkOutline" solo flat hide-details clearable)
                            v-col(cols="12")
                                v-text-field(type="text" placeholder="ระบุชื่อผู้ใช้" :prepend-inner-icon="mdiAccountOutline" solo flat hide-details)
                        v-slide-y-transition
                            .text-center.my-5(v-if="isSubmitable")
                                v-btn(x-large color="accent" depressed rounded dark min-width="250px" @click="doContinue()") ดำเนินการต่อ
                    v-col(cols="12").text-center
                        .text-caption.white--text Copyright&copy; Adeptus Thai Co., Ltd.
</template>

<script>
import { mdiAccountOutline, mdiDomain, mdiNetworkOutline } from "@mdi/js"

export default {
	data: () => ({
		mdiAccountOutline: mdiAccountOutline,
		mdiDomain: mdiDomain,
		mdiNetworkOutline: mdiNetworkOutline,
	}),
	computed: {
		companies() {
			return this.$store.getters["company/companies"] || []
		},
		companySites() {
			return this.$store.getters["company/companySites"] || []
		},
		selectedCompanyID: {
			get() {
				return this.$store.getters["company/selectedCompanyID"]
			},
			set(value) {
				this.$store.dispatch("company/setSelectedCompanyID", value)
			},
		},
		selectedCompanySiteID: {
			get() {
				return this.$store.getters["company/selectedCompanySiteID"]
			},
			set(value) {
				this.$store.dispatch("company/setSelectedCompanySiteID", value)
			},
		},
		isSubmitable() {
			return !!this.selectedCompanyID && !!this.selectedCompanySiteID
		},
	},
	methods: {
		doContinue() {
			this.$router.push({ name: "app" })
		},
	},
}
</script>
