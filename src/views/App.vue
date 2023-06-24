<template lang="pug">
v-main(app).primary
    //- Bar
    v-app-bar(dark flat tile app height="70px" color="primary darken-1")
        v-btn(:icon="$vuetify.breakpoint.xsOnly" :outlined="$vuetify.breakpoint.smAndUp" rounded @click="openMenu()")
            v-icon(:left="$vuetify.breakpoint.smAndUp") {{ mdiDotsGrid }}
            span(v-if="$vuetify.breakpoint.smAndUp") เมนูหลัก
        v-spacer
        .text-body-1.font-weight-bold Adeptus Thai Co., Ltd.
        v-spacer
        v-btn(:icon="$vuetify.breakpoint.xsOnly" :outlined="$vuetify.breakpoint.smAndUp" rounded @click="reset()")
            span(v-if="$vuetify.breakpoint.smAndUp") Log out
            v-icon(:right="$vuetify.breakpoint.smAndUp") {{ mdiHomeExportOutline }}
    //- Menu
    v-bottom-sheet(v-model="mainMenuVisibility" :inset="$vuetify.breakpoint.smAndUp" content-class="rounded-t-xl overflow-hidden" :max-width="$vuetify.breakpoint.smAndUp ? `450px` : `100%`")
        v-list
            v-subheader เมนูหลัก
            v-list-item(v-for="(item,index) in mainMenuItems" :key="index" :disabled="item.disabled" exact :to="item.option")
                v-list-item-icon(size="24")
                    v-icon {{ item.icon || null }}
                v-list-item-title {{ item.title }}
                v-list-item-icon(size="14")
                    v-icon {{ mdiChevronRight }}
    //- Vuew
    v-fade-transition(hide-on-leave)
        router-view
</template>

<script>
import { mdiHomeExportOutline, mdiDotsGrid, mdiChevronRight } from "@mdi/js"

export default {
	data: () => ({
		mdiHomeExportOutline: mdiHomeExportOutline,
		mdiDotsGrid: mdiDotsGrid,
		mainMenuVisibility: false,
		mdiChevronRight: mdiChevronRight,
	}),
	computed: {
		mainMenuItems() {
			return this.$store.getters["mainMenuItems"] || []
		},
	},
	methods: {
		openMenu() {
			this.mainMenuVisibility = true
		},
		reset() {
			this.$store.dispatch("index/clear")
			this.$store.dispatch("auth/reset")
			this.$store.dispatch("company/clear")
			this.$router.push({ name: "home" })
		},
	},
}
</script>
