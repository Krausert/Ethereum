<template>
    <el-row class="tac">
        <el-col :span="24">
            <el-menu :default-active="currentPage" class="el-menu-vertical-demo">
                <!-- 主页 -->
                <el-menu-item index="1" @click="navigateTo('home')">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">主页</span>
                </el-menu-item>
                <!-- 用户管理 -->
                <el-menu-item index="2" @click="navigateTo('users')">
                    <i class="el-icon-user-solid"></i>
                    <span slot="title">用户管理</span>
                </el-menu-item>
                <!-- 轮播图列表 -->
                <el-menu-item index="3" @click="navigateTo('carousel')">
                    <i class="el-icon-picture"></i>
                    <span slot="title">轮播图管理</span>
                </el-menu-item>
                <!-- 添加轮播图 -->
                <el-menu-item index="4" @click="navigateTo('addCarousel')">
                    <i class="el-icon-circle-plus-outline"></i>
                    <span slot="title">添加轮播图</span>
                </el-menu-item>
            </el-menu>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            currentPage: '1', // 当前所在页面的索引
        };
    },
    methods: {
        // 导航到指定页面
        navigateTo(page) {
            switch (page) {
                case 'home':
                    this.$router.push('/index/');
                    break;
                case 'users':
                    this.$router.push('/index/users');
                    break;
                case 'carousel':
                    this.$router.push('/index/carousel');
                    break;
                case 'addCarousel':
                    this.$router.push('/index/add-carousel');
                    break;
            }
        }
    },
    created() {
        // 初始化时设置当前页面的索引，以便在刷新后仍能保持正确的菜单高亮
        const path = this.$route.path;
        if (path.includes('/users')) this.currentPage = '2';
        else if (path.includes('/carousel')) this.currentPage = '3';
        else if (path.includes('/add-carousel')) this.currentPage = '4';
        else this.currentPage = '1';
    }
}
</script>
