<template>
    <div class="logout-container">
        <!-- 注销按钮 -->
        <el-header class="logout-header">
            <h2 style="color: cornflowerblue;">后台管理系统</h2>
            <el-button @click="handleLogout" class="logout-btn" type="info">注销</el-button>
        </el-header>
    </div>
</template>

<script>
export default {
    methods: {
        // 处理注销逻辑
        handleLogout() {
            // 询问用户是否确定注销
            if (!confirm('确定要注销吗？')) return;

            // 获取用户ID和Token
            const userId = this.$store.state.uid;
            const userToken = this.$store.state.token;

            // 发送注销请求
            this.$http.get('/users/backend/logout', {
                params: { id: userId },
                headers: { authorization: userToken }
            }).then(({ data: { code } }) => {
                // 如果code不等于1，表示注销失败
                if (code !== 1) return alert('注销失败！');

                // 注销成功，清除存储的用户数据
                this.$store.commit('logout');

                // 跳转到登录页面
                this.$router.push('/login');
            });
        }
    }
}
</script>

<style scoped>
.logout-container {
    width: 100%;
    padding: 0 20px;
    background-color: #ffc0cb; /* 粉色背景 */
    text-align: right;
}

.logout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 25px;
    line-height: 55px;
    color: #333;
}

.logout-btn {
    font-size: 20px;
    font-weight: 400;
    color: #fff;
    border: none;
    outline: none;
    cursor: pointer;
    height: 40px;
    /* padding: 10px 20px; */
    border-radius: 5px;
}


</style>
