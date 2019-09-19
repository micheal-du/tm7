<template>
  <div class="tableInfo">
    <div class="searchLine">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商城设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listTable">
      <el-button type="primary" icon="el-icon-plus" style="position: absolute;top: 20px;right: 0;z-index: +99;"
                 @click="addGood"></el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="运费模板" name="trade">
          <el-table
            :data="allData"
            style="width: 100%"
            default-expand-all
            stripe>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <!--<el-form-item :label="props.row.valuation ==2 ? '首重（kg）' : props.row.valuation ==1  ? '首件（个）' : ''"-->
                  <!--v-if="props.row.valuation !=3">-->
                  <!--<span>{{ props.row.templateStartStandards}}</span>-->
                  <!--</el-form-item>-->
                  <!--<el-form-item label="运费" v-if="props.row.valuation !=3">-->
                  <!--<span>{{ props.row.templateStartFees}} </span>-->
                  <!--</el-form-item>-->
                  <!--<el-form-item :label="props.row.valuation ==2 ? '续重（Kg）' : props.row.valuation ==1  ? '续件（个）' : ''"-->
                  <!--v-if="props.row.valuation !=3">-->
                  <!--<span>{{ props.row.templateAddFees}}</span>-->
                  <!--</el-form-item>-->
                  <!--<el-form-item label="运费" v-if="props.row.valuation !=3">-->
                  <!--<span>{{ props.row.templateAddStandards}}</span>-->
                  <!--</el-form-item>-->
                  <!--<el-form-item label="计价方式" v-if="props.row.valuation ==3">-->
                  <!--<span>商家包邮</span>-->
                  <!--</el-form-item>-->
                  <el-table
                    :data="props.row.localName"
                    style="width: 100%">
                    <el-table-column
                      label="配送区域">
                      <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row" :key="index">{{item.name}},</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="props.row.valuation ==2 ? '首重（Kg）' : props.row.valuation ==1  ? '首件（个）' : ''"
                      v-if="props.row.valuation !=3"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.templateStartStandards}} </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="运费"
                      v-if="props.row.valuation !=3">
                      <template slot-scope="scope">
                        <span>{{ scope.row.templateStartFees}} </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="props.row.valuation ==2 ? '续重（Kg）' : props.row.valuation ==1  ? '续件（个）' : ''"
                      v-if="props.row.valuation !=3"
                    >
                      <template slot-scope="scope">
                        <span>{{ scope.row.templateAddFees}} </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="运费"
                      v-if="props.row.valuation !=3">
                      <template slot-scope="scope">
                        <span>{{ scope.row.templateAddStandards}} </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="计价方式"
                      v-if="props.row.valuation ==3"
                    >
                      <template >
                        <span>商家包邮</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="模板名称">
              <template slot-scope="scope">
                <div class="postName">
                  {{scope.row.name}}
                </div>
              </template>
            </el-table-column>
            <!--<el-table-column-->
            <!--label="配送区域"-->
            <!--&gt;-->
            <!--<template slot-scope="scope">-->
            <!--<div class="postInfo" v-if="scope.row.localtionSet!=''">-->
            <!--<span v-for="item in scope.row.localName">{{item.name}},</span>-->
            <!--</div>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="edit(scope)">编辑
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
    <div class="block" v-if="activeName == 'trade'">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total='total'>
      </el-pagination>
    </div>
    <div>
      <el-dialog title="新建运费模板" :visible.sync="dialogFormVisible">
        <div>
          <el-input v-model="rubData.name" autocomplete="off" placeholder="请输入模板名称"
                    style="margin: 0px 0 30px;"></el-input>
          <el-radio-group v-model="rubData.radio2">
            <el-radio :label="1">按件数</el-radio>
            <el-radio :label="2">按重量</el-radio>
            <el-radio :label="3">商家包邮</el-radio>
          </el-radio-group>
          <transition name="el-fade-in-linear">
            <el-table
              :data="mouldPost"
              style="width: 100%;"
              v-if="rubData.radio2 !=9 && rubData.radio2 !=3">
              <el-table-column
                label="可配送区域"
                width="180">
                <template slot-scope="scope">
                  <!--<el-button-->
                  <!--size="mini"-->
                  <!--type="primary"-->
                  <!--@click="handleedit(scope)"-->
                  <!--v-if="scope.row.templateNames == 1"-->
                  <!--&gt;指定可配送区域和运费-->
                  <!--</el-button>-->
                  <!--<el-input v-model="mouldPost[scope.$index].templateAddStandards"></el-input>-->
                  <span v-if="scope.row.templateNames.length>0">{{scope.row.templateNames}},</span>
                  <span v-else class="fastRun" @click="chooseAdd(scope)">选择可配送区域</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="rubData.radio2 ==2 ? '首重' :'首件'"
                width="180"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model="mouldPost[scope.$index].templateAddStandards"></el-input>
                  <!--<span v-else>{{scope.row.templateAddStandards}}</span>-->
                </template>
              </el-table-column>
              <el-table-column
                label="运费"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model="mouldPost[scope.$index].templateAddFees"></el-input>
                  <!--<span v-else>{{scope.row.templateAddFees}}</span>-->
                </template>
              </el-table-column>
              <el-table-column
                :label="rubData.radio2 ==2 ? '续重' :'续件'"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model="mouldPost[scope.$index].templateStartFees"></el-input>
                  <!--<span v-else>{{scope.row.templateStartFees}}</span>-->
                </template>
              </el-table-column>
              <el-table-column
                label="续费"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model="mouldPost[scope.$index].templateStartStandards"></el-input>
                  <!--<span>{{scope.row.templateStartStandards}}</span>-->
                </template>
              </el-table-column>
            </el-table>
          </transition>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="mini"
            type="primary"
            @click="handleedit()"
          >指定可配送区域和运费
          </el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="subForm">确 定</el-button>
        </div>
      </el-dialog>
      <transition name="el-fade-in-linear">
        <div>
          <el-dialog title="运费地区" :visible.sync="dialogArea">
            <!--<el-transfer-->
              <!--v-model="value"-->
              <!--:data="data"-->
              <!--:titles="['未选择区域','已选择区域']">-->
              <!--<div slot-scope="{ option }">-->
                <!--<div @click="checkAll(option)">{{ option.name }}</div>-->
                <!--&lt;!&ndash;<div v-if="option.childrenValue">&ndash;&gt;-->
                <!--&lt;!&ndash;<span v-for="item in option.children" style="display: block">{{item.name}}</span>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
              <!--</div>-->
              <!--<el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>-->
              <!--<el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>-->
            <!--</el-transfer>-->
            <div class="chooseArea">
              已选择区域：
              <el-tag
                v-for="tag in chooseLoc"
                :key="tag.code"
                closable
                @close="handleClose(tag)">
                {{tag.name}}
              </el-tag>
            </div>
            <div class="chooseArea">
              可选择区域：
              <div class="chooseAreaBack">
                <span
                  v-for="(tag , index ) in data"
                  :key="tag.code"
                  @click = "chooseLocal(tag,index)"
                  :class="tag.ok == undefined? 'cancalChoose':tag.ok ?'actChoose': tag.ok ?'cancalChoose':''"
                >
                  {{tag.name}}
                </span>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="sureMould">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </transition>
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

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 49%;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .chooseArea{
    margin-bottom: 20px;
  }

  .chooseArea .el-tag{
    margin-right: 10px;
    margin-bottom: 10px;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
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

  .postName {
    font-size: 22px;
    padding: 15px 0;
  }
  .chooseAreaBack{
    background: #f2f2f2;
    padding: 20px 20px 10px 20px;
    margin-top: 20px;
    max-height: 300px;
    overflow-y: auto;
  }
  .fastRun {
    font-size: 12px;
    margin-left: 15px;
    color: #3399ff;
    font-style: oblique;
  }

  .el-transfer-panel {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    max-height: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
  }

  .el-transfer__buttons {
    transform: rotate(90deg);
    width: 5%;
    position: relative;
    left: 43%;
  }

  .tableInfo .el-transfer-panel__item {
    height: auto !important;
    width: 22%;
    display: inline-block;
  }
  .chooseAreaBack span{
    padding: 10px;
    position: relative;
    display: inline-block;
  }
  span.actChoose{
    background: #2276d2;
    color: #FFFFFF;
  }
  span.cancalChoose{
    background: none;
    color: #000;
  }
</style>
<script>
  export default {
    data() {
      const generateData = _ => {
        const data = [];
        const cities = this.CITY.cities;
        for (let i = 0; i < cities.length; i++) {
          data.push({
            key: i,
            name: cities[i].name,
            code: cities[i].code,
            children: cities[i].children,
            childrenValue: false
          });
        }
        console.log(data);
        return data;
      };
      return {
        allData: [],
        formPostFee: {},
        activeName: 'trade',
        searchContent: '',
        childrenValue: false,
        classfy: '',
        chooseSet: '',
        dialogImageUrl: '',
        dialogVisible: false,
        dialogFormVisible: false,
        imageUrl: '',
        total: 0,
        pageNo: 1,
        mouldPost: [{
          templateAddFees: '',
          templateAddStandards: '',
          templateDests: '',
          templateNames: '',
          templateStartFees: '',
          templateStartStandards: '',
        }],
        rubData: {
          radio2: 3,
          name: ''
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogArea: false,
        data: generateData(),
        value: [],
        allLocal: [],
        chooseType : 1,
        dId : 0,
        chooseLoc :[]
      }
    },
    mounted() {
      this.getData(this.pageNo);
    }
    ,
    methods: {
      getData(pageNo) {
        var that = this;
        var url = this.GLOBAL.url.delivery.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + "?curPage=" + pageNo;
        this.$axios.get(url)
          .then(function (response) {
            console.log(response.data.results)
            for (let i = 0; i < response.data.results.length; i++) {
              let localName = {localName: that.getAllLocal(response.data.results[i])};
              Object.assign(response.data.results[i], localName);
              console.log(response.data.results[i]);
            }
            that.allData = response.data.results;
            that.total = response.data.count;
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log(that.allData);
      },
      handleedit() {
        console.log(this.mouldPost);
        this.mouldPost = this.mouldPost.concat([{
          templateAddFees: '',
          templateAddStandards: '',
          templateDests: '',
          templateNames: '',
          templateStartFees: '',
          templateStartStandards: '',
        }])
      },
      chooseLocal(tag,index){
        console.log(tag);
        // console.log(index);
        // console.log(this.data[index].ok);
        if (this.data[index].ok == undefined) {
          let ok = {ok : true};
          Object.assign(this.data[index],ok);
          this.chooseLoc = this.chooseLoc.concat([tag]);
        }else{
          let ok = {ok : !this.data[index].ok};
          Object.assign(this.data[index],ok);
          if (this.data[index].ok){
            this.chooseLoc = this.chooseLoc.concat([tag]);
          } else{
            // this.chooseLoc = this.chooseLoc.concat([tag]);
            let city = this.chooseLoc;
            for (let i = 0 ; i< this.chooseLoc.length ; i ++){
              if (tag.code == city[i].code){
                city.splice(i,1,'')
              }
            }
            let trueCity = [];
            for (let i = 0 ; i < city.length ; i++){
              if (city[i]==''){
              } else {
                trueCity = trueCity.concat(city[i]);
              }
            }
            this.chooseLoc = trueCity;
            console.log(trueCity);
            console.log(this.chooseLoc);
            return
          }
          console.log(this.data[index]);
        }
      },
      chooseAdd(info) {
        this.makeTag(info.row);
      },
      addGood() {
        this.mouldPost = [{
          templateAddFees: '',
          templateAddStandards: '',
          templateDests: '',
          templateNames: '',
          templateStartFees: '',
          templateStartStandards: '',
        }];
        this.chooseType = 1;
        this.dId = 0;
        this.dialogFormVisible = true;
      }
      ,
      makeTag(info) {
        var that = this;
        this.dialogArea = true;
        this.dId = info.id;
      }
      ,
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getData(this.pageNo);
      }
      ,
      handleClick(tab, event) {
        var that = this;
        this.getData(this.pageNo);
        if (this.activeName == 'newTag') {
          this.makeTag(0);
        }
      },
      checkAll(allCity) {
        console.log(allCity);
      },
      sureMould() {
        this.dialogArea = false;
        let postArea;
        let postCode;
        let postList;
        for (let i = 0; i < this.chooseLoc.length; i++) {
          if (i == 0) {
            postArea = this.chooseLoc[i].name;
            postCode = this.chooseLoc[i].code;
          } else {
            postArea = postArea + ',' + this.chooseLoc[i].name;
            postCode = postCode + ',' + this.chooseLoc[i].code;
          }
        }
        postList = {
          templateDests: postCode, templateNames: postArea,
          templateStartFees: 0, templateStartStandards: 0, templateAddFees: 0, templateAddStandards: 0
        }
        if (this.mouldPost.length == 1) {
          this.mouldPost = [postList];
        } else {
          this.mouldPost[this.mouldPost.length - 1].templateDests = postCode;
          this.mouldPost[this.mouldPost.length - 1].templateNames = postArea;
        }
        console.log(this.mouldPost);
      },
      handleDelete(index, info) {
        var that = this;
        var url = this.GLOBAL.url.delivery.replace("{sellerId}", this.GLOBAL.sellerId);
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
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
      ,
      subForm() {
        console.log(this.mouldPost);
        this.upMould();
        this.dialogFormVisible = false;
      },
      upMould() {
        var that = this;
        var url = this.GLOBAL.url.delivery.replace("{sellerId}", this.GLOBAL.sellerId);
        var data = {
          fixedFees: 0,
          id: this.dId,
          name: this.rubData.name,
          sellerId: '',
          valuation: this.rubData.radio2
        };
        var dispatchAreas = {dispatchAreas: this.mouldPost};
        console.log(this.mouldPost);
        // console.log('data:' + JSON.stringify(dispatchAreas, null, 2));
        if (dispatchAreas.dispatchAreas == '') {
          that.$message.error('区域不能为空');
          return false;
        }
        Object.assign(data, dispatchAreas);
        console.log('data:' + JSON.stringify(data, null, 2));
        if (this.chooseType == 1){
          this.$axios.post(url, data)
            .then(function (res) {
              console.log(res);
              if (!res.data.success) {
                that.$message.error(res.data.message);
              }else {
                that.$message({
                  type: 'info',
                  message: '创建成功'
                });
              }
            })
        } else {
          url = this.GLOBAL.url.delivery.replace("{sellerId}", this.GLOBAL.sellerId);
          url = url + '/' + this.dId;
          this.$axios.put(url, data)
            .then(function (res) {
              console.log(res);
              if (!res.data.success) {
                that.$message.error(res.data.message);
              }else {
                that.$message({
                  type: 'info',
                  message: '修改成功'
                });
                that.getData();
              }
            })
        }
      },
      handleClose(tag) {
        this.chooseLoc.splice(this.chooseLoc.indexOf(tag), 1);
        var dataInfo = this.data;
        console.log(dataInfo);
        console.log(tag);
        for (let i = 0 ; i <dataInfo.length ; i ++){
          if (tag.code == dataInfo[i].code){
            dataInfo[i].ok = false;
          }
        }
        this.data = dataInfo;
      },
      delMould() {
        var that = this;
        var url = this.GLOBAL.url.delivery.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + '/' + this.dId;
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
      },
      edit(info) {
        console.log(info.row);
        this.chooseType = 2;
        this.dialogFormVisible = true;
        // this.getAllLocal(info.row);
        console.log(info.row);
        this.rubData.name = info.row.name;
        this.rubData.radio2 = info.row.valuation;
        this.rubData.radio2 = info.row.valuation;
        this.dId= info.row.id;
        let mainPost = [];
        for (let i = 0 ; i < info.row.localName.length; i++){
          let mouldPost= {
            templateAddFees: '',
            templateAddStandards: '',
            templateDests: '',
            templateNames: '',
            templateStartFees: '',
            templateStartStandards: '',
          };
          mouldPost.templateAddFees = info.row.localName[i].templateAddFees;
          mouldPost.templateAddStandards = info.row.localName[i].templateAddStandards;
          mouldPost.templateStartFees = info.row.localName[i].templateStartFees;
          mouldPost.templateStartStandards = info.row.localName[i].templateStartStandards;
          for (let o = 0 ; o<info.row.localName[i].length;o++) {
            console.log(info.row.localName[i][o].name);
            mouldPost.templateNames = mouldPost.templateNames+ (mouldPost.templateNames==''?'':',') + info.row.localName[i][o].name;
            mouldPost.templateDests = mouldPost.templateDests+ (mouldPost.templateDests==''?'':',') + info.row.localName[i][o].code;
          }
          mainPost = mainPost.concat([mouldPost])
        }
        this.mouldPost = mainPost;
        console.log(mainPost);
      },
      getAllLocal(info) {
        var that = this;
        var localName = [];
        console.log(info.templateDests);
        var localCode = info.templateDests.split(';');
        var localFir = info.templateStartFees.split(';');
        var localFirFee = info.templateStartStandards.split(';');
        var localNext = info.templateAddStandards.split(';');
        var localNextFee = info.templateAddFees.split(';');
        if (localCode[localCode.length - 1] == '') {
          localCode.splice(localCode.length - 1, 1);
        }
        console.log(localCode);
        let arrLocal = [];
        for (let o = 0; o < localCode.length; o++) {
          let allCode = localCode[o].split(',');
          for (let k = 0; k < allCode.length; k++) {
            for (let i = 0; i < this.data.length; i++) {
              if (allCode[k] == this.data[i].code) {
                localName = localName.concat({code: allCode[k], name: this.data[i].name});
              }
            }
          }
          // arrLocal.push([{templateAddStandards : localNext[o],templateAddFees:localNextFee[o] ,
          // templateStartStandards :localFirFee[o] ,templateStartFees : localFir[o]}])
          arrLocal.push(localName);
          Object.assign(arrLocal[o],{templateAddStandards : localNext[o],templateAddFees:localNextFee[o] ,
            templateStartStandards :localFirFee[o] ,templateStartFees : localFir[o]});
        }
        console.log(arrLocal);
        return arrLocal;
        // this.allLocal = localName;
      }
    }
  }
</script>
