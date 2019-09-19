<template>
  <div id="app">
    <header v-if="currentRoute != 'login'">
      <transition name="el-zoom-in-top">
        <div class="superBack" v-if="!isCollapse">
          超级消费端商城商家端(DEV)
        </div>
      </transition>
      <i class="el-icon-menu" @click="show" :style="isCollapse ? 'left: 1.4vw;': ''"></i>
   
      <el-tooltip class="item" effect="dark" content="了解该商品详情" placement="bottom">
        <div slot="content" @click="outLogin">注销登录</div>
        <img src="static/img/GGAD.png" class="headerAvater"/>
        
      </el-tooltip>
    </header>
    <div class="allSlide" v-if="currentRoute != 'login'">
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
    </div>
    <router-view :key="key"/>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        isCollapse: this.GLOBAL.isCollapse,
        currentRoute : '',
        unCount : 0
      };
    },
    computed: {
      key() {
        this.currentRoute  = this.$route.name;
        this.getNoticeSum();
      }
    },
    mounted(){
    },
    methods: {
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
.aa{
  color:red
}
  .allSlide .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 100vh;
    background: #409EFF !important;
    color: #FFFFff;
    position: relative;
    left: 0;
    z-index: +99;
  }
  header{
    height: 60px;
    width: 100vw;
    position: relative;
    border-bottom: 1px solid #CACACA;
    line-height: 60px;
  }
  header i{
    position: absolute;
    left: 15.4vw;
    top: 23px;
    color: #606266;
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
