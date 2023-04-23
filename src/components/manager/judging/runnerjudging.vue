<template>
    <div class="table-container">

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/runner' }">跑腿订单</el-breadcrumb-item>
            <el-breadcrumb-item>跑腿订单仲裁</el-breadcrumb-item>
        </el-breadcrumb>

        <el-input placeholder="输入搜索内容" v-model="queryInfo.name" style="width: 200px; "></el-input>
        <el-button type="primary" icon="el-icon-search" circle @click="search" style="margin-left: 20px;"></el-button>

        <el-card style="margin-top: -20px;">
            <el-table :data="judgingGoodsList" stripe style="width: 100%">
                <el-table-column label="索引号" type="index" width="100px" align="center"></el-table-column>
                <el-table-column prop="type" label="订单类型" align="center" width="250px"></el-table-column>
                <el-table-column prop="needMoney" label="需要垫付" align="center" width="150px">
                    <template slot-scope="scope">{{ scope.row.needMoney }} 元</template>
                </el-table-column>
                <el-table-column prop="reward" label="跑腿费" align="center" width="150px">
                    <template slot-scope="scope">{{ scope.row.reward }} 元</template>
                </el-table-column>
                <el-table-column prop="time" label="订单创建时间" align="center" width="180px"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="checkGoods(scope.row.id)" round>查看仲裁资料</el-button>
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
        if (window.sessionStorage.getItem('judgingRunnerNum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('judgingRunnerNum');

        }
        if (window.sessionStorage.getItem('judgingRunnerSize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('judgingRunnerSize');
        }
        this.getJudgingGoodsList();

    },
    data() {

        return {
            judgingGoodsList: [],
            queryInfo: {
                pageNum: 1,
                pageSize: 10,
                name: '',
            },
            total: '',
            checkId:'',
        }
    },
    methods: {
        checkGoods(id1) {
            this.$router.push({
                path: '/runnerjudgingdetail',
                query: { id: id1 }
            })
        },
        getJudgingGoodsList() {
            this.$http.get('runner/judgingrunner', { params: { pageNum: this.queryInfo.pageNum, pageSize: this.queryInfo.pageSize, name: this.queryInfo.name } }).then((res) => {
                if (res.data.code == 1) {
                    this.judgingGoodsList = res.data.data.records;
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
            window.sessionStorage.setItem('judgingRunnerSize', newsize);
            this.getJudgingGoodsList();
        },
        //分页改变事件
        handleCurrentChange(newpage) {
            this.queryInfo.pageNum = newpage;
            window.sessionStorage.setItem('judgingRunnerNum', newpage);
            this.getJudgingGoodsList();
        },
        search() {
            this.queryInfo.pageNum = 1;
            this.getJudgingGoodsList();
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