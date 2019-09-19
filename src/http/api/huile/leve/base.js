const base={
    geturl (sellerId){ return `/api/admin/${sellerId}/charge-gradients`},
    posturl (sellerId){ return `/api/admin/${sellerId}/charge-gradient`},
    deleteurl (sellerId,id){ return `/api/admin/${sellerId}/charge-gradient/${id}`},
    puturl (sellerId,id){ return `/api/admin/${sellerId}/charge-gradient/${id}`},
}
export default base