<template>
  <div id="app">
      <el-container>
        <el-aside width="15%">
           <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" @select="handleSelect"  text-color= "#fff" background-color="rgba(0,0,0,.65)">
            <el-menu-item index="/">
              <el-badge :value="unCount" class="item" :max="99">
                <i class="el-icon-message"></i>
              </el-badge>
              <span slot="title">通知</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-goods"></i>
                <span slot="title">商品</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/goodsmen/0">商品管理</el-menu-item>
                <el-menu-item index="/classfy">分类管理</el-menu-item>
                <el-menu-item index="/tag">标签管理</el-menu-item>
                <el-menu-item index="/ansmenger">评价管理</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/order/">
              <i class="el-icon-tickets"></i>
              <span slot="title">订单</span>
            </el-menu-item>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-setting"></i>
                <span slot="title">营销</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/discount">会员折扣</el-menu-item>
                <el-menu-item index="/gift">好物送TA</el-menu-item>
                <el-menu-item index="/salegoods">会员分销</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-s-shop"></i>
                <span slot="title">商城设置</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/setting">基础设置</el-menu-item>
                <el-menu-item index="/payset">支付设置</el-menu-item>
                <el-menu-item index="/postmould">运费模板</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title">
                <i class="el-icon-money"></i>
                <span slot="title">惠乐储</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/leve">储值梯度</el-menu-item>
                <el-menu-item index="/pay">微信支付记录</el-menu-item>
                <el-menu-item index="/paysuce">充值成功记录</el-menu-item>
                <el-menu-item index="/compsutions">消费记录</el-menu-item>
                <el-menu-item index="/refund">退款记录</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="/timeline">
              <i class="el-icon-tickets"></i>
              <span slot="title">时间轴</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-header class="header">
            <!-- <transition name="el-zoom-in-top">
              <div class="superBack" v-if="!isCollapse">
                超级消费端商城商家端(DEV)
              </div>
            </transition> -->
            <div class="header-left">
              <i class="el-icon-s-unfold" @click="iscolla"></i>
            </div>
            <div class="header-right">
              <i class="el-icon-warning-outline" @click='abc'  ></i>
              <el-dropdown>
                <el-button type="primary">
                    你好<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            </div>
          </el-header>
          <el-main>
              <router-view></router-view>
          </el-main>
      </el-container>
      
    </el-container>
    
     
  </div>
</template>

<script>
import {mapMutations,mapState} from 'vuex'
  export default {
    data() {
      return {
        // isCollapse: this.GLOBAL.isCollapse,
        currentRoute : '',
        unCount : 0
      };
    },
    computed: {
      key() {
        this.currentRoute  = this.$route.name;
        this.getNoticeSum();
      },
      // ...mapState(['isCollapse'])
      ...mapState({isCollapse:state=>state.isCollapse})
    },
    mounted(){
    },
    methods: {
      toggleCollapse(){
        console.log(123)
        this.$store.commit('toggleCollapse')
      },
      handleOpen(key, keyPath) {
      },
      getNoticeSum(){
        var that = this;
        var url = this.GLOBAL.url.unread.replace("{sellerId}",this.GLOBAL.sellerId);
        this.$axios.get(url,{})
          .then(function (response) {
            console.log(response);
            that.unCount = response.data.results;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      handleSelect(key, keyPath) {
        this.$router.push(key);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      show(){
        this.GLOBAL.isCollapse = this.isCollapse = !this.isCollapse;
      },
      outLogin(){
        localStorage.removeItem('admin');
        this.$router.push('/login')
      }
    }
  }
</script>

<style>
.header-left{
float:left
}
.header-right{
  float:right
}

  header{
    height: 60px;
    width: 100vw;
    position: relative;
    border-bottom: 1px solid #CACACA;
    line-height: 60px;
    /* background: blue; */
  }
  header:after{
    content :'';
    display: block;
    clear: both;
  }


  .allSlide .el-menu--collapse{
    position: relative;
    min-height: 100vh;
    background:linear-gradient(#409EFF,#0095ffb8);
  }
  .allSlide {
    display: inline-block;
    position: relative;
    width: 13vw;
  }
  .headerAvater{
    width: 40px;
    height: 40px;
    position: absolute;
    right: 2vw;
    bottom: 10px;
    border: 1px solid #f2f2f2;
  }
  .superBack{
    font-size: 1vw;
    color: #FFFFff;
    font-weight: 600;
    background: #409EFF;
    width: 13vw;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-bottom: 1px solid #000;
  }
  .el-submenu{
    background-color: #409EFF !important;
  }
  .el-submenu .el-menu-item{
    min-width: auto !important;
  }
  .allSlide .el-badge__content.is-fixed {
    top: 18px !important;
    height: 12px;
    line-height: 12px;
    right: 18px !important;
  }
</style>
