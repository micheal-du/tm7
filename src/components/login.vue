<template>
  <div class="hollologin">
    <el-container>
      <el-main>
        <h1 class="tit">超级SC商城后台管理系统</h1>
        <div class="login">
          <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input v-model.number="ruleForm2.Admin"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="ruleForm2.pass" auto-complete="off" @keyup.enter= "submitForm('ruleForm2')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm2')" >提交</el-button>
              <el-button @click="resetForm('ruleForm2')">重置</el-button>
            </el-form-item>
          </el-form>
          <div class="loginb">
          </div>
        </div>
      </el-main>
    </el-container>
  </div>

</template>


<script>
  export default {
    name : 'home',
    data() {
      var checkAdmin = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        info : [],
        ruleForm2: {
          pass: '',
          age: '',
          Admin : ''
        },
        rules2: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          Admin: [
            { validator: checkAdmin, trigger: 'blur' }
          ]
        }
      };
    },
    mounted(){

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ruleForm2.Admin== 'admin' && this.ruleForm2.pass== 'admin'){
              localStorage.setItem("admin", this.ruleForm2);
              this.GLOBAL.sellerId = 3405474861;
              this.GLOBAL.baseUrl = 'https://scmall.thinkmacro.cn';
              this.GLOBAL.url = this.GLOBAL.changUrl(this.GLOBAL.baseUrl);
              this.$router.push('/');
            }else if(this.ruleForm2.Admin== 'beta' && this.ruleForm2.pass== 'beta'){
              localStorage.setItem("admin", this.ruleForm2);
              this.GLOBAL.sellerId = 2589123516;
              this.GLOBAL.baseUrl = 'https://scmall-beta.thinkmacro.cn';
              this.GLOBAL.url = this.GLOBAL.changUrl(this.GLOBAL.baseUrl);
              console.log(this.GLOBAL.url);
              this.$router.push('/');
            }else{
              alert('账号或密码错误')
            }
          } else {
            console.log('1231')
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style>
  .hollologin .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height: 100vh;
    background: url(../../static/img/bak.jpg);
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .login{
    margin: 0 auto;
    vertical-align: middle;
    height: 350px;
    width: 460px;
    position: relative;
    top: 25vh;
    z-index: 22;
  }
  .hollologin .loginb{
    margin: 0 auto;
    vertical-align: middle;
    height: 305px;
    width: 460px;
    position: absolute;
    background: white;
    opacity: .3;
    top: 0;
    z-index: 0;
  }
  .hollologin .el-form {
    width: 70%;
    position: relative;
    top: 60px;
    left: 40px;
    z-index: 22;
    margin-bottom: 45px;
  }
  .hollologin .el-button{
    margin-right:30px ;
    margin-top: 5px;
  }
  .hollologin .logoit{
    position: relative;
    top: 20px;
    z-index: 22;
    width: 35%;
  }
  .hollologin .el-form-item {
    margin-bottom: 30px;
  }
  .hollologin .el-form-item__label{
    color: #FFFFFF;
  }
  h1.tit{
    color: #FFFFFF;
    position: relative;
    top: 150px;
  }
</style>
