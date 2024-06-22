<template>
    <el-container>
        <el-header>
            <!-- 头部顶栏 -->
            <top-header></top-header>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px">
                <left-menu></left-menu>
            </el-aside>
            <!-- 主体 -->
            <el-main>
                <!-- 子路由 显示的内容 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import LeftMenu from "@/components/LeftMenu";
import TopHeader from "@/components/TopHeader";

export default {
    components: {
        LeftMenu,
        TopHeader,
    },
};
</script>