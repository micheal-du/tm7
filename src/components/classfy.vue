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
        <el-tab-pane label="商品分类" name="trade">
          <el-table
            :data="allData"
            style="width: 100%"
            stripe>
            <el-table-column
              prop="order"
              label="排序"
              width="60"
            >
              <template slot-scope="scope">
                <el-input v-model="allData[scope.$index].order" placeholder="请输入序号" @blur="blurOrder(allData[scope.$index])"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="图片"
              sortable
              width="180"
              align = "center"
            >
              <template slot-scope="scope">
                <img :src="allData[scope.$index].icon" style="height: 60px; width: 60px;" />
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="分类名称">

            </el-table-column>
            <el-table-column
              label="加入热推"
              width="80">
              <template slot-scope="scope">
                <el-switch v-model="allData[scope.$index].hot" @change = "changeHot(allData[scope.$index].id,allData[scope.$index].hot)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="分类显示"
              width="120"
            >
              <template slot-scope="scope">
                <el-switch v-model="allData[scope.$index].status" @change = "changeStatus(allData[scope.$index])"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="新建分类" name="item">

        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="classfy">
      <el-dialog title="新建分类信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="分类名称">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类logo">
            <el-upload
              class="avatar-uploader"
              action=""
              :http-request="fnUploadRequest"
              :show-file-list="false"
            >
              <img :src="form.icon != ''? picUrl != '' ? picUrl : form.icon: picUrl" class="avatar" v-if="picUrl !='' ||form.icon!=''">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="数量单位">
            <el-input v-model="form.quantityUnit" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="分类排序">
            <el-input v-model="form.order" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-switch
              v-model="form.status"
              active-text="隐藏"
              inactive-text="显示">
            </el-switch>
            <el-switch
              v-model="form.hot"
              active-text="加入热推"
              inactive-text="取消热推">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false;activeName = 'trade'">取 消</el-button>
          <el-button type="primary" @click="subForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="block" v-if="activeName == 'trade' || activeName == 'item'">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total= 'total'>
      </el-pagination>
    </div>
  </div>
</template>
<style>
  .tableInfo{
    position: relative;
    vertical-align: top;
    display: inline-block;
    width: 84%;
    left: 1.5vw;
  }
  .searchLine{
    position: relative;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
  }
  .listTable{
    max-height: 74vh;
    overflow: auto;
    padding-top: 40px;
    position: relative;
  }
  .searchLine .el-breadcrumb{
    position: absolute;
    bottom: 10px;
  }
  .listTable .searchClass{
    position: absolute;
    width: 12%;
    right: 160px;
    top: 0px;
  }
  .listTable .el-button.btnSearch{
    position: absolute;
    width: 4%;
    right: 60px;
    top: 0px;
  }
  .listTable .searchGroup .el-select ,.footerChoose .el-select{
    display: inline-block;
    position:absolute;
    right: 380px;
    top: 0px;
  }
  .el-popper{
    width: 200px;
  }
  .searchGroup{
    position: relative;
    bottom: 20px;
  }
  .block{
    width: 100%;
    margin: 50px auto;
    text-align: center;
  }
  .footerChoose{
    position: relative;
    top: 20px;
  }
  .footerChoose .el-select{
    position: relative;
    left: 0;
  }
  .createForm .el-input__inner{
    width: auto !important;
  }
  .selZoom .el-form-item{
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
  .classfy .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 123px;
    height: 123px;
    line-height: 123px;
    text-align: center;
  }
  .classfy  .avatar {
    width: 123px;
    height: 123px;
    display: block;
  }
  .classfy .el-input{
    width: 17% !important;
  }
  .classfy .el-switch{
    padding-right: 90px;
  }
