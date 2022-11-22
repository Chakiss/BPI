<template lang="pug">
v-container
    v-row
        v-col(v-for="(item,index) in mainMenuItems" :key="index" cols="12" sm="6" md="3")
            v-card(rounded="lg" :disabled="item.disabled" exact :to="item.option")
                v-btn(:color="item.disabled ? `grey` : `success`" dark absolute top right depressed x-small) {{ item.disabled ? `ไม่พร้อมใช้งาน` : `พร้อมใช้งาน` }}
                v-card-text
                    .text-center
                        v-icon(size="48") {{ item.icon }}
                v-card-actions
                    v-spacer
                    .text-body-2 {{ item.title }}
                    v-spacer
</template>

<script>
export default {
	data: () => ({}),
	computed: {
		mainMenuItems() {
			return this.$store.getters["mainMenuItems"] || []
		},
	},
}
</script>
