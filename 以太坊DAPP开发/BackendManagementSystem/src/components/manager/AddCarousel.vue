<template>
    <div class="upload-container">
        <el-upload
            class="upload-demo"
            :action="''"
            :before-upload="beforeUpload"
            :on-change="handleChange"
            :auto-upload="false"
            :limit="1"
        >
            <el-button type="primary">选择图片</el-button>
        </el-upload>
        <div class="image-preview" v-if="dialogImageUrl">
            <el-image
                style="width: 100px; height: 100px"
                :src="dialogImageUrl"
                fit="cover"
            ></el-image>
        </div>
        <div class="btnBox">
            <el-button type="primary" @click="handleUpload">添加轮播图</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogImageUrl: '', // 预览图片的URL
            fileList: [], // 已选择文件列表
            file: null, // 当前选择的文件
        };
    },
    methods: {
        // 上传前检查文件
        beforeUpload(file) {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                this.$message.error('上传的文件必须是图片');
            }
            return isImage;
        },
        // 处理文件选择
        handleChange(file, fileList) {
            this.file = file.raw;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.dialogImageUrl = e.target.result;
            };
            reader.readAsDataURL(this.file);
            this.fileList = fileList;
        },
        // 处理上传事件
        handleUpload() {
            if (!this.file) {
                return this.$message.warning('还未上传图片');
            }

            // 获取管理员ID和Token
            const adminId = this.$store.state.uid;
            const adminToken = this.$store.state.token;

            // 创建表单数据对象，添加管理员ID和图片文件
            const formData = new FormData();
            formData.append('id', adminId);
            formData.append('carousel', this.file);

            // 发送请求添加轮播图
            this.$http.post('/carousel/backend/add', formData, {
                headers: { authorization: adminToken }
            }).then(({ data: { code } }) => {
                if (code !== 1) {
                    return this.$message.error('添加失败！');
                }
                this.$message.success('添加成功！');
                this.fileList = []; // 清空已选择文件列表
                this.file = null; // 重置文件
                this.dialogImageUrl = ''; // 清空预览图片
            });
        }
    }
}
</script>

<style scoped>
.upload-container {
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.image-preview {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.btnBox {
    margin-top: 20px;
}
</style>
