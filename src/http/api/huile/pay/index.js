import base from './base'

import axios from '../../../http'

const pay={
    getpay(sellerId,param,header){
        
        return axios({url:base.geturl(sellerId),method:'get' ,params:param,headers:header})
    },
    searchpay(sellerId,param,header){
        console.log(param)
        return axios({url:base.searchurl(sellerId),method:'get' ,params:param,headers:header})
    
    },
    putrefresh(sellerId,id,header){
        return axios({url:base.putrefreshurl(sellerId,id),method:'put' ,headers:header})
    
    },
    
}
export default pay