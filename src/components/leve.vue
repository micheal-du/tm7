<template>
    <div class="tableInfo">
        <div class="searchLine">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>储值梯度</el-breadcrumb-item>
          
            </el-breadcrumb>
        </div>
        <div>
            <el-button @click="postdialog = true" type="info"> + 添加储值梯度</el-button>
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
                    prop="chargeMoney"
                    label="金额"
                    width="180">
                    </el-table-column>
                <!-- <el-table-column
                    label="是否送券"
                    width="180">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.isGiftCoupon"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch> 
                        </template>
                </el-table-column>
                <el-table-column
                    label="券类型">
                     <template slot-scope="scope">
                         <p v-if='scope.row.isGiftCoupon&&scope.row.couponTemplate'>
                            <span>{{scope.row.couponTemplate.name}}</span>
                            <span>{{scope.row.couponTemplate.summary}}</span>
                            <span @click="selectcouponTemplate(scope.$index,scope.row)">重新选择</span>
                         </p>
                         <p v-if="scope.row.isGiftCoupon&&!scope.row.couponTemplate">
                            <span @click='addcouponTemplate(scope.$index,scope.row)'>添加券</span>
                         </p>
                       
                         <el-dialog
                            title="选择优惠券模板"
                            :visible.sync="coupondialog"
                            width="50%"
                            >
                            <el-select v-model="couponTemplatevalue" placeholder="请选择" @change='changecoupon(val)'>
                                <el-option  v-for='(item,index) in couponTemplate' :label="item.name" :value="item.name" :key="index"></el-option>
                            </el-select>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="coupondialog = false">取 消</el-button>
                                <el-button type="primary" @click="submmitcouponTemplate(scope.$index,scope.row)">确 定</el-button>
                            </span>
                        </el-dialog>
                     </template>
                </el-table-column> -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-switch
                        v-model="scope.row.status"
                        active-text="是否启用"
                       >
                        </el-switch>
                    </template>
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
            title="新增储值梯度"
            :visible.sync="postdialog"
            width="30%"
            >
            <el-form :model="postform" :rules="postrules" ref="postform" label-width="100px" class="demo-ruleForm">
                <el-form-item label="储值金额" prop="chargeMoney">
                    <el-input v-model="postform.chargeMoney" placeholder="新增的储值金额"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="postdialog = false">取 消</el-button>
                <el-button type="primary" @click="postleve('postform')">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="修改储值梯度"
            :visible.sync="editdialog"
            width="30%"
            >
            <el-form :model="editform" :rules="editrules" ref="editform" label-width="100px" class="demo-ruleForm">
                <el-form-item label="储值金额" prop="chargeMoney" placeholder="修改的储值金额">
                    <el-input v-model="editform.chargeMoney"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editdialog = false">取 消</el-button>
                <el-button type="primary" @click="putEdit('editform')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import instance from '../http/index.js'
