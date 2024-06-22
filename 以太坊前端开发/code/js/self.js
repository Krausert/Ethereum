// 从 utils 文件夹中的 ajax.js 文件导入 ajax 请求模块并重命名为 request，同时导入 isLogin 方法并重命名为 checkLogin
import { ajax as request, isLogin as checkLogin } from '../utils/ajax.js';  
import '../lib/jquery.js';  // 导入 jQuery 库
import { nickTest as validateNickname, sexTest as validateGender, ageTest as validateAge } from '../utils/reg.js';  // 导入昵称、性别、年龄的正则校验并重命名

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

    // 渲染用户数据到表单
    $('.username').val(user.username);  // 设置用户名
    $('.age').val(user.age);  // 设置年龄
    $('.gender').val(user.gender);  // 设置性别
    $('.nickname').val(user.nickname);  // 设置昵称

    // 表单提交事件处理
    $('form').on('submit', async function(event) {
        // 阻止默认行为
        event.preventDefault();

        // 获取输入的数据
        const age = $('.age').val();
        const gender = $('.gender').val();
        const nickname = $('.nickname').val();

        // 检查输入是否为空
        if (!age) {
            alert('年龄不能为空');  // 提示年龄不能为空
            return;
        }
        if (!gender) {
            alert('性别不能为空');  // 提示性别不能为空
            return;
        }
        if (!nickname) {
            alert('昵称不能为空');  // 提示昵称不能为空
            return;
        }

        // 验证输入格式
        if (!validateAge(age)) {
            alert('年龄格式错误');  // 提示年龄格式错误
            return;
        }
        if (!validateGender(gender)) {
            alert('性别格式错误');  // 提示性别格式错误
            return;
        }
        if (!validateNickname(nickname)) {
            alert('昵称格式错误');  // 提示昵称格式错误
            return;
        }

        try {
            // 发送更新用户信息请求
            const response = await request.post('/users/update', {
                id: user.id,
                age: age,
                gender: gender,
                nickname: nickname
            }, {
                headers: { authorization: token }  // 设置请求头中的认证 token
            });

            const code = response.data.code;

            if (code !== 1) {
                alert('修改失败');  // 提示修改失败
                return;
            }

            alert('修改成功');  // 提示修改成功
        } catch (error) {
            console.error('更新用户信息请求失败:', error.message);  // 在控制台输出错误信息
        }
    });
})();
