import base from './base'

import axios from '../../../http'

const pay={
    getrefund(sellerId,param,header){
        
        return axios({url:base.geturl(sellerId),method:'get' ,params:param,headers:header})
    },
    searchrefund(sellerId,param,header){
        return axios({url:base.searchurl(sellerId),method:'get' ,params:param,headers:header})
    
    },
    
}
export default pay