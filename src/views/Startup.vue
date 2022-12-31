<template lang="pug">
v-main(app).primary
    v-container.fill-height
        v-row(no-gutters justify="center")
            v-col(cols="11" sm="6" md="5" lg="4" xl="3").text-center
                .text-body-2.white--text Adeptus Thai Co., Ltd.
                .text-h1.white--text.mt-3.mb-8 ยินดีต้อนรับ
                v-btn(x-large color="accent" depressed rounded dark min-width="250px" :to="{name:'auth'}") เริ่มใช้งาน
</template>

<script>
import { mdiAccountOutline, mdiDomain, mdiNetworkOutline } from "@mdi/js"

export default {
	data: () => ({
		mdiAccountOutline: mdiAccountOutline,
		mdiDomain: mdiDomain,
		mdiNetworkOutline: mdiNetworkOutline,
	}),
}
</script>
