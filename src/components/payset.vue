<template>
  <div class="tableInfo">
    <div class="searchLine">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商城设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listTable">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="支付设置" name="first">
          <el-switch v-model="sizeForm.payType" active-value='2'
                     inactive-value='1' active-text="微信支付" inactive-text="美团支付"></el-switch>
          <transition name="el-zoom-in-center">
            <div class="createForm" v-if="sizeForm.payType==2">
              <h2>微信支付</h2>
              <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
                <el-form-item label="商户号">
                  <el-input v-model="sizeForm.wxMerchantId"></el-input>
                </el-form-item>
                <el-form-item label="API证书">
                  <el-upload
                    class="upload-demo"
                    :action="actionUrl"
                    :on-success="handleAvatarSuccess"
                    multiple>
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">用以实现自动退款功能。获取方法：微信商户平台> 账户中心 > 账户设置 > API安全 > 下载证书。下载的证书上传即可
                    </div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="API秘钥">
                  <el-input v-model="sizeForm.wxApiKey"></el-input>
                </el-form-item>
                <el-form-item size="large">
                  <el-button type="primary" @click="onSubmit">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
          </transition>
          <transition name="el-zoom-in-center">
            <div class="createForm" v-if="sizeForm.payType==1">
              <h2>美团支付</h2>
              <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
                <el-form-item label="商户号">
                  <el-input v-model="sizeForm.payMerchantId"></el-input>
                </el-form-item>
                <el-form-item size="large">
                  <el-button type="primary" @click="onSubmit">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
          </transition>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<style>
  .tableInfo {
    position: relative;
    vertical-align: top;
    display: inline-block;
    width: 84%;
    left: 1.5vw;
  }

  .createForm {
    padding: 20px 0 30px;
    border-bottom: 1px solid #f2f2f2;
    position: relative;
  }

  .createForm h2 {
    color: #3a3a3a;
  }

  .searchLine {
    position: relative;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
  }

  .listTable {
    max-height: 74vh;
    overflow: auto;
    padding-top: 40px;
    position: relative;
  }

  .searchLine .el-breadcrumb {
    position: absolute;
    bottom: 10px;
  }

  .listTable .searchClass {
    position: absolute;
    width: 12%;
    right: 160px;
    top: 0px;
  }

  .listTable .el-button.btnSearch {
    position: absolute;
    width: 4%;
    right: 60px;
    top: 0px;
  }

  .listTable .searchGroup .el-select, .footerChoose .el-select {
    display: inline-block;
    position: absolute;
    right: 380px;
    top: 0px;
  }

  .el-popper {
    /* min-width: 200.39px !important;
        position: absolute !important;
        top: 162px !important;
        left: 0;
        right: 423px !important; */
    width: 200px;
  }

  .searchGroup {
    position: relative;
    bottom: 20px;
  }

  .block {
    width: 100%;
    margin: 50px auto;
    text-align: center;
  }

  .footerChoose {
    position: relative;
    top: 20px;
  }

  .footerChoose .el-select {
    position: relative;
    left: 0;
  }

  .createForm .el-input__inner {
    width: auto !important;
  }

  .selZoom .el-form-item {
    display: inline-block;
    width: 25%;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .itemHalf {
    display: inline-block;
    width: 48%;
    position: relative;
  }

  .itemHalf .el-input {
    width: 180px;
  }
</style>
<script>
  import editor from './editor'
  import oss from '../appOss.js'

  export default {
    data() {
      return {
        isCollapse: this.GLOBAL.getisCollapse(),
        content: '',
        tableData: [],
        tinymceHtml: 'abc',
        activeName: 'first',
        searchContent: '',
        classfy: '',
        chooseSet: '',
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        picUrl: '',
        total: 0,
        init: {
          height: 300,
          plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
          toolbar:
            'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
          branding: false
        },
        rubData: [],
        dialogFormVisible: false,
        sizeForm: {
          wxMerchantId: '',
          wxApiKey: '',
          merchantId : '',
          payType : "2",
          payMerchantId:''
        },
        cat: [],
        actionUrl: '',
        cerBack: ''
      }
    },
// 	watch: {
// 		isCollapse : a
// 	},

    mounted() {
      // console.log(this._watchers);
      this.getCat();
      this.actionUrl = this.GLOBAL.url.upUrl.replace("{sellerId}", this.GLOBAL.sellerId);
      console.log(this.actionUrl)
    },
    components: {editor},
    methods: {
      formatter(row, column) {
        return row.address;
      },
      getCat() {
        var that = this;
        var url = that.GLOBAL.url.bindInfo.replace("{sellerId}", that.GLOBAL.sellerId);
        that.$axios.get(url)
          .then(function (response) {
            that.sizeForm = response.data.results;
            console.log(response)
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      chooseType(cid) {
        var id = cid;
        var r = this.cat.filter(function (a) {
          return a.id == id;
        });
        return r;
      },
      getData() {
        var that = this;
        var url = this.GLOBAL.url.banner.replace("{sellerId}", this.GLOBAL.sellerId);
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            for (var i = 0; i < response.data.results.length; i++) {
              var name = that.chooseType(response.data.results[i].cid);
              if (name != '') {
                let cName = {cName: name[0].name}
                Object.assign(response.data.results[i], cName);
              } else {
                let cName = {cName: '其他'}
                Object.assign(response.data.results[i], cName);
              }
              let statusCn = {statusCn: that.GLOBAL.typeChange(response.data.results[i].type)};
              Object.assign(response.data.results[i], statusCn);
            }
            that.tableData = response.data.results;
            that.total = response.data.count
          })
          .catch(function (error) {
            console.log(error);
          });
        url = this.GLOBAL.url.settingMall.replace("{sellerId}", this.GLOBAL.sellerId);
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            tinyMCE.activeEditor.setContent(response.data.results.service);
            that.sizeForm = response.data.results;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleDelete(index, info) {
        var that = this;
        console.log(info);
        var url = this.GLOBAL.url.delBanner.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{bannerId}", info.id)
        this.$axios.delete(url)
          .then((res) => {
            console.log(res);
            that.getData();
          })
      },
      upData() {
        var that = this;
        var data = this.sizeForm;
        let info = {
          "wxP12BaseUrl": this.cerBack.wxP12BaseUrl,
          "wxP12Path": this.cerBack.wxP12Path,
          "merchantId" :this.sizeForm.payMerchantId
        };
        Object.assign(data, info);
        var url = this.GLOBAL.url.bindInfo.replace("{sellerId}", this.GLOBAL.sellerId);
        console.log(data);
        this.$axios.post(url, data).then((res) => {
          console.log(res);
          if (res.data.success) {
            that.$message({
              message: '编辑成功',
              type: 'success'
            });
          } else {
            that.$message.error(res.data.message);
          }
        })
      },
      handleAvatarSuccess(res, file) {
        console.log(file);
        this.cerBack = res.results;
        console.log(this.cerBack);
      },
      handleClick() {

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        console.log(file.url);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      onSubmit() {
        this.upData();
      },
      subForm() {
        var that = this;
        console.log(this.bannerForm);
        var url = this.GLOBAL.url.banner.replace("{sellerId}", this.GLOBAL.sellerId);
        this.bannerForm.bannerUrl = this.picUrl;
        this.$axios.post(url, this.bannerForm).then((res) => {
          console.log(res);
          that.$message({
            message: '编辑成功',
            type: 'success'
          });
          this.getData();
        })
      },
      handlePreview(file) {
        console.log(file);
      },
    }
  }
</script>
