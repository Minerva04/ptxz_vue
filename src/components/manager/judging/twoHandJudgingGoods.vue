<template>
    <div class="table-container">

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/twohand' }">二手交易商品</el-breadcrumb-item>
            <el-breadcrumb-item>二手交易仲裁</el-breadcrumb-item>
        </el-breadcrumb>

        <el-input placeholder="输入搜索内容" v-model="queryInfo.name" style="width: 200px; "></el-input>
        <el-button type="primary" icon="el-icon-search" circle @click="search" style="margin-left: 20px;"></el-button>

        <el-card style="margin-top: -20px;">
            <el-table :data="judgingGoodsList" stripe style="width: 100%">
                <el-table-column label="索引号" type="index" width="100px" align="center"></el-table-column>
                <el-table-column prop="imgUrl" label="商品图片" align="center" width="80px">
                    <template slot-scope="scope">
                        <img :src="getImg(scope.row.imag)" width="60" height="60" style="border-radius: 5px;">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" align="center" width="200px"></el-table-column>
                <el-table-column prop="price" label="价格" align="center" width="70px">
                    <template slot-scope="scope">{{ scope.row.price }} 元</template>
                </el-table-column>
                <el-table-column prop="creteTime" label="订单创建时间" align="center" width="180px"></el-table-column>
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
        if (window.sessionStorage.getItem('judgingGoodsNum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('judgingGoodsNum');

        }
        if (window.sessionStorage.getItem('judgingGoodsSize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('judgingGoodsSize');
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
                path: '/twohandjudgingdetail',
                query: { id: id1 }
            })
        },
        getJudgingGoodsList() {
            this.$http.get('goodsorder/judgingorder', { params: { pageNum: this.queryInfo.pageNum, pageSize: this.queryInfo.pageSize, name: this.queryInfo.name } }).then((res) => {
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
            window.sessionStorage.setItem('judgingGoodsSize', newsize);
            this.getJudgingGoodsList();
        },
        //分页改变事件
        handleCurrentChange(newpage) {
            this.queryInfo.pageNum = newpage;
            window.sessionStorage.setItem('judgingGoodsNum', newpage);
            this.getJudgingGoodsList();
        },
        getImg(img) {
            return `http://localhost:7070/api/file/download?name=${img}`
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