<template>
    <div class="table-container">

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/change' }">以物换物商品</el-breadcrumb-item>
            <el-breadcrumb-item>我的以物换物订单</el-breadcrumb-item>
        </el-breadcrumb>


        <el-input placeholder="输入搜索内容" v-model="queryInfo.name" style="width: 200px; "></el-input>
        <el-select v-model="queryInfo.status" placeholder="选择订单状态" style="width: 200px; margin-left: 20px;">
            <el-option label="全部订单" value=''></el-option>
            <el-option label="交换中" value="1"></el-option>
            <el-option label="交换完成" value="2"></el-option>
            <el-option label="交换取消" value="3"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" circle @click="search" style="margin-left: 20px;"></el-button>

        <el-card style="margin-top: -20px;">
            <el-table :data="changeOrderList" stripe style="width: 100%">
                <el-table-column label="索引号" type="index" width="100px" align="center"></el-table-column>
                <el-table-column label="我方换出" align="center" width="80px">
                    <template slot-scope="scope">
                        <img v-if="checkSender(scope.row.launchUserId)" :src="getImg(scope.row.sendImg)" width="60"
                            height="60" style="border-radius: 5px;">
                        <img v-else :src="getImg(scope.row.acImg)" width="60" height="60" style="border-radius: 5px;">
                    </template>

                </el-table-column>
                <el-table-column label="我方物品名称" align="center" width="200px">
                    <template slot-scope="scope">
                        {{ checkSender(scope.row.launchUserId) ? scope.row.launchGoodsName : scope.row.acceptGoodsName }}
                    </template>

                </el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">

                        <el-button type="success" @click="ifConfirmChange(scope.row.id)" circle> 交换完成</el-button>
                        <el-button v-if="checkSender(scope.row.launchUserId)" type="info" size="mini" @click="checkGoods(scope.row.acceptGoodsId)" round>查看详情</el-button>
                        <el-button v-else type="info" size="mini" @click="checkGoods(scope.row.launchGoodsId)" round>查看详情</el-button>
                        <el-button type="danger" @click="ifCancelChange(scope.row.id)" circle>取消交换</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="对方换出" align="center" width="80px">
                    <template slot-scope="scope">
                        <img v-if="checkSender(scope.row.launchUserId)" :src="getImg(scope.row.acImg)" width="60"
                            height="60" style="border-radius: 5px;">
                        <img v-else :src="getImg(scope.row.sendImg)" width="60" height="60" style="border-radius: 5px;">
                    </template>
                </el-table-column>
                <el-table-column label="我方物品名称" align="center" width="200px">
                    <template slot-scope="scope">
                        {{ checkSender(scope.row.launchUserId) ? scope.row.acceptGoodsName : scope.row.launchGoodsName }}
                    </template>
                </el-table-column>

                <el-table-column prop="lastStatus" label="状态" align="center" width="140px">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.lastStatus)" size="small">{{
                            getStatusText(scope.row.lastStatus)
                        }}</el-tag>
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

        <el-dialog title="交换完成" :visible.sync="confirmChangeInfo" width="30%">
            <span>是否确认完成交换</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="confirmChangeInfo = false">取 消</el-button>
                <el-button type="primary" @click="confirmChange(checkId)">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="取消交换" :visible.sync="cancelChangeInfo" width="30%">
            <span>是否确认取消交换</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelChangeInfo = false">取 消</el-button>
                <el-button type="primary" @click="cancelChange(checkId)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  
<script>
export default {
    mounted() {
        if (window.sessionStorage.getItem('mychangelistnum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('mychangelistnum');

        }
        if (window.sessionStorage.getItem('mychangelistsize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('mychangelistsize');
        }
        this.getMyChangeList();

    },
    data() {


        return {
            changeOrderList: [],
            fileList: [],
            queryInfo: {
                pageNum: 1,
                pageSize: 10,
                name: '',
                status: ''
            },

            total: '',
            confirmChangeInfo: false,
            checkId: '',
            cancelChangeInfo: false,

        }
    },
    methods: {
        ifConfirmChange(id){
            this.checkId=id;
            this.confirmChangeInfo=true;
        },
        ifCancelChange(id){
            this.checkId=id;
            this.cancelChangeInfo=true;
        },
        confirmChange(id){
            this.$http.get(`changeorder/confirm/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
                    this.confirmChangeInfo=false;
                    this.getMyChangeList();
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        cancelChange(id){
            this.$http.get(`changeorder/cancel/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
                    this.cancelChangeInfo=false;
                    this.getMyChangeList();
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        
        checkSender(id) {
            if (window.sessionStorage.getItem('userid') == id) {
                return true;
            } else {
                return false;
            }
        },
        checkAcer(id) {
            if (window.sessionStorage.getItem('userid') == id) {
                return true;
            } else {
                return false;
            }
        },

        checkGoods(id1) {
            this.$router.push({
                path: '/changegoodsdetail',
                query: { id: id1, from: 'mychange' }
            })
        },


        getStatusType(status) {

            if (status === 1) {
                return 'warning';
            } else if (status === 3) {
                return 'danger';
            } else if (status === 2) {
                return 'success';
            }
        },
        getStatusText(status) {

            if (status === 1) {
                return '交换中';
            } else if (status === 2) {
                return '交换完成';
            } else if (status === 3) {
                return '交换取消';
            }
        },
        getMyChangeList() {
            this.$http.get('changeorder', { params: { pageNum: this.queryInfo.pageNum, pageSize: this.queryInfo.pageSize, name: this.queryInfo.name, status: this.queryInfo.status } }).then((res) => {
                if (res.data.code == 1) {
                    this.changeOrderList = res.data.data.records;
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
            window.sessionStorage.setItem('mychangelistsize', newsize);
            this.getMyChangeList();
        },
        //分页改变事件
        handleCurrentChange(newpage) {
            this.queryInfo.pageNum = newpage;
            window.sessionStorage.setItem('mychangelistnum', newpage);
            this.getMyChangeList();
        },
        getImg(img) {
            return `http://localhost:7070/api/file/download?name=${img}`
        },
        search() {
            this.queryInfo.pageNum = 1;
            this.getMyChangeList();
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