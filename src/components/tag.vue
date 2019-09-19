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
        <el-tab-pane label="商品标签" name="trade">
          <el-table
            :data="allData"
            style="width: 100%"
            stripe>
            <el-table-column
              label="ID"
              prop='id'
              sortable
              width="180"
              align = "center"
            >
            </el-table-column>
            <el-table-column
              prop="tag"
              label="标签名称">
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleedit(scope)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="新建标签" name="newTag">

        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="block" v-if="activeName == 'trade'">
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
</style>
<script>
  export default {
    data() {
      return {
        allData: [],
        activeName: 'trade',
        searchContent: '',
        classfy : '',
        chooseSet : '',
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        total : 0,
        pageNo : 1,
        rubData :[],
      }
    },
    mounted(){
      this.getData(this.pageNo);
    },
    methods: {
      getData(pageNo){
        var that = this;
        var url = this.GLOBAL.url.tag.replace("{sellerId}",this.GLOBAL.sellerId);
        url = url + "?curPage=" + pageNo;
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            that.allData = response.data.results;
            that.total = response.data.count
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleedit(info){
        this.makeTag(info.row);
      },
      makeTag(judge){
        var that = this;
        var id = judge.id;
        if(judge == 0){
          judge = '标签名';
        }else{
          judge = judge.tag;
        }
        this.$prompt('请输入标签名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: judge
        }).then(({ value }) => {
          console.log(value)
          if(value==null || value==''){
            this.$message.error('标签不能为空');
            return false;
          }
          this.$message({
            type: 'success',
            message: '标签名为: ' + value
          });
          if (judge == '标签名') {
            var url = this.GLOBAL.url.tag.replace("{sellerId}",this.GLOBAL.sellerId);
            url = url + '?tag=' + value;
            this.$axios.post(url).then(function (response) {
              console.log(response);
              that.activeName = 'trade';
              that.pageNo = 1;
              that.getData(that.pageNo);
            })
              .catch(function (error) {
                console.log(error);
              });
          }else{
            var url = this.GLOBAL.url.doTag.replace("{sellerId}",this.GLOBAL.sellerId);
            url = url.replace("{tagId}",id);
            url = url + '?tag=' + value;
            this.$axios.put(url).then(function (response) {
              console.log(response);
              that.activeName = 'trade';
              that.pageNo = 1;
              that.getData(that.pageNo);
            })
              .catch(function (error) {
                console.log(error);
              });
          }
        }).catch(() => {
          that.activeName = 'trade';
          that.pageNo = 1;
          that.getData(this.pageNo);
          that.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      handleCurrentChange(val) {
        this.pageNo= val;
        this.getData(this.pageNo);
      },
      handleClick(tab, event) {
        var that = this;
        this.getData(this.pageNo);
        if(this.activeName == 'newTag') {
          this.makeTag(0);
        }
      },
      handleDelete(index,info){
        var that = this;
        var url = this.GLOBAL.url.doTag.replace("{sellerId}",this.GLOBAL.sellerId);
        url = url.replace("{tagId}",info.id);
        this.$axios.delete(url).then(function (response) {
          console.log(response);
          that.activeName = 'trade';
          that.pageNo = 1;
          that.getData(that.pageNo);
          that.$message({
            type: 'info',
            message: response.data.code == '9999' ? response.data.message: '删除成功'
          });
        })
          .catch(function (error) {
            console.log(error);
          });
      }
    }
  }
</script>
