<template>
  <div class="container">
    <div class="login-container">
      <el-form
        :model="loginForm"
        status-icon
        :rules="validationRules"
        ref="loginFormRef"
        label-width="100px"
        class="form-style"
      >
        <h2>登录</h2>
        <!-- 输入用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="loginForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 输入密码 -->
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 输入验证码 -->
        <el-form-item label="验证码" prop="captcha">
          <el-input type="text" v-model="loginForm.captcha" autocomplete="off">
            <template slot="append">
              <!-- 验证码图片，点击刷新 -->
              <div v-html="captchaImage" @click="fetchCaptcha"></div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <!-- 登录按钮与重置表单按钮 -->
          <el-button class="btn" type="success" @click="handleLogin('loginFormRef')">登录</el-button>
          <el-button class="btn" type="info" @click="handleReset('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 验证用户名是否为空
    const validateUsername = (rule, value, callback) => {
      if (!value) return callback(new Error("用户名不能为空"));
      callback();
    };

    // 验证密码是否为空
    const validatePassword = (rule, value, callback) => {
      if (!value) return callback(new Error("密码不能为空"));
      callback();
    };

    // 验证验证码是否正确
    const validateCaptcha = (rule, value, callback) => {
      if (value !== this.captchaAnswer)
        return callback(new Error("验证码错误"));
      callback();
    };

    return {
      captchaAnswer: "", // 存储验证码答案
      captchaImage: "", // 存储验证码图片
      loginForm: {
        username: "", // 用户名
        password: "", // 密码
        captcha: "" // 验证码
      },
      validationRules: {
        username: [{ validator: validateUsername, trigger: "blur" }], // 用户名校验规则
        password: [{ validator: validatePassword, trigger: "blur" }], // 密码校验规则
        captcha: [{ validator: validateCaptcha, trigger: "blur" }] // 验证码校验规则
      }
    };
  },
  methods: {
    // 处理登录逻辑
    handleLogin(formRef) {
      // 校验表单
      this.$refs[formRef].validate(valid => {
        if (valid) {
          // 获取用户名和密码
          const { username, password } = this.loginForm;
          // 发送登录请求
          this.$http
            .post("/users/backend/login", { username, password })
            .then(({ data: { code } }) => {
              if (code === 1) {
                // 登录成功，跳转到主页
                this.$router.push("/index");
              } else {
                // 登录失败，显示错误提示
                alert("用户名或密码错误");
              }
            });
        } else {
          console.log("表单验证失败");
        }
      });
    },
    // 重置表单
    handleReset(formRef) {
      this.$refs[formRef].resetFields(); // 重置表单字段
      this.fetchCaptcha(); // 刷新验证码
    },
    // 获取验证码
    fetchCaptcha() {
      this.$http.get("/users/backend/code").then(({ data: { code, data } }) => {
        if (code !== 1) return alert("获取验证码失败");
        this.captchaAnswer = data.text; // 设置验证码答案
        this.captchaImage = data.data; // 设置验证码图片
        console.log(data.text); // 输出验证码答案（用于调试）
      });
    }
  },
  created() {
    this.fetchCaptcha(); // 页面创建时获取一次验证码
  }
};
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-color: #ffc0cb;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  width: 450px;

  border-radius: 8px;
}

.form-style {
    padding: 45px 35px;
  background-color: #ffffff;
  border: 1px solid #00aaff;
  border-radius: 8px;

}

.btn {
  width: 46%;
  margin: 5px;
}
</style>
