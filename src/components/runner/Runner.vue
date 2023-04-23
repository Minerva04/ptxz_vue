<template>
    <div class="table-container">

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>跑腿订单</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card style="margin-top: -20px;">
            <el-table :data="runnerList" stripe style="width: 100%">
         
                <el-table-column label="索引号" type="index" width="80px" align="center"></el-table-column>
                <el-table-column prop="type" label="类型描述" align="center" width="200px" >
                    <template slot-scope="scope">
                        <el-tag type="primary" >{{ scope.row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="需垫付" align="center" width="100px" >
                    <template slot-scope="scope">
                        <el-tag type="danger" >{{ scope.row.needMoney }}元</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="跑腿费" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tag type="success"  >{{ scope.row.reward }}元</el-tag>
                        
                    </template>
                </el-table-column>
                <el-table-column prop="time" label="发布时间" align="center" width="200x">
                   
                </el-table-column>
                <el-table-column  align="center">
                    <template slot-scope="scope">                   
                        <el-button type="info" size="mini" @click="checkRunner(scope.row.id)" round>查看详情</el-button>
                 </template>
                </el-table-column>
            </el-table>

            <!-- 分页功能部分 -->
            <div>
                <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page=this.queryInfo.pageNum :page-sizes="[5, 8, 10, 12]" :page-size=this.queryInfo.pageSize
                    layout="total, sizes, prev, pager, next, jumper" :total=this.total >
                </el-pagination>
            </div>
        </el-card>

    </div>
</template>
  
<script>
export default {
    mounted() {
        if (window.sessionStorage.getItem('runnerNum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('runnerNum');

        }
        if (window.sessionStorage.getItem('runnerSize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('runnerSize');
        }
        this.getRunnerList();
    },
    data() {
      
        return {

            runnerList: [],
            queryInfo: {
                pageNum: 1,
                pageSize: 10,
            },
            total: '',
        }
    },
    methods: {
       
        getRunnerList() {
            this.$http.get('runner', { params: { pageNum: this.queryInfo.pageNum, pageSize: this.queryInfo.pageSize } }).then((res) => {
                if (res.data.code == 1) {
                    this.runnerList = res.data.data.records;
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

     
        checkRunner(id1) {
            this.$router.push({
                path: '/runnerdetail',
                query: { id: id1}
            })
        },
        
        //分页大小改变事件
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            window.sessionStorage.setItem('goodsOrderSize', newsize,);
            this.getGoodsOrderList();
        },
        //分页改变事件
        handleCurrentChange(newpage) {
            this.queryInfo.pageNum = newpage;
            window.sessionStorage.setItem('goodsOrderNum', newpage,);
            this.getGoodsOrderList();
        },
    },

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