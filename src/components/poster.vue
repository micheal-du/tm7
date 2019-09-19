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
              prop="id"
              label="ID"
              width="100"
            >
            </el-table-column>
            <el-table-column
              label="图片"
              sortable
              width="280"
              align = "center"
            >
              <template slot-scope="scope">
                <img :src="allData[scope.$index].picUrl" style="height: 60px; width: 60px;" />
              </template>
            </el-table-column>
            <el-table-column
              label="是否启用"
              width="130">
              <template slot-scope="scope">
                <el-switch v-model="allData[scope.$index].isUse" @change = "changeHot(allData[scope.$index].id,allData[scope.$index].isUse)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="上传时间"
              sortable
              align = "center"
            >
              <template slot-scope="scope">
                <span>{{allData[scope.$index].upTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="320" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">重新上传</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.isUse">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="classfy">
      <el-dialog title="新建海报信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="背景图片">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess">
              <img v-if="form.icon" :src="form.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-switch
              v-model="form.status"
              active-text="使用"
              inactive-text="禁用">
            </el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false;activeName = 'trade'">取 消</el-button>
          <el-button type="primary" @click="subForm">确 定</el-button>
        </div>
      </el-dialog>
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
    /* min-width: 200.39px !important;
        position: absolute !important;
        top: 162px !important;
        left: 0;
        right: 423px !important; */
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
  export default {
    data() {
      return {
        allData: [
          {id : 12 , picUrl : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539623586118&di=aec04c1bda122b4caf0dec014a1145d8&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fback_pic%2F00%2F00%2F40%2F82%2F4db824aaf9f925a275d7146291fe8446.jpg',
          isUse : true,upTime:'2018-10-10'},
          {id : 13 , picUrl : 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539623586118&di=aec04c1bda122b4caf0dec014a1145d8&imgtype=0&src=http%3A%2F%2Fpic.90sjimg.com%2Fback_pic%2F00%2F00%2F40%2F82%2F4db824aaf9f925a275d7146291fe8446.jpg',
            isUse : false,upTime:'2018-10-11'},
        ],
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
        form:{
        }
      }
    },
    mounted(){
      this.getData();
      // this.test();
    },
    methods: {
      getData(){
        var that = this;
        var url = this.GLOBAL.url.cat.replace("{sellerId}",this.GLOBAL.sellerId);
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
      test(){
        this.GLOBAL.ajax();
      },
      changeHot(id,isUse){
        // var url = this.GLOBAL.url.isHot.replace("{sellerId}",this.GLOBAL.sellerId);
        // url = url.replace("{cid}",id);
        // url = url + '?isHot=' + hot;
        // this.$axios.put(url)
        //   .then(function (response) {
        //     console.log(response);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });
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
        this.$axios.post(url , this.form)
          .then(function (response) {
            that.activeName = 'trade';
            that.getData();
          })
          .catch(function (error) {
            console.log(error);
          });
        this.activeName = 'trade';
      },
      handleEdit(index, info){
        this.form = info;
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
      blurOrder(form){
        console.log(form);
        this.editClass(form);
      }
    }
  }
</script>
