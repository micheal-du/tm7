var http = require('http');
var url = require('url');
var util = require('util');
var OSS = require('ali-oss')

var client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: 'LTAId8r4AqcGovdJ',
  accessKeySecret: 'VPIpb6H3SfyG36TV71g0dhpEnZkZn7',
  bucket: 'scmall-dev',
  host:'http://oss-cn-hangzhou.aliyuncs.com'
})

async function put () {
  try {
    let result = await client.put('20181011145149.663d953.png', 'local-file');
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

put();
