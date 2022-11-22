<template lang="pug">
v-overlay(:value="visibility" :light="false" :dark="true" color="primary" opacity="0.95" z-index="99999")
    v-progress-circular(indeterminate color="white" :size="80" width="3")
</template>

<script>
export default {
	computed: {
		visibility() {
			return this.$store.getters["loader"] || false
		},
	},
}
</script>
