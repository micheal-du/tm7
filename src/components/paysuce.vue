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
                <span>筛选搜索</span>
            </h4>
                <el-form ref="form" :model="form" label-width="80px" :inline="true" size='mini'>
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
                        </template>
                </el-table-column>
                <el-table-column
                    prop="initMoney"
                    label="储值金额"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="initMoney"
                    label="优惠券信息"
                    width="180">
                    <span>暂无</span>
                </el-table-column>
                <el-table-column
                    prop="dealNo"
                    label="支付订单单号">
                </el-table-column>
                <el-table-column label="储值时间" prop="initTs">
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
        <el-dialog
        title="金额流水"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <span>嫦娥</span>
        <span slot="footer" class="dialog-footer">
            <el-form>
                
            </el-form>
        </span>
        </el-dialog>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import api from '../http/api/huile/paysuce'
    export default {
        mounted(){
            this.getpaysuce({type:2,curPage:1,pageSize:10})
        },
        methods:{
            getMore(){
                this.dialogVisible=true;

            },
            getpaysuce(params){
                api.getpaysuce('2589123516',params,{'wxAppId':'wxc82bddb7b0e6d799'}).then(res=>this.tableData=res.data.records)
            },
            handelger(){
                console.log(123)
            },
            handleSizeChange(val) {
                this.listQuery.pageNum = 1;
                this.listQuery.pageSize = val;
                this.getpaysuce({type:2,curPage:this.listQuery.pageNum,pageSize:this.listQuery.pageSize})
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getpaysuce();
                this.getpaysuce({type:1,curPage:this.listQuery.pageNum,pageSize:this.listQuery.pageSize})
            },
            handleClose(){

            },
            handelSearch(){
                const createdAtBegin=this.form.date1[0] ? dayjs(this.form.date1[0]).format('YYYY-MM-DD HH:mm:ss') : undefined
                const createdAtEnd=this.form.date1[1] ? dayjs(this.form.date1[1]).format('YYYY-MM-DD HH:mm:ss') : undefined
                const searchparms={type:2,curPage:1,pageSize:10,buyerPhone:this.form.buyerPhone||undefined,createdAtBegin:createdAtBegin,createdAtEnd:createdAtEnd}
                 this.searchpaysuce2(searchparms)
            },
            searchpaysuce2(searchform){
                this.getpaysuce(searchform)
            },
            resetsearch(searchform){
                this.form='',
                this.getpaysuce({type:2,curPage:1,pageSize:10})
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
                    date1:''
                },
                tableData:''
                
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
    margin-top:15px;
   
  }
</style>