import Vue from 'vue';
import App from './App';
import store from '../store/index'
import ElementUI from 'element-ui';
import 'element-theme-dark';
import KonamiCode from "vue-konami-code";

Vue.use(ElementUI);

Vue.prototype.$window = window;
Vue.use(KonamiCode, { callback: () => store.dispatch('set42') })

new Vue({
	el: '#app',
	store,
	beforeCreate() {
		this.$store.commit('initialiseStore');
	},
	mounted(){
		document.getElementById("searchBar-input").focus();
	},
	render: h => h(App)
});

