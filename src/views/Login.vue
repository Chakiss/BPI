<template lang="pug">
v-main(app).primary
    v-container.fill-height
        v-row(no-gutters justify="center")
            v-col(cols="11" sm="6" md="5" lg="4" xl="3")
                v-row
                    v-col(cols="12").text-center
                        .text-h6.white--text
                            span.font-weight-bold สวัสดี
                            span , กรุณาเข้าสู่ระบบ
                    v-col(cols="12")
                        v-row(dense)
                            v-col(cols="12")
                                v-text-field(v-model="username" type="text" placeholder="ระบุชื่อผู้ใช้งาน" solo flat hide-details clearable)
                            v-col(cols="12")
                                v-text-field(v-model="password" type="password" placeholder="ระบุรหัสผ่าน" solo flat hide-details clearable)
                            v-col(cols="12").text-center
                                v-btn(x-large color="accent" depressed rounded dark min-width="250px" @click="login()") เข้าสู่ระบบ
                    v-col(cols="12").text-center
                        .text-caption.white--text Copyright&copy; Adeptus Thai Co., Ltd.
</template>

<script>
export default {
	data: () => ({
		username: null, //"Dev01"
		password: null, //"9IJN0okm"
	}),
	computed: {},
	methods: {
		async login() {
			try {
				await this.$store.dispatch("auth/login", {
					username: this.username,
					password: this.password,
				})
				await this.$store.dispatch("company/getCompanies")
				this.$router.go()
			} catch (error) {
				await this.$store.dispatch("auth/reset")
				console.error(error)
				alert("ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบข้อมูลสำหรับเข้าระบบ")
			}
		},
	},
}
</script>