</style>
<script>
  import oss from '../appOss.js'
  export default {
    data() {
      return {
        allData: [],
        tinymceHtml:'abc',
        activeName: 'trade',
        searchContent: '',
        classfy : '',
        chooseSet : '',
        dialogImageUrl: '',
        dialogVisible: false,
        total : 0,
        rubData :[],
        dialogFormVisible:false,
        typeClass : 0,
        form:{
          hot: false,
          status: false,
          id : 0,
          icon: '',
          parentCid : 0
        },
        pageNo : 1,
        picUrl : ''
      }
    },
    mounted(){
      this.getData(this.pageNo);
      // this.test();
    },
    methods: {
      getData(pageNo){
        var that = this;
        var url = this.GLOBAL.url.cat.replace("{sellerId}",this.GLOBAL.sellerId);
        url = url + '?curPage=' + pageNo;
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            for(let i = 0 ; i< response.data.results.length ; i++){
              response.data.results[i].createTs = that.GLOBAL.changeTime(response.data.results[i].createTs);
              if(response.data.results[i].status == 1){
                response.data.results[i].status = true;
              }else{
                response.data.results[i].status = false;
              }
            }
            that.allData = response.data.results;
            that.total = response.data.count;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleClick(tab, event) {
        this.getData();
        if (this.activeName == 'item'){
          this.dialogFormVisible = true;
        }
      },
      // test(){
      //   this.GLOBAL.ajax();
      // },
      changeHot(id,hot){
        var url = this.GLOBAL.url.isHot.replace("{sellerId}",this.GLOBAL.sellerId);
        url = url.replace("{cid}",id);
        url = url + '?isHot=' + hot;
        this.$axios.put(url)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      subForm(form){
        console.log(this.form);
        var that = this;
        var url = this.GLOBAL.url.cat.replace("{sellerId}",this.GLOBAL.sellerId);
        this.dialogFormVisible = false;
        if(this.form.status){
          this.form.status = 1;
        }else{
          this.form.status = 0;
        }
        this.form.icon = this.picUrl;
        if (this.typeClass ==0 ){
          this.$axios.post(url , this.form)
            .then(function (response) {
              that.activeName = 'trade';
              if (response.data.success) {
                that.$message({
                  type: 'success',
                  message: '操作成功!'
                });
              }
              that.getData();
            })
            .catch(function (error) {
              console.log(error);
            });
        } else if (this.typeClass ==2 ){
          url = this.GLOBAL.url.editCat.replace("{sellerId}", this.GLOBAL.sellerId);
          url = url.replace("{cid}",  this.form.id);
          this.$axios.put(url , this.form)
            .then(function (response) {
              that.activeName = 'trade';
              if (response.data.success) {
                that.$message({
                  type: 'success',
                  message: '修改商品成功!'
                });
              }
              that.getData();
            })
            .catch(function (error) {
              console.log(error);
            });
        }

        this.activeName = 'trade';
      },
      handleEdit(index, info){
        this.form = info;
        this.picUrl = '';
        this.typeClass = 2;
        this.dialogFormVisible =true;
      },
      changeStatus(form){
        console.log(form);
        this.editClass(form);
      },
      editClass(form){
        var that = this;
        var url = this.GLOBAL.url.editCat.replace("{sellerId}",this.GLOBAL.sellerId);
        url = url.replace("{cid}",form.id);
        this.form.hot = form.hot;
        this.form.status = form.status;
        this.form.id = form.id;
        this.form.icon = form.icon;
        this.form.parentCid = form.parentCid;
        this.form.order = form.order;
        this.form.quantityUnit = form.quantityUnit;
        this.form.name = form.name;
        if(this.form.status){
          this.form.status = 1;
        }else{
          this.form.status = 0;
        }
        this.$axios.put(url , this.form)
          .then(function (response) {
            that.activeName = 'trade';
            that.getData();
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getData(this.pageNo);
      },
      blurOrder(form){
        console.log(form);
        this.editClass(form);
      },
      handleDelete(index,info){
        var that = this;
        var url = this.GLOBAL.url.editCat.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{cid}",  info.id);
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$axios.delete(url)
            .then(function (res){
              console.log(res);
              that.getData(that.pageNo);
              that.$message({
                type: 'success',
                message: '删除成功!'
              });
            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
        setTimeout(function () {
          // that.dialogVisible = true;
          console.log(that.picUrl)
        }, 300)
      },
    }
  }
</script>
