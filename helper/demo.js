var WXBizDataCrypt = require('./WXBizDataCrypt')

var appId = "wxa57690ac52c01299"
var sessionKey = "UnsyjWzCbKeP6pktlhiXMA=="
var encryptedData = "0sqOXCdFzU9Su+gY0/urPMrnOz1diiCPa3GWMVpKbJsEP1DbMOrAM45apaL3Op4YUih05rG1hqDx4S0rUMiu+bjfu8t5xqrGk7VIhQj1ki4tgc9DteInhALDVjKCD/OG5POWYvwxPeF3LwKUXG+yH6i5FR7jlFREgxYk6mZ8H1HGK+TsY5GcBDOGsX5wqZa/rI+vhGtf3Lqg9ezk9jLCEtez6g72/DDCQQ+GWseFKdJ8PPgvbe45o8XAPG7gYC1hVZZ/7gmV1HzehZGUdGeFlpffTdJ9UAIa0cE0+v9Y0IlZ4QdJR5m6XO91IsDQOWSVA/5IfiEx/Phml3nbmLgM6sw1vO2yce/1FPQJJHJXyC7yxn77XaP7WlBvfHJntiMkJ6FWBlVgtRGei75KaeSSrFhtMYsZgALpdxdARPpY432ZlG9gPLw2FUGHoNEvwSbnYc1zc84hvxY/usB/GExzwiiFDexaR34SjrQPBLOp+OVNbKpHYPeBoZx8I+YFzlP3zqsrk9ec4Dz0rf1L4tJ/Fg=="
var iv = "RvXDYHBSt3HvWNn7FQMVuw=="

var pc = new WXBizDataCrypt(appId, sessionKey)

var data = pc.decryptData(encryptedData , iv)

console.log('解密后 data: ', data)
// 解密后的数据为
//
// data = {
//   "nickName": "Band",
//   "gender": 1,
//   "language": "zh_CN",
//   "city": "Guangzhou",
//   "province": "Guangdong",
//   "country": "CN",
//   "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
//   "unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
//   "watermark": {
//     "timestamp": 1477314187,
//     "appid": "wx4f4bc4dec97d474b"
//   }
// }
