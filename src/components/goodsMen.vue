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
          <div class="searchGroup" v-if="activeName == 'first'|| activeName == 'third'">
            <el-input
              placeholder="请输入商品名称"
              v-model="searchContent"
              class="searchClass"
              clearable>
            </el-input>
            <el-select v-model="sizeForm.cid" placeholder="请选择商品分类">
              <el-option
                v-for="item in cat"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" class="btnSearch" @click='searchByName'></el-button>
          </div>
        </transition>
      </div>
      <el-button type="primary" icon="el-icon-plus" style="position: absolute;right: 0;z-index: +99;"
                 @click="addGood"></el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商品列表" name="first">
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
              prop="cid"
              label="分类"
              :filters="cat"
              :filter-method="filterTag"
              filter-placement="bottom-end">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.cid === '家' ? 'primary' : 'success'"
                  disable-transitions>{{scope.row.cName}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="onShop"
              label="上架"
              width="80">
              <template slot-scope="scope">
                <el-switch v-model="tableData[scope.$index].onShop"
                           :disabled="scope.row.stock ==0"
                           @change="changeStatus(tableData[scope.$index].id,tableData[scope.$index].onShop)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="hot"
              label="推荐"
              width="120"
            >
              <template slot-scope="scope">
                <el-switch v-model="tableData[scope.$index].hot"
                           @change="changeHot(tableData[scope.$index],tableData[scope.$index].hot)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="order"
              label="排序"
              width="80"
            >
            </el-table-column>
            <el-table-column
              prop="stock"
              label="库存"
              width="80"
            >
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑
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
        <el-tab-pane name="second">
          <div class="createForm">
            <el-form ref="sizeForm" :model="sizeForm" label-width="80px" size="mini" :rules="rules">
              <el-form-item label="是否使用积分" class="itemHalf">
                <el-switch v-model="sizeForm.useCrmPoints" active-value="true"
                           inactive-value="false"></el-switch>
              </el-form-item>
              <el-form-item label="是否礼品" class="itemHalf">
                <el-switch v-model="sizeForm.type" active-value="2"
                           inactive-value="1" active-text="可送礼" inactive-text="不可送礼"></el-switch>
              </el-form-item>
              <el-form-item label="商品名称" class="itemHalf" prop="name">
                <el-input v-model="sizeForm.name"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" class="itemHalf">
                <el-select v-model="sizeForm.cid" placeholder="请选择商品分类">
                  <el-option
                    v-for="item in cat"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品标签" class="itemHalf">
                <el-select v-model="sizeForm.tags" placeholder="请选择商品分类">
                  <el-option
                    v-for="item in tags"
                    :key="item.id"
                    :label="item.tag"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="最高可用积分" class="itemHalf" prop="name" v-if="sizeForm.useCrmPoints == 'true'">
                <el-input v-model="sizeForm.maxUseCrmPoints"></el-input>
              </el-form-item>
              <div>
                <p>商品规格</p>
                <div style="padding: 20px 0;border-bottom: 1px solid #d3d3d3;margin: 20px 0">
                  <el-form-item label="一级规格">
                    <el-select v-model="skuNameInfo.name" placeholder="请选择规格系列" style="display: inline-block;"
                               filterable
                               allow-create
                               @change="setSkuKey(skuNameInfo.name,1)"
                    >
                      <el-option
                        v-for="item in skuName"
                        :key="item.id"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="规格值">
                    <el-input class="sameLine" v-for="(item,index) in skuValueInfo" v-model="item.name" placeholder="请输入规格值" :key="index"
                              @blur="addSkuValue(item.name,1)"></el-input>
                    <el-button type="primary" icon="el-icon-plus" class="sameLine" @click="addValue(1)">添加规格值
                    </el-button>
                  </el-form-item>
                  <el-form-item label="规格图">
                    <el-upload
                      action=""
                      :http-request="fnUploadRequestSku"
                      class="sameLine avatar-uploader"
                      :show-file-list="false"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                      v-for="(item , index) in skuValueInfo.length"
                       :key="index"
                    >
                      <img :src="picUrlSku[index]" class="avatar" v-if="picUrlSku!=''">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="二级规格">
                    <el-select v-model="secSkuName.name" placeholder="请选择规格系列" style="display: inline-block;"
                               filterable
                               allow-create
                               @change="setSkuKey(secSkuName.name,2)"
                    >
                      <el-option
                        v-for="item in skuName"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="规格值">
                    <el-input class="sameLine" v-for="(item , index) in skuValueInfo2" v-model="item.name"  :key="index"
                              placeholder="请输入规格值"
                              @blur="addSkuValue(item.name ,2)"></el-input>
                    <el-button type="primary" icon="el-icon-plus" class="sameLine" @click="addValue(2)">添加规格值
                    </el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-table
                      :data="specsType"
                      style="width: 100%"
                      :span-method="objectSpanMethod"
                    >
                      <el-table-column
                        prop="name"
                        :label="skuNameInfo.name"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="nameSec"
                        :label="secSkuName.name"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        label="库存">
                        <template slot-scope="scope">
                          <el-input v-if="specsType.length != 0" v-model="specsType[scope.$index].stock"
                                    :label="specsType[scope.$index].stock" @blur="sumStock"></el-input>
                          <span v-else>{{scope.row}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="重量（kg）">
                        <template slot-scope="scope">
                          <el-input v-if="specsType.length != 0" v-model="specsType[scope.$index].weight"></el-input>
                          <span v-else>{{scope.row.weight}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="售价（元）">
                        <template slot-scope="scope">
                          <el-input v-if="specsType.length != 0" v-model="specsType[scope.$index].price"
                                    :label="specsType[scope.$index].price"></el-input>
                          <span v-else>{{scope.row.price}}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                  <el-form-item label="批量设置">
                    <el-input v-model="allStock" class="sameLine" placeholder="批量库存" @blur="setAll('stock')"></el-input>
                    <el-input v-model="allPrice" class="sameLine" placeholder="批量售价" @blur="setAll('price')"></el-input>
                  </el-form-item>
                </div>
              </div>
              <el-form-item label="商品相册">
                <span v-if="sizeForm.images!=''">
                  <img v-for='(item,index) in sizeForm.images' :src="item"   :key="index"
                     style="height: 100px;margin-right:20px;width: 100px;">
                </span>
                
                <el-upload
                  class="avatar-uploader"
                  action=""
                  :http-request="fnUploadRequestAll"
                  list-type="picture-card"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="60%" :src="picUrlAll[picUrlAll.length-1]" alt="">
                </el-dialog>
              </el-form-item>
              <el-form-item label="商品封面图">
                <img :src="sizeForm.picUrl" style="height: 100px;width: 100px;" v-if="sizeForm.picUrl == ''">
                <!--<img :src="picUrl" style="height: 100px;width: 100px;" v-if="picUrl != ''">-->
                <el-upload
                  class="avatar-uploader"
                  action=""
                  :http-request="fnUploadRequest"
                  :show-file-list="false"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                >
                  <img :src="picUrl" class="avatar" v-if="picUrl !=''">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="商品库存" class="itemHalf" prop="stock">
                <el-input v-model="sizeForm.stock" disabled></el-input>
              </el-form-item>
              <el-form-item label="库存警告" class="itemHalf">
                <el-input v-model="sizeForm.warnNum"></el-input>
              </el-form-item>
              <el-form-item label="产地" class="itemHalf" prop="location">
                <el-input v-model="sizeForm.location"></el-input>
              </el-form-item>
              <el-form-item label="储存条件" class="itemHalf">
                <el-input v-model="sizeForm.storageCondition"></el-input>
              </el-form-item>
              <el-form-item label="商品品牌" class="itemHalf" prop="brand">
                <el-input v-model="sizeForm.brand"></el-input>
              </el-form-item>
              <el-form-item label="运费模板">
                <el-select v-model="sizeForm.deliveryTemplateId" placeholder="请选择规格系列" style="display: inline-block;"
                           filterable
                           allow-create>
                  <el-option
                    v-for="item in deliveryData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <span class="fastRun">快速添加运费模板</span>
              </el-form-item>
              <div class="selZoom">
                <p>售价</p>
                <el-form-item label="价格" prop="price">
                  <el-input v-model="sizeForm.price"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="商品详情">
                <editor :height=400 ref="editor" :value="content" @input="(content)=> content = content"></editor>
              </el-form-item>
              <el-form-item size="large">
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button @click="backOne">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="回收站" name="third">
          <el-table
            :data="rubData"
            style="width: 100%"
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
            <el-table-column label="操作" width="220">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">还原
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
    <div class="footerChoose" v-if="activeName == 'first' || activeName == 'third'">
      <el-select v-model="chooseSet" placeholder="请选择">
        <el-option
          v-for="item in choose"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-check" class="btnSearch" @click="btnDo"></el-button>
    </div>
    <div class="block" v-if="activeName == 'first' || activeName == 'third'">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :total='total'>
      </el-pagination>
    </div>
    <!--<div>-->
      <!--<el-dialog title="新建运费模板" :visible.sync="dialogFormVisible">-->
        <!--<div>-->
          <!--<el-input v-model="rubData.name" autocomplete="off" placeholder="请输入模板名称"-->
                    <!--style="margin: 0px 0 30px;"></el-input>-->
          <!--<el-radio-group v-model="rubData.radio2">-->
            <!--<el-radio :label="1">按件数</el-radio>-->
            <!--<el-radio :label="2">按重量</el-radio>-->
            <!--<el-radio :label="3">商家包邮</el-radio>-->
          <!--</el-radio-group>-->
          <!--<transition name="el-fade-in-linear">-->
            <!--<el-table-->
              <!--:data="mouldPost"-->
              <!--style="width: 100%;"-->
              <!--v-if="rubData.radio2 !=9 && rubData.radio2 !=3">-->
              <!--<el-table-column-->
                <!--label="可配送区域"-->
                <!--width="180">-->
                <!--<template slot-scope="scope">-->
                  <!--<span v-if="scope.row.templateNames.length>0">{{scope.row.templateNames}},</span>-->
                  <!--<span v-else class="fastRun" @click="chooseAdd(scope)">选择可配送区域</span>-->
                <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
                <!--:label="rubData.radio2 ==2 ? '首重' :'首件'"-->
                <!--width="180"-->
                <!--align="center">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-input v-model="mouldPost[scope.$index].templateAddStandards"></el-input>-->
                  <!--&lt;!&ndash;<span v-else>{{scope.row.templateAddStandards}}</span>&ndash;&gt;-->
                <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
                <!--label="运费"-->
                <!--align="center">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-input v-model="mouldPost[scope.$index].templateAddFees"></el-input>-->
                  <!--&lt;!&ndash;<span v-else>{{scope.row.templateAddFees}}</span>&ndash;&gt;-->
                <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
                <!--:label="rubData.radio2 ==2 ? '续重' :'续件'"-->
                <!--align="center">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-input v-model="mouldPost[scope.$index].templateStartFees"></el-input>-->
                  <!--&lt;!&ndash;<span v-else>{{scope.row.templateStartFees}}</span>&ndash;&gt;-->
                <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column-->
                <!--label="续费"-->
                <!--align="center">-->
                <!--<template slot-scope="scope">-->
                  <!--<el-input v-model="mouldPost[scope.$index].templateStartStandards"></el-input>-->
                  <!--&lt;!&ndash;<span>{{scope.row.templateStartStandards}}</span>&ndash;&gt;-->
                <!--</template>-->
              <!--</el-table-column>-->
            <!--</el-table>-->
          <!--</transition>-->
        <!--</div>-->
        <!--<div slot="footer" class="dialog-footer">-->
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="primary"-->
            <!--@click="handleedit()"-->
          <!--&gt;指定可配送区域和运费-->
          <!--</el-button>-->
          <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
          <!--<el-button type="primary" @click="subForm">确 定</el-button>-->
        <!--</div>-->
      <!--</el-dialog>-->
      <!--<transition name="el-fade-in-linear">-->
        <!--<div>-->
          <!--<el-dialog title="运费地区" :visible.sync="dialogArea">-->
            <!--<div class="chooseArea">-->
              <!--已选择区域：-->
              <!--<el-tag-->
                <!--v-for="tag in chooseLoc"-->
                <!--:key="tag.code"-->
                <!--closable-->
                <!--@close="handleClose(tag)">-->
                <!--{{tag.name}}-->
              <!--</el-tag>-->
            <!--</div>-->
            <!--<div class="chooseArea">-->
              <!--可选择区域：-->
              <!--<div class="chooseAreaBack">-->
                <!--<span-->
                  <!--v-for="(tag , index ) in data"-->
                  <!--:key="tag.code"-->
                  <!--@click = "chooseLocal(tag,index)"-->
                  <!--:class="tag.ok == undefined? 'cancalChoose':tag.ok ?'actChoose': tag.ok ?'cancalChoose':''"-->
                <!--&gt;-->
                  <!--{{tag.name}}-->
                <!--</span>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div slot="footer" class="dialog-footer">-->
              <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
              <!--<el-button type="primary" @click="sureMould">确 定</el-button>-->
            <!--</div>-->
          <!--</el-dialog>-->
        <!--</div>-->
      <!--</transition>-->
    <!--</div>-->
  </div>
</template>
<style>
  .tableInfo {
    position: relative;
    vertical-align: top;
    display: inline-block;
    left: 1.5vw;
    width: 84%;
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

  .bottomSearch .searchClass {
    position: absolute;
    width: 12%;
    right: 160px;
    top: 0px;
  }

  .bottomSearch .el-button.btnSearch {
    position: absolute;
    width: 4%;
    right: 60px;
    top: 0px;
  }

  .bottomSearch {
    position: relative;
    top: 2vh;
    z-index: +99;
  }

  .bottomSearch .searchGroup .el-select, .footerChoose .el-select {
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

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 165px;
    height: 165px;
    line-height: 165px;
    text-align: center;
  }

  .avatar {
    width: 165px;
    height: 165px;
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

  .fastRun{
    font-size: 12px;
    margin-left: 15px;
    color: #3399ff;
    font-style: oblique;
  }

  .sameLine {
    display: inline-block;
    margin-right: 20px;
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
        tableData: [],
        dialogFormVisible: false,
        content: '',
        tinymceHtml: 'abc',
        activeName: 'first',
        searchContent: '',
        classfy: '',
        chooseSet: '',
        dialogImageUrl: '',
        dialogVisible: false,
        imageUrl: '',
        specsType: [],
        allStock: '',
        allPrice: '',
        choose: [{
          value: '1',
          label: '下架'
        }, {
          value: '2',
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
          name: 'aaa',
          region: '',
          // delivery: false,
          desc: '',
          crmPrices: [],
          album: [],
          price: '',
          stock: '',
          warnNum: 0,
          cid: '',
          storageCondition: '',
          maxUseCrmPoints: 0,
          freight: '',
          hot: true,
          useCrmPoints: false,
          deliveryTemplateId: 0,
          order: 0,
          brand: '',
          id: 0,
          tags: "",
          skuStocks: [
            {
              "price": 0,
              "skus": [
                {
                  "key": "string",
                  "keyId": 0,
                  "value": "string",
                  "valueId": 0
                }
              ],
              "stock": 0,
              "weight": 0
            }
          ],
          SkuImage: [{
            imageUrl: '',
            value: ''
          }],
          picUrl: "",
          localtion: '',
          classfyInfo: [],
        },
        skuName: [],
        secSkuName: {
          name: ''
        },
        init: {
          height: 300,
          plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
          toolbar:
            'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
          branding: false
        },
        skuNameInfo: {
          name: ''
        },
        skuValueInfo: [{name: ''}],
        skuValueInfo2: [{name: ''}],
        rubData: [],
        pageNo: 1,
        numId: 0,
        ids: '',
        cat: [],
        tags: [],
        picUrl: '',
        picUrlAll: [],
        deliveryData: [],
        picUrlSku: [],
        shopType: [
          {id: 1, name: '普通商品'},
          {id: 2, name: '礼品'},
        ],
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 3, max: 60, message: '长度在 3 到 60 个字符', trigger: 'blur'}
          ],
          location: [
            {required: true, message: '请输入商品产地', trigger: 'blur'},
            {min: 3, max: 60, message: '长度在 3 到 60 个字符', trigger: 'blur'}
          ],
          brand: [
            {required: true, message: '请输入商品品牌', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          stock: [
            {required: true, message: '请输入商品库存量', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          warn: [
            {required: true, message: '请输入库存报警数', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入商品价格', trigger: 'blur'},
            {min: 1, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          store: [
            {required: true, message: '请输入保存方式', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
        }
      }
    },
// 	watch: {
// 		isCollapse : a
// 	},

    mounted() {
      // console.log(this._watchers);
      this.numId = this.$route.params.ID;
      console.log(this.$route.params.ID);
      this.getCat();
      tinymce.init({});
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
      getData(pageNo) {
        var url = this.GLOBAL.url.goodsList.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + '?curPage=' + pageNo;
        if (this.numId != 0) {
          url = url + '&numIid=' + this.numId;
        }
        if (this.searchContent != '') {
          url = url + '&name=' + this.searchContent;
        }
        if (this.sizeForm.cid != '') {
          url = url + '&cid=' + this.sizeForm.cid;
        }
        var classfyInfo = [];
        this.$axios.get('https://scmall-beta.thinkmacro.cn:443/admin/2589123516/item')
          .then(response=> {
            for (var i = 0; i < response.data.results.length; i++) {
              var name = this.chooseType(response.data.results[i].cid);
              if (name != '') {
                let cName = {cName: name[0].name}
                Object.assign(response.data.results[i], cName);
              } else {
                let cName = {cName: '其他'}
                Object.assign(response.data.results[i], cName);
              }
              if (response.data.results[i].status == '1') {
                let onShop = {onShop: true};
                Object.assign(response.data.results[i], onShop);
              } else {
                let onShop = {onShop: false};
                Object.assign(response.data.results[i], onShop);
              }
              if (response.data.results[i].inRecyleBin) {
                this.rubData.push(response.data.results[i]);
              }
              if (response.data.results[i].type == 1) {
                response.data.results[i].type = '普通商品';
              } else if (response.data.results[i].type == 2) {
                response.data.results[i].type = '礼品';
              }
            }
            console.log(response.data.results);
            this.tableData = response.data.results;
            this.total = response.data.count;

          })
          .catch(function (error) {
            console.log(error);
          });
        url = this.GLOBAL.url.tag.replace("{sellerId}", this.GLOBAL.sellerId);
        this.$axios.get(url)
          .then(response=> {
            console.log(response);
            this.tags = response.data.results;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      setSkuKey(val, type) {
        var chooseList = this.skuName;
        var judge = 0;
        var choose = 0;
        for (let i = 0; i < chooseList.length; i++) {
          if (val == chooseList[i].name) {
            judge++;
            choose = i;
          }
        }
        if (judge == 0) {
          this.addSku(val, type);
        } else {
          if (type == 1) {
            this.skuNameInfo = chooseList[choose];
          } else if (type == 2) {
            this.secSkuName = chooseList[choose];
          }
        }
      },
      getCat() {
        var url = this.GLOBAL.url.cat.replace("{sellerId}", this.GLOBAL.sellerId);
        this.$axios.get(url)
          .then(response=> {
            this.cat = response.data.results;
            this.getData(this.pageNo);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      sumStock() {
        let sumStock = 0;
        for (let i = 0; i < this.specsType.length; i++) {
          sumStock = sumStock + parseFloat(this.specsType[i].stock);
        }
        console.log(sumStock);
        this.sizeForm.stock = sumStock;
      },
      setAll(type) {
        let list = this.specsType;
        let list2 = [];
        let sumStock = 0;
        for (let i = 0; i < this.specsType.length; i++) {
          if (type == 'price') {
            if (this.allPrice < 0.01) {
              this.$message.error('最低单价不能低于0.01');
              return false;
            }
            let allPrice = {price: this.allPrice};
            list = [Object.assign(this.specsType[i], allPrice)];
            list2 = list2.concat(list);
          } else if (type == 'stock') {
            if (this.allPrice <= 0) {
              this.$message.error('最低库存不能低于0');
              return false;
            }
            let allStock = {stock: this.allStock};
            list = [Object.assign(this.specsType[i], allStock)];
            sumStock = sumStock + parseFloat(this.allStock);
            list2 = list2.concat(list);
          }
        }
        this.sizeForm.stock = sumStock;
        this.specsType = list2;
        // console.log(this.specsType);
      },
      backOne() {
        this.activeName = 'first';
      },
      addSku(e, type) {
        console.log(e)
        console.log(this.skuNameInfo);
        if (e == ''){
          this.$message.error('规格名不能为空');
          return false;
        }
        var url = this.GLOBAL.url.sku.replace("{sellerId}", this.GLOBAL.sellerId);
        var data = this.skuNameInfo;
        data.name = e;
        url = url + '?id=' + data.id + '&name=' + data.name;
        this.$axios.post(url, data)
          .then(response=> {
            console.log(response);
            if (type == 1) {
              this.skuNameInfo = response.data.results;
            } else if (type == 2) {
              this.secSkuName = response.data.results;
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      addSkuValue(e, type) {
        var url = this.GLOBAL.url.skuValue.replace("{sellerId}", this.GLOBAL.sellerId);
        if (e == ''){
          this.$message.error('规格名不能为空');
          return false;
        }
        var data = {id: 0, name: e, sellerId: ''};
        url = url + '?id=' + data.id + '&name=' + data.name;
        this.$axios.post(url, data)
          .then(response=> {
            console.log(response);
            if (type == 1) {
              this.skuValueInfo[this.skuValueInfo.length - 1] = response.data.results;
              this.makeTable(1);
            } else if (type == 2) {
              this.skuValueInfo2[this.skuValueInfo2.length - 1] = response.data.results;
              this.makeTable(2);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      makeTable(type) {
        var list = [];
        for (let i = 0; i < this.skuValueInfo.length; i++) {
          let oneSku = this.skuValueInfo[i];
          for (let o = 0; o < this.skuValueInfo2.length; o++) {
            let secSku = {nameSec: this.skuValueInfo2[o].name, idSec: this.skuValueInfo2[o].id};
            Object.assign(secSku, oneSku);
            secSku = [secSku];
            list = list.concat(secSku);
            // console.log(secSku);
          }
        }
        this.specsType = list;
        // console.log(this.specsType);
      },
      chooseType(cid) {
        var id = cid;
        var r = this.cat.filter(function (a) {
          return a.id == id;
        });
        console.log(r)
        return r;
      },
      addGood() {
        this.sizeForm = {};
        this.skuValueInfo= [{name: ''}];
        this.skuValueInfo2= [{name: ''}];
        this.skuNameInfo = {};
        this.secSkuName = {};
        this.activeName = 'second';
        this.getSku();
      },
      getSku() {
        var url = this.GLOBAL.url.sku.replace("{sellerId}", this.GLOBAL.sellerId);
        this.$axios.get(url)
          .then(response=> {
            console.log(response);
            this.skuName = response.data.results;
          })
          .catch(function (error) {
            console.log(error);
          });
        url = this.GLOBAL.url.skuValue.replace("{sellerId}", this.GLOBAL.sellerId);
        this.$axios.get(url)
          .then(response=> {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        url = this.GLOBAL.url.delivery.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + "?pageSize=" + 50;
        this.$axios.get(url)
          .then(response=> {
            console.log(response);
            this.deliveryData = response.data.results;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      upData(info) {
        var data = this.sizeForm;
        console.log(this.specsType);
        console.log(info);
        console.log(tinyMCE.activeEditor.getContent());
        if (info != undefined) {
          data = info;
        }
        var url = this.GLOBAL.url.v2Updata.replace("{sellerId}", this.GLOBAL.sellerId);
        data.desc = tinyMCE.activeEditor.getContent();
        data.picUrl = this.picUrl;
        data.album = this.picUrlAll;
        var skuImages = [];
        for (let i = 0; i < this.skuValueInfo.length; i++) {
          let picUrl = [{value: this.skuValueInfo[i].name, imageUrl: this.picUrlSku[i]}];
          skuImages = skuImages.concat(picUrl);
        }
        let list = [];
        for (let i = 0; i < this.specsType.length; i++) {
          let skuStock = {
            price: this.specsType[i].price,
            stock: this.specsType[i].stock,
            weight: this.specsType[i].weight,
          }
          let stockSku = [];
          let skusOne = [{
            key: this.skuNameInfo.name,
            keyId: this.skuNameInfo.id,
            value: this.specsType[i].name,
            valueId: this.specsType[i].id,
          }];
          let skusTwo = [{
            key: this.secSkuName.name,
            keyId: this.secSkuName.id,
            value: this.specsType[i].nameSec,
            valueId: this.specsType[i].idSec,
          }];
          if (this.secSkuName != '') {
            skusOne = skusOne.concat(skusTwo);
          }
          let skus = {skus: skusOne};
          Object.assign(skuStock, skus);
          list = list.concat([skuStock]);
        }
        // console.log(list);
        data.skuStocks = list;
        data.skuImages = skuImages;
        console.log(JSON.stringify(data, null, 2));
        this.$axios.post(url, data).then((res) => {
          console.log(res);
          if (res.data.success) {
            this.$message({
              message: this.activeName == 'second' ? '新建商品成功' : '编辑商品成功',
              type: 'success'
            });
            this.activeName = 'first';
            this.getData(this.pageNo);
          } else {
            this.$message.error(res.data.message);
          }
        })
      },
      changeHot(info, status) {
        info.hot = status;
        console.log(info);
        var url = this.GLOBAL.url.goodsHot.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{numIid}", info.id);
        url = url + '?cid=' + info.cid + '&isHot=' + info.hot;
        console.log(url);
        this.$axios.put(url, {})
          .then(response=> {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        // this.upData(info);
      },
      changeNow(nid, status) {
      
        if (status) {
          var url = this.GLOBAL.url.listing.replace("{sellerId}", this.GLOBAL.sellerId);
          url = url.replace("{numIid}", nid);
        } else {
          var url = this.GLOBAL.url.delisting.replace("{sellerId}", this.GLOBAL.sellerId);
          url = url.replace("{numIid}", nid);
        }
        this.$axios.put(url
        ).then((res) => {
          console.log(res);
        })
      },
      changeStatus(id, status) {
        console.log(status + ',' + id);
        this.changeNow(id, status);
      },
      handleAvatarSuccess(res, file) {
        console.log(file);
        console.log(res);
        this.sizeForm.picUrl = URL.createObjectURL(file.raw);
      },
      addValue(type) {
        var newSkuValue = {id: 0, sellerId: '', name: ''};
        if (type == 1) {
          this.skuValueInfo= this.skuValueInfo.concat(newSkuValue);
        } else if (type == 2) {
          this.skuValueInfo2= this.skuValueInfo2.concat(newSkuValue);
        }
      },
      handleClick() {

      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getData(this.pageNo);
      },
      handleDelete(index, info) {
     
        var url = this.GLOBAL.url.delGoods.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{numIid}", info.id);
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(url)
            .then(res=> {
              console.log(res);
              this.getData(this.pageNo);
              this.$message({
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
      // handleRemove(file, fileList) {
      //   console.log(file, fileList);
      // },
      // handlePictureCardPreview(file) {
      //   console.log(file.url);
      //   this.sizeForm.album = file.url;
      //   this.dialogVisible = true;
      // },
      onSubmit() {
        this.upData();
      },
      handleEdit(index, info) {
        // this.dialogFormVisible = true;
        var url = this.GLOBAL.url.goodsDetail.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{numIid}", info.id);
        this.$axios.get(url, {})
          .then(response=> {
            console.log(response.data.results);
            if (response.data.results.type == 1) {
              response.data.results.type = '普通商品';
            } else if (response.data.results.type == 2) {
              response.data.results.type = '礼品';
            }
            this.sizeForm = response.data.results;
          })
          .catch(function (error) {
            console.log(error);
          });
        console.log(this.sizeForm);
        url = this.GLOBAL.url.nuSku.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{numIid}", info.id);
        this.$axios.get(url, {})
          .then(response=> {
            console.log(response.data.results);
            this.specsType = response.data.results;
            var skuOne = [];
            var skuTwo = [];
            for (let i = 0; i < response.data.results.length; i++) {
              console.log(response.data.results[i]);
              if (response.data.results[i].propertiesName.search(";") != -1) {
                var sku = response.data.results[i].propertiesName.split(';');
              }else {
                var sku = [response.data.results[i].propertiesName];
              }
              if (response.data.results[i].properties.search(";") != -1) {
                var skuId = response.data.results[i].properties.split(';');
              }else {
                var skuId = [response.data.results[i].properties];
              }
              console.log(sku);
              console.log(skuId);
              this.specsType[i].name = sku[0].split(":")[1];
              if (sku.length>1){
                this.specsType[i].nameSec = sku[1].split(":")[1];
                this.secSkuName.name = sku[1].split(":")[0];
                skuTwo.push(sku[1].split(":")[1]);
              }
              if (skuId.length>1){
                this.specsType[i].idSec = skuId[1].split(":")[1];
                this.secSkuName.id = skuId[1].split(":")[0];
              }
              this.specsType[i].id = skuId[0].split(":")[1];
              this.skuNameInfo.name = sku[0].split(":")[0];
              this.skuNameInfo.id = skuId[0].split(":")[0];
              skuOne.push(sku[0].split(":")[1]);
              console.log(skuOne);
              console.log(skuTwo);
            }
            this.getSkuFunction(skuOne, 1);
            this.getSkuFunction(skuTwo, 2);
          })
          .catch(function (error) {
            console.log(error);
          });
        this.activeName = 'second';
        this.getSku();
      },
      setTheValue(skuArr, type) {
        console.log(skuArr);
        let skuInfo = [];
        for (let i = 0; i < skuArr.length; i++) {
          let newSku = [{name: skuArr[i]}];
          skuInfo = skuInfo.concat(newSku);
        }
        console.log(skuInfo);
        if (type == 1) {
          this.skuValueInfo = skuInfo;
        } else if (type == 2) {
          this.skuValueInfo2 = skuInfo;
        }
      },
      getSkuFunction(skuArr, type) {
        skuArr.sort();
        var arr = [skuArr[0]];
        for (var i = 1; i < skuArr.length; i++) {
          console.log(skuArr[i]);
          if (skuArr[i] !== skuArr[i - 1]) {
            arr.push(skuArr[i]);
          }
        }
        console.log(arr);
        this.setTheValue(arr, type);
      },
      handleSelectionChange(val) {
        console.log(val);
        var ids = '';
        for (let i = 0; i < val.length; i++) {
          if (i == 0) {
            ids = val[i].id;
          } else {
            ids = ids + ',' + val[i].id;
          }
        }
        console.log(ids);
        this.ids = ids;
      },
      btnDo() {
        console.log(this.chooseSet);
        if (this.chooseSet == '1') {
          var url = this.GLOBAL.url.setAll.replace("{sellerId}", this.GLOBAL.sellerId);
          this.$axios.put(url, {ids: this.ids})
            .then(response=>{
              console.log(response);
              this.getData(this.pageNo);
            })
            .catch(function (error) {
              console.log(error);
            });
        } else if (this.chooseSet == '2') {
          var url = this.GLOBAL.url.delAll.replace("{sellerId}", this.GLOBAL.sellerId);
          this.$axios.delete(url, {data: {ids: this.ids}})
            .then(response=> {
              console.log(response);
              this.getData(this.pageNo);
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      },
      subForm() {
        this.upData();
        this.dialogFormVisible = false;
      },
      searchByName() {
        this.getData(this.pageNo);
      },
      async fnUploadRequest(option) {
        oss.ossUploadFile(option)
          .then(function (res) {
            console.log(res.fileUrl);
            setTimeout(function () {
              // that.dialogVisible = true;
              this.picUrl = res.fileUrl;
            }, 300)
          });
        setTimeout(function () {
          // that.dialogVisible = true;
          console.log(this.picUrl)
        }, 300)
      },
      async fnUploadRequestAll(option) {
        oss.ossUploadFile(option)
          .then(function (res) {
            console.log(res.fileUrl);
            this.picUrlAll.push(res.fileUrl);
          });
        setTimeout(function () {
          // that.dialogVisible = true;
          console.log(this.picUrlAll)
        }, 600)
      },
      async fnUploadRequestSku(option) {
        oss.ossUploadFile(option)
          .then(function (res) {
            console.log(res.fileUrl);
            setTimeout(function () {
              // that.dialogVisible = true;
              console.log(this.picUrlAll);
              this.picUrlSku.push(res.fileUrl);
            }, 600)
          });

      },
      objectSpanMethod({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 0) {
          if (rowIndex % this.skuValueInfo2.length === 0) {
            return {
              rowspan: this.skuValueInfo2.length,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>
