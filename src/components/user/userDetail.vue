<template>
    <div class="profile-wrapper">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>我的信息</el-breadcrumb-item>

        </el-breadcrumb>
        <div class="header">

            <img :src=this.user.head alt="头像" @click="cheackHead">
            <h2 class="name">{{ user.userName }}</h2>
            <span class="email">邮箱：{{ user.email }}</span>
            <span class="status">用户状态：{{ user.status === 0 ? '正常' : '封禁' }}</span>
        </div>
        <div class="balance">
            <p><span class="balance-label">余额：</span><span class="balance-amount">{{ user.money }}元</span></p>
            <p><span class="balance-label">冻结余额：</span><span class="balance-amount">{{ user.freezeMoney }}元</span></p>
        </div>
        <div style="display: flex; gap: 10px;">
            <el-button type="primary" size="small" @click="ModifyPassword">修改密码</el-button>
            <el-button type="primary" size="small" @click="ModifyUser">修改信息</el-button>
        </div>

        <div class="note">
            充值请联系管理员 管理员微信:12345677
        </div>
    </div>
</template>
  
  
<script>

export default {
    data() {
        return {
            user: {
                userName: '',
                head: '',
                money: '',
                freezeMoney: '',
                status: '0',
                email: ''
            }
        };
    },
    mounted() {
        const token = window.sessionStorage.getItem('token');
        this.$http.get(`user`).then((resp) => {
            if (resp.data.code == 1) {
                this.user = { ...resp.data.data };
                this.user.head = `http://localhost:7070/api/file/download?name=${this.user.head}`
            } else if (resp.data.code == 2) {
                this.$message.error(resp.data.msg);
                window.sessionStorage.clear();
                this.$router.push('/login');
            } else {
                this.$message.error('系统繁忙请稍后再试');
            }
        })
    },
    methods: {
        ModifyUser() {
            this.$router.push('/modifyuser');
        },
        handleAvatarClick() {
            window.open(this.user.avatar);
        },
        cheackHead() {
            window.open(this.user.head, '_blank');
        },
        ModifyPassword() {
            this.$router.push({ path: '/modifypassword', query: { email: this.user.email } });
        }
    }
};
</script>
  
<style scoped>
.name {
    font-size: 28px;
    font-family: "Microsoft YaHei", sans-serif;
    margin-left: 10px;
    margin-bottom: 0px;
}

.profile-wrapper {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}



.balance {
    margin-bottom: 20px;
}

.balance p {
    margin: 10px 0;
}

.header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease-out;
    border: 2px solid #ffffff;
}

.header img:hover {
    transform: scale(1.1);
    border-color: #007aff;
}

.el-button {
    margin-left: auto;
    display: flex;
    align-items: center;
}

.el-button i {
    margin-right: 5px;
}

.note {

    padding: 20px;
    color: #666;

}

.balance-label {
    font-weight: bold;

}

.balance-amount {
    font-weight: bold;

}

.balance p {
    margin: 10px 0;
}

.name {
    display: flex;
    font-size: 28px;
    /* 将名字文本放大为 28px */
    font-family: "Microsoft YaHei", sans-serif;
    /* 设置名字文本的字体 */
    margin-left: 10px;
    margin-top: -80px
}

.email {
    position: absolute;
    font-size: 16px;
    margin-left: 150px;
    ;
    font-weight: bold;
    color: #000108ad;
}

.status {
    font-size: 16px;
    margin-left: 150px;
    margin-bottom: -70px;
    font-weight: bold;
    color: #000108ad;
    position: absolute;
}

.active {
    color: green;
}
</style>