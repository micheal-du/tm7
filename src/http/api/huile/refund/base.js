const base={
    geturl (sellerId){ return `/api/admin/${sellerId}/charge-record`},
    searchurl (sellerId){ return `/api/admin/${sellerId}/charge-record`},
}
export default base