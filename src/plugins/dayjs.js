import Vue from "vue"
import dayjs from "dayjs"
import buddhistEra from "dayjs/plugin/buddhistEra"
import "dayjs/locale/th"

dayjs.extend(buddhistEra)
dayjs.locale("th")

Vue.prototype.$dayjs = dayjs

export default dayjs
