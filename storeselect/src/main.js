// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import {Toast} from 'tpo/src/index'
import App from './App';
import router from './router';
import 'tpo/lib/index.css';
import ajax from "../../utils/axios";
import 'es6-promise/auto';
// Vue.use(Tpo);
import 'es6-promise/auto'
Vue.$Toast = Vue.prototype.$Toast = Toast
// Vue.component(Tpo.SwiperSlide.name, Tpo.SwiperSlide);
/* eslint-disable no-new */
new Vue({
		el: '#app',
		router,
		template: '<App/>',
		components: { App }
	})

