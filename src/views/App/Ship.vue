<template lang="pug">
v-container
    v-row
        v-col(cols="12")
            .text-caption.white--text วันที่ส่งสินค้า:
            v-text-field(type="text" :prepend-inner-icon="mdiCalendarMonthOutline" solo flat hide-details clearable)
        v-col(cols="12")
            .text-caption.white--text บาร์โค๊ดใบเบิก:
            v-text-field(type="text" :prepend-inner-icon="mdiTextBoxOutline" :append-icon="mdiBarcodeScan" solo flat hide-details clearable)
        v-col(cols="12")
            v-row(dense)
                v-col(cols="4")
                    .text-caption.white--text SO:
                    v-text-field(type="text" solo flat hide-details readonly)
                v-col(cols="4")
                    .text-caption.white--text Line:
                    v-text-field(type="text" solo flat hide-details readonly)
                v-col(cols="4")
                    .text-caption.white--text Rel:
                    v-text-field(type="text" solo flat hide-details readonly)
        v-col(cols="12")
            v-row(dense)
                v-col(cols="8")
                    .text-caption.white--text สินค้า:
                    v-text-field(type="text" solo flat hide-details readonly)
                v-col(cols="4")
                    .text-caption.white--text จำนวน:
                    v-text-field(type="text" solo flat hide-details readonly)
        v-col(cols="12")
            .text-caption.white--text ชื่อสินค้า:
            v-text-field(type="text" solo flat hide-details readonly)
        v-col(cols="12" sm="8")
            .text-caption.white--text บาร์โค๊ดสินค้า:
            v-text-field(type="text" :append-icon="mdiBarcodeScan" solo flat hide-details clearable)
        v-col(cols="12" sm="4")
            .text-caption.white--text รหัสสินค้า:
            v-text-field(type="text" solo flat hide-details readonly)
        v-col(cols="12")
            .text-caption.white--text รายการ:
            v-sheet(width="100%" color="white").rounded-lg.overflow-hidden
                v-simple-table
                    template(v-slot:default)
                        thead
                            tr
                                th.text-center Line
                                th.text-center Lot
                                th.text-center Qty
                                th.text-center
                        tbody
                            tr
                                td.text-left Example 1
                                td.text-left 0001
                                td.text-right 1
                                td.text-center
                                    v-btn(outlined color="error" small rounded)
                                        v-icon(left) {{ mdiTrashCanOutline }}
                                        span ลบ
        v-col(cols="12")
            v-row
                v-col(cols="6")
                    v-btn(block outlined dark x-large rounded) เริ่มใหม่
                v-col(cols="6")
                    v-btn(block dark depressed color="accent" x-large rounded) ส่งข้อมูล
</template>

<script>
import { mdiCalendarMonthOutline, mdiBarcodeScan, mdiTextBoxOutline, mdiTrashCanOutline } from "@mdi/js"

export default {
	data: () => ({
		mdiCalendarMonthOutline: mdiCalendarMonthOutline,
		mdiTextBoxOutline: mdiTextBoxOutline,
		mdiBarcodeScan: mdiBarcodeScan,
		mdiTrashCanOutline: mdiTrashCanOutline,
	}),
	computed: {},
}
</script>
