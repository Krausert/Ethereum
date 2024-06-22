// 基础柯里化正则校验函数
function createRegTest(reg) {
    return function(value) {
        return reg.test(value);
    };
}

// 用户名校验：以小写字母或数字开头，后面跟 3-11 个数字、字母或下划线
const validateUsername = createRegTest(/^[a-z0-9]\w{3,11}$/);

// 密码校验：6-12 个数字、字母或下划线
const validatePassword = createRegTest(/\w{6,12}/);

// 昵称校验：2-5 个汉字
const validateNickname = createRegTest(/^[\u4e00-\u9fa5]{2,5}$/);

// 年龄校验：1-120 之间的整数
const validateAge = createRegTest(/^([1-9]\d?|1[01]\d|120)$/);

// 性别校验：男或女
const validateGender = createRegTest(/^(男|女)$/);

// 导出校验函数
export { 
    validateUsername as nameTest, 
    validatePassword as pwdTest, 
    validateNickname as nickTest, 
    validateAge as ageTest, 
    validateGender as sexTest 
};
