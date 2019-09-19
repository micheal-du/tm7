<template>
  <div class="tableInfo">
    <div class="searchLine">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listTable">
      <div class="bottomSearch">
        <transition name="el-fade-in-linear">
          <div class="searchGroup">
            <el-input
              placeholder="请输入商品名称"
              v-model="searchContent"
              class="searchClass"
              clearable>
            </el-input>
            <!--<el-select v-model="form.cid" placeholder="请选择商品分类">-->
              <!--<el-option-->
                <!--v-for="item in cat"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <el-button type="primary" icon="el-icon-search" class="btnSearch" ></el-button>
          </div>
        </transition>
      </div>
      <el-button type="primary" icon="el-icon-plus" style="position: absolute;top: 20px;right: 0;z-index: +99;"
                 @click="addGood"></el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="分销商品管理" name="manage">
          <el-table
            :data="allData"
            style="width: 100%"
            stripe>
            <el-table-column
              label="ID"
              prop='id'
              sortable
              width="180"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="商品名称">
            </el-table-column>
            <el-table-column
              label="售价">
              <template slot-scope="scope">
                <span>{{scope.row.price}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="返佣率"
              width="160"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="allData[scope.$index].distributionRate" placeholder="请输入返佣率"
                          @blur="blurOrder(allData[scope.$index])"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="order"
              label="排序"
              width="160"
              align="center"
            >
              <template slot-scope="scope">
                <el-input v-model="allData[scope.$index].order" placeholder="请输入序号"
                          @blur="blurOrder(allData[scope.$index])"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="stock"
              label="库存"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="启用/暂停分销"
              width="80">
              <template slot-scope="scope">
                <el-switch v-model="allData[scope.$index].openDistribution"
                           @change="changeStatus(scope.row.id,scope.row.distributionRate)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleedit(scope.row)">编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)">移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="佣金审核" name="check">
          <el-table
            :data="allData"
            style="width: 100%"
            stripe>
            <el-table-column
              label="ID"
              prop='id'
              sortable
              width="180"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="用户信息">
              <template slot-scope="scope">
                <span><img :src="scope.row.avatarUrl" style="border-radius:50%;height: 30px;width: 30px;vertical-align: middle;margin-right: 15px; "></img>{{scope.row.nickName}}元</span>
              </template>
            </el-table-column>
            <el-table-column
              label="详情">
              <template slot-scope="scope">
                <span>审核提现{{scope.row.amount}}元</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作记录">
              <template slot-scope="scope">
                <span :style="scope.row.status == 0 ? '' : scope.row.status == 1 ? 'color:red;' : 'color:green;'">{{scope.row.status == 0 ? '待审核' : scope.row.status == 1 ? '通过' :'拒绝：'+ scope.row.reson}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleedit(scope.row)"
                  v-if="scope.row.status == 0">审核
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total='total'>
      </el-pagination>
    </div>
    <div class="classfy discount">
      <el-dialog title="提现审核" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="申请提现金额">
            ￥{{form.amount}}
          </el-form-item>
          <el-form-item label="备注">
            <el-radio v-model="radioYes" label="true">同意提现</el-radio>
            <el-radio v-model="radioYes" label="false">拒绝申请</el-radio>
          </el-form-item>
          <el-form-item label="备注" v-if="radioYes == 'false'">
            <el-input v-model="form.reson" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="subForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="classfy discount">
      <el-dialog title="添加分销商品" :visible.sync="dialogForm" style="width: 115%;">
        <el-table
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          stripe>
          <el-table-column
            label="ID"
            prop='id'
            sortable
            width="180"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="商品名称">
          </el-table-column>
          <el-table-column
            label="售价">
            <template slot-scope="scope">
              <span>{{scope.row.price}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="返佣率"
            width="160"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="tableData[scope.$index].distributionRate" placeholder="请输入返佣率"
                        @blur="blurOrder(tableData[scope.$index])"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="order"
            label="排序"
            width="160"
            align="center"
          >
            <template slot-scope="scope">
              <el-input v-model="tableData[scope.$index].order" placeholder="请输入序号"
                        @blur="blurOrder(tableData[scope.$index])"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="stock"
            label="库存"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="启用/暂停分销"
            width="80">
            <template slot-scope="scope">
              <el-switch v-model="tableData[scope.$index].openDistribution"
                         @change="changeStatus(scope.row.id,scope.row.distributionRate)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleedit(scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogForm = false">取 消</el-button>
          <el-button type="primary" @click="dialogForm = false">确 定</el-button>
        </div>
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange2"
          :total='total2'>
        </el-pagination>
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

  .discount .el-input {
    width: 48% !important;
    display: inline-block;
  }

</style>
<script>
  export default {
    data() {
      return {
        allData: [],
        activeName: 'manage',
        searchContent: '',
        classfy: '',
        tableData: [],
        chooseSet: '',
        dialogImageUrl: '',
        dialogFormVisible: false,
        dialogForm: false,
        imageUrl: '',
        total: 0,
        pageNo: 1,
        rubData: [],
        total2: 0,
        radioYes: true,
        form: {
          name: '',
          quantityUnit: [

          ],
          id: 0,
        },
        quantityUnit: [

        ],
      }
    },
    mounted() {
      this.getData(this.pageNo);
    },
    methods: {
      getData(pageNo) {
        var that = this;
        var url;
        url = this.GLOBAL.url.hasdistri.replace("{sellerId}", this.GLOBAL.sellerId);
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
      handleedit(info) {
        this.editDiscount(info);
      },
      editDiscount(info) {
        console.log(info);
        this.dialogFormVisible = true;
        this.form = info;
      },
      addGood() {
        this.dialogForm = true;
        this.getNodistri(1);
      },
      getNodistri(pageNo){
        var that = this;
        var url = this.GLOBAL.url.nodistri.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + "?curPage=" + pageNo;
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            that.tableData = response.data.results;
            that.total2 = response.data.count;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        if (activeName == 'manage'){
          this.getData(this.pageNo);
        } else{
          this.getAllMessage(this.pageNo);
        }
      },
      handleCurrentChange2(val) {
        this.pageNo = val;
        this.getNodistri(this.pageNo);
      },
      handleClick(tab, event) {
        var that = this;
        console.log(tab);
        if (tab.label == '佣金审核') {
          this.getAllMessage(1);
        } else if (tab.label == '已分销商品管理') {
          this.getData(1);
        }
      },
      editGoods() {
        this.dialogForm = true;
        this.pageNo = 1;
        this.getAllGoods(this.pageNo);
      },
      getAllMessage(pageNo) {
        var that = this;
        var url = this.GLOBAL.url.withdraw.replace("{sellerId}", this.GLOBAL.sellerId) + "?curPage=" + pageNo;
        this.$axios.get(url, {})
          .then(function (response) {
            console.log(response.data.results);
            that.allData = response.data.results;
            that.total = response.data.count;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      subForm() {
        var that = this;
        var url = this.GLOBAL.url.withdrawCheck.replace("{sellerId}", this.GLOBAL.sellerId);
        var data = {
          "applyIds": [
            this.form.id
          ],
          "pass": this.form.radioYes == 'true' ? true : false,
          "reson": this.form.reson
        };
        console.log(data);
        this.$axios.post(url, data).then((res) => {
          console.log(res);
          if (res.data.code == 9999) {
            that.$message.error(res.data.message);
          } else {
            that.dialogFormVisible = false;
            that.getAllMessage(this.pageNo);
          }
        })
      },
      handleSelectionChange(val) {
        let goodsList;
        for (var i = 0; i < val.length; i++) {
          if (i == 0) {
            goodsList = val[i].id;
          } else {
            goodsList = goodsList + ',' + val[i].id;
          }
        }
        this.form.items = goodsList;
        console.log(goodsList);
      },
      changeStatus(id, info) {
        console.log(id);
        console.log(info);
        var url = this.GLOBAL.url.distribution.replace("{sellerId}", this.GLOBAL.sellerId);
        var data = {
          "distributionRate": info,
          "itemIds": [id]
        }
        this.$axios.post(url, data).then((res) => {
          console.log(res);
          if (res.data.code == 9999) {
            that.$message.error(res.data.message);
          } else {

          }
        })
      },
      handleDelete(index, info) {
        var that = this;
        var url = this.GLOBAL.url.discount.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + '/' + info.id;
        this.$confirm('此操作将永久删除该折扣, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$axios.delete(url)
            .then(function (res) {
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
