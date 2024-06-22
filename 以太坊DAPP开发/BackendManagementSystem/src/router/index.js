import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    // 默认重定向到登录页面
    {
        path: '/',
        redirect: '/login'
    },
    // 登录页面
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/Login')
    },
    // 主页
    {
        path: '/index',
        component: () => import('@/views/Index'),
        children: [
            // 主页内容
            {
                path: '/',
                name: 'index',
                component: () => import('@/components/manager/Home'),
            },
            // 用户列表
            {
                path: 'users',
                component: () => import('@/components/manager/Users'),
            },
            // 轮播图列表
            {
                path: 'carousel',
                component: () => import('@/components/manager/Carousel'),
            },
            // 添加轮播图
            {
                path: 'add-carousel',
                component: () => import('@/components/manager/AddCarousel'),
            },
        ]
    },
    // 404 重定向到登录页面
    {
        path: '/*',
        redirect: '/login'
    }
];

// 解决路由重复点击报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err) => err);
};

// 创建路由实例
const router = new VueRouter({
    mode: 'history', // 使用 HTML5 History 模式
    base: process.env.BASE_URL, // 基础路径
    routes // 路由配置
});

// 导出路由实例
export default router;
