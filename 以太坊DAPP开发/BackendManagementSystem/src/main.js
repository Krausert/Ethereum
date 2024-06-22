import Vue from 'vue';
import App from './App.vue';
// 导入路由
import router from './router';
// 导入 Element UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入 axios
import axios from '@/http';
// 导入 Vuex store
import store from './store';

// 配置 axios 响应拦截器
axios.interceptors.response.use(response => {
	const data = response.data;
	if (data) {
		// 如果响应数据中包含 token，更新 Vuex 中的 token
		if (data.token) {
			store.commit('setToken', data.token);
		}
		// 如果响应数据中包含用户 ID，更新 Vuex 中的用户 ID
		if (data.user && data.user.id) {
			store.commit('setUid', data.user.id);
		}
	}
	return response;
});

// 配置路由守卫，进行权限校验
router.beforeEach((to, from, next) => {
	// 如果目标路径是登录页面，直接放行
	if (to.path === '/login') {
		next();
	} else {
		// 如果不是登录页面，检查是否已登录
		const token = store.state.token;
		const uid = store.state.uid;
		if (token && uid) {
			next(); // 如果已登录，放行
		} else {
			// 如果未登录，重定向到登录页面
			router.push('/login');
		}
	}
});

// 将 axios 和 store 挂载到 Vue 原型上，方便全局使用
Vue.prototype.$http = axios;
Vue.prototype.$store = store;

// 使用 Element UI 插件
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
	router, // 将路由配置注入到 Vue 实例中
	store,  // 将 Vuex store 注入到 Vue 实例中
}).$mount('#app');
