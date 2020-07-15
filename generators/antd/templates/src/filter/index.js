import Vue from 'vue'
import moment from 'moment'

export const YYYY_MM_DD = _ => moment(_).format('YYYY-MM-DD')
Vue.filter('YYYY_MM_DD', YYYY_MM_DD)

export const YYYY_MM_DD_HH_MM = _ => moment(_).format('YYYY-MM-DD HH:mm')
Vue.filter('YYYY_MM_DD_HH_MM', YYYY_MM_DD_HH_MM)

export const YYYY_MM_DD_HH_MM_SS = _ => moment(_).format('YYYY-MM-DD HH:mm:ss')
Vue.filter('YYYY_MM_DD_HH_MM_SS', YYYY_MM_DD_HH_MM_SS)

export const HH_MM_SS = _ => moment(_).format('HH:mm:ss')
Vue.filter('HH_MM_SS', HH_MM_SS)
