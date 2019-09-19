
const isCollapse = false;
const baseUrl = 'https://scmall.thinkmacro.cn';
const url = {};
const sellerId = 3405474861;

var urls = {
  goodsList : "/admin/{sellerId}/item",
  delGoods : "/admin/{sellerId}/item/{numIid}",
  listing : "/admin/{sellerId}/item/{numIid}/listing",
  delisting :"/admin/{sellerId}/item/{numIid}/delisting",
  delivery : "/admin/{sellerId}/trade/{tid}/delivery",
  trade : "/admin/{sellerId}/trade/",
  cat : "/admin/{sellerId}/item-cat",
  editCat : "/admin/{sellerId}/item-cat/{cid}",
  tag :"/admin/{sellerId}/item-tag",
  sum : "/admin/{sellerId}/trade/sum",
  messageNotice : "/admin/{sellerId}/message",
  modifyShow : '/admin/{sellerId}/rate/modify-show',
  isHot: '/admin/{sellerId}/item-cat/{cid}/hot',
  delAll : '/admin/{sellerId}/item/delete-batch',
  setAll : '/admin/{sellerId}/item/delisting-batch',
  refund : '/admin/{sellerId}/trade/{tid}/refund',
  checkRe : '/admin/{sellerId}/trade/{tid}/return-check',
  confirm : '/admin/{sellerId}/trade/{tid}/return-good-confirm',
  unread : '/admin/{sellerId}/message/unread-count',
  readMessage : '/admin/{sellerId}/message/{msgId}',
  rate : '/admin/{sellerId}/rate',
  doTag : '/admin/{sellerId}/item-tag/{tagId}',
  banner : '/admin/{sellerId}/banner',
  settingMall : '/admin/{sellerId}/mall-set',
  delBanner : '/admin/{sellerId}/banner/{bannerId}',
  goodsDetail : '/admin/{sellerId}/item/{numIid}/detail',
  sku : '/admin/{sellerId}/v2/sku/name',
  skuValue : '/admin/{sellerId}/v2/sku/value',
  delivery : '/admin/{sellerId}/v2/delivery',
  v2Updata : '/admin/{sellerId}/v2/item',
  discount : '/admin/{sellerId}/v2/crm-discount',
  crmdiscount : '/admin/{sellerId}/v2/crm-discount/items',
  holiCard : '/admin/{sellerId}/v2/greeting-card',
  message : '/admin/{sellerId}/v2/bless',
  delMessage : '/admin/{sellerId}/v2/bless/{id}',
  nuSku : '/admin/{sellerId}/v2/item/{numIid}/sku',
  upUrl:'/admin/{sellerId}/bind/upload-p12',
  bindInfo :'/admin/{sellerId}/bind/pay',
  putOut:'/admin/{sellerId}/trade/{tid}/delivery',
  delCard:'/admin/{sellerId}/v2/greeting-card/{id}',
  giftList :'/admin/{sellerId}/v2/gift-giving',
  goodsHot : '/admin/{sellerId}/item/{numIid}/hot',
  giftInfo : '/admin/{sellerId}/v2/gift-giving/{id}',
  refundInfo : '/admin/{sellerId}/trade/{tid}/refund-info',
  getExcel:'/admin/{sellerId}/trade/export',
  nodistri :'/admin/{sellerId}/v3/distribution/nodistri',
  withdraw : '/admin/{sellerId}/v3/distribution/withdraw',
  distribution :'/admin/{sellerId}/v3/distribution',
  hasdistri:'/admin/{sellerId}/v3/distribution/hasdistri',
  withdrawCheck:'/admin/{sellerId}/v3/distribution/withdraw/check'
};
for (var u in urls) {
  url[u] = baseUrl + urls[u];
}
function changUrl(baseUrl) {
  for (var u in urls) {
    url[u] = baseUrl + urls[u];
  }
  return url;
}
function getisCollapse(){
  return isCollapse;
}
function changeTime(timeStamp){
  var date = new Date(timeStamp);
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + '  ';
  let h =  (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
  let s =  (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds()) ;
  return Y + M + D + h + m + s;
}
function statusChange(status) {
  var nowStatus;
  if (status == '0'){
    nowStatus = '待支付';
  } else if(status == '1'){
    nowStatus = '待发货';
  } else if(status == '3'){
    nowStatus = '待收货';
  } else if(status == '6'){
    nowStatus = '已完成';
  } else if(status == '7'){
    nowStatus = '已关闭';
  } else if(status == '99'){
    nowStatus = '已取消';
  } else if(status == '100'){
    nowStatus = '退款关闭';
  }
  return nowStatus;
}
function levelChange(status) {
  var nowStatus;
  if (status == '1'){
    nowStatus = '好评';
  } else if(status == '2'){
    nowStatus = '中评';
  } else if(status == '3'){
    nowStatus = '差评';
  }
  return nowStatus;
}
function typeChange(status) {
  var nowStatus;
  if (status == '1'){
    nowStatus = '商品';
  } else if(status == '2'){
    nowStatus = '分类';
  } else if(status == '3'){
    nowStatus = '自定义';
  }
  return nowStatus;
}
export default
{
  isCollapse,
  getisCollapse,
  changeTime,
  url,
  sellerId,
  statusChange,
  levelChange,
  typeChange,
  changUrl
}
