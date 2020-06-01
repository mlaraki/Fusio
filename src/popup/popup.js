import Vue from 'vue'
import App from './App'
import store from '../store'
import 'element-theme-dark';
import {
	RadioGroup,
	RadioButton,
	Avatar,
	Collapse,
	CollapseItem
} from 'element-ui'

Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Avatar)
Vue.use(Collapse)
Vue.use(CollapseItem)
/* eslint-disable no-new */
new Vue({
	el: '#popup',
	store,
	beforeCreate() {
		this.$store.commit('initialiseStore');
	},
	render: h => h(App)
})