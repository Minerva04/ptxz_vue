<template>
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div class="head">
                <img class="headImg" :src="this.user.head" alt="无法加载图片" @click="myDetail">
                <span>{{ this.user.userName }}</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!-- 侧边 -->
            <el-aside width="200px">
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" router
                    unique-opened="true">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menu" :key="item.id">
                        <!-- 模板 -->
                        <template slot="title">
                            <i :class="icon[item.id]"></i>
                            <span>{{ item.name }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="two.path" v-for="two in item.child" :key="two.id">
                            <template slot="title">
                                <i :class="icon[two.id]"></i>
                                <span>{{ two.name }}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>

            </el-aside>


            <el-container>
                <el-main>
                    <router-view></router-view>
                </el-main>
                
            </el-container>
        </el-container>
       
    </el-container>
    
</template>
<script>
export default {
    created() {
        this.getMenu();
        this.getUser();
    },
    data() {
        return {
            headSrc: require('../assets/defaultHead.jpg'),
            menu: [],
            icon: {
                '1': 'el-icon-s-goods',
                '2': 'el-icon-sort',
                '3': 'el-icon-s-promotion',
                '4': 'el-icon-shopping-bag-1',
                '5': 'el-icon-shopping-bag-2',
                '6': 'el-icon-s-order',
                '7': 'el-icon-upload',
                '8': 'el-icon-upload',
                '9': 'el-icon-upload',
                '10': 'el-icon-user-solid',
                '11': 'el-icon-shopping-cart-1',
                '12': 'el-icon-milk-tea',
                '13': 'el-icon-shopping-bag-2',
                '14': 'el-icon-tickets',
                '15': 'el-icon-paperclip',
                '16': 'el-icon-position',
                '17': 'el-icon-bicycle'
            },
            user: {
                userName: '',
                head: '',
                money: 0,
                freezeMoney: 0,
                status: '1',
                email: ''
            }
        }
    },
    methods: {
        logout() {
            //登出功能实现 清楚会话token和缓存的用户数据并跳转 
            this.$http.delete('login').then((res) => {
                if (res.data.code == 1) {
                    this.$message.success('退出成功');
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试')
                }
            })

        },
        getMenu() {
            this.$http.get('menu').then((res) => {
                if (res.data.code == 1) {
                    this.menu = res.data.data;
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试')
                }

            })
        },
        getUser() {
            const token = window.sessionStorage.getItem('token');
            this.$http.get('user').then((res) => {
                if (res.data.code == 1) {
                    this.user = { ...res.data.data };
                    this.user.head = `http://localhost:7070/api/file/download?name=${this.user.head}`
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试')
                }

            })
        },
        myDetail() {
            this.$router.push('/mydetail');
        }
    }
};

</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: #333744;
}

.el-main {
    background-color: #eaedf1;
}

.el-footer {
    background-color: #eaedf1;
}

.headImg {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    cursor: pointer;

}

.head img:hover {
    transform: scale(1.1);
    border-color: #007aff;
}
</style>