<template>
  <div class="arbitration">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/twohandjudging' }">二手交易仲裁</el-breadcrumb-item>
      <el-breadcrumb-item>仲裁资料</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="seller">
      <h3>卖家仲裁资料</h3>
      <img :src="this.busineessJudging.imag" alt="卖家暂未提供图片" style="width: 300px;cursor: pointer" @click="cheackBisImg">
      <p>卖家描述:{{ this.busineessJudging.description }}</p>
      <p class="published-time">提交时间：{{ this.busineessJudging.commitTime }}</p>
    </div>
    <div class="buyer">
      <h3>买家仲裁资料</h3>
      <img :src="this.customJudging.imag" alt="买家暂未提供图片" style="width: 300px;cursor: pointer" @click="cheackCusImg">
      <p>买家描述:{{ this.customJudging.description }}</p>
      <p class="published-time">提交时间：{{ this.customJudging.commitTime }}</p>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="returnMoneyInfo = true">退款给买家</el-button>
      <el-dialog title="退款给买家" :visible.sync="returnMoneyInfo" width="30%">
        <span>确定退款给买家吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="returnMoneyInfo = false">取 消</el-button>
          <el-button type="primary" @click="returnMoney">确 定</el-button>
        </span>
      </el-dialog>
      <el-button type="primary" @click="returnMoneyfwInfo = true" style="margin-left: 20px;">自定义退款金额</el-button>

    </div>
    <el-dialog title="退款给买家" :visible.sync="returnMoneyfwInfo" width="30%">
      <el-form ref='goodsForm' :model="moneyfw" :rules="rules">
        <el-form-item label="输入退还金额" prop="money">
          <el-input v-model="moneyfw.money"></el-input>
        </el-form-item>
        <div>
          <el-button type="primary" @click="returnMoneyfw">退款</el-button>
          <el-button @click="returnMoneyfwInfo = false">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>

export default {
  created() {
    this.getBusineessJudging();
    this.getCustomJudging();
  },
  data() {
    return {
      busineessJudging: {
        imag: '',
        description: '',
        commitTime: ''
      },
      customJudging: {
        imag: '',
        description: '',
        commitTime: ''
      },
      returnMoneyInfo: false,
      returnMoneyfwInfo: false,
      moneyfw: {
        money: ''
      },
      rules: {
        money: {
          required: true,
          validator: (rules, value, callback) => {
            if (!value) {
              callback(new Error('请填写退还金额'))
            } else {
              const reg = /^\d+(\.\d{0,2})?$/
              if (reg.test(value)) {
                if (value < 10000) {
                  callback()
                } else {
                  callback(new Error('退还金额小于10000'))
                }
              } else {
                callback(new Error('退还金额格式只能为数字,且最多保留两位数字'))
              }
            }
          },
          trigger: 'blur',
        },

      }
    };
  },
  methods: {
    returnMoneyfw() {
      this.$refs.goodsForm.validate(valid => {
        if (valid) {
          this.$http.put(`goodsorder/returnfw/${this.$route.query.id}`, this.moneyfw).then((res) => {
            if (res.data.code == 1) {
              this.returnMoneyfwInfo = false;
              this.$message.success(res.data.data);
              this.$router.push('/twohandjudging')
            } else if (res.data.code == 2) {
              this.$message.error(res.data.msg);
              window.sessionStorage.clear();
              this.$router.push('/login')
            } else {
              this.$message.error(res.data.msg);
            }

          })
        }
      })
    },
    returnMoney() {
      this.$http.put(`goodsorder/return/${this.$route.query.id}`).then((res) => {
        if (res.data.code == 1) {
          this.returnMoneyInfo = false;
          this.$message.success(res.data.data);
          this.$router.push('/twohandjudging')
        } else if (res.data.code == 2) {
          this.$message.error(res.data.msg);
          window.sessionStorage.clear();
          this.$router.push('/login')
        } else {
          this.$message.error(res.data.msg);
        }

      })
    },
    getBusineessJudging() {
      this.$http.get(`judging/business/${this.$route.query.id}`).then((res) => {
        if (res.data.code == 1) {
          this.busineessJudging = { ...res.data.data }
          this.busineessJudging.imag = this.getimg(this.busineessJudging.imag);
        } else if (res.data.code == 2) {
          this.$message.error(res.data.msg);
          window.sessionStorage.clear();
          this.$router.push('/login')
        } else {
          this.$message.error(res.data.msg);
        }

      })
    },
    getCustomJudging() {
      this.$http.get(`judging/custom/${this.$route.query.id}`).then((res) => {
        if (res.data.code == 1) {
          this.customJudging = { ...res.data.data }
          this.customJudging.imag = this.getimg(this.customJudging.imag);
        } else if (res.data.code == 2) {
          this.$message.error(res.data.msg);
          window.sessionStorage.clear();
          this.$router.push('/login')
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },

    getimg(img) {
      return `http://localhost:7070/api/file/download?name=${img}`
    },
    cheackBisImg() {
      window.open(this.busineessJudging.imag, '_blank');
    },
    cheackCusImg() {
      window.open(this.customJudging.imag, '_blank');
    }
  },
};
</script>
  
<style scoped>
.arbitration {
  display: flex;
  flex-direction: column;
}

.seller,
.buyer {
  margin-bottom: 20px;
}

/* .buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
} */

.published-time {
  font-size: 16px;
  color: #999;
  margin-bottom: 10px;
}
</style>