<template>
  <div class="tableInfo">
    <div class="searchLine">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listTable">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="轮播设置" name="second">
          <el-table
            :data="tableData"
            style="width: 100%"
            stripe>
            <el-table-column
              prop="id"
              label="ID"
              sortable
              width="80"
            >
            </el-table-column>
            <el-table-column
              label="轮播图"
              width="180"
              align="center"
            >
              <template slot-scope="scope">
                <img :src="tableData[scope.$index].bannerUrl" style="width: 105px;height: 65px;"/>
              </template>
            </el-table-column>
            <el-table-column
              prop="statusCn"
              label="类型"
              width="120"
              align="center">
            </el-table-column>
            <el-table-column
              prop="cid"
              label="商品分类"
              :filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
              :filter-method="filterTag"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.tag === '家' ? 'primary' : 'success'"
                  disable-transitions>{{scope.row.cName}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="url "
              label="Url">
            </el-table-column>
            <el-table-column
              prop="numIid"
              label="商品ID"
              width="80"
            >
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">修改
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="基本设置" name="first">
          <div class="createForm">
            <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
              <el-form-item label="商城名称">
                <el-input v-model="sizeForm.mallName"></el-input>
              </el-form-item>
              <el-form-item label="小程序图标">
                <el-upload
                  class="avatar-uploader"
                  action=""
                  :http-request="fnUploadRequest"
                  :show-file-list="false"
                >
                  <img :src="sizeForm.logo != ''? picUrl != '' ? picUrl : sizeForm.logo: picUrl" class="avatar"
                       v-if="picUrl !='' ||sizeForm.logo!=''">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <!--<el-upload action=""-->
                  <!--:http-request="fnUploadRequest">-->
                  <!--<img :src="sizeForm.logo" style="height: 130px;height: 130px;">-->
                  <!--<i v-if="picUrl==''" class="el-icon-plus avatar-uploader-icon"></i>-->
                </el-upload>
              </el-form-item>
              <el-form-item label="运费设置">
                <el-radio-group v-model="sizeForm.freeAll" size="medium">
                  <el-radio border label="true">免运费</el-radio>
                  <el-radio border label="false">运费设置</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-collapse-transition>
                <div v-show="sizeForm.freeAll == 'false'">
                  <el-form-item label="每单运费">
                    <el-input v-model="sizeForm.postFee" style="display: inline-block;width:auto;"></el-input>
                    <span>元，单笔订单满</span>
                    <el-input v-model="sizeForm.freeFee" style="display: inline-block;width:auto;"></el-input>
                    <span>免运费</span>
                  </el-form-item>
                  <el-form-item label="是否会员免运费">
                    <el-radio-group v-model="sizeForm.crmFreeFee" size="medium">
                      <el-radio border label="true">开启</el-radio>
                      <el-radio border label="false">关闭</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-collapse-transition>
                    <div v-show="sizeForm.crmFreeFee == 'true'">
                      <el-form-item label="等级高于">
                        <el-select v-model="sizeForm.crmFreeLevel" placeholder="请选择活动区域"
                                   style="display: inline-block;width:auto;">
                          <el-option label="等级1" value="level1"></el-option>
                          <el-option label="等级2" value="level2"></el-option>
                        </el-select>
                        <span>时免邮</span>
                      </el-form-item>
                    </div>
                  </el-collapse-transition>
                </div>
              </el-collapse-transition>
              <el-form-item label="商城介绍">
                <el-input
                  type="textarea"
                  :rows="5"
                  placeholder="请输入内容"
                  v-model="sizeForm.descr"
                  style="width: 50%;">
                </el-input>
              </el-form-item>
              <el-form-item label="客服电话">
                <el-input v-model="sizeForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="商城服务">
                <editor :height=400 ref="editor" :value="content" @input="(content)=> content = content"></editor>
              </el-form-item>
              <el-form-item size="large">
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="classfy">
      <el-dialog title="编辑轮播图信息" :visible.sync="dialogFormVisible">
        <div class="createForm">
          <el-form ref="form" :model="bannerForm" label-width="80px" size="mini">
            <el-form-item label="商品ID" class="itemHalf" prop="name">
              <el-input v-model="bannerForm.numIid"></el-input>
            </el-form-item>
            <el-form-item label="所属分类" class="itemHalf">
              <el-select v-model="bannerForm.cid" placeholder="请选择商品分类">
                <el-option
                  v-for="item in cat"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="自定义链接" class="itemHalf" v-if="bannerForm.tags=='3'">
              <el-input v-model="bannerForm.url"></el-input>
            </el-form-item>
            <el-form-item label="轮播图类型" class="itemHalf">
              <el-select v-model="bannerForm.tags" placeholder="请选择商品分类">
                <el-option
                  v-for="item in tag"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品封面图">
              <p>尺寸750*360-1500*720,大小500kb以内,jpg,png格式</p>
              <el-upload action=""
                         :http-request="fnUploadRequest"
              >
                <i v-if="picUrl==''" class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="subForm">确 定</el-button>
        </div>
      </el-dialog>
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
        bannerForm: {
          bannerUrl: ''
        },
        choose: [{
          value: '选项1',
          label: '下架'
        }, {
          value: '选项2',
          label: '删除'
        }],
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        total: 0,
        sizeForm: {
          mallName: '',
          logo: '',
          // delivery: false,
          descr: '',
          freeAll: '',
          freeFee: '',
          id: 0,
          phone: '',
          crmFreeFee: false
        },
        init: {
          height: 300,
          plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
          toolbar:
            'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
          branding: false
        },
        rubData: [],
        dialogFormVisible: false,
        tag: [
          {
            value: '1',
            label: '商品'
          }, {
            value: '2',
            label: '分类'
          }, {
            value: '3',
            label: '自定义链接'
          }
        ],
        cat: []
      }
    },
// 	watch: {
// 		isCollapse : a
// 	},

    mounted() {
      // console.log(this._watchers);
      this.getCat();
      tinymce.init({})
    },
    components: {editor},
    methods: {
      formatter(row, column) {
        return row.address;
      },
      getCat() {
        var that = this;
        var url = that.GLOBAL.url.cat.replace("{sellerId}", that.GLOBAL.sellerId);
        that.$axios.get(url)
          .then(function (response) {
            that.cat = response.data.results;
            that.getData();
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
        console.log(r)
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
        data.logo = this.picUrl;
        data.service = tinyMCE.activeEditor.getContent();
        var url = this.GLOBAL.url.settingMall.replace("{sellerId}", this.GLOBAL.sellerId);
        console.log(data);
        this.$axios.put(url, data).then((res) => {
          console.log(res);
          if(res.data.success){
            that.$message({
              message: '编辑成功',
              type: 'success'
            });
          }else{
            that.$message.error({
              message: res.data.message
            });
          }
          that.getData();
        })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
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
      async fnUploadRequest(option) {
        var that = this;
        oss.ossUploadFile(option)
          .then(function (res) {
            console.log(res.fileUrl);
            setTimeout(function () {
              // that.dialogVisible = true;
              that.picUrl = res.fileUrl;
            }, 300)
          });
      },
      handleEdit(index, info) {
        this.dialogFormVisible = true;
        this.bannerForm = info;
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
      }
    }
  }
</script>
