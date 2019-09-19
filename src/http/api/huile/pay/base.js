const base={
    geturl (sellerId){ return `/api/admin/${sellerId}/charge-wx-pay-record`},
    searchurl (sellerId){ return `/api/admin/${sellerId}/charge-wx-pay-record`},
    putrefreshurl(sellerId,id){ return `/api/admin/${sellerId}/charge-wx-pay-record/${id}/wx-pay-check`}
}
export default base