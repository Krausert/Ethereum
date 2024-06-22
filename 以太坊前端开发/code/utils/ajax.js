import axios from '../lib/axios.js';


axios.defaults.baseURL = 'http://localhost:9000';
const request = axios;

// 是否登录
async function checkLogin() {
    // 获取本地存储的 token 和用户 ID
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('uid');

    // 如果 token 或用户 ID 为空，返回未登录状态
    if (!token || !userId) {
        return { status: 0, message: '未登录' };
    }

    try {
        // 使用 token 和用户 ID 请求用户信息
        const response = await request.get('/users/info', {
            params: { id: userId },
            headers: { authorization: token }
        });

        const code = response.data.code;
        const user = response.data.user;

        // 如果请求失败，返回未登录状态
        if (code !== 1) {
            return { status: 0, message: '未登录' };
        }

        // 请求成功，返回已登录状态和用户信息
        return { status: 1, message: '已登录', user: user, token: token };
    } catch (error) {
        // 请求异常，返回未登录状态
        console.error('获取用户信息失败:', error.message);
        return { status: 0, message: '未登录' };
    }
}

// 导出模块
export { request as ajax, checkLogin as isLogin };
