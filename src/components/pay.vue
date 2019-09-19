<template>
    <div class="tableInfo">
        <div class="searchLine">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>微信支付记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="record">
            <el-row>
                <el-col :span="6">
                    <div class="grid-content">
                            <h4>所有记录总金额</h4>
                            <h3>$.2</h3>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                            <h4>所有记录总金额</h4>
                            <h3>$.2</h3>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                            <h4>所有记录总金额</h4>
                            <h3>$.2</h3>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                            <h4>所有记录总金额</h4>
                            <h3>$.2</h3>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div style="margin-top:10px">
            <h4>
                <i class="el-icon-search"></i>
                <span>筛选搜索</span>
            </h4>
            <el-form ref="form" :model="form" label-width="70px" :inline="true" size="mini">
                <el-form-item label="会员手机">
                    <el-input v-model="form.buyerPhone"></el-input>
                </el-form-item>
                <el-form-item label="活动时间">
                    <div class="block">
                        <span class="demonstration">默认</span>
                        <el-date-picker
                        v-model="form.date1"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handelSearch">搜索</el-button>
                    <el-button @click='resetsearch'>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table
              :data="tableData"
              stripe
              
              height='500'
              style="width: 100%">
                <el-table-column
                    type="index"
                    label="序号"
                    width="50">
                </el-table-column>
                <el-table-column
                    label="会员信息"
                    width="180">
                        <template slot-scope="scope">
                            <span>{{scope.row.chargeAccount.name}}</span>
                            <span>{{scope.row.chargeAccount.buyerPhone}}</span>
                            <i class="el-icon-refresh" @click="handelRefresh(scope.$index,scope.row)" v-if='scope.row.status===0'></i>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="充值金额"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="充值状态"
                    width="180">
                        <template slot-scope="scope">
                            <span type="success" v-if='scope.row.status===2'>充值成功</span>
                            <span type="info" v-if='scope.row.status===1'>用户未付款</span>
                            <span type="info" v-if='scope.row.status===0'>微信支付回调失败</span>
                        </template>
                </el-table-column>
                <el-table-column
                    prop="outTradeNo"
                    label="内部订单单号">
                </el-table-column>
                  <el-table-column
                    prop="transactionId"
                    label="微信订单单号">
                </el-table-column>
                <el-table-column
                    label="优惠券信息">
                        <template slot-scope="scope">
                            <p v-if='scope.row.coupon'>
                                <span >{{scope.row.coupon.name}}</span>
                                <span>有效期：{{scope.row.coupon.validEndTime}}</span>
                            </p>
                            <p v-else>
                                <span type='warning'>没有优惠券</span>
                            </p>
                            
                        </template>
                </el-table-column>
                <el-table-column label="储值时间" prop="createdAt">
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes,prev, pager, next,jumper"
                :page-size="listQuery.pageSize"
                :page-sizes="[5,10,15]"
                :current-page.sync="listQuery.pageNum"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import api from '../http/api/huile/pay'
    export default {
        mounted(){
            this.getpay({curPage:1,pageSize:10})
        },
        methods:{
            //发起搜索请求
            handelSearch(){
                const createdAtBegin=this.form.date1[0]?dayjs(this.form.date1[0]).format('YYYY-MM-DD HH:mm:ss'):undefined
                const createdAtEnd=this.form.date1[1]?dayjs(this.form.date1[1]).format('YYYY-MM-DD HH:mm:ss'):undefined
                console.log(createdAtBegin)
                const searchparms={curPage:1,pageSize:10,buyerPhone:this.form.buyerPhone||undefined,createdAtBegin:createdAtBegin,createdAtEnd:createdAtEnd}
                this.searchpay(searchparms)
            },
            handelRefresh(index,row){
                this.openFullScreen()
                const id=row.id
                console.log(this.tableData[index])
                this.putrefresh(id).then(res=>{console.log(res.data);this.tableData[index]=res.data})
            },
            resetsearch(){
                this.form={}
                this.getpay({curPage:1,pageSize:10})
            },
            handleSizeChange(val) {
                this.listQuery.pageNum = 1;
                this.listQuery.pageSize = val;
                this.getpay({type:1,curPage:this.listQuery.pageNum,pageSize:this.listQuery.pageSize});
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getpay({type:1,curPage:this.listQuery.pageNum,pageSize:this.listQuery.pageSize});
            },
            handleClose(){

            },
            getMore(){
                this.dialogVisible=true;

            },
            getpay(params){
                 api.getpay('2589123516',params,{'wxAppId':'wxc82bddb7b0e6d799'}).then(res=>this.tableData=res.data.data.records)
            },
            //搜索请求
            searchpay(searchparams){
               api.getpay('2589123516',searchparams,{'wxAppId':'wxc82bddb7b0e6d799'}).then(res=>{this.tableData=res.data.data.records;console.log(res.data.data.records)})
            },
            putrefresh(id){
                return  api.putrefresh('2589123516',id,{'wxAppId':'wxc82bddb7b0e6d799'})
            },
            openFullScreen() {
                const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                loading.close();
                }, 2000);
            }

        },
        data(){
            return {
                dialogVisible:false,
                listQuery: {
                    keyword: null,
                    pageNum: 1,
                    pageSize: 10
                    },
                total: null,
                form:{
                    buyerPhone:'',
                    date1:[]
                },
                tableData:[],
                tableData1:[
                    {   
                    member:'嫦娥',
                    recharge:100,
                    order:{
                        type:'支付宝',
                        detail:23123124124
                    },
                    date:dayjs().format('YYYY/MM/DD HH:mm:ss '),
                    total:10000
                    },
                    {   
                    member:'猪八戒',
                    recharge:200,
                    order:{
                        type:'微信',
                        detail:33333333
                    },
                    date:dayjs().format('YYYY/MM/DD HH:mm:ss '),
                    total:10000
                    }
                ]
            }
        }
    }
</script>

<style scoped>
  .tableInfo {
    position: relative;
    vertical-align: top;
    display: inline-block;
    left: 1.5vw;
    width: 84%;
     margin-top:15px
  }
  .record{
      margin-top: 10px
  }
  .grid-content{
      background:grey;
      margin-right :20px;
    padding: 2px 20px;
    
  }
</style>