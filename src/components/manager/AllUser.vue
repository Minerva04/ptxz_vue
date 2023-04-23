<template>
    <div class="table-container">

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>所有用户</el-breadcrumb-item>
        </el-breadcrumb>


        <el-input placeholder="输入用户邮箱" v-model="queryInfo.name" style="width: 200px; "></el-input>
        <el-select v-model="queryInfo.status" placeholder="用户状态" style="width: 200px; margin-left: 20px;">
            <el-option label="所有用户" value=''></el-option>
            <el-option label="正常用户" value="0"></el-option>
            <el-option label="封禁用户" value="1"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" circle @click="search" style="margin-left: 20px;"></el-button>

        <el-card style="margin-top: -20px;">
            <el-table :data="allUserList" stripe style="width: 100%">
                <el-table-column label="索引号" type="index" width="100px" align="center"></el-table-column>
                <el-table-column prop="imgUrl" label="用户头像" align="center" width="80px">
                    <template slot-scope="scope">
                        <img :src="getImg(scope.row.head)" width="60" height="60" style="border-radius: 5px;">
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="用户名称" align="center" width="200px"></el-table-column>
                <el-table-column prop="money" label="用户余额" align="center" width="130px">
                    <template slot-scope="scope">{{ scope.row.money }} 元</template>
                </el-table-column>
                <el-table-column prop="freezeMoney" label="用户冻结余额" align="center" width="130px">
                    <template slot-scope="scope">{{ scope.row.freezeMoney }} 元</template>
                </el-table-column>
                <el-table-column prop="email" label="用户邮箱" align="center" width="180px"></el-table-column>
                <el-table-column prop="status" label="用户状态" align="center" width="140px">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.status)" size="small">{{ getStatusText(scope.row.status)
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="changeGoodsInfo = true; checkId = scope.row.id"
                            round>修改用户余额</el-button>

                        <el-dialog title="修改用户余额" :visible.sync=" changeGoodsInfo ">
                            <el-form :model=" user " ref='goodsForm' label-width="120px" class="form-container"
                                :rules=" rules ">
                                <el-form-item label="用户余额" prop="money">
                                    <el-input v-model=" user.money "></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click=" changeGoodsInfo = false ">取 消</el-button>
                                <el-button type="primary" @click=" changeMoney(checkId) ">确 定</el-button>
                            </div>
                        </el-dialog>
                        <el-button v-if=" scope.row.status === 0 " type="danger"
                            @click=" banningInfo = true; checkId = scope.row.id " round>封禁用户</el-button>
                        <el-dialog title="封禁用户" :visible.sync=" banningInfo " width="30%">
                            <span>确认封禁当前用户吗？</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click=" banningInfo = false ">取 消</el-button>
                                <el-button type="primary" @click=" banning(checkId) ">确 定</el-button>
                            </span>
                        </el-dialog>
                        <el-button v-if=" scope.row.status === 1 " type="success"
                            @click=" cancelBanningInfo = true; checkId = scope.row.id " round>解封用户</el-button>
                        <el-dialog title="封禁用户" :visible.sync=" cancelBanningInfo " width="30%">
                            <span>确认解封当前用户吗？</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click=" cancelBanningInfo = false ">取 消</el-button>
                                <el-button type="primary" @click=" cancelBanning(checkId) ">确 定</el-button>
                            </span>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页功能部分 -->
            <div class="block">
                <el-pagination ref="pagination" @size-change=" handleSizeChange " @current-change=" handleCurrentChange "
                    :current-page= this.queryInfo.pageNum  :page-sizes=" [5, 8, 10, 12] " :page-size= this.queryInfo.pageSize 
                    layout="total, sizes, prev, pager, next, jumper" :total= this.total >
                </el-pagination>
            </div>
        </el-card>

    </div>
</template>
  
<script>
export default {
    mounted() {
        if (window.sessionStorage.getItem('allUserNum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('allUserNum');

        }
        if (window.sessionStorage.getItem('allUserSize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('allUserSize');
        }
        this.getAllUser();

    },
    data() {

        return {
            allUserList: [],
            queryInfo: {
                pageNum: 1,
                pageSize: 10,
                name: '',
                status: ''
            },
            user: {
                money: ''
            },
            total: '',
            changeGoodsInfo: false,
            checkId: '',
            banningInfo: false,
            cancelBanningInfo: false,
            rules: {
                money: {
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            callback(new Error('请输入修改后的用户余额'))
                        } else {
                            const reg = /^\d+(\.\d{0,2})?$/
                            if (reg.test(value)) {
                                if (value < 10000000) {
                                    callback()
                                } else {
                                    callback(new Error('余额小于10000000'))
                                }
                            } else {
                                callback(new Error('余额格式只能为数字,且最多保留两位数字'))
                            }
                        }
                    },
                    trigger: 'blur',
                },
            },

        }
    },
    methods: {

        getStatusType(status) {
            if (status === 0) {
                return 'success';
            } else if (status === 1) {
                return 'danger';
            }
        },
        getStatusText(status) {
            if (status === 0) {
                return '正常';
            } else if (status === 1) {
                return '封禁';
            }
        },
        getAllUser() {
            this.$http.get('user/alluser', { params: { pageNum: this.queryInfo.pageNum, pageSize: this.queryInfo.pageSize, name: this.queryInfo.name, status: this.queryInfo.status } }).then((res) => {
                if (res.data.code == 1) {
                    this.allUserList = res.data.data.records;
                    this.total = res.data.data.total;
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            window.sessionStorage.setItem('allUserSize', newsize);
            this.getMyGoodsList();
        },
        //分页改变事件
        handleCurrentChange(newpage) {
            this.queryInfo.pageNum = newpage;
            window.sessionStorage.setItem('allUserNum', newpage);
            this.getAllUser();
        },
        getImg(img) {
            return `http://localhost:7070/api/file/download?name=${img}`
        },
        search() {
            this.queryInfo.pageNum = 1;
            this.getAllUser();
        },
        changeMoney(id) {

            this.$refs.goodsForm.validate(valid => {
                if (valid) {
                    this.$http.put(`user/changemoney/${id}`, this.user).then((res) => {
                        if (res.data.code == 1) {
                            this.changeGoodsInfo = false;
                            this.$message.success("修改成功");
                            this.user.money = '';
                            this.getAllUser();
                        } else if (res.data.code == 2) {
                            this.$message.error(res.data.msg);
                            window.sessionStorage.clear();
                            this.$router.push('/login');
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            })
        },
        banning(id) {
            this.$http.get(`user/banning/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.banningInfo = false;
                    this.$message.success(res.data.data);
                    this.getAllUser();
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        cancelBanning(id) {
            this.$http.get(`user/cancelbanning/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.cancelBanningInfo = false;
                    this.$message.success(res.data.data);
                    this.getAllUser();
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        }

    }

};
</script>
  
<style>
.pagination-container {
    text-align: center;
    margin-top: 20px;
}

.el-pagination {
    display: inline-block;
}

.top {
    margin-top: 10px;
}
</style>