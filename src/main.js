// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import global from './Global'
import axios from 'axios'
import cities from './city'

Vue.prototype.GLOBAL = global;
Vue.prototype.CITY = cities;
Vue.use(ElementUI);

let axiosIns = axios.create({});
let ajaxMethod = ['get', 'post' , 'put' , 'delete'];
let api = {};
var that = this;
var fundebug = require("fundebug-javascript");
fundebug.apikey = "81d68642a4b0490dedf2992060df50e432fb2ec74fe2694b87abd279ca3acce9";
// axiosIns.defaults.responseType = 'json';
// axiosIns.defaults.headers['Content-Type'] = 'application/json';
// axiosIns.defaults.headers.delete['Access-Control-Allow-Methods'] = 'GET，POST，OPTIONS，PUT，DELETE';
ajaxMethod.forEach((method)=> {
  //数组取值的两种方式
  api[method] = function (url, data) {
    return new Promise(function (resolve, reject) {
      axiosIns[method](url, data).then((response)=> {
        /*根据后台数据进行处理
         *1 code===200   正常数据+错误数据     code!==200   网络异常等
         *2 code===200   正常数据     code!==200   错误数据+网络异常等
         * 这里使用的是第一种方式
         * ......     */
        // if (response.data.success){
        //   that.$message({
        //     message: response.data.message,
        //     type: 'success'
        //   });
        // } else{
        //   that.$message.error(response.data.message);
        // }
        resolve(response);
      }).catch((response)=> {
        //reject response
        //alert('xiuxiu，限你10分钟到我面前来,不然...');
      })
    })
  }
});

Vue.prototype.$axios = api;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