import api from '../http/api/huile/leve'
    export default {
        //钩子函数
        mounted(){
            this.getleve({type:1,curPage:1,pageSize:10})
        },

        //自定义方法
        methods:{
            changecoupon(val){
                console.log(123,val)
            },
            handleSizeChange(val) {
                this.listQuery.pageNum = 1;
                this.listQuery.pageSize = val;
                this.getleve({type:1,curPage:this.listQuery.pageNum,pageSize:this.listQuery.pageSize});
            },
            handleCurrentChange(val) {
                this.listQuery.pageNum = val;
                this.getleve({type:1,curPage:this.listQuery.pageNum,pageSize:this.listQuery.pageSize});
                
            },
            handleDelete(index,row){
                this.deleteleve(row).then(res=>{if(res.data){alert('删除成功');this.getleve({type:1,curPage:1,pageSize:10})}});
                this.getleve({type:1,curPage:1,pageSize:10})
                
            },
            handleEdit(index,row){
                this.editdialog=true;
                this.editform=row;
               
            },
            handelecoupon(){

            },
            selectcouponTemplate(index,row){
                this.coupondialog=true;
                this.couponTemplatevalue=row.couponTemplate.name;
                console.log(index,row);
                
                 
            },
            submmitcouponTemplate(index,row){
               // console.log(index,row);
            //    console.log
            //    row.couponTemplate=

            },
            addcouponTemplate(index,row){
                this.coupondialog=true;
            },
            putEdit(form){
                 this.$refs[form].validate((valid)=>{
                    if(valid){
                        // console.log(this.editform)
                        this.editform.status=0;
                        this.editform.isGiftCoupon=0;
                        const row=this.editform
                        this.putleve(row).then(res=>{if(res.data.status===0){alert('修改成功'); this.getleve({type:1,curPage:1,pageSize:10})}});
                   
                        
                    }else{
                        alert('edit error')
                        return false
                    }
                })
                
                this.editdialog=false
            },
            getleve(params){
                 api.getleve('2589123516',params,{'wxAppId':'wxc82bddb7b0e6d799'}).then(res=>{
                     this.tableData=res.data;
                     //因为后端返回的isGiftCoupon是1，2，0 ，但是开关v-model只能绑定true,false 所以要转换
                     this.tableData.forEach(val=>{if(val.isGiftCoupon&&val.isGiftCoupon>0) val.isGiftCoupon=true; else{val.isGiftCoupon=false} }); console.log(this.tableData)})
            },
            postleve(postform){
                this.$refs[postform].validate((valid)=>{
                    if(valid){
                        api.postleve('2589123516',{'wxAppId':'wxc82bddb7b0e6d799'},this.postform).then(res=>{if(res.data.status===0){alert('添加成功')}});
                    //   location.reload()
                    this.getleve()
                    }else{
                        alert('submit error')
                        return false
                    }
                })
                this.postdialog=false
               
            },
            deleteleve(row){
               return  api.deleteleve('2589123516',row.id,{'wxAppId':'wxc82bddb7b0e6d799'})
            },
            putleve(row){
                console.log(row)
                return  api.putleve('2589123516',row.id,{'wxAppId':'wxc82bddb7b0e6d799'},row)
            }
        },
        computed:{
            tableData1(){
                return this.tableData.forEach(val=>{if(val.isGiftCoupon&&val.isGiftCoupon>0) val.isGiftCoupon=ture; else{val.isGiftCoupon=false} })
            }
        },
        data(){
            return {
                couponTemplatevalue:'',
                selectcouponTemplatevalue:'',
                submitcouponTemplatevalue:'',
                couponTemplate:[{name: "满50打9折",summary: "满50打9折",type: 2},{name: "满100减10元",summary: "仅限于开业期间",type: 1}],
                postdialog:false,
                editdialog:false,
                coupondialog:false,
                postform:{
                    chargeMoney:''
                },
                listQuery: {
                    keyword: null,
                    pageNum: 1,
                    pageSize: 10
                    },
                total: null,
                tableData:[],
                couponform:{
                    coupon:''
                },
                postrules:{
                    chargeMoney:[
                        {required:true,message:'请输入储值金额',trigger:'blur'}
                    ]
                },
                editform:{
                    chargeMoney:''
                },
                editrules:{
                    chargeMoney:[
                       {required:true,message:'请输入储值金额',trigger:'blur'} 
                    ]
                },
                tabledatatest:[
                    {
                        price:1,
                        gift:true,
                        type:{
                            subtype:'代金券',
                            detail:'满100减10元（仅限于开业期间）'
                        },
                        actived:true
                    },
                                        {
                        price:2,
                        gift:false,
                        type:{
                            subtype:'折扣券',
                            detail:'全场九折（仅限于周末）'
                        },
                        actived:true
                    }
                ]
            }
        },

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
    .searchLine{
    position: relative;
    height: 35px;
    border-bottom: 1px solid #e4e7ed;
  }
</style>