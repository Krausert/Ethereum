import '../lib/jquery.js';  // 导入 jQuery 库
import { ajax as request } from '../utils/ajax.js';  // 从 utils 文件夹中的 ajax.js 文件导入 ajax 请求模块并重命名为 request
// 导入用户名与密码正则校验
import { nameTest, pwdTest } from '../utils/reg.js';

// 当表单提交时触发事件
$('form').on('submit', async function(event) {
    // 阻止默认提交行为
    event.preventDefault();

    // 获取表单输入的用户名和密码
    const username = $('.username').val();
    const password = $('.password').val();

    // 检查用户名和密码是否为空
    if (username === '' || password === '') {
        alert('表单不能为空');  // 弹出提示信息
        return;
    }

    // 验证用户名格式
    if (!nameTest(username)) {
        alert('用户名格式错误');  // 弹出提示信息
        return;
    }

    // 验证密码格式
    if (!pwdTest(password)) {
        alert('密码格式错误');  // 弹出提示信息
        return;
    }

    try {
        // 发送登录请求
        const response = await request.post('/users/login', { username: username, password: password });
        const { code, message, token, user } = response.data;

        // 登录失败处理
        if (code !== 1) {
            if (message === '用户名或密码错误') {
                $('.error').css('display', 'block');  // 显示错误提示
            } else {
                alert(message);  // 弹出其他错误信息
            }
            return;
        }

        // 登录成功，保存 token 和用户 ID
        localStorage.setItem('token', token);
        localStorage.setItem('uid', user.id);

        // 跳转到主页
        window.location.href = './index.html';
    } catch (error) {
        console.error('登录请求失败:', error.message);  // 在控制台输出错误信息
    }
});
