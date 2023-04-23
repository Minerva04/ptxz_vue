<template>
    <div class="table-container">

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/runner' }">跑腿订单</el-breadcrumb-item>
            <el-breadcrumb-item>我接受的跑腿订单</el-breadcrumb-item>
        </el-breadcrumb>


        <el-input placeholder="输入搜索内容" v-model="queryInfo.name" style="width: 200px; "></el-input>
        <el-select v-model="queryInfo.status" placeholder="选择订单状态" style="width: 200px; margin-left: 20px;">
            <el-option label="全部订单" value=''></el-option>
            <el-option label="订单正在进行" value="1"></el-option>
            <el-option label="对方发起仲裁" value="3"></el-option>
            <el-option label="我方发起仲裁" value="2"></el-option>
            <el-option label="已完成" value="4"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" circle @click="search" style="margin-left: 20px;"></el-button>

        <el-card style="margin-top: -20px;">
            <el-table :data="myRunnerList" stripe style="width: 100%">
                <el-table-column label="索引号" type="index" width="100px" align="center"></el-table-column>

                <el-table-column prop="type" label="类型描述" align="center" width="200px"></el-table-column>
                <el-table-column label="需垫付" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tag type="danger">{{ scope.row.needMoney }}元</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="跑腿费" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tag type="success">{{ scope.row.reward }}元</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="发布时间/接单时间" align="center" width="180px"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="140px">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.status)" size="small">{{ getStatusText(scope.row.status)
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="danger" v-if="scope.row.status === 1" size="mini"
                            @click="checkCancel(scope.row.id)" round>取消订单</el-button>

                        <el-dialog title="取消订单" :visible.sync="cancelInfo" width="30%">
                            <span>确认取消当前订单吗？</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="cancelInfo = false">取 消</el-button>
                                <el-button type="primary" @click="cancel(checkId)">确 定</el-button>
                            </span>
                        </el-dialog>

                        <el-button type="primary" v-if="scope.row.status === 3" size="mini"
                            @click="checkConfirmCancel(scope.row.id)" round>确认取消</el-button>

                        <el-dialog title="确认取消" :visible.sync="confirmCancelInfo" width="30%">
                            <span>确认同意取消当前订单吗？</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="confirmCancelInfo = false">取 消</el-button>
                                <el-button type="primary" @click="confirmCancel(checkId)">确 定</el-button>
                            </span>
                        </el-dialog>

                        <el-button v-if="scope.row.status === 2||scope.row.status === 3" type="warning" size="mini" @click="checkJudging(scope.row.id)" round>提供仲裁资料</el-button>
                        <!-- 提供仲裁资料 -->
                        <el-dialog title="提供仲裁资料" :visible.sync="judgingInfo">
                            <el-form :model="judgingForm" :rules="rules1">
                                <el-form-item label="仲裁图片" prop="file">
                                    <el-upload ref="upload" class="upload-demo" action="api/file/upload"
                                        :on-success="handleUploadSuccess" :before-upload="beforeUpload"
                                        list-type="picture-card" limit="1" :file-list="fileList"
                                        :before-remove="beforeRemove">
                                        <i class="el-icon-plus upload-icon"></i>
                                        <div slot="tip">只能上传jpg/png文件,且不超过1MB</div>
                                    </el-upload>

                                </el-form-item>
                                <el-form-item label="描述" prop="description">
                                    <el-input type="textarea" v-model="judgingForm.description"
                                        style="width: 80%;"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="judgingInfo = false">取 消</el-button>
                                <el-button type="primary" @click="putJudging(checkId)">确 定</el-button>
                            </div>
                        </el-dialog>

                        <el-button type="info" size="mini" @click="checkRunner(scope.row.id)" round>查看详情</el-button>
                     
                      
                        <el-button type="danger" icon="el-icon-delete" @click="checkDelete(scope.row.status, scope.row.id)"
                            circle></el-button>

                        <el-dialog title="删除订单" :visible.sync="deleteGoodsInfo" width="30%">
                            <span>确认删除当前订单吗？</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="deleteGoodsInfo = false">取 消</el-button>
                                <el-button type="primary" @click="deleteGoods(checkId)">确 定</el-button>
                            </span>
                        </el-dialog>

                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页功能部分 -->
            <div class="block">
                <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page=this.queryInfo.pageNum :page-sizes="[5, 8, 10, 12]" :page-size=this.queryInfo.pageSize
                    layout="total, sizes, prev, pager, next, jumper" :total=this.total>
                </el-pagination>
            </div>
        </el-card>

    </div>
</template>
  
<script>

