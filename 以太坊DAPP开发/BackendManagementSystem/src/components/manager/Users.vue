<template>
    <div>
        <div>
            <!-- 搜索框，输入时自动搜索 -->
            <el-input class="search-input" v-model="searchQuery" placeholder="搜索用户" clearable @input="handleSearch">
                <template slot="prepend">搜索用户：</template>
            </el-input>
        </div>
        <!-- 表格数据展示 -->
        <el-table :data="filteredUserList" border style="width: 100%">
            <!-- 表格列 -->
            <el-table-column label="用户名" prop="username" align="center"></el-table-column>
            <el-table-column label="年龄" prop="age" align="center"></el-table-column>
            <el-table-column label="性别" prop="gender" align="center"></el-table-column>
            <el-table-column label="昵称" prop="nickname" align="center"></el-table-column>
            <el-table-column label="角色" prop="role" align="center"></el-table-column>
            <el-table-column label="冻结账号" align="center" prop="flag">
                <template slot-scope="scope">
                    <!-- 冻结和解冻按钮 -->
                    <el-button v-if="scope.row.flag" size="mini" type="info" @click="freezeAccount(scope.row.id, scope.row.nickname)">冻结</el-button>
                    <el-button v-else size="mini" type="success" @click="unfreezeAccount(scope.row.id, scope.row.nickname)">解冻</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200px">
                <template slot-scope="scope">
                    <!-- 重置密码和删除按钮 -->
                    <el-button size="mini" type="primary" @click="resetUserPassword(scope.row.id, scope.row.nickname)">重置密码</el-button>
                    <el-button size="mini" type="danger" @click="deleteUserAccount(scope.row.id, scope.row.nickname)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination :page-size="5" :current-page="currentPage" @current-change="handlePageChange"
            layout="total, prev, pager, next, jumper" :total="userList.length">
        </el-pagination>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userList: [], // 用户列表
            searchQuery: '', // 搜索字符串
            currentPage: 1, // 当前页码
        }
    },
    methods: {
        // 切换页码
        handlePageChange(newPage) {
            this.currentPage = newPage;
        },
        // 重置用户密码
        resetUserPassword(userId, nickname) {
            this.$confirm(`确定要重置用户 ${nickname} 的密码吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const { uid: adminId, token } = this.$store.state;

                this.$http.post('/users/backend/reset', { id: adminId, uid: userId }, { headers: { authorization: token } })
                    .then(({ data: { code } }) => {
                        if (code === 1) {
                            this.$message.success('重置密码成功！');
                        } else {
                            this.$message.error('重置密码失败');
                        }
                    });
            }).catch(() => {
                this.$message.info('已取消操作');
            });
        },
        // 删除用户账户
        deleteUserAccount(userId, nickname) {
            this.$confirm(`确定要删除用户 ${nickname} 吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const { uid: adminId, token } = this.$store.state;

                this.$http.post('/users/backend/del', { id: adminId, uid: userId }, { headers: { authorization: token } })
                    .then(({ data: { code } }) => {
                        if (code === 1) {
                            this.userList = this.userList.filter(user => user.id !== userId);
                            this.$message.success('删除成功！');
                        } else {
                            this.$message.error('删除失败！');
                        }
                    });
            }).catch(() => {
                this.$message.info('已取消操作');
            });
        },
        // 冻结用户账户
        freezeAccount(userId, nickname) {
            this.$confirm(`确定要冻结用户 ${nickname} 吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const { uid: adminId, token } = this.$store.state;

                this.$http.post('/users/backend/flag', { id: adminId, uid: userId }, { headers: { authorization: token } })
                    .then(({ data: { code } }) => {
                        if (code === 1) {
                            const user = this.userList.find(user => user.id === userId);
                            user.flag = false;
                            this.$message.success('冻结成功！');
                        } else {
                            this.$message.error('冻结失败！');
                        }
                    });
            }).catch(() => {
                this.$message.info('已取消操作');
            });
        },
        // 解冻用户账户
        unfreezeAccount(userId, nickname) {
            this.$confirm(`确定要解冻用户 ${nickname} 吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const { uid: adminId, token } = this.$store.state;

                this.$http.post('/users/backend/flag', { id: adminId, uid: userId }, { headers: { authorization: token } })
                    .then(({ data: { code } }) => {
                        if (code === 1) {
                            const user = this.userList.find(user => user.id === userId);
                            user.flag = true;
                            this.$message.success('解冻成功！');
                        } else {
                            this.$message.error('解冻失败！');
                        }
                    });
            }).catch(() => {
                this.$message.info('已取消操作');
            });
        },
        // 搜索用户
        handleSearch() {
            const { uid: adminId, token } = this.$store.state;

            this.$http.get('/users/backend/search', { params: { id: adminId, searchStr: this.searchQuery }, headers: { authorization: token } })
                .then(({ data: { code, list } }) => {
                    if (code === 1) {
                        this.userList = list;
                    } else {
                        this.$message.error('搜索失败');
                    }
                });
        }
    },
    computed: {
        // 当前页显示的用户列表
        filteredUserList() {
            const start = (this.currentPage - 1) * 5;
            const end = start + 5;
            return this.userList.slice(start, end);
        }
    },
    created() {
        const { uid: adminId, token } = this.$store.state;

        this.$http.get('/users/backend/list', { params: { id: adminId }, headers: { authorization: token } })
            .then(({ data: { code, list } }) => {
                if (code === 1) {
                    this.userList = list;
                } else {
                    this.$message.error('获取用户信息失败');
                }
            });
    }
}
</script>

<style scoped>
.search-input {
    width: 300px;
    margin-bottom: 20px;
}

.el-button {
    margin: 0 5px;
}

span {
    margin-left: 10px;
}
</style>
