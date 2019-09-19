<template>
  <div class="tableInfo">
    <div class="searchLine">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listTable">
      <el-button type="primary" icon="el-icon-plus" style="position: absolute;top: 20px;right: 0;z-index: +99;"
                 @click="addGood"></el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="会员折扣" name="trade">
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
              prop="name"
              label="折扣名称">
            </el-table-column>
            <el-table-column
              label="最大折扣">
              <template slot-scope="scope">
                <span>{{scope.row.levelDiscount[scope.row.levelDiscount.length-1]}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="最低折扣">
              <template slot-scope="scope">
                <span>{{scope.row.levelDiscount[0]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleedit(scope.row)">编辑</el-button>
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
    <div class="block" v-if="activeName == 'trade'">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total= 'total'>
      </el-pagination>
    </div>
    <div class="classfy discount">
      <el-dialog title="新建折扣信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="折扣名称">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <div>
            会员等级
          </div>
          <el-form-item>
            <template >
              <div v-for="(item,index) in form.quantityUnit" style="left: 70px;position: relative;" :key="index">
                <el-input  v-model="item.discount" autocomplete="off"></el-input>
                <el-select v-model="item.levelName" placeholder="请选择会员等级">
                  <el-option
                    v-for="item in quantityUnit"
                    :key="item.level"
                    :label="item.levelName"
                    :value="item.levelName">
                  </el-option>
                </el-select>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="折扣商品">
            <el-button type="primary" @click="editGoods">管理折扣商品</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="subForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="classfy discount">
      <el-dialog title="添加折扣商品" :visible.sync="dialogForm">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          stripe>
          <el-table-column
            prop="id"
            label="ID"
            type="selection"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="id"
            label="ID"
            sortable
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="商品名称">
          </el-table-column>
          <el-table-column
            prop="price"
            label="普通会员价"
            width="120">
          </el-table-column>
          <el-table-column
            prop="stock"
            label="库存"
            width="80"
          >
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogForm = false">取 消</el-button>
          <el-button type="primary" @click="dialogForm = false">确 定</el-button>
        </div>
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange2"
          :total= 'total2'>
        </el-pagination>
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
  .discount .el-input{
    width: 48% !important;
    display: inline-block;
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
        tableData: [],
        chooseSet : '',
        dialogImageUrl: '',
        dialogFormVisible: false,
        dialogForm:false,
        imageUrl: '',
        total : 0,
        pageNo : 1,
        rubData :[],
        total2:0,
        form:{
          name: '',
          quantityUnit: [
            {level: 1 ,levelName: '青铜' ,discount : 0.9},
            {level: 2 ,levelName: '白银' ,discount : 0.8},
            {level: 3 ,levelName: '黄金' ,discount : 0.7},
            {level: 4 ,levelName: '铂金' ,discount : 0.6},
            {level: 0 ,levelName: '钻石' ,discount : 0.5},
          ],
          id : 0,
        },
        quantityUnit: [
          {level: 1 ,levelName: '青铜' ,discount : 0.9},
          {level: 2 ,levelName: '白银' ,discount : 0.8},
          {level: 3 ,levelName: '黄金' ,discount : 0.7},
          {level: 4 ,levelName: '铂金' ,discount : 0.6},
          {level: 0 ,levelName: '钻石' ,discount : 0.5},
        ],
      }
    },
    mounted(){
      this.getData(this.pageNo);
    },
    methods: {
      getData(pageNo){
        var that = this;
        var url = this.GLOBAL.url.discount.replace("{sellerId}",this.GLOBAL.sellerId);
        url = url + "?curPage=" + pageNo;
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            // response.data.results.levelDiscount.split(',');
            for (let i = 0 ; i < response.data.results.length ; i++){
              let level = response.data.results[i].levelDiscount;
              response.data.results[i].levelDiscount = level.split(',');
            }
            that.allData = response.data.results;
            that.total = response.data.count
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleedit(info){
        this.editDiscount(info);
      },
      editDiscount(info){
        console.log(info);
        this.dialogFormVisible = true;
        this.form.name=info.name;
      },
      addGood() {
        this.dialogFormVisible = true;
      },
      handleCurrentChange(val) {
        this.pageNo= val;
        this.getData(this.pageNo);
      },
      handleCurrentChange2(val) {
        this.pageNo= val;
        this.getAllGoods(this.pageNo);
      },
      handleClick(tab, event) {
        var that = this;
      },
      editGoods(){
        this.dialogForm = true;
        this.pageNo = 1;
        this.getAllGoods(this.pageNo);
      },
      getAllGoods(pageNo){
        var that = this;
        var url = this.GLOBAL.url.crmdiscount.replace("{sellerId}", this.GLOBAL.sellerId) + "?curPage=" + pageNo;
        this.$axios.get(url, {})
          .then(function (response) {
            console.log(response.data.results);
            that.tableData = response.data.results;
            that.total2 = response.data.count;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      subForm(){
        var that = this;
        var url = this.GLOBAL.url.discount.replace("{sellerId}",this.GLOBAL.sellerId);
        var crmLevel;
        for (let i = 0 ; i < this.form.quantityUnit.length;i++){
          if (this.form.quantityUnit[i].discount>1 || this.form.quantityUnit[i].discount <0){
            this.$message({
              type: 'info',
              message: '折扣范围在0-1之间，请重新输入'
            });
            return false;
          }
          if (i==0){
            crmLevel = this.form.quantityUnit[i].level + ":" + this.form.quantityUnit[i].levelName + ":" + this.form.quantityUnit[i].discount;
          }else {
            crmLevel = crmLevel + "," + this.form.quantityUnit[i].level + ":" + this.form.quantityUnit[i].levelName + ":" + this.form.quantityUnit[i].discount;
          }
        }
        var data ={
          id : 0,
          items : this.form.items,
          levelDiscount : crmLevel,
          name: this.form.name,
          sellerId : this.GLOBAL.sellerId
        };
        if (this.form.items == '') {
          that.$message.error('尚未选择折扣商品');
          return false;
        }
        console.log(data);
        this.$axios.post(url, data).then((res) => {
          console.log(res);
          if (res.data.code==9999){
            that.$message.error(res.data.message);
          } else{
            that.dialogFormVisible =false;
            that.getData(this.pageNo);
          }
        })
      },
      handleSelectionChange(val) {
        let goodsList ;
        for (var i = 0; i < val.length; i++) {
          if (i==0){
            goodsList = val[i].id;
          } else{
            goodsList = goodsList + ',' + val[i].id;
          }
        }
        this.form.items = goodsList;
        console.log(goodsList);
      },
      handleDelete(index,info){
        var that = this;
        var url = this.GLOBAL.url.discount.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + '/' + info.id;
        this.$confirm('此操作将永久删除该折扣, 是否继续?', '提示', {
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
      }
    }
  }
</script>
