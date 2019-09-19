<template>
    <div class="tableInfo">
        <div class="searchLine">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>微信支付记录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div style="margin-top:10px">
            <h4>
                <i class="el-icon-search"></i>
                <span >筛选搜索</span>
            </h4>
            <el-form ref="form" :model="form" label-width="70px" :inline="true" size='mini'>
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
              border
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
                    </template>
                </el-table-column>
                <el-table-column
                    prop="initMoney"
                    label="消费金额"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="transactionId"
                    label="订单详情">
                </el-table-column>
                <el-table-column
                    prop="initTs"
                    label="消费时间">
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
import api from '../http/api/huile/compsutions'
// import urlfun from '../urlo'
import dayjs from 'dayjs'
// import instance from '../http/index'
    export default {
        //mounted钩子函数
        mounted(){
            this.getcom({type:2,curPage:1,pageSize:10})
        },
        //自定义的方法
        methods:{
            //get请求
            getcom(params){
                api.getcom('2589123516',params,{'wxAppId':'wxc82bddb7b0e6d799'}).then(res=>{this.tableData=res.data.records;console.log(res.data.records)})
            },
            //搜索请求
            handelSearch(){
                const createdAtBegin=this.form.date1[0] ? dayjs(this.form.date1[0]).format('YYYY-MM-DD HH:mm:ss') : undefined
                const createdAtEnd=this.form.date1[1] ? dayjs(this.form.date1[1]).format('YYYY-MM-DD HH:mm:ss') : undefined
                const searchparms={type:2,curPage:1,pageSize:10,buyerPhone:this.form.buyerPhone||undefined,createdAtBegin:createdAtBegin,createdAtEnd:createdAtEnd}
                // this.searchpaysuce(searchparms)
                this.searchpaysuce2(searchparms)
            },
            //重置搜索
             resetsearch(){
                this.form='',
                this.getcom({type:2,curPage:1,pageSize:10})
            },
                 
            //分页
            handleSizeChange(val) {
                this.listQuery.pageNum = 1;
                this.listQuery.pageSize = val;
                this.getcom({type:2,curPage:this.listQuery.pageNum,pageSize:this.listQuery.pageSize});
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getcom({type:2,curPage:this.listQuery.pageNum,pageSize:this.listQuery.pageSize});
            },
            handleClose(){

            },
            searchpaysuce2(searchparms){
                this.getcom(searchparms)
           }
            // searchpaysuce(searchform){
            //     const baseurl=`/api/admin/2589123516/charge-record`
            //     const url=baseurl+urlfun.geturl1(searchform);
            //     console.log(url)
            //     instance({url:url,method:'get',headers:{'wxAppId':'wxc82bddb7b0e6d799'}}).then(res=>this.tableData=res.data.records)
            // }
        },
        data(){
            return {
                tableData:'',
                form:{
                    date1:[],
                    buyerPhone:''

               } ,
                listQuery: {
                    keyword: null,
                    pageNum: 1,
                    pageSize: 10
                    },
                total: null,
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
    margin-top: 15px
  }
</style>