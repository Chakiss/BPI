<template lang="pug">
v-app
    v-app-bar(app flat tile color="grey" dark hight="40px")
        v-spacer
        .text-h6.font-weight-bold POS
        v-spacer
    v-main(app).grey.lighten-2
        AppForm
    v-footer(app height="35px" color="grey lighten-2")
        .text-caption.text--secondary Copyright&copy;{{ new Date().getFullYear() }}
        v-spacer
        .text-caption.text--secondary Powered by Wongsakorn
</template>

<script>
import AppForm from "@/components/AppForm.vue"

export default {
	components: { AppForm },
}
</script>
