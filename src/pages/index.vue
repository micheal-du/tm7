<template>
  <div class="hello">
    <el-container>
      <el-aside width="200px">
          <side-bar></side-bar>
      </el-aside>
      <el-container>
        <el-header>
          <m-header @iscolla='colla'></m-header>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
      
    </el-container>
   
  </div>
  
</template>

<script>
import mHeader from '../layout/header'
import sideBar from '../layout/sideBar'
import hamburger from '.././components/Hamburger'
import {mapState} from 'vuex'
export default {
  name: 'HelloWorld',
  components:{
    mHeader,sideBar,hamburger
  },
  computed:{
      ...mapState(['sidebar'])
  },
  methods:{
    colla(val){
      console.log(val)
    }
  },
  data () {
    return {
        con:'el-icon-delete-solid'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello{
    margin:0;
    padding:0
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
