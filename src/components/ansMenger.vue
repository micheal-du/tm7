<template>
  <div class="tableInfo">
    <div class="searchLine">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listTable">
      <transition name="el-fade-in-linear">
        <div class="searchGroup" v-if="activeName == 'first'">
          <el-input
            placeholder="请输入评价内容"
            v-model="searchContent"
            class = "searchClass"
            clearable>
          </el-input>
          <el-button type="primary" icon="el-icon-search" class="btnSearch"></el-button>
        </div>
      </transition>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商品列表" name="first">
          <el-table
            :data="tableData"
            style="width: 100%"
            stripe>
            <el-table-column
              prop="id"
              label="ID"
              type="selection"
              width="80"
            >
            </el-table-column>
            <!--<el-table-column-->
            <!--prop="id"-->
            <!--label="ID"-->
            <!--sortable-->
            <!--width="80"-->
            <!--&gt;-->
            <!--</el-table-column>-->
            <el-table-column
              prop="nickName"
              label="会员昵称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="ratingText"
              label="评价内容">
            </el-table-column>
            <el-table-column
              prop="status"
              label="评价等级"
              width="160"
              align="center"
            >
              <template slot-scope="scope">
                <p>{{tableData[scope.$index].rating}}</p>
                <el-tooltip class="item" effect="dark" content="了解该商品详情" placement="bottom">
                  <div slot="content" @click="toDetailGoods(tableData[scope.$index].numIid)">了解该商品详情</div>
                  <img :src="tableData[scope.$index].picUrl" style="width: 70px; height: 74px;"/>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              label="是否显示"
              width="120"
            >
              <template slot-scope="scope">
                <el-switch v-model="tableData[scope.$index].isShow" @change = "changeStatus(tableData[scope.$index].id,tableData[scope.$index].isShow)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="rateTs"
              label="评价时间"
              width="110"
            >
            </el-table-column>
            <el-table-column
              prop="sellerRate"
              label="状态"
              width="120"
              align='center'
            >
              <template slot-scope="scope">
                <span>{{tableData[scope.$index].sellerRate ? '已回复' : '未回复'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align='center'>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">处理</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footerChoose" v-if="activeName == 'first'">
      <el-select v-model="chooseSet" placeholder="请选择">
        <el-option
          v-for="item in choose"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-check" class="btnSearch"></el-button>
    </div>
    <div class="block" v-if="activeName == 'first'">
      <el-pagination
        layout="prev, pager, next"
        :total= 'total'>
      </el-pagination>
    </div>
    <div>
      <el-dialog title="请进行评论操作" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="请回复评论">
            <el-input v-model="form.ansReply"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch v-model="form.isShow" @change = "form.isShow = !form.isShow"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click = "dialogFormVisible = !dialogFormVisible">取 消</el-button>
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
    left: 1.5vw;
    width: 84%;
  }
  .searchLine{
    position: relative;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
  }
  .listTable{
    overflow: auto;
    max-height: 74vh;
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
  import editor from './editor'
  export default {
    data() {
      return {
        isCollapse : this.GLOBAL.getisCollapse(),
        tableData: [],
        tinymceHtml:'abc',
        activeName: 'first',
        searchContent: '',
        classfy : '',
        chooseSet : '',
        dialogImageUrl: '',
        dialogVisible: false,
        dialogFormVisible :false,
        imageUrl: '',
        choose : [{
          value: '选项1',
          label: '删除评论'
        },{
          value: '选项2',
          label: '允许显示'
        },{
          value: '选项3',
          label: '隐藏显示'
        },
        ],
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
        total : 0,
        form: {
          ansReply : ''
        },
        init: {
          height: 300,
          plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
          toolbar:
            'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
          branding: false
        },
        rubData :[]
      }
    },
// 	watch: {
// 		isCollapse : a
// 	},

    mounted(){
      // console.log(this._watchers);
      this.getData();
      tinymce.init({})
    },
    components: {editor},
    methods: {
      formatter(row, column) {
        return row.address;
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      getData(){
        console.log();
        var that = this;
        var url = this.GLOBAL.url.rate.replace("{sellerId}",this.GLOBAL.sellerId);
        this.$axios.get(url,{})
          .then(function (response) {
            console.log(response);
            for(let i = 0 ; i< response.data.results.length ; i++){
              response.data.results[i].rateTs = that.GLOBAL.changeTime(response.data.results[i].rateTs);
              response.data.results[i].rating = that.GLOBAL.levelChange(response.data.results[i].rating);
            }
            that.tableData = response.data.results;
            that.total = response.data.count;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleClick(){

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
      toDetailGoods(numlid){
        this.$router.push('/goodsmen/'+ numlid);
      },
      changeStatus(id,status){
        console.log(status + ',' + id);
        this.upData(id,status);
      },
      upData(id,status){
        var that = this;
        var data = { "ids": id,"show": status};
        var url = this.GLOBAL.url.modifyShow.replace("{sellerId}",this.GLOBAL.sellerId);
        this.$axios.put(url,data
        ).then((res)=>{
          console.log(res);
        })
      },
      handleEdit(index,info){
        this.form = info ;
        this.dialogFormVisible = true ;
      },
      subForm(){
        var that =this;
        var url = this.GLOBAL.url.rate.replace("{sellerId}",this.GLOBAL.sellerId);
        if (this.form.ansReply == undefined){
          this.$message.error('回复不能为空');
          return false;
        }
        var data = {'id' : this.form.id , 'show':this.form.isShow, 'reply':this.form.ansReply};
        this.$axios.put(url,data
        ).then((res)=>{
          console.log(res);
          that.dialogFormVisible = false;
          that.getData();
          that.$message({
            message: '提交成功',
            type: 'success'
          });
        })
      }
    }
  }
</script>
