import base from './base'

import axios from '../../../http'

const leve={
    getleve(sellerId,param,header){
        
        return axios({url:base.geturl(sellerId),method:'get' ,params:param,headers:header})
    },
    postleve(sellerId,header,data){
        
        return axios({url:base.posturl(sellerId),method:'post',headers:header,data:data})
    },
    deleteleve(sellerId,id,header){
        
        return axios({url:base.deleteurl(sellerId,id),method:'delete',headers:header})
    },
    putleve(sellerId,id,header,data){
        
        return axios({url:base.puturl(sellerId,id),method:'put',headers:header,data})
    },
    
}
export default leve