export default {
    mounted() {
        if (window.sessionStorage.getItem('myAcceptNum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('myAcceptNum');

        }
        if (window.sessionStorage.getItem('myAccepetSize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('myAccepetSize');
        }
        this.getMyRunnerList();
    },
    data() {
        var fileRule = (rules, value, callback) => {
            if (this.judgingForm.imag) {
                callback();
            } else {
                callback(new Error('请上传图片'));
            }
        };
        return {
            judgingForm: {
                imag: '',
                description: ''
            },
            myRunnerList: [],
            queryInfo: {
                pageNum: 1,
                pageSize: 10,
                name: '',
                status: ''
            },
            runner: {
                type: '',
                description: '',
                needMoney: '',
                time: '',
                contact: '',
                reward: '',
                status: ''
            },
            total: '',
            checkId: '',
            deleteGoodsInfo: false,
            cancelInfo: false,
            confirmCancelInfo: false,
            judgingInfo: false,
            fileList:[],
            confirmInfo:false,
            rules1: {

                description: [
                    { required: true, message: "请输入仲裁描述", trigger: "blur" },
                    { max: 50, min: 1, message: "描述长度在50个字符以内", trigger: "blur" },
                ],

                //验证是否上传图片
                file: [
                    {
                        validator: fileRule,
                        trigger: 'blur'
                    }
                ],
            },

        }
    },
    methods: {
        checkConfirmCancel(id) {
            this.checkId = id;
            this.confirmCancelInfo = true;
        },
        confirmCancel(id) {
            this.confirmCancelInfo = false;
            this.$http.get(`runner/acceptconfirmcancel/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
                    this.getMyRunnerList();
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        checkCancel(id) {
            this.checkId = id;
            this.cancelInfo = true;
        },
        checkJudging(id) {
            this.judgingInfo = true;
            this.checkId = id;
        },
       
        cancel(id) {
            this.cancelInfo = false;
            this.$http.get(`runner/acceptcancel/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
                    this.getMyRunnerList();
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },

        checkDelete(status, id) {
            if (status === 1) {
                this.$message.error("当前订单正在进行无法删除")
            } else if (status === 2 || status === 3) {
                this.$message.error("当前订单处于仲裁状态无法删除")
            } else {
                this.deleteGoodsInfo = true
                this.checkId = id;
            }
        },
        deleteGoods(id) {
            this.deleteGoodsInfo = false;
            this.$http.delete(`runner/accept/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
                    this.getMyRunnerList();
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        checkRunner(id1) {
            this.$router.push({
                path: '/runnerdetail',
                query: { id: id1, from: 'myacrunner' }
            })
        },


        getStatusType(status) {
            if (status === 0) {
                return 'info';
            } else if (status === 1) {
                return 'warning';
            } else if (status === 2) {
                return 'danger';
            } else if (status === 3) {
                return 'danger';
            } else if (status === 4) {
                return 'success';
            }
        },
        getStatusText(status) {
            if (status === 0) {
                return '等待接受';
            } else if (status === 1) {
                return '订单正在进行';
            } else if (status === 3) {
                return '对方发起仲裁';
            } else if (status === 2) {
                return '我方发起仲裁';
            } else if (status === 4) {
                return '订单已完成';
            }
        },
         getMyRunnerList() {
            this.$http.get(`runner/myaccept`, { params: { pageNum: this.queryInfo.pageNum, pageSize: this.queryInfo.pageSize, name: this.queryInfo.name, status: this.queryInfo.status } }).then((res) => {
                if (res.data.code == 1) {
                    this.myRunnerList = res.data.data.records;
                    this.total = res.data.data.total;
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })
        },
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            window.sessionStorage.setItem('myRunnerSize', newsize);
            this.getMyRunnerList();
        },
        //分页改变事件
        handleCurrentChange(newpage) {
            this.queryInfo.pageNum = newpage;
            window.sessionStorage.setItem('myRunnerNum', newpage);
            this.getMyRunnerList();
        },

        search() {
            this.queryInfo.pageNum = 1;
            this.getMyRunnerList();
        },


        initRunner(id) {
            this.$http.get(`runner/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.runner = { ...res.data.data }
                    this.changeInfo = true;
                    this.checkId = id;
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })

        },
       
        handleUploadSuccess(response, file, fileList) {
            this.judgingForm.imag = response.data
        },
        beforeUpload(file) {
            if (file) {
                const suffix = file.name.split('.')[1]
                const size = file.size / 1024 / 1024 < 1

                if (['png', 'jpeg', 'jpg'].indexOf(suffix) < 0) {
                    this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
                    this.$refs.upload.clearFiles()
                    return false
                }
                if (!size) {
                    this.$message.error('上传文件大小不能超过 1MB!')
                    return false
                }
                return file
            }
        },
        beforeRemove(file) {
            this.fileList=[];
            this.judgingForm.imag = '';
        },
        putJudging(id) {
            this.judgingInfo = false,
                this.$http.put(`/judging/accept/${id}`, this.judgingForm).then((res) => {
                    if (res.data.code == 1) {
                        this.$message.success(res.data.data);
                    } else if (res.data.code == 2) {
                        this.$message.error(res.data.msg);
                        window.sessionStorage.clear();
                        this.$router.push('/login');
                    } else {
                        this.$message.error('系统繁忙请稍后再试');
                    }
                    this.judgingForm.description = '';
                    this.judgingForm.imag = '';
                    this.fileList = [];
                })
        },

       
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