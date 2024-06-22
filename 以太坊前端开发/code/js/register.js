import '../lib/jquery.js';  // 导入 jQuery 库
import { ajax as request } from '../utils/ajax.js';  // 从 utils 文件夹中的 ajax.js 文件导入 ajax 请求模块并重命名为 request
import { nameTest as validateUsername, pwdTest as validatePassword, nickTest as validateNickname } from '../utils/reg.js';  // 导入用户名、密码、昵称的正则校验并重命名

// 表单提交事件处理程序
$('form').on('submit', async function(event) {
    // 阻止默认表单提交行为
    event.preventDefault();

    // 获取表单输入值
    const userInput = {
        username: $('.username').val(),  // 获取用户名
        password: $('.password').val(),  // 获取密码
        confirmPassword: $('.rpassword').val(),  // 获取确认密码
        nickname: $('.nickname').val()  // 获取昵称
    };

    // 检查是否有空输入
    if (Object.values(userInput).some(value => value === '')) {
        alert('表单不能为空');  // 弹出提示信息
        return;
    }

    // 验证输入格式
    if (!validateUsername(userInput.username)) {
        alert('用户名格式错误');  // 弹出提示信息
        return;
    }

    if (!validatePassword(userInput.password)) {
        alert('密码格式错误');  // 弹出提示信息
        return;
    }

    if (!validateNickname(userInput.nickname)) {
        alert('昵称格式错误');  // 弹出提示信息
        return;
    }

    if (userInput.password !== userInput.confirmPassword) {
        alert('两次密码不一致');  // 弹出提示信息
        return;
    }

    try {
        // 发送注册请求
        const response = await request.post('/users/register', {
            username: userInput.username,
            password: userInput.password,
            rpassword: userInput.confirmPassword,
            nickname: userInput.nickname
        });

        // 处理注册响应
        if (response.data.code !== 1) {
            $('.error').css('display', 'block');  // 显示错误提示
            return;
        }

        // 注册成功提示并跳转
        alert('注册成功，点击确定跳转到登录页面');
        window.location.href = './login.html';  // 跳转到登录页面
    } catch (error) {
        console.error('注册请求失败:', error.message);  // 在控制台输出错误信息
    }
});
