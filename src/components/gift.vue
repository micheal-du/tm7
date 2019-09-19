<template>
  <div class="tableInfo">
    <div class="searchLine">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>礼品中心</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listTable">
      <!--<el-button type="primary" icon="el-icon-plus" style="position: absolute;top: 20px;right: 0;z-index: +99;"-->
      <!--@click="addGood"></el-button>-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="赠礼中心" name="trade">
          <el-table
            :data="allData"
            highlight-current-row
            @current-change="handleCurrentChangeTable"
            style="width: 100%"
            stripe>
            <el-table-column
              label="礼品ID"
              prop='giftId'
              sortable
              width="180"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="赠送人">
              <template slot-scope="scope">
                <span><img :src="scope.row.buyerAvatarUrl" class="avar"/>{{scope.row.buyerName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="商品名称">
              <template slot-scope="scope">
                <span>{{scope.row.itemName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="支付金额">
              <template slot-scope="scope">
                <span>{{scope.row.totalFee}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="获赠人">
              <template slot-scope="scope">
                <span><img :src="scope.row.receiverAvatarUrl" class="avar"/>{{scope.row.receiverName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="赠送时间"
              align="center">
              <template slot-scope="scope">
                <span>{{scope.row.giftTs}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="贺卡" name="card">
          <div style="position: relative;left: 110%;bottom: 350px;" class="card" v-if="cardHol.length -1 == index">
            <el-upload
              action=""
              :http-request="fnUploadRequest"
              :show-file-list="false"
              :on-success="fnUploadRequest"
            >
              <i class="el-icon-plus avatar-uploader-icon" style="border : 3px dotted #bfe6ff"></i>
            </el-upload>
          </div>
          <el-row>
            <el-col :span="6" v-for="(o, index) in cardHol" :key="o">
              <el-card :body-style="{ padding: '0px'  }" style="margin:0 0 20px 20px;">
                <img :src="o.picUrl" class="image" style="width: 100%">
                <div style="padding: 14px;">
                  <span>贺卡{{index}}</span>
                  <div class="bottom clearfix">
                    <el-button type="text" class="button" @click="delHe(o)">删除</el-button>
                  </div>
                </div>
              </el-card>
              <div style="position: relative;left: 110%;bottom: 350px;" class="card" v-if="cardHol.length -1 == index">
                <el-upload
                  action=""
                  :http-request="fnUploadRequest"
                  :show-file-list="false"
                  :on-success="fnUploadRequest"
                >
                  <i class="el-icon-plus avatar-uploader-icon" style="border : 3px dotted #bfe6ff"></i>
                </el-upload>
              </div>
            </el-col>
          </el-row>
          <img v-if="picUrl" :src="picUrl" class="avatar">
          <el-button type="primary" v-if="picUrl" style="position: absolute;right: 0;bottom: 20px;" @click="addCard">
            保存<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-tab-pane>
        <el-tab-pane label="祝福语" name="hopeMessage">
          <el-button type="primary" plain style="position: relative;left: 93%;" @click="makeTag">新增祝福语</el-button>
          <el-table
            :data="messageData"
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
              prop="bless"
              label="祝福语">
            </el-table-column>
            <el-table-column
              label="使用次数"
              prop="useCount"
            >
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleedit(scope)">编辑
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
      </el-tabs>
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
      </el-dialog>
    </div>
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :total='total'>
      </el-pagination>
    </div>
    <div>
      <el-dialog
        title="礼品详情"
        :visible.sync="dialogVisibleDetail"
        width="60%"
        :before-close="handleClose">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="基本信息" name="1">
            <div class="tInfo dialogInfo">{{'订单编号：'+ tInfo.tid}}</div>
            <div class="tInfo dialogInfo">{{'下单时间：'+ tInfo.giftTs}}</div>
            <div class="tInfo dialogInfo">礼品状态： {{tInfo.status==2 ? '已领取':tInfo.status==1 ? '未领取': '已退还'}}</div>
            <div class="tInfo dialogInfo">{{'购买用户：'+ tInfo.buyerName}}</div>
            <div class="tInfo dialogInfo">{{'配送方式：'+ '快递配送'}}</div>
            <div class="tInfo dialogInfo">{{'配送费用：'+ tInfo.postFee}}</div>
          </el-collapse-item>
          <el-collapse-item title="收货人信息" name="2">
            <div class="tInfo dialogInfo">{{'姓名：'+ tInfo.receiverName}}</div>
            <div class="tInfo dialogInfo">{{'收礼时间：'+ tInfo.receiveTs}}</div>
            <div class="tInfo dialogInfo">{{'地址：'+ tInfo.province + tInfo.city + tInfo.district + tInfo.address}}</div>
            <div class="tInfo">
              <el-table
                :data="[tInfo]"
                style="width: 100%;max-height: 250px;overflow: auto">
                <el-table-column
                  prop="itemName"
                  label="商品名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  label="图片"
                  width="180"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.itemName" placement="bottom">
                      <img :src="scope.row.itemPicUrl" style="height: 60px; width: 60px;"/>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="payment"
                  label="售价">
                </el-table-column>
                <el-table-column
                  prop="num"
                  label="数量">
                </el-table-column>
                <el-table-column
                  label="规格"
                  align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.specsValue}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-item>
        </el-collapse>
        <span slot="footer" class="dialog-footer">
          <el-button @click="toOrderDetail">查看订单</el-button>
				  <el-button @click="dialogVisibleDetail = false">取 消</el-button>
				  <el-button type="primary" @click="dialogVisibleDetail = false">确 定</el-button>
			  </span>
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

  .card .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 330px;
    height: 330px;
    line-height: 330px;
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

  img.avar {
    height: 25px;
    width: 25px;
    border-radius: 50%;
    vertical-align: bottom;
    margin-right: 10px;
  }

  .el-card img {
    height: 240px;
    width: 100%;
  }
</style>
<script>
  import oss from '../appOss.js'

  export default {
    data() {
      return {
        allData: [],
        activeName: 'trade',
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
        cardHol: [],
        messageData: [],
        picUrl: '',
        dialogVisibleDetail: false,
        tInfo: {},
        form: {
          name: '',
          quantityUnit: [
            {level: 1, levelName: '青铜', discount: 0.9},
            {level: 2, levelName: '白银', discount: 0.8},
            {level: 3, levelName: '黄金', discount: 0.7},
            {level: 4, levelName: '铂金', discount: 0.6},
            {level: 5, levelName: '钻石', discount: 0.5},
          ],
          id: 0,
        },
        quantityUnit: [
          {level: 1, levelName: '青铜', discount: 0.9},
          {level: 2, levelName: '白银', discount: 0.8},
          {level: 3, levelName: '黄金', discount: 0.7},
          {level: 4, levelName: '铂金', discount: 0.6},
          {level: 5, levelName: '钻石', discount: 0.5},
        ],
      }
    },
    mounted() {
      this.getData(this.pageNo);
    },
    methods: {
      getData(pageNo) {
        var that = this;
        var url = this.GLOBAL.url.giftList.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + "?curPage=" + pageNo;
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.results.length; i++) {
              response.data.results[i].giftTs = that.GLOBAL.changeTime(response.data.results[i].giftTs);
            }
            that.allData = response.data.results;
            that.total = response.data.count;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getCard(pageNo) {
        var that = this;
        var url = this.GLOBAL.url.holiCard.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + "?curPage=" + pageNo;
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            if (response.data.results.length == 0) {
              that.cardHol = 1;
            } else {
              that.cardHol = response.data.results;
            }
            that.total = response.data.count
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleCurrentChangeTable(val) {
        console.log(val);
        this.dialogVisibleDetail = true;
        this.chooseInfo = val;
        // this.tInfo = val;
        this.getGiftInfo(val.id);
      },
      getGiftInfo(tId) {
        var that = this;
        var url = this.GLOBAL.url.giftInfo.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{id}", tId);
        // console.log(url)
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            response.data.results.giftTs = that.GLOBAL.changeTime(response.data.results.giftTs);
            response.data.results.receiveTs = that.GLOBAL.changeTime(response.data.results.receiveTs);
            that.tInfo = response.data.results;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getMessage(pageNo) {
        var that = this;
        var url = this.GLOBAL.url.message.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + "?curPage=" + pageNo;
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            that.messageData = response.data.results;
            that.total = response.data.count
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleedit(info) {
        this.makeTag(info.row);
      },
      addGood() {
        this.allData = {};
        this.dialogFormVisible = true;
      },
      handleAvatarSuccess(fileUrl) {
        this.picUrl = fileUrl;
      },
      async fnUploadRequest(option) {
        var that = this;
        oss.ossUploadFile(option)
          .then(function (res) {
            setTimeout(function () {
              console.log(res.fileUrl);
              that.picUrl = res.fileUrl;
              that.handleAvatarSuccess(res.fileUrl);
            }, 600)
          });
        setTimeout(function () {
          // that.dialogVisible = true;
          console.log(that.picUrl)
        }, 300)
      },
      delHe(info) {
        console.log(info);
        var that = this;
        var url = this.GLOBAL.url.delCard.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{id}", info.id);
        if (this.cardHol.length <= 1) {
          this.$message.error('至少需要一张贺卡');
          return false
        } else {
          this.$axios.delete(url)
            .then(function (response) {
              console.log(response);
              that.getCard(that.pageNo);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      },
      addCard() {
        var that = this;
        var url = this.GLOBAL.url.holiCard.replace("{sellerId}", this.GLOBAL.sellerId);
        let data = {
          id: 0,
          picUrl: that.picUrl,
          sellerId: ''
        }
        this.$axios.post(url, data)
          .then(function (response) {
            console.log(response);
            that.getCard(that.pageNo);
            that.picUrl = '';
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      makeTag(bless) {
        var that = this;
        var myBless = bless.bless;
        this.$prompt('请输入祝福语', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: myBless != '' ? myBless : ''
        }).then(({value}) => {
          console.log(value);
          if (value == null || value == '') {
            this.$message.error('祝福语不能为空');
            return false;
          }
          this.$message({
            type: 'success',
            message: '祝福语为: ' + value
          });
          let data = {
            "bless": value,
            "id": 0,
            "sellerId": "",
            "useCount": ''
          }
          var url = this.GLOBAL.url.message.replace("{sellerId}", this.GLOBAL.sellerId);
          this.$axios.post(url, data).then(function (response) {
            console.log(response);
            that.pageNo = 1;
            that.getMessage(that.pageNo);
          })
            .catch(function (error) {
              console.log(error);
            });
        }).catch(() => {
          that.pageNo = 1;
          that.getMessage(this.pageNo);
          that.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        if (this.activeName == 'trade') {
          this.getData(this.pageNo);
        } else if (this.activeName == 'card') {
          this.getCard(this.pageNo);
        } else if (this.activeName == 'hopeMessage') {
          this.getMessage(this.pageNo);
        }
      },
      handleClick(tab, event) {
        var that = this;
        this.pageNo = 1;
        console.log(tab.index);
        if (tab.index == 0) {
          this.getData(this.pageNo);
        } else if (tab.index == 1) {
          this.getCard(this.pageNo);
        } else if (tab.index == 2) {
          this.getMessage(this.pageNo);
        }
      },

      editGoods() {
        this.dialogForm = true;
        this.getAllGoods();
      },
      getAllGoods() {
        var that = this;
        var url = this.GLOBAL.url.crmdiscount.replace("{sellerId}", this.GLOBAL.sellerId);
        this.$axios.get(url, {})
          .then(function (response) {
            console.log(response.data.results);
            that.tableData = response.data.results;
            that.total = response.data.count;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      subForm() {
        var that = this;
        var url = this.GLOBAL.url.discount.replace("{sellerId}", this.GLOBAL.sellerId);
        var crmLevel;
        for (let i = 0; i < this.form.quantityUnit.length; i++) {
          if (i == 0) {
            crmLevel = this.form.quantityUnit[i].level + ":" + this.form.quantityUnit[i].levelName + ":" + this.form.quantityUnit[i].discount;
          } else {
            crmLevel = crmLevel + "," + this.form.quantityUnit[i].level + ":" + this.form.quantityUnit[i].levelName + ":" + this.form.quantityUnit[i].discount;
          }
        }
        var data = {
          id: 0,
          items: this.form.items,
          levelDiscount: crmLevel,
          name: this.form.name,
          sellerId: this.GLOBAL.sellerId
        };
        console.log(data);
        this.$axios.post(url, data).then((res) => {
          console.log(res);
          this.getData(this.pageNo);
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
      handleDelete(index, info) {
        var that = this;
        console.log(info);
        var url = this.GLOBAL.url.delMessage.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{id}", info.id);
        this.$axios.delete(url).then(function (response) {
          console.log(response);
          that.pageNo = 1;
          that.getMessage(that.pageNo);
          that.$message({
            type: 'info',
            message: response.data.code == '9999' ? response.data.message : '删除成功'
          });
        })
          .catch(function (error) {
            console.log(error);
          });
      },
      toOrderDetail() {
        console.log(this.chooseInfo);
        this.$router.push('/order/'+ this.chooseInfo.tid);
      }
    }
  }
</script>
