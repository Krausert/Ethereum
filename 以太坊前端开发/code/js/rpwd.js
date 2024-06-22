// 从 utils 文件夹中的 ajax.js 文件导入 ajax 请求模块并重命名为 request，同时导入 isLogin 方法并重命名为 checkLogin
import { ajax as request, isLogin as checkLogin } from '../utils/ajax.js';  
import '../lib/jquery.js';  // 导入 jQuery 库
import { pwdTest as validatePassword } from '../utils/reg.js';  // 导入密码正则校验并重命名为 validatePassword

(async function() {
    // 检查用户是否已登录
    const loginStatus = await checkLogin();  // 获取登录状态
    const status = loginStatus.status;
    const user = loginStatus.user;
    const token = loginStatus.token;

    if (status !== 1) {
        alert('请先登录！');  // 提示用户先登录
        window.location.href = './login.html';  // 跳转到登录页面
        return;
    }

    // 表单提交事件处理
    $('form').on('submit', async function(event) {
        // 阻止默认提交行为
        event.preventDefault();

        // 获取输入的数据
        const oldPassword = $('.oldpassword').val();
        const newPassword = $('.newpassword').val();
        const confirmPassword = $('.rnewpassword').val();

        // 检查输入是否为空
        if (!oldPassword) {
            alert('旧密码不能为空');  // 提示旧密码不能为空
            return;
        }
        if (!newPassword) {
            alert('新密码不能为空');  // 提示新密码不能为空
            return;
        }
        if (!confirmPassword) {
            alert('确认新密码不能为空');  // 提示确认新密码不能为空
            return;
        }

        // 验证新密码格式
        if (!validatePassword(newPassword)) {
            alert('新密码格式错误');  // 提示新密码格式错误
            return;
        }

        // 检查两次输入的新密码是否一致
        if (newPassword !== confirmPassword) {
            alert('两次密码不一致');  // 提示两次密码不一致
            return;
        }

        try {
            // 发送修改密码请求
            const response = await request.post('/users/rpwd', {
                id: user.id,
                oldPassword: oldPassword,
                newPassword: newPassword,
                rNewPassword: confirmPassword
            }, {
                headers: { authorization: token }  // 设置请求头中的认证 token
            });

            const code = response.data.code;

            if (code !== 1) {
                alert('修改失败');  // 提示修改失败
                return;
            }

            // 删除本地存储的 token 和用户 ID
            localStorage.removeItem('token');
            localStorage.removeItem('uid');

            // 提示用户修改成功并跳转到登录页面
            alert('修改成功，点击确定跳转至登录页面');
            window.location.href = './login.html';  // 跳转到登录页面
        } catch (error) {
            console.error('修改密码请求失败:', error.message);  // 在控制台输出错误信息
        }
    });
})();
