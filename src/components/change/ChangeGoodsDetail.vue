<template>
    <div class="product-detail">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/change' }">以物换物</el-breadcrumb-item>
            <el-breadcrumb-item v-if="this.$route.query.from == 'mychangegoods'"
                :to="{ path: '/mychangegoods' }">我的以物换物商品</el-breadcrumb-item>
                <el-breadcrumb-item v-if="this.$route.query.from == 'mychange'"
                :to="{ path: '/mychange' }">以物换物订单</el-breadcrumb-item>
            <el-breadcrumb-item>商品详情</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="product-info">
            <img :src=this.goods.imgUrl class="image">
            <h2>{{ goods.name }}</h2>
            <p class="description">商品描述:{{ goods.description }}</p>
            <div class="price-contact">
                <p class="price">期望交换:{{ goods.price }} </p>
            </div>
            <p class="contact">联系方式：{{ goods.contact }}</p>
            <p class="location">位置：{{ this.location }}</p>
            <p class="published-time">发布时间：{{ goods.time }}</p>
        </div>
        <el-button v-if="this.goods.isManager == 1" class="buy-btn" type="danger" @click="removeInfo = true">下架</el-button>
        <el-dialog title="下架" :visible.sync="removeInfo" width="30%">
            <span>确定下架该商品吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="removeInfo = false">取 消</el-button>
                <el-button type="primary" @click="remove">确 定</el-button>
            </span>
        </el-dialog>

        <el-button v-if="!this.ismygoods&&this.goods.isManager !== 1" class="buy-btn" type="primary" @click="getMyChange">发起交换</el-button>
        <el-dialog title="交换" :visible.sync="dialogVisible" width="30%"  >

            <el-row style="margin-top: 0px;">
                <el-col :span="9">
                    <el-input placeholder="输入搜索内容" v-model="queryInfo.name"></el-input>
                </el-col>
                <el-col :span="1">
                    <el-button type="primary" icon="el-icon-search" circle @click="search"></el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6" v-for="item in myChangeList" :key="item.id" :offset="1">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="getimg(item.imgUrl)" class="image" style="width: 100px; height: 100px;">
                        <div style="padding: 13px;">
                            <span>{{ item.name }}</span>
                            <div style="margin-top: 10px;" class="bottom clearfix">
                                <el-button type="primary" size="mini" class="button" @click="change(item.id)">交换</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div class="block" >
                <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page=this.queryInfo.pageNum :page-sizes="[1,  3, 9]" :page-size=this.queryInfo.pageSize
                    layout="total, sizes, prev, pager, next, jumper" :total=this.total >
                </el-pagination>
            </div>

        </el-dialog>
    </div>
</template>
  

  
<script>
export default {
    data() {
        return {
            queryInfo: {
                pageSize: 9,
                pageNum: 1,
                name: '',
            },
            img: '',
            total: '',
            myChangeList: [],
            goods: {
                name: '',
                description: '',
                hope: '',
                time: '',
                contact: '',
                area: '',
                building: '',
                floor: '',
                room: '',
                imgUrl: '',
                time: '',
                isManager:''
            },
            location: '',
            ismygoods: false,
            dialogVisible: false,
            removeInfo:false
        };
    },
    created() {
        this.getOne();
    },
    methods: {

        getMyChange() {
            this.dialogVisible = true;

            this.$http.get('changegoods/mychange', {
                params: {
                    pageSize: this.queryInfo.pageSize,
                    pageNum: this.queryInfo.pageNum,
                    name: this.queryInfo.name,
                }
            }).then((res) => {
                if (res.data.code == 1) {
                    this.myChangeList = res.data.data.records;
                    this.total = res.data.data.total;
                } else if (resp.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');

                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        change(id) {
            this.dialogVisible=false;
            this.$http.get(`changegoods/sendchange/${id}/${this.$route.query.id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
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
            this.$http.get(`changegoods/${this.$route.query.id}`).then((res) => {
                if (res.data.code == 1) {
                    this.goods.name = res.data.data.name;
                    this.goods.description = res.data.data.description;
                    this.goods.hope = res.data.data.hope;
                    this.goods.time = res.data.data.time;
                    this.goods.contact = res.data.data.contact;
                    this.goods.area = res.data.data.area;
                    this.goods.building = res.data.data.building;
                    this.goods.floor = res.data.data.floor;
                    this.goods.room = res.data.data.room;
                    this.goods.isManager = res.data.data.isManager;
                    this.goods.imgUrl = `http://localhost:7070/api/file/download?name=${res.data.data.imgUrl}`;
                    this.goods.time = res.data.data.time;
                   
                    if (this.goods.area == 1) {
                        this.location = `北区${this.goods.building}栋${this.goods.floor}楼${this.goods.room}号房间`
                    } else if (this.goods.area == 2) {
                        this.location = `南区${this.goods.building}栋${this.goods.floor}楼${this.goods.room}号房间`
                    } else if (this.goods.area == 3) {
                        this.location = `东区${this.goods.building}栋${this.goods.floor}楼${this.goods.room}号房间`
                    }
                    if (res.data.data.userId == window.sessionStorage.getItem('userid')||this.$route.query.from) {
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
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;

            this.getMyChange();
        },
        //分页改变事件
        handleCurrentChange(newpage) {
            this.queryInfo.pageNum = newpage;
            this.getMyChange();
        },
        getimg(img) {
            return `http://localhost:7070/api/file/download?name=${img}`
        },
        search() {
            this.queryInfo.pageNum = 1;
            this.getMyChange();
        },
        clearSearch() {
            this.queryInfo.name = '';
        },
       
          remove() {
            this.$http.delete(`changegoods/${this.$route.query.id}`).then((resp) => {
                if (resp.data.code == 1) {
                    this.$message.success("下架成功");
                    this.$router.push('/change');
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
.block{
    margin-left: -400px;
}
</style>