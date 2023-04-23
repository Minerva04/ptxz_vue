<template>
    <div class="table-container">

        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/change' }">以物换物</el-breadcrumb-item>
            <el-breadcrumb-item>我的以物换物商品</el-breadcrumb-item>
        </el-breadcrumb>


        <el-input placeholder="输入搜索内容" v-model="queryInfo.name" style="width: 200px; "></el-input>
        <el-select v-model="queryInfo.status" placeholder="选择订单状态" style="width: 200px; margin-left: 20px;">
            <el-option label="所有有物品" value=''></el-option>
            <el-option label="未交换" value="0"></el-option>
            <el-option label="交换中" value="1"></el-option>
            <el-option label="交换完成" value="2"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" circle @click="search" style="margin-left: 20px;"></el-button>

        <el-card style="margin-top: -20px;">
            <el-table :data="myChangeList" stripe style="width: 100%">
                <el-table-column label="索引号" type="index" width="100px" align="center"></el-table-column>
                <el-table-column prop="imgUrl" label="物品图片" align="center" width="80px">
                    <template slot-scope="scope">
                        <img :src="getImg(scope.row.imgUrl)" width="60" height="60" style="border-radius: 5px;">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="物品名称" align="center" width="200px"></el-table-column>
                <el-table-column prop="time" label="发布时间" align="center" width="180px"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="140px">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.status)" size="small">{{ getStatusText(scope.row.status)
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 3" type="success" size="mini" @click="ifReset(scope.row.id)"
                            round>重新上架该物品</el-button>
                        <el-dialog title="重新上架" :visible.sync="resetInfo" width="30%">
                            <span>是否重新上架该物品</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="resetInfo = false">取 消</el-button>
                                <el-button type="primary" @click="reset(checkId)">确 定</el-button>
                            </span>
                        </el-dialog>

                        <el-button v-if="scope.row.status === 0" type="primary" size="mini" @click="initGoods(scope.row.id)"
                            round>修改物品信息</el-button>

                        <el-dialog title="修改物品信息" :visible.sync="changeGoodsInfo">
                            <el-form :model="goodsInfo" ref='goodsForm' label-width="120px" class="form-container"
                                :rules="rules">
                                <el-form-item label="物品名称" prop="name">
                                    <el-input v-model="goodsInfo.name" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="期望交换" prop="price">
                                    <el-input v-model="goodsInfo.hope"></el-input>
                                </el-form-item>
                                <el-form-item label="物品描述" prop="description">
                                    <el-input type="textarea" v-model="goodsInfo.description"></el-input>
                                </el-form-item>
                                <el-form-item label="联系方式" prop="contact">
                                    <el-input v-model="goodsInfo.contact"></el-input>
                                </el-form-item>

                                <div>
                                    <el-form-item label="物品图片" prop="file">
                                        <el-upload ref="upload" class="upload-demo" action="api/file/upload"
                                            :on-success="handleUploadSuccess" :before-upload="beforeUpload"
                                            list-type="picture-card" limit="1" :file-list="fileList"
                                            :before-remove="beforeRemove">
                                            <img v-if="initImg" :src="initImg" class="preview-image"
                                                style="width: 100%; height: 100%;">

                                            <div slot="tip" class="upload-tip">只能上传jpg/png文件,且不超过1MB</div>
                                        </el-upload>

                                    </el-form-item>
                                </div>
                                <el-form-item label="选择区域" prop="area">
                                    <el-select v-model="goodsInfo.area" placeholder="请选择区域">
                                        <el-option label="南区" value='1'></el-option>
                                        <el-option label="北区" value='2'></el-option>
                                        <el-option label="东区" value='3'></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="选择楼栋" prop="building">
                                    <el-select v-model="goodsInfo.building" placeholder="请选择楼栋">
                                        <el-option v-for="n in 20" :key="n" :label="n + '栋'" :value="n"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="选择楼层" prop="floor">
                                    <el-select v-model="goodsInfo.floor" placeholder="请选择楼层">
                                        <el-option v-for="n in 6" :key="n" :label="n + '层'" :value="n"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="选择房间" prop="room">
                                    <el-select v-model="goodsInfo.room" placeholder="请选择房间">
                                        <el-option v-for="n in 20" :key="n" :label="n + '号房间'" :value="n"></el-option>
                                    </el-select>
                                </el-form-item>

                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="changeGoodsInfo = false">取 消</el-button>
                                <el-button type="primary" @click="changeGoods(checkId)">确 定</el-button>
                            </div>
                        </el-dialog>


                        <el-button type="warning" v-if="scope.row.status === 0" size="mini"
                            @click="pushChange(scope.row.id)" round>发起的交换</el-button>

                        <el-button type="warning" v-if="scope.row.status === 0" size="mini"
                            @click="acceptChange(scope.row.id)" round>被发起的交换</el-button>

                        <el-button type="info" size="mini" @click="checkGoods(scope.row.id)" round>查看详情</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="checkDelete(scope.row.status, scope.row.id)"
                            circle></el-button>

                        <el-dialog title="删除物品" :visible.sync="deleteGoodsInfo" width="30%">
                            <span>确认删除当前物品吗？</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="deleteOrderInfo = false">取 消</el-button>
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
        <!-- 发起的交换 -->
        <el-dialog title="发起的交换" :visible.sync="pushChangeInfo">
            <el-input placeholder="输入搜索内容" v-model="queryInfo1.name" style="width: 200px; "></el-input>
            <el-select v-model="queryInfo1.status" placeholder="选择订单状态" style="width: 200px; margin-left: 20px;">
                <el-option label="所有有物品" value=''></el-option>
                <el-option label="等待对方处理" value="0"></el-option>
                <el-option label="已拒绝" value="2"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" circle @click="search1" style="margin-left: 20px;"></el-button>
            <el-table :data="pushChangeList" stripe style="width: 100%">
                <el-table-column label="索引号" type="index" width="100px" align="center"></el-table-column>
                <el-table-column prop="acImg" label="物品图片" align="center" width="80px">
                    <template slot-scope="scope">
                        <img :src="getImg(scope.row.acImg)" width="60" height="60" style="border-radius: 5px;">
                    </template>
                </el-table-column>
                <el-table-column prop="acceptGoodsName" label="物品名称" align="center" width="200px"></el-table-column>
                <el-table-column prop="time" label="发布时间" align="center" width="180px"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="140px">
                    <template slot-scope="scope">
                        <el-tag :type="getPushChangeStatusType(scope.row.status)" size="small">{{
                            getPushChangeStatusText(scope.row.status)
                        }}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能部分 -->
            <div class="block1">
                <el-pagination ref="pagination1" @size-change="handleSizeChange1" @current-change="handleCurrentChange1"
                    :current-page=this.queryInfo1.pageNum :page-sizes="[6, 3, 5]" :page-size=this.queryInfo1.pageSize
                    layout="total, sizes, prev, pager, next, jumper" :total=this.total1>
                </el-pagination>
            </div>
        </el-dialog>

        <!-- 被发起的交换 -->
        <el-dialog title="被发起的交换" :visible.sync="acceptChangeInfo">
            <el-input placeholder="输入搜索内容" v-model="queryInfo2.name" style="width: 200px; "></el-input>
            <el-select v-model="queryInfo2.status" placeholder="选择订单状态" style="width: 200px; margin-left: 20px;">
                <el-option label="所有有物品" value=''></el-option>
                <el-option label="等待处理" value="0"></el-option>
                <el-option label="已拒绝" value="2"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" circle @click="search2" style="margin-left: 20px;"></el-button>
            <el-table :data="acceptChangeList" stripe style="width: 100%">
                <el-table-column label="索引号" type="index" width="80px" align="center"></el-table-column>
                <el-table-column prop="sendImg" label="物品图片" align="center" width="60px">
                    <template slot-scope="scope">
                        <img :src="getImg(scope.row.sendImg)" width="60" height="60" style="border-radius: 5px;">
                    </template>
                </el-table-column>
                <el-table-column prop="launchGoodsName" label="物品名称" align="center" width="100px"></el-table-column>
                <el-table-column prop="time" label="发起时间" align="center" width="180px"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="100px">
                    <template slot-scope="scope">
                        <el-tag :type="getAcceptChangeStatusType(scope.row.status)" size="small">{{
                            getAcceptChangeStatusText(scope.row.status)
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 0" type="success" size="mini" @click="agree(scope.row.id)"
                            round>同意</el-button>
                        <el-button v-if="scope.row.status === 0" type="danger" size="mini" @click="refuse(scope.row.id)"
                            round>拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页功能部分 -->
            <div class="block1">
                <el-pagination ref="pagination1" @size-change="handleSizeChange2" @current-change="handleCurrentChange2"
                    :current-page=this.queryInfo2.pageNum :page-sizes="[6, 3, 5]" :page-size=this.queryInfo2.pageSize
                    layout="total, sizes, prev, pager, next, jumper" :total=this.total2>
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
export default {
    mounted() {
        if (window.sessionStorage.getItem('mychangeNum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('mychangeNum');

        }
        if (window.sessionStorage.getItem('mychangeSize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('mychangeSize');
        }
        this.getMyChangeList();

    },
    data() {

        var fileRule = (rules, value, callback) => {

            if (this.goodsInfo.imgUrl) {
                callback();
            } else {
                callback(new Error('请上传图片'));
            }
        };
        return {
            pushChangeList: [],
            myChangeList: [],
            fileList: [],
            acceptChangeList: [],
            queryInfo: {
                pageNum: 1,
                pageSize: 10,
                name: '',
                status: ''
            },
            queryInfo1: {
                pageNum: 1,
                pageSize: 6,
                name: '',
                status: ''
            },
            queryInfo2: {
                pageNum: 1,
                pageSize: 6,
                name: '',
                status: ''
            },
            goodsInfo: {
                name: '',
                hope: '',
                description: '',
                imgUrl: '',
                area: '',
                building: null,
                floor: null,
                room: null,
                contact: ''
            },
            total: '',
            total1: '',
            total2: '',
            initImg: '',
            changeGoodsInfo: false,
            checkId: '',
            deleteGoodsInfo: false,
            pushChangeInfo: false,
            acceptChangeInfo: false,
            resetInfo:false,
            rules: {
                name: [
                    { required: true, message: "请输入商品名称", trigger: "blur" },
                    { max: 10, min: 1, message: "名称长度在10个字符以内", trigger: "blur" },
                ],
                description: [
                    { required: true, message: "请输入商品描述", trigger: "blur" },
                    { max: 50, min: 1, message: "描述长度在50个字符以内", trigger: "blur" },
                ],
                hope: [
                    { required: true, message: "请输入期望交换", trigger: "blur" },
                    { max: 50, min: 1, message: "描述长度在50个字符以内", trigger: "blur" },
                ],
                contact: [
                    { required: true, message: "请输入联系方式", trigger: "blur" },
                    { max: 20, min: 1, message: "联系方式长度在20个字符以内", trigger: "blur" },
                ],
                //验证是否上传图片
                file: [
                    {
                        required: true,
                        validator: fileRule,
                        trigger: 'blur'
                    }
                ],
                area: [
                    { required: true, message: '请选择校区', trigger: 'change' }
                ],
                building: [
                    { required: true, message: '请选择楼栋', trigger: 'change' }
                ],
                floor: [
                    { required: true, message: '请选择楼层', trigger: 'change' }
                ],
                room: [
                    { required: true, message: '请选择房间', trigger: 'change' }
                ]
            },

        }
    },
    methods: {
        ifReset(id){
            this.checkId=id;
            this.resetInfo=true;
        },
        reset(id){
            this.$http.put(`changegoods/reset/${id}`).then((res) => {
                if (res.data.code == 1) {
                   this.resetInfo=false;
                   this.$message.success(res.data.data);
                   this.getMyChangeList();
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })
        },
        acceptChange(id) {
            this.acceptChangeInfo = true;
            this.checkId = id;
            this.$http.get(`changegoods/acceptchange/${id}`, { params: { pageNum: this.queryInfo2.pageNum, pageSize: this.queryInfo2.pageSize, name: this.queryInfo2.name, status: this.queryInfo2.status } }).then((res) => {
                if (res.data.code == 1) {
                    this.acceptChangeList = res.data.data.records
                    this.total2 = res.data.data.total;
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })
        },
        agree(id) {
            this.$http.put(`changegoods/agree/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.getMyChangeList();
                    this.$message.success(res.data.data);
                    this.acceptChangeInfo = false;
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })

        },
        refuse(id) {
            this.$http.put(`changegoods/refuse/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
                    this.acceptChange(this.checkId);
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })
        },
        pushChange(id) {
            this.pushChangeInfo = true;
            this.checkId = id;
            this.$http.get(`changegoods/pushchange/${id}`, { params: { pageNum: this.queryInfo1.pageNum, pageSize: this.queryInfo1.pageSize, name: this.queryInfo1.name, status: this.queryInfo1.status } }).then((res) => {
                if (res.data.code == 1) {
                    this.pushChangeList = res.data.data.records
                    this.total1 = res.data.data.total;
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })
        },
        checkDelete(status, id) {
            if (status === 1) {
                this.$message.error("当前商品处于交换状态无法删除")
            } else {
                this.deleteGoodsInfo = true
                this.checkId = id;
            }
        },
        deleteGoods(id) {
            this.deleteGoodsInfo = false;
            this.$http.delete(`changegoods/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
                    this.getMyChangeList();
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })
        },
        checkGoods(id1) {
            this.$router.push({
                path: '/changegoodsdetail',
                query: { id: id1, from: 'mychangegoods' }
            })
        },


        getStatusType(status) {
            if (status === 0) {
                return 'info';
            } else if (status === 1) {
                return 'warning';
            } else if (status === 2) {
                return 'success';
            } else if (status === 3) {
                return 'danger'
            }
        },
        getStatusText(status) {
            if (status === 0) {
                return '未交换';
            } else if (status === 1) {
                return '交换中';
            } else if (status === 2) {
                return '交换完成';
            } else if (status === 3) {
                return '交换取消';
            }
        },
        getPushChangeStatusType(status) {
            if (status === 0) {
                return 'info';
            } else if (status === 2) {
                return 'warning';
            }
        },
        getPushChangeStatusText(status) {
            if (status === 0) {
                return '等待对方处理';
            } else if (status === 2) {
                return '已拒绝';
            }
        },
        getAcceptChangeStatusType(status) {
            if (status === 0) {
                return 'info';
            } else if (status === 2) {
                return 'warning';
            }
        },
        getAcceptChangeStatusText(status) {
            if (status === 0) {
                return '等待处理';
            } else if (status === 2) {
                return '已拒绝';
            }
        },
        getMyChangeList() {
            this.$http.get('changegoods/mychangegoods', { params: { pageNum: this.queryInfo.pageNum, pageSize: this.queryInfo.pageSize, name: this.queryInfo.name, status: this.queryInfo.status } }).then((res) => {
                if (res.data.code == 1) {
                    this.myChangeList = res.data.data.records;
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
            window.sessionStorage.setItem('mychangeSize', newsize);
            this.getMyChangeList();
        },
        //分页改变事件
        handleCurrentChange(newpage) {
            this.queryInfo.pageNum = newpage;
            window.sessionStorage.setItem('mychangeNum', newpage);
            this.getMyChangeList();
        },
        handleSizeChange1(newsize) {
            this.queryInfo1.pageSize = newsize;
            this.pushChange(this.checkId);
        },
        //分页改变事件
        handleCurrentChange1(newpage) {
            this.queryInfo1.pageNum = newpage;
            this.pushChange(this.checkId);
        },
        handleSizeChange2(newsize) {
            this.queryInfo2.pageSize = newsize;
            this.acceptChange(this.checkId);
        },
        //分页改变事件
        handleCurrentChange2(newpage) {
            this.queryInfo2.pageNum = newpage;
            this.acceptChange(this.checkId);
        },
        getImg(img) {
            return `http://localhost:7070/api/file/download?name=${img}`
        },
        search() {
            this.queryInfo.pageNum = 1;
            this.getMyChangeList();
        },
        search1() {
            this.queryInfo1.pageNum = 1;
            this.pushChange(this.checkId);
        },
        search2() {
            this.queryInfo1.pageNum = 1;
            this.acceptChange(this.checkId);
        },

        handleUploadSuccess(response, file, fileList) {
            this.goodsInfo.imgUrl = response.data
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
                this.initImg = ''

                return file
            }
        },
        beforeRemove(file) {
            this.fileList = [];
            this.goodsInfo.imgUrl = '';
        },

        initGoods(id) {
            this.fileList = [];
            this.$http.get(`changegoods/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.goodsInfo = { ...res.data.data }
                    this.goodsInfo.area = res.data.data.area + ''
                    this.initImg = `http://localhost:7070/api/file/download?name=${this.goodsInfo.imgUrl}`
                    this.changeGoodsInfo = true;
                    this.checkId = id;
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })

        },
        changeGoods(id) {
            this.$refs.goodsForm.validate(valid => {
                if (valid) {
                    this.$http.put(`changegoods/change/${id}`, this.goodsInfo).then((res) => {

                        if (res.data.code == 1) {
                            this.changeGoodsInfo = false;
                            this.$message.success("修改成功");
                            this.getMyChangeList();
                        } else if (res.data.code == 2) {
                            this.$message.error(res.data.msg);
                            window.sessionStorage.clear();
                            this.$router.push('/login');
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }
            })
        }

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

.block1 {
    margin-left: -200px;
}</style>