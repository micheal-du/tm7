import base from './base'

import axios from '../../../http'

const paysuce={
    getpaysuce(sellerId,param,header){
        
        return axios({url:base.geturl(sellerId),method:'get' ,params:param,headers:header})
    },
    
    
}
export default paysuce