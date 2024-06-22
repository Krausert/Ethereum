import { ajax as request, isLogin as checkLogin } from '../utils/ajax.js'; // 从 utils 文件夹中的 ajax.js 文件导入 ajax 请求模块并重命名为 request，同时导入 isLogin 方法并重命名为 checkLogin
import '../lib/jquery.js';  // 导入 jQuery 库
import '../lib/layui/layui.js';  // 导入 layui 库

// 自执行异步函数，处理用户登录状态
(async function handleUserLogin() {
    // 检查用户是否已登录
    const { status, user } = await checkLogin();  // 使用 checkLogin 方法检查用户的登录状态
    if (status === 1) {  // 如果用户已登录
        // 切换显示
        $('.off').removeClass('active');  // 隐藏未登录状态元素
        $('.on').addClass('active');  // 显示已登录状态元素

        // 设置用户昵称和个人中心链接
        $('.nickname').text(user.nickname);  // 显示用户昵称
        $('.self').on('click', () => window.location.href = './self.html');  // 为个人中心链接添加点击事件，跳转到 self.html

        // 退出登录
        $('.logout').on('click', async () => {  // 为退出登录按钮添加点击事件
            if (!confirm('确定要退出登录吗？')) return;  // 弹出确认框，用户取消则返回
            
            const userId = localStorage.getItem('uid');  // 从 localStorage 中获取用户 ID
            const authToken = localStorage.getItem('token');  // 从 localStorage 中获取认证 token
            
            try {
                const { data: { code } } = await request.get('/users/logout', {  // 发送 GET 请求以注销用户
                    params: { id: userId },  // 传递用户 ID 作为请求参数
                    headers: { authorization: authToken }  // 设置请求头中的认证 token
                });
                if (code !== 1) throw new Error('注销失败');  // 如果返回的 code 不是 1，抛出错误

                localStorage.removeItem('token');  // 从 localStorage 中移除 token
                localStorage.removeItem('uid');  // 从 localStorage 中移除用户 ID

                // 切换显示
                $('.off').addClass('active');  // 显示未登录状态元素
                $('.on').removeClass('active');  // 隐藏已登录状态元素
            } catch (error) {
                alert(error.message);  // 弹出错误信息
            }
        });
    }
})();

// 渲染轮播图
async function renderCarousel() {
    try {
        const { data: { code, list } } = await request.get('/carousel/list');  // 发送 GET 请求以获取轮播图列表
        if (code !== 1) throw new Error('获取轮播图失败');  // 如果返回的 code 不是 1，抛出错误

        let carouselHtml = list.map(item => `<div><img src="${request.defaults.baseURL}/${item.name}"></div>`).join('');  // 生成轮播图 HTML
        $('#carousel > :first-child').html(carouselHtml);  // 更新页面上的轮播图容器

        // 使用 layui 渲染轮播图
        layui.carousel.render({
            elem: '#carousel',  // 轮播图容器
            width: '1200px',  // 轮播图宽度
            height: '600px',  // 轮播图高度
            arrow: 'hover',  // 设置箭头显示方式
            anim: 'fade'  // 设置动画效果
        });
    } catch (error) {
        console.error(error.message);  // 在控制台输出错误信息
    }
}

renderCarousel();  // 调用 renderCarousel 函数渲染轮播图
