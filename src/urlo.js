

const addurl={
    geturl1(params){
        var url1='';
        if(params.buyerPhone){
            if(params.createdAtBegin){
                url1=`?type=${params.type}&curPage=${params.curPage}&pageSize=${params.pageSize}&createdAtBegin=${params.createdAtBegin}&createdAtEnd=${params.createdAtEnd}&buyerPhone=${params.buyerPhone}`
            }else{
                url1=`?type=${params.type}&curPage=${params.curPage}&pageSize=${params.pageSize}&buyerPhone=${params.buyerPhone}`
            }
        }else{
            if(params.createdAtBegin){
                url1=`?type=${params.type}&curPage=${params.curPage}&pageSize=${params.pageSize}&createdAtBegin=${params.createdAtBegin}&createdAtEnd=${params.createdAtEnd}`
            }else{
                url1=`?type=${params.type}&curPage=${params.curPage}&pageSize=${params.pageSize}`
            }
        }
        return url1;
    },
    geturl2(params){
        var url2='';
        if(params.buyerPhone){
            if(params.createdAtBegin){
                url2=`?curPage=${params.curPage}&pageSize=${params.pageSize}&createdAtBegin=${params.createdAtBegin}&createdAtEnd=${params.createdAtEnd}&buyerPhone=${params.buyerPhone}`
            }else{
                url2=`?curPage=${params.curPage}&pageSize=${params.pageSize}&buyerPhone=${params.buyerPhone}`
            }
        }else{
            if(params.createdAtBegin){
                url2=`?curPage=${params.curPage}&pageSize=${params.pageSize}&createdAtBegin=${params.createdAtBegin}&createdAtEnd=${params.createdAtEnd}`
            }else{
                url2=`?curPage=${params.curPage}&pageSize=${params.pageSize}`
            }
        }
        return url2;
    }

}
export default addurl

