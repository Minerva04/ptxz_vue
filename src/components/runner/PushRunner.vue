<template>
    <div class="add-product">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>跑腿</el-breadcrumb-item>
            <el-breadcrumb-item>发布跑腿</el-breadcrumb-item>
        </el-breadcrumb>
        <h2>发布跑腿</h2>
        <el-form :model="form" ref='goodsForm' label-width="120px" class="form-container" :rules="rules">
            <el-form-item label="类型描述" prop="type">
                <el-input v-model="form.type" clearable></el-input>
            </el-form-item>
            <el-form-item label="需要垫付" prop="needMoney">
                <el-input v-model="form.needMoney"></el-input>
            </el-form-item>
            <el-form-item label="跑腿费" prop="reward">
                <el-input v-model="form.reward"></el-input>
            </el-form-item>
            <el-form-item label="详细信息" prop="description">
                <el-input type="textarea" v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="form.contact"></el-input>
            </el-form-item>
            <div class="btn-container">
                <el-button type="primary" @click="dialogVisible=true">发布跑腿</el-button>
                <el-dialog title="发布跑腿" :visible.sync="dialogVisible" width="30%">
                    <span>
                        确定发布该订单吗？
                        发布之后将冻结相应的垫付金额和跑腿费。
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false">取 消</el-button>
                        <el-button type="primary" @click="handleSubmit">确 定</el-button>
                    </span>
                </el-dialog>
                <el-button @click="handleReset">重置</el-button>
            </div>
        </el-form>
    </div>
</template>
  
<script>
export default {
    data() {

        return {
            form: {
                type: '',
                needMoney: null,
                description: '',
                reward: '',
                contact: ''
            },
            dialogVisible:false,
            rules: {
                type: [
                    { required: true, message: "请输入类型描述", trigger: "blur" },
                    { max: 10, min: 1, message: "名称长度在5个字符以内", trigger: "blur" },
                ],
                description: [
                    { required: true, message: "请输入详细信息", trigger: "blur" },
                    { max: 50, min: 1, message: "长度在50个字符以内", trigger: "blur" },
                ],
                contact: [
                    { required: true, message: "请输入联系方式", trigger: "blur" },
                    { max: 20, min: 1, message: "联系方式长度在20个字符以内", trigger: "blur" },
                ],


                needMoney: {
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            callback(new Error('请填写对方所需垫付的钱'))
                        } else {
                            const reg = /^\d+(\.\d{0,2})?$/
                            if (reg.test(value)) {
                                if (value < 10000) {
                                    callback()
                                } else {
                                    callback(new Error('所需垫付的钱小于10000'))
                                }
                            } else {
                                callback(new Error('所需垫付的钱格式只能为数字,且最多保留两位数字'))
                            }
                        }
                    },
                    trigger: 'blur',
                },
                reward: {
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            callback(new Error('请填写跑腿费'))
                        } else {
                            const reg = /^\d+(\.\d{0,2})?$/
                            if (reg.test(value)) {
                                if (value < 10000) {
                                    callback()
                                } else {
                                    callback(new Error('跑腿费小于10000'))
                                }
                            } else {
                                callback(new Error('跑腿费格式只能为数字,且最多保留两位数字'))
                            }
                        }
                    },
                    trigger: 'blur',
                },
            },
        };
    },
    methods: {

        handleSubmit() {
           this.dialogVisible=false;
            this.$refs.goodsForm.validate(valid => {

                if (valid) {

                    // 将表单数据提交到后端
                    this.$http.post('runner/add', this.form).then((resp) => {
                        if (resp.data.code == 1) {
                            this.$message.success("发布成功");
                            this.handleReset();
                        } else if (resp.data.code == 2) {
                            this.$message.error(resp.data.msg);
                            this.handleReset();
                            window.sessionStorage.clear();
                            this.$router.push('/login');
                        } else {
                            this.$message.error(resp.data.msg);
                        }
                    });
                }
            })

        },
        handleReset() {
            this.form.type = '';
            this.form.needMoney = '';
            this.form.description = '';
            this.form.reward = '';
            this.form.contact = ''
        },
    }
};
</script>
  
<style scoped>
.add-product {
    margin: 20px;
}

.form-container {
    max-width: 500px;
}

.el-form-item__label {
    font-weight: bold;
    font-size: 16px;
}

.upload-demo .el-upload-list {
    display: flex !important;
    flex-wrap: wrap;
}

.el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
}

.el-upload-list--picture-card .el-upload-list__item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.el-upload-list--picture-card .el-upload-list__item i {
    font-size: 28px;
    color: #999;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 5px;
    transition: all 0.2s;
}

.el-upload-list--picture-card .el-upload-list__item:hover i {
    color: #666;
}

.upload-tip {
    color: #999;
    font-size: 12px;
    margin-top: 5px;
}

.btn-container {
    text-align: center;
    margin-top: 20px;
}
</style>