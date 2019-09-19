<template>
  <div class="tableInfo">
    <div class="searchLine">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="listTable">
      <el-button type="primary" class="btnSearch" @click='getExcel' style="width: 8%;right: 40%;top: 4%;" :loading="downLoad">导出订单表格</el-button>
      <transition name="el-fade-in-linear">
        <div class="searchGroup">
          <el-input
            placeholder="请输入订单号"
            v-model="searchContent"
            class="searchClass"
            @clear='searchClear'
            clearable>
          </el-input>
          <el-select v-model="statusAll" filterable placeholder="请选择" v-show="activeName == '-1'">
            <el-option
              v-for="item in orderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" class="btnSearch" @click='searchById'></el-button>
        </div>
      </transition>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="-1">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="订单号">
                    <span>{{ props.row.tid }}</span>
                  </el-form-item>
                  <el-form-item label="下单时间">
                    <span>{{ props.row.createTs}}</span>
                  </el-form-item>
                  <el-form-item label="收货人">
                    <span>{{ props.row.name}}</span>
                  </el-form-item>
                  <el-form-item label="手机">
                    <span>{{ props.row.mobile}}</span>
                  </el-form-item>
                  <el-form-item label="积分抵扣">
                    <span>{{props.row.crmPoints}}</span>
                  </el-form-item>
                  <el-form-item label="微信支付">
                    <span>￥{{props.row.payType == 1 || props.row.payType == 2 ? props.row.totalFee.toFixed(2) : 0.00}}</span>
                  </el-form-item>
                  <el-form-item label="优惠券抵扣">
                    <span>{{ props.row.couponFee}}</span>
                  </el-form-item>
                  <el-form-item label="支付方式" v-if="props.row.crmPoints == 0">
                    <span>￥{{  props.row.payType ==4 &&  props.row.couponId == null ?
                      '储值卡支付':  props.row.payType ==4 &&  props.row.couponId != null ?
                      '储值卡 + 券' :  props.row.payType == 1 &&  props.row.couponId != null ?
                      '微信支付 + 券' : '微信支付'  }}</span>
                  </el-form-item>
                  <el-form-item label="支付方式" v-if="props.row.crmPoints != 0">
                    <span>￥{{  props.row.payType ==4 &&  props.row.couponId == null ?
                      '储值卡支付 + 积分 ':  props.row.payType ==4 &&  props.row.couponId != null ?
                      '储值卡 + 券 + 积分' :  props.row.payType == 1 &&  props.row.couponId != null ?
                      '微信支付 + 券 + 积分' : '微信支付 + 积分'  }}</span>
                  </el-form-item>
                  <el-form-item label="储值卡支付">
                    <span>￥{{ props.row.useChargeFee}}</span>
                  </el-form-item>
                  <el-form-item label="分佣佣金">
                    <span>￥{{ props.row.distriAmount ? props.row.distriAmount : 0}}</span>
                  </el-form-item>
                  <el-form-item label="收货地址">
                    <span>{{ props.row.state + props.row.city +  props.row.district + props.row.address}}</span>
                  </el-form-item>
                  <el-form-item label="商品状态">
                    <span>{{ props.row.statusCn}}</span>
                  </el-form-item>
                  <el-form-item label="商品总价">
                    <span>￥{{ props.row.itemTotalFee}}</span>
                  </el-form-item>
                  <el-form-item label="商品名称">
                    <span v-for="(item,index) in props.row.orders" :key="index">{{item.itemName}}<span
                      style="font-weight: 600;color: #dd6161">{{'（x' + item.num + '）  '}} </span></span>
                  </el-form-item>
                  <el-form-item label="商品封面">
                    <el-tooltip class="item" v-for="(item,index) in props.row.orders" effect="dark" :key="index"
                                :content="item.itemName + '（￥' + item.price + '）  规格：' + item.specsValue + item.specs"
                                placement="bottom">
                      <img :src="item.picUrl" style="height: 70px;width: 70px;border-radius: 8px;margin-right: 5px;"
                           @click="toDetailGoods(item.numIid)"/>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="订单号"
              prop="tid">
            </el-table-column>
            <el-table-column
              label="下单时间"
              prop="createTs">
            </el-table-column>
            <el-table-column
              label="收货人"
              prop="name">
            </el-table-column>
            <el-table-column
              label="商品总价">
              <template slot-scope="props">
                <el-popover
                  placement="top"
                  width="160"
                  trigger="hover">
                  <p>优惠券：￥{{props.row.couponFee.toFixed(2)}}</p>
                  <p>积分抵扣：￥{{props.row.crmPoints.toFixed(2)}}</p>
                  <p>储值卡：￥{{props.row.payType == 4 ?props.row.useChargeFee.toFixed(2) : 0.00}}</p>
                  <p>微信支付：￥{{props.row.payType == 1 || props.row.payType == 2 ? props.row.totalFee.toFixed(2) : 0.00}}</p>
                  <p>分销返佣：￥{{props.row.distriAmount ? props.row.distriAmount.toFixed(2) : 0.00}}</p>
                  <span slot="reference">￥{{ props.row.itemTotalFee.toFixed(2)}}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="手机"
              prop="mobile">
            </el-table-column>
            <el-table-column
              label="收货地址">
              <template slot-scope="props">
                <span>{{ props.row.state + props.row.city +  props.row.district + props.row.address}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="订单类型">
              <template slot-scope="props">
                <span>{{ props.row.type == 2 ? '礼品订单' : props.row.distriNumIid ? '分佣订单' :'普通订单'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align='center'>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.status == 1" type="primary">发货
                </el-button>
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.status == 3" type="primary">编辑物流信息
                </el-button>
                <el-button
                  size="mini"
                  @click="handleCheck(scope.$index, scope.row)">查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="1">
				<span slot="label">
					<el-badge v-for="(edgeNum,index) in orderSum" :value="edgeNum.num" class="item" :key="index"
                    v-if="edgeNum.status ==1">待发货</el-badge>
          <!--<el-badge class="item" v-else>待发货</el-badge>-->
				</span>
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="订单号">
                    <span>{{ props.row.tid }}</span>
                  </el-form-item>
                  <el-form-item label="下单时间">
                    <span>{{ props.row.createTs}}</span>
                  </el-form-item>
                  <el-form-item label="收货人">
                    <span>{{ props.row.name}}</span>
                  </el-form-item>
                  <el-form-item label="手机">
                    <span>{{ props.row.mobile}}</span>
                  </el-form-item>
                  <el-form-item label="收货地址">
                    <span>{{ props.row.state + props.row.city +  props.row.district + props.row.address}}</span>
                  </el-form-item>
                  <el-form-item label="商品状态">
                    <span>{{ props.row.statusCn}}</span>
                  </el-form-item>
                  <el-form-item label="商品总价">
                    <span>￥{{ props.row.totalFee}}</span>
                  </el-form-item>
                  <el-form-item label="商品名称">
                    <span v-for="(item,index) in props.row.orders" :key="index">{{item.itemName}}<span
                      style="font-weight: 600;color: #dd6161">{{'（x' + item.num + '）  '}} </span></span>
                  </el-form-item>
                  <el-form-item label="商品封面">
                    <el-tooltip class="item" v-for="(item,index) in props.row.orders" effect="dark" :key="index"
                                :content="item.itemName + '（￥' + item.price + '）  规格：' + item.specsValue + item.specs"
                                placement="bottom">
                      <img :src="item.picUrl" style="height: 70px;width: 70px;border-radius: 8px;margin-right: 5px;"
                           @click="toDetailGoods(item.numIid)"/>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="订单号"
              prop="tid">
            </el-table-column>
            <el-table-column
              label="下单时间"
              prop="createTs">
            </el-table-column>
            <el-table-column
              label="收货人"
              prop="name">
            </el-table-column>
            <el-table-column
              label="手机"
              prop="mobile">
            </el-table-column>
            <el-table-column
              label="收货地址">
              <template slot-scope="props">
                <span>{{ props.row.state + props.row.city +  props.row.district + props.row.address}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">发货
                </el-button>
                <el-button
                  size="mini"
                  @click="handleCheck(scope.$index, scope.row)">查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="100">
				<span slot="label">
					<el-badge v-for="(edgeNum,index) in orderSum" :value="edgeNum.num" class="item" :key="index"
                    v-if="edgeNum.status ==100">退款/退货审核</el-badge>
          <!--<el-badge class="item" v-else>退款/退货审核</el-badge>-->
				</span>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="订单号">
                    <span>{{ props.row.tid }}</span>
                  </el-form-item>
                  <el-form-item label="下单时间">
                    <span>{{ props.row.createTs}}</span>
                  </el-form-item>
                  <el-form-item label="收货人">
                    <span>{{ props.row.name}}</span>
                  </el-form-item>
                  <el-form-item label="手机">
                    <span>{{ props.row.mobile}}</span>
                  </el-form-item>
                  <el-form-item label="收货地址">
                    <span>{{ props.row.state + props.row.city +  props.row.district + props.row.address}}</span>
                  </el-form-item>
                  <el-form-item label="商品状态">
                    <span>{{ props.row.statusCn}}</span>
                  </el-form-item>
                  <el-form-item label="商品总价">
                    <span>￥{{ props.row.totalFee.toFixed(2)}}</span>
                  </el-form-item>
                  <el-form-item label="商品名称">
                    <span v-for="(item,index) in props.row.orders" :key='index'>{{item.itemName}}<span
                      style="font-weight: 600;color: #dd6161">{{'（x' + item.num + '）  '}} </span></span>
                  </el-form-item>
                  <el-form-item label="商品封面">
                    <el-tooltip class="item" v-for="(item,index) in props.row.orders" effect="dark" :key="index"
                                :content="item.itemName + '（￥' + item.price + '）  规格：' + item.specsValue + item.specs"
                                placement="bottom">
                      <img :src="item.picUrl" style="height: 70px;width: 70px;border-radius: 8px;margin-right: 5px;"
                           @click="toDetailGoods(item.numIid)"/>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="订单号"
              prop="tid">
            </el-table-column>
            <el-table-column
              label="下单时间"
              prop="createTs">
            </el-table-column>
            <el-table-column
              label="收货人"
              prop="name">
            </el-table-column>
            <el-table-column
              label="手机"
              prop="mobile">
            </el-table-column>
            <el-table-column
              label="收货地址">
              <template slot-scope="props">
                <span>{{ props.row.state + props.row.city +  props.row.district + props.row.address}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleCheck(scope.$index, scope.row)">查看
                </el-button>
                <el-button
                  size="mini"
                  @click="openRe(scope.$index, scope.row)">审核退款
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="102">
				<span slot="label">
					<el-badge v-for="(edgeNum,index) in orderSum" :value="edgeNum.num" class="item" :key="index"
                    v-if="edgeNum.status == 102">待买家退货</el-badge>
          <!--<el-badge class="item" v-else>待买家退货</el-badge>-->
				</span>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="订单号">
                    <span>{{ props.row.tid }}</span>
                  </el-form-item>
                  <el-form-item label="下单时间">
                    <span>{{ props.row.createTs}}</span>
                  </el-form-item>
                  <el-form-item label="收货人">
                    <span>{{ props.row.name}}</span>
                  </el-form-item>
                  <el-form-item label="手机">
                    <span>{{ props.row.mobile}}</span>
                  </el-form-item>
                  <el-form-item label="收货地址">
                    <span>{{ props.row.state + props.row.city +  props.row.district + props.row.address}}</span>
                  </el-form-item>
                  <el-form-item label="商品状态">
                    <span>{{ props.row.statusCn}}</span>
                  </el-form-item>
                  <el-form-item label="商品总价">
                    <span>{{ props.row.totalFee}}</span>
                  </el-form-item>
                  <el-form-item label="商品名称">
                    <span v-for="(item,index) in props.row.orders" :key="index">{{item.itemName}}<span
                      style="font-weight: 600;color: #dd6161">{{'（x' + item.num + '）  '}} </span></span>
                  </el-form-item>
                  <el-form-item label="商品封面">
                    <el-tooltip class="item" v-for="(item,index) in props.row.orders" effect="dark" :key="index"
                                :content="item.itemName + '（￥' + item.price + '）  规格：' + item.specsValue + item.specs"
                                placement="bottom">
                      <img :src="item.picUrl" style="height: 70px;width: 70px;border-radius: 8px;margin-right: 5px;"
                           @click="toDetailGoods(item.numIid)"/>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="订单号"
              prop="tid">
            </el-table-column>
            <el-table-column
              label="下单时间"
              prop="createTs">
            </el-table-column>
            <el-table-column
              label="收货人"
              prop="name">
            </el-table-column>
            <el-table-column
              label="手机"
              prop="mobile">
            </el-table-column>
            <el-table-column
              label="收货地址">
              <template slot-scope="props">
                <span>{{ props.row.state + props.row.city +  props.row.district + props.row.address}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleCheck(scope.$index, scope.row)">查看
                </el-button>
                <el-button
                  size="mini"
                  @click="sureRec(scope.row)">确认收货
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane name="103">
				<span slot="label">
					<el-badge v-for="edgeNum in orderSum" :value="edgeNum.num" class="item" :key="index"
                    v-if="edgeNum.status ==103">待退款</el-badge>
          <!--<el-badge class="item" v-else>待退款</el-badge>-->
				</span>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="订单号">
                    <span>{{ props.row.tid }}</span>
                  </el-form-item>
                  <el-form-item label="下单时间">
                    <span>{{ props.row.createTs}}</span>
                  </el-form-item>
                  <el-form-item label="收货人">
                    <span>{{ props.row.name}}</span>
                  </el-form-item>
                  <el-form-item label="手机">
                    <span>{{ props.row.mobile}}</span>
                  </el-form-item>
                  <el-form-item label="收货地址">
                    <span>{{ props.row.state + props.row.city +  props.row.district + props.row.address}}</span>
                  </el-form-item>
                  <el-form-item label="商品名称">
                    <span v-for="(item,index) in props.row.orders" :key="index">{{item.itemName}}<span
                      style="font-weight: 600;color: #dd6161">{{'（x' + item.num + '）  '}} </span></span>
                  </el-form-item>
                  <el-form-item label="商品总价">
                    <span>￥{{ props.row.totalFee}}</span>
                  </el-form-item>
                  <el-form-item label="商品名称">
                    <span v-for="(item,index) in props.row.orders" style="font-weight: 600;color: #dd6161" :key="index">{{ item.itemName + '（x' + item.num + '）  '}} </span>
                  </el-form-item>
                  <el-form-item label="商品封面">
                    <el-tooltip class="item" v-for="(item,index) in props.row.orders" effect="dark" :key="index"
                                :content="item.itemName + '（￥' + item.price + '）  规格：' + item.specsValue + item.specs"
                                placement="bottom">
                      <img :src="item.picUrl" style="height: 70px;width: 70px;border-radius: 8px;margin-right: 5px;"
                           @click="toDetailGoods(item.numIid)"/>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column
              label="订单号"
              prop="tid">
            </el-table-column>
            <el-table-column
              label="下单时间"
              prop="createTs">
            </el-table-column>
            <el-table-column
              label="收货人"
              prop="name">
            </el-table-column>
            <el-table-column
              label="手机"
              prop="mobile">
            </el-table-column>
            <el-table-column
              label="收货地址">
              <template slot-scope="props">
                <span>{{ props.row.state + props.row.city +  props.row.district + props.row.address}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleCheck(scope.$index, scope.row)">查看
                </el-button>
                <el-button
                  size="mini"
                  @click="sureGoods(scope.$index, scope.row)">退款
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        layout="prev, pager, next"
        :total='total'>
      </el-pagination>
    </div>
    <div>
      <div v-if="activeName== -1 || activeName== 1">
        <el-dialog title="请输入发货信息" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="请输入物流单号">
              <el-input v-model="form.invoiceNo" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="请选择物流公司名称">
              <el-select v-model="form.logisticsCompanyCn" placeholder="请选择" @change="setValueCom">
                <el-option
                  v-for="item in options"
                  :key="item.label"
                  :label="item.label"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="subForm">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div v-if="activeName== 100 || activeName== 101|| activeName== 103">
        <el-dialog title="订单操作" :visible.sync="dialogFormVisible">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="收货人信息" name="1">
              <div class="tInfo">{{'姓名：'+ tInfo.name}}</div>
              <div class="tInfo">{{'手机：'+ tInfo.mobile}}</div>
              <div class="tInfo">{{'地址：'+ tInfo.state + tInfo.city + tInfo.district + tInfo.address}}</div>
              <div class="tInfo" v-if="tInfo.refundStatus != null">{{'退款理由：'+ rInfo.reson}}</div>
              <div class="tInfo">
                <el-table
                  :data="tInfo.orders"
                  style="width: 100%;">
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
          <el-switch
            v-model="isRe"
            active-text="同意退款"
            inactive-text="拒绝退款"
            style="margin: 30px 0"
            v-if="activeName== 100"
          >
          </el-switch>
          <transition name="el-fade-in-linear">
            <el-form :model="formRe" v-if="isRe && activeName== 100">
              <el-form-item label="请选择退货类型">
                <el-select v-model="reType" placeholder="请选择">
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <div v-if="reType == '2'">
                <el-form-item label="退货收货人">
                  <el-input v-model="formRe.returnReceiverName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="退货收货电话">
                  <el-input v-model="formRe.receiverPhone" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="退货地址">
                  <el-input v-model="formRe.returnAddress" autocomplete="off"></el-input>
                </el-form-item>
              </div>
              <el-form-item label="同意退款金额" v-if="reType == '3'">
                <el-input v-model="formRe.refundAmount" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
          </transition>
          <el-form :model="formRe" v-if="activeName== 101 || activeName== 103">
            <el-form-item :label="activeName== 103 ? '实际退款金额':'同意退款金额'">
              <el-input v-model="formRe.refundAmount" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="subForm">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <el-dialog
        title="订单详情"
        :visible.sync="dialogVisibleDetail"
        width="60%"
        :before-close="handleClose">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="基本信息" name="1">
            <div class="tInfo dialogInfo">{{'订单编号：'+ tInfo.tid}}</div>
            <div class="tInfo dialogInfo">{{'下单时间：'+ tInfo.createTs}}</div>
            <div class="tInfo dialogInfo">{{'订单状态：'+ tInfo.statusCn}}</div>
            <div class="tInfo dialogInfo">{{'购买用户：'+ tInfo.name}}</div>
            <div class="tInfo dialogInfo">{{'配送方式：'+ '快递配送'}}</div>
            <div class="tInfo dialogInfo">{{'配送费用：'+ tInfo.postFee}}</div>
          </el-collapse-item>
          <el-collapse-item title="收货人信息" name="2">
            <div class="tInfo dialogInfo">{{'姓名：'+ tInfo.name}}</div>
            <div class="tInfo dialogInfo">{{'手机：'+ tInfo.mobile}}</div>
            <div class="tInfo dialogInfo">{{'地址：'+ tInfo.state + tInfo.city + tInfo.district + tInfo.address}}</div>
            <div class="tInfo">
              <el-table
                :data="tInfo.orders"
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
                      <img :src="scope.row.picUrl" style="height: 60px; width: 60px;"/>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="price"
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
                    <span>{{scope.row.specsValue + scope.row.specs}}</span>
                  </template>
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

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .dialogInfo {
    width: 48%;
    display: inline-block
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .tInfo {
    margin-top: 15px;
    position: relative;
    font-weight: 600;
  }

  .el-badge__content.is-fixed {
    top: 8px !important;
  }
</style>
<script>
  import editor from './editor'

  export default {
    data() {
      return {
        isCollapse: this.GLOBAL.getisCollapse(),
        numId: 0,
        tableData: [],
        dialogFormVisible: false,
        dialogVisibleDetail: false,
        tinymceHtml: 'abc',
        activeName: '-1',
        searchContent: '',
        classfy: '',
        chooseSet: '',
        dialogImageUrl: '',
        reType: '1',
        dialogVisible: false,
        imageUrl: '',
        isRe: true,
        choose: [{
          value: '选项1',
          label: '下架'
        }, {
          value: '选项2',
          label: '删除'
        }],
        downLoad : false,
        formRe: {},
        options: [{
          value: 'shunfeng',
          label: '顺丰速运'
        }, {
          value: 'yuantong',
          label: '圆通快递'
        }, {
          value: 'shentong',
          label: '申通快递'
        }, {
          value: 'tiantian',
          label: '天天快递'
        }, {
          value: 'suning',
          label: '苏宁快递'
        }],
        options2: [{
          value: '1',
          label: '发货途中追回'
        }, {
          value: '2',
          label: '已收货寄回'
        }, {
          value: '3',
          label: '未发货退款'
        }],
        orderStatus: [
          {
            value: '0',
            label: '待支付'
          }
          , {
            value: '1',
            label: '待发货'
          }, {
            value: '3',
            label: '待收货'
          }
          , {
            value: '6',
            label: '已完成'
          }, {
            value: '7',
            label: '已关闭'
          }, {
            value: '99',
            label: '已取消'
          }, {
            value: '100',
            label: '退款关闭'
          }
        ],
        total: 0,
        sizeForm: {
          name: '',
          region: '',
          // delivery: false,
          desc: '',
          crmPrices: [],
          album: ["string"],
          price: 0,
          stock: 0,
          warnNum: 0,
          cid: 51,
          storageCondition: '',
          quantityUnit: '',
          freight: 0,
          hot: true,
          specsValue: 0,
          order: 0,
          brand: '',
          id: 0,
          tags: "",
          specs: '',
          picUrl: '',
          localtion: '',
        },
        rInfo: {},
        statusAll: '',
        activeNames: ['1', '2'],
        pageNo: 1,
        form: {
          'invoiceNo': '',
          'logisticsCompany': '',
          'logisticsCompanyCn': ''
        },
        tInfo: {},
        init: {
          height: 300,
          plugins: 'link lists image code table colorpicker textcolor wordcount contextmenu',
          toolbar:
            'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
          branding: false
        },
        rubData: [],
        orderSum: []
      }
    },
// 	watch: {
// 		isCollapse : a
// 	},

    mounted() {
      // console.log(this._watchers);
      this.numId = this.searchContent = this.$route.params.ID;
      this.getData(this.activeName, this.pageNo);
      tinymce.init({});
      this.getSum();
    },
    components: {editor},
    methods: {
      searchClear() {
        this.numId = 0;
        this.getData(this.activeName, this.pageNo);
        this.getSum();
      },
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
      getData(activeName, pageNo) {
        var that = this;
        var url = this.GLOBAL.url.trade.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url + '?curPage=' + pageNo;
        if (activeName != '-1') {
          url = url + '&status=' + activeName;
        }
        if (this.numId != 0) {
          url = url + '&tid=' + this.numId;
        }
        if (activeName == '-1' && this.statusAll != '') {
          url = url + '&status=' + this.statusAll;
        }
        console.log(url)
        this.$axios.get(url, {})
          .then(function (response) {
            console.log(response);
            for (let i = 0; i < response.data.results.length; i++) {
              let statusCn = {statusCn: that.GLOBAL.statusChange(response.data.results[i].status)};
              response.data.results[i].createTs = that.GLOBAL.changeTime(response.data.results[i].createTs);
              Object.assign(response.data.results[i], statusCn);
            }
            that.tableData = response.data.results;
            that.total = response.data.count;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      toDetailGoods(numlid) {
        this.$router.push('/goodsmen/' + numlid);
      },
      getExcel(){
        var that = this;
        this.downLoad = true;
        let url = this.GLOBAL.url.getExcel.replace("{sellerId}", this.GLOBAL.sellerId);
        this.$axios.get(url, {},{responseType: 'arraybuffer'})
          .then(function (response) {
            // console.log(response.request.responseURL);
            window.location.href = response.request.responseURL;
            that.downLoad = false;
          })
      },
      getSum() {
        var that = this;
        var url = this.GLOBAL.url.sum.replace("{sellerId}", this.GLOBAL.sellerId);
        var status = ['1', '100', '102', '103'];
        var orderSum = [];
        for (let i = 0; i < status.length; i++) {
          let nUrl = url + '?status=' + status[i];
          that.$axios.get(nUrl, {})
            .then(function (response) {
              orderSum = orderSum.concat([{num: response.data.results, status: status[i]}]);
              that.orderSum = orderSum;
              console.log(orderSum);
            })
        }
      },
      searchById() {
        this.numId = this.searchContent;
        this.getData(this.activeName, this.pageNo);
        this.getSum();
      },
      upData() {
        var that = this;
        var data = this.sizeForm;
        console.log(data);
        this.$axios({
          method: 'post',
          url: 'https://scmall.thinkmacro.cn/admin/3405474861/item',
          data: data

        }).then((res) => {
          console.log(res);
        })

      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleCheck(index, info) {
        this.tInfo = info;
        this.dialogVisibleDetail = true;
      },
      handleClick() {
        this.pageNo = 1;
        this.getData(this.activeName, this.pageNo);
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getData(this.activeName, this.pageNo);
      },
      delivery() {
        var that = this;
        var info = this.tInfo;
        var url = this.GLOBAL.url.putOut.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{tid}", info.tid);
        console.log(this.form);
        console.log(url);
        // this.form.logisticsCompany = options.
        this.$axios.put(url, this.form)
          .then(function (response) {
            console.log(response);
            that.getData(that.activeName, that.pageNo);
            that.getSum();
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      reMoney() {
        this.refundS()
      },
      setValueCom(value) {
        this.form.logisticsCompanyCn = value.label;
        this.form.logisticsCompany = value.value;
      },
      refundS() {
        var that = this;
        var info = this.tInfo;
        var url = this.GLOBAL.url.checkRe.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{tid}", info.tid);
        let agree = {aggree: this.isRe};
        Object.assign(this.formRe, agree);
        this.$axios.put(url, this.formRe)
          .then(function (response) {
            console.log(response);
            if (!response.data.success) {
              that.$notify({
                title: '提示',
                message: response.data.message
              });
            }else{
              that.$notify({
                title: '提示',
                message: '成功'
              });
            }
            that.getData(that.activeName, that.pageNo);
            that.getSum();
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      sureRec(info) {
        var that = this;
        console.log(info);
        this.tInfo =info;
        this.$prompt('请输入退款金額', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          console.log(value)
          if (value == null || value == '') {
            this.$message.error('标签不能为空');
            return false;
          }
          this.$message({
            type: 'success',
            message: '退款金額为: ' + value
          });
          this.formRe.refundAmount = value;
          this.getGoods();
        }).catch(() => {
          that.pageNo = 1;
          that.getData(this.pageNo);
          that.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      refund() {
        var that = this;
        var info = this.tInfo;
        var url = this.GLOBAL.url.refund.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{tid}", info.tid);
        if (!this.formRe.refundAmount) {
          this.formRe.refundAmount = info.totalFee;
        }
        url = url + '/?aggreeRefund=' + this.isRe + '&refundAmount=' + this.formRe.refundAmount;
        this.$axios.put(url)
          .then(function (response) {
            console.log(response);
            if (!response.data.success) {
              that.$notify({
                title: '提示',
                message: response.data.message
              });
            }
            that.getData(that.activeName, that.pageNo);
            that.getSum();
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      getGoods() {
        var that = this;
        var info = this.tInfo;
        var url = this.GLOBAL.url.confirm.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{tid}", info.tid);
        url = url + '?refundAmount=' + this.formRe.refundAmount;
        this.$axios.put(url)
          .then(function (response) {
            console.log(response);
            if (!response.data.success) {
              that.$notify({
                title: '提示',
                message: response.data.message
              });
            }
            that.getData(that.activeName, that.pageNo);
            that.getSum();
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      subForm() {
        if (this.activeName == -1 || this.activeName == 1) {
          this.delivery();
        } else if (this.activeName == 100) {
          this.reMoney();
        } else if (this.activeName == 101) {
          this.getGoods();
        } else if (this.activeName == 103) {
          this.refund();
        }
        this.dialogFormVisible = false;
      },
      handleEdit(index, info) {
        console.log(info);
        this.tInfo = info;
        this.dialogFormVisible = true;
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
      handleChange(val) {
        console.log(val);
      },
      handleClose() {

      },
      openRe(index, info) {
        this.tInfo = info;
        this.dialogFormVisible = true;
        this.getRefundsInfo(info.tid);
      },
      getRefundsInfo(tid) {
        var that = this;
        var url = this.GLOBAL.url.refundInfo.replace("{sellerId}", this.GLOBAL.sellerId);
        url = url.replace("{tid}", tid);
        this.$axios.get(url)
          .then(function (response) {
            console.log(response);
            that.rInfo = response.data.results;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      sureGoods(index, info) {
        this.tInfo = info;
        this.dialogFormVisible = true;
      }
    }
  }
</script>
