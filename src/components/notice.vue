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
        <el-tab-pane label="订单" name="trade">
          <el-table
            :data="allData"
            style="width: 100%"
            stripe>
            <el-table-column
              label="是否处理"
              width="80"
              align= "center"
            >
              <template slot-scope="scope">
                <i class="el-icon-message" v-if="scope.row.status == 0" style="color: #0077AA;"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTs"
              label="订单时间"
              width="240"
              align="center">
            </el-table-column>
            <el-table-column
              label="订单内容"
            >
              <template slot-scope="scope" @click="openDetail(scope.row)">
                <span style="color: #0077AA;" @click="openDetail(scope.row)">{{scope.row.message}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="商品" name="item">
          <el-table
            :data="allData"
            style="width: 100%"
            stripe>
            <el-table-column
              label="是否处理"
              width="80"
              align= "center"
            >
              <template slot-scope="scope">
                <i class="el-icon-message" v-if="scope.row.status == 0" style="color: #0077AA;"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTs"
              label="订单时间"
              width="240"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="订单内容">
              <template slot-scope="scope">
                <span style="color: #0077AA;" @click="toDetail(scope.row)">{{scope.row.message}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="平台通知" name="platformNotice">
          <el-table
            :data="allData"
            style="width: 100%"
            stripe>
            <el-table-column
              label="是否处理"
              width="80"
              align= "center"
            >
              <template slot-scope="scope">
                <i class="el-icon-message" v-if="scope.row.status == 0" style="color: #0077AA;"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTs"
              label="订单时间"
              width="240"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="订单内容">
              <template slot-scope="scope">
                <span style="color: #0077AA;" @click="toDetail(scope.row)">{{scope.row.message}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="其他消息" name="orterNotice">
          <el-table
            :data="allData"
            style="width: 100%"
            stripe>
            <el-table-column
              label="是否处理"
              width="80"
              align= "center"
            >
              <template slot-scope="scope">
                <i class="el-icon-message" v-if="scope.row.status == 0" style="color: #0077AA;"></i>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTs"
              label="订单时间"
              width="240"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="订单内容">
              <template slot-scope="scope">
                <span style="color: #0077AA;" @click="toDetail(scope.row)">{{scope.row.message}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="block" v-if="activeName == 'trade' || activeName == 'item'">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page = "pageNo"
        :total= 'total'>
      </el-pagination>
    </div>
    <div>
      <el-dialog
        title="订单详情"
        :visible.sync="dialogVisibleDetail"
        width="60%"
        :before-close="handleClose">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="基本信息" name="1">
            <div class="tInfo">{{'订单编号：'+ tInfo.tid}}</div>
            <div class="tInfo">{{'下单时间：'+ tInfo.createTs}}</div>
            <div class="tInfo">{{'订单状态：'+ tInfo.status}}</div>
            <div class="tInfo">{{'购买用户：'+ tInfo.name}}</div>
            <div class="tInfo">{{'配送方式：'+ '快递配送'}}</div>
            <div class="tInfo">{{'配送费用：'+ tInfo.postFee}}</div>
          </el-collapse-item>
          <el-collapse-item title="收货人信息" name="2">
            <div class="tInfo">{{'姓名：'+ tInfo.name}}</div>
            <div class="tInfo">{{'手机：'+ tInfo.mobile}}</div>
            <div class="tInfo">{{'地址：'+ tInfo.state + tInfo.city + tInfo.district + tInfo.address}}</div>
            <div class="tInfo">
              <el-table
                :data="tInfo.orders"
                style="width: 100%">
                <el-table-column
                  prop="id"
                  label="商品ID"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="itemName"
                  label="商品名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="price"
                  label="售价">
                </el-table-column>
                <el-table-column
                  prop="num"
                  label="数量">
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
        <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleDetail = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisibleDetail = false">确 定</el-button>
			</span>
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
  .tInfo{
    margin-top: 15px;
    position: relative;
    font-weight: 600;
  }
</style>
<script>
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
        imageUrl: '',
        total : 0,
        dialogVisibleDetail:false,
        rubData :[],
        tInfo :{},
        activeNames : ['1'],
        pageNo : 1
      }
    },
    mounted(){
      console.log(localStorage.getItem('admin'))
      if(!localStorage.getItem('admin')){
        this.$router.push('/login');
      }
      this.getData(this.activeName,this.pageNo);
    },
    methods: {
      getData(type,page){
        var that = this;
        var that = this;
        var url = this.GLOBAL.url.messageNotice.replace("{sellerId}",this.GLOBAL.sellerId);
        url = url + '?curPage=' + page;
        url = url + '&topic=' + type;
        console.log(url)
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            for(let i = 0 ; i< response.data.results.length ; i++){
              response.data.results[i].createTs = that.GLOBAL.changeTime(response.data.results[i].createTs);
            }
            that.allData = response.data.results;
            that.total = response.data.count
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleClick(tab, event) {
        this.pageNo = 1;
        this.getData(this.activeName,this.pageNo);
      },
      openDetail(info){
        var url = this.GLOBAL.url.readMessage.replace("{sellerId}",this.GLOBAL.sellerId);
        url = url.replace("{msgId}",info.id);
        this.readMessage(url);
        this.$router.push('/order/'+ info.key);
      },
      handleChange(val) {
        console.log(val);
      },
      handleClose(){

      },
      readMessage(url){
        this.$axios.post(url)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleCurrentChange(val) {
        this.pageNo= val;
        this.getData(this.activeName,this.pageNo);
      },
      toDetail(val){
        console.log(val);
        var url = this.GLOBAL.url.readMessage.replace("{sellerId}",this.GLOBAL.sellerId);
        url = url.replace("{msgId}",val.id);
        this.readMessage(url);
        this.$router.push('/goodsmen/'+ val.key);
      }
    }
  }
</script>
