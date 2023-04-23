<template>
    <div class="product-detail">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item  :to="{ path: '/runner' }">跑腿订单</el-breadcrumb-item>
            <el-breadcrumb-item v-if="this.$route.query.from=='myrunner'" :to="{ path: '/myrunner' }">我的跑腿订单</el-breadcrumb-item>
            <el-breadcrumb-item v-if="this.$route.query.from=='myacrunner'" :to="{ path: '/myacrunner' }">我接受的跑腿订单</el-breadcrumb-item>
        
            <el-breadcrumb-item>跑腿订单详情</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="product-info">
            <h2>{{ runner.type }}</h2>
        
            <div class="price-contact">
                <p class="price">需要垫付：{{ runner.needMoney }} 元</p>
            </div>
            <div class="price-contact">
                <p class="price">跑腿费：{{ runner.reward }} 元</p>
            </div>
            <p class="description">详细信息:{{ runner.description }}</p>
            <p class="contact">联系方式：{{ runner.contact }}</p>
            <p class="published-time">发布时间：{{ runner.time }}</p>
        </div>
        <el-button v-if="this.runner.isManager == 1" class="buy-btn" type="danger" @click="removeInfo = true">删除</el-button>
        <el-dialog title="下架" :visible.sync="removeInfo" width="30%">
            <span>确定删除该订单吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="removeInfo = false">取 消</el-button>
                <el-button type="primary" @click="remove">确 定</el-button>
            </span>
        </el-dialog>

        <el-button v-if="!this.ismygoods&&this.runner.isManager !== 1" class="buy-btn" type="primary" @click="dialogVisible = true">接受订单</el-button>
        <el-dialog title="接受订单" :visible.sync="dialogVisible" width="30%">
            <span>
                     确定接受该订单吗？
                接受之后将冻结与跑腿费相同的资金。
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="accept">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  

  
<script>
export default {
    data() {
        return {
            runner: {
                type:'',
                description: '',
                needMoney: '',
                time: '',
                contact: '',
                reward:'',
                isManager:''
            },
            ismygoods: false,
            dialogVisible: false,
            removeInfo:false
        };
    },
    created() {
        this.getOne();
    },
    methods: {
        accept() {
            this.dialogVisible = false
            this.$http.put(`runner/accept/${this.$route.query.id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
                    this.$router.push('/runner');
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            }) 
        },
        getOne() {
            this.$http.get(`runner/${this.$route.query.id}`).then((res) => {
                if (res.data.code == 1) {
                  this.runner={...res.data.data}
                    if (res.data.data.publishUserId == window.sessionStorage.getItem('userid')||this.$route.query.from) {
                        this.ismygoods = true;
                    }
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$route.push('/login')
                } else {
                    this.$message.error(res.data.msg);
                }

            })
        },
        remove(){
            this.$http.delete(`runner/${this.$route.query.id}`).then((resp) => {
                if (resp.data.code == 1) {
                    this.$message.success("删除成功");
                    this.$router.push('/runner');
                } else if (resp.data.code == 2) {
                    this.$message.error(resp.data.msg);
                    this.handleReset();
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(resp.data.msg);
                }
            });
        },
    },
};
</script>

<style scoped>
.product-detail {
    max-width: 800px;
    margin: 0 auto;
}

.product-info {
    padding: 30px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
}

.product-info h2 {
    font-size: 32px;
    margin-bottom: 10px;
}

.product-info .description {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
}

.price-contact {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.price-contact .price {
    font-size: 24px;
    margin-right: 20px;
}

.location,
.published-time {
    font-size: 16px;
    color: #999;
    margin-bottom: 10px;
}

.buy-btn {
    margin-top: 30px;
}
</style>