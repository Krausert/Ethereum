<template>
    <div class="carousel-container">
        <el-row :gutter="20">
            <!-- 循环渲染轮播图 -->
            <el-col :span="8" v-for="(item, index) in carouselList" :key="index" class="carousel-item">
                <el-card :body-style="{ padding: '0px' }">
                    <!-- 轮播图线上地址 -->
                    <img :src="`${baseURL}/${item.name}`" class="carousel-image">
                    <!-- 删除按钮 -->
                    <div class="button-container">
                        <el-button class="delete-button" size="mini" type="danger" @click="handleDelete(item.id)">删除</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            carouselList: [], // 轮播图列表
            baseURL: this.$http.defaults.baseURL // 基础URL
        };
    },
    methods: {
        // 删除轮播图
        handleDelete(imageId) {
            if (!confirm('确定删除该轮播图吗？')) return;

            const adminId = this.$store.state.uid;
            const adminToken = this.$store.state.token;

            this.$http.post('/carousel/backend/remove', { id: adminId, imgId: imageId }, { headers: { authorization: adminToken } })
                .then(({ data: { code } }) => {
                    if (code !== 1) {
                        return this.$message.error('删除失败！');
                    }
                    this.carouselList = this.carouselList.filter(item => item.id !== imageId);
                    this.$message.success('删除成功！');
                });
        }
    },
    created() {
        // 初始化获取轮播图列表
        this.$http.get('/carousel/list')
            .then(({ data: { code, list } }) => {
                if (code !== 1) {
                    return this.$message.error('获取轮播图列表失败');
                }
                this.carouselList = list;
            });
    }
};
</script>

<style scoped>
.carousel-container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.carousel-item {
    margin-bottom: 20px;
}

.carousel-image {
    width: 100%;
    height: 213px;
    object-fit: cover;
    display: block;
    border-radius: 4px 4px 0 0;
}

.button-container {
    text-align: center;
    padding: 10px;
    background-color: #fff;
    border-radius: 0 0 4px 4px;
}

.delete-button {
    margin-top: 5px;
    margin-bottom: 5px;
}
</style>
