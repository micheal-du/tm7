<template>
  <div class="timeLime">
    <div class="timeGroup" v-for="(item,index) in 4" :key="index">
      <div class="timeLine"></div>
      <div class="timeCircle">
        <h1>10/10</h1>
        <small>2018</small>
      </div>
      <div class="timeCard" :style="(index+1)%2 == 0 ? 'right:17%' : 'left:17%'">
        <!--<div class="timeDate" :style="(index+1)%2 == 0 ? 'left: 258px;' : 'left:0%'">
          2018/10/10
        </div>-->
        <div class="timeSmall" :style="(index+1)%2 == 0 ? 'background: #409eff;left: -1px;transform: rotate(135deg);border: 1px solid #a5d5ff' : 'background: #409eff;\n'+
'    transform: rotate(45deg);left:340px;border: 1px solid #409eff;'"></div>
        <el-row>
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <!--<img src="http://img5.imgtn.bdimg.com/it/u=1800375035,1790901282&fm=26&gp=0.jpg" class="image">-->
            <div class="topCard">
              状态{{index + 1}}
            </div>
            <div style="padding: 14px;">
              <span>完成后台管理系统功能搭建,完成后台管理系统功能搭建,完成后台管理系统功能搭建</span>
            </div>
          </el-card>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "timeline",
    data() {
      return {
        currentDate: new Date()
      };
    }
  }
</script>

<style scoped>
  .timeLime{
    position: relative;
    display: inline-block;
    height: 100vh;
    width: 80vw;
    vertical-align: top;
    text-align: center;
    margin: 0px auto;
    top: 20px;
  }
  .timeGroup{
    position: relative;
    display: block;
    height: 225px;
  }
  .timeLine{
    background: -webkit-gradient(linear,left top, left bottom,from(#3A3A3A),to(#8c939d));
    background: linear-gradient(to bottom,#3A3A3A,#8c939d);
    width: 3px;
    height: 200px;
    margin: 0 auto;
    top: 27px;
    position: absolute;
    left: 49.3%;
  }
  .timeCircle{
    border: #b3d8ff 4px solid;
    width: 60px;
    height: 60px;
    position: absolute;
    top: 0;
    margin: 0 auto;
    display: block;
    border-radius: 50%;
    text-align: center;
    left: 47.2%;
    background: #409eff;
    z-index: +99;
  }
  .timeCard{
    position: absolute;
    max-width: 380px;
    max-height: 180px;
    min-height: 100px;
    text-align: left;
    transition: all 0.5s;
  }
  .timeCard:hover{
    transform: scale(1.2);
  }
  .topCard{
    position: relative;
    display: block;
    padding: 3%;
    text-align: left;
    font-size: 18px;
    background: #409eff;
    font-weight: 600;
    color: #fff;
  }
  .timeCard .el-row{
    border-bottom: 3px solid #337493;
    border-radius: 8px;
    max-width: 360px !important;
  }
  .timeDate {
    padding: 15px 0;
    font-weight: 400;
    position: relative;
  }
  .timeSmall{
    height: 26px;
    width: 17px;
    background: #409eff;
    transform: rotate(45deg);
    position: absolute;
    top: 9px;
    border: 1px solid #409eff;
  }
  .timeCircle h1{
    font-size: 18px;
    color: #fff;
    margin-block-start: 0em;
    margin-block-end: 0em;
    line-height: 45px;
  }
  .timeCircle small{
    color: #FFFFFF;
    position: relative;
    bottom: 12px;
  }
</style>
