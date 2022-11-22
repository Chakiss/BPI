<template lang="pug">
v-app
    LoaderOverlay
    router-view
</template>

<script>
import LoaderOverlay from "@/components/Loader.vue"

export default {
	components: { LoaderOverlay },
}
</script>
