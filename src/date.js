Date.prototype.Format = function (result) {
    var o = {
    "M+": this.getMonth() + 1, //month
    "D+": this.getDate(), //day
    "h+": this.getHours(), //hours
    "m+": this.getMinutes(), //minutes
    "s+": this.getSeconds(), //seconds
    "q+": Math.floor((this.getMonth() + 3) / 3), // season
    "S": this.getMilliseconds() //milliseconds
    };
    if (/(Y+)/.test(result)) {
    result = result.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o){
    if (new RegExp("(" + k + ")").test(result)) {
    result = result.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    }
    return result;
    };