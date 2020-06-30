const co = require('co')
const urllib = require('urllib')
// const request = require('request-promise')
const sign = require('@ali/mocks-client-signature')
const params = '?' + sign.makeSignature('qingkui', '1b70b1c81b2222').paramString

const URL = 'http://mocks.alibaba-inc.com'
const REPO_URL = `${URL}/mock/`
const PROJECT_URL = `${URL}/project/`

co(function* () {
  // yield saveComment()
  // yield forkProduct()
  // yield addQingkui()
  // yield createProduct()
  // yield addApi()
  // yield modifyMethod()
  // yield deleteApi()
  // yield saveComment()
  // yield importApiList()
});

// addQingkui();


function* importApiList() {
  var url = 'https://mocks.alibaba-inc.com/openapi/importApiList.json'
  var result = yield urllib.requestThunk(url + params, {
    method: 'POST',
    data: {
      product: 'human_4',
      apiList: JSON.stringify([
        {
          api: "DescribeResourceUsage.json",
          method: "GET",
          comment: "查看实例资源使用情况",
          delay: "1",
          mockjs: "false",
          currentTag: "default",
          tagList: [
            "default"
          ],

          lastModified: 1521710195871,
          lastModifiedNickName: "虎曼",
          lastModifiedWorkId: "73116",
          lastModifiedEmail: "human.hjh@alibaba.net",
          lastModifiedloginId: "human.hjh",
          lastModifiedTagName: "default",

          params: [
            {
              name: "DBInstanceId",
              type: "String",
              desc: "实例ID"
            }
          ],
          responseParams: [
            {
              name: "a",
              type: "String",
              require: "false",
              desc: ""
            }
          ],
          headers: [
            {
              key: "c",
              value: ""
            }
          ],
          responseData: {
            default: '{ "success": true, "modifiedID": "@param.id" }',
          }
        },
        {
          api: "DescribeResourceUsage2.json",
          method: "ALL",
          comment: "查看实例资源使用情况",
          delay: "1",
          mockjs: "false",
          currentTag: "default",
          tagList: [
            "default"
          ],

          lastModified: 1521710195871,
          lastModifiedNickName: "虎曼",
          lastModifiedWorkId: "73116",
          lastModifiedEmail: "human.hjh@alibaba.net",
          lastModifiedloginId: "human.hjh",
          lastModifiedTagName: "default",

          params: [
            {
              name: "DBInstanceId",
              type: "String",
              desc: "实例ID"
            }
          ],
          responseParams: [
            {
              name: "a",
              type: "String",
              require: "false",
              desc: ""
            }
          ],
          headers: [
            {
              key: "c",
              value: ""
            }
          ],
          responseData: {
            default: '{ "success": true, "modifiedID": "@param.id" }',
          }
        }
      ])
    }
  });
  console.log(result.data.toString())
}

function* modifyMethod() {
  var url = 'https://mocks.alibaba-inc.com/openapi/deleteApi.json'
  var result = yield urllib.requestThunk(url + params, {
    method: 'POST',
    data: {
      product: "human_4",
      api: 'xxx',
    }
  });
  console.log(result.data.toString())
}

function* deleteApi() {
  var url = 'https://mocks.alibaba-inc.com/openapi/deleteApi.json'
  var result = yield urllib.requestThunk(url + params, {
    method: 'POST',
    data: {
      product: "test1234",
      api: 'test',
    }
  });
  console.log(result.data.toString())
}

function* addApi() {
  var url = 'https://mocks.alibaba-inc.com/openapi/addApi.json'
  var result = yield urllib.requestThunk(url + params, {
    method: 'POST',
    data: {
      product: "human_4",
      api: 'xxx',
      comment: ''
    }
  });
  console.log(result.data.toString())
}

function* createProduct(data) {
  var url = 'https://mocks.alibaba-inc.com/openapi/createProduct.json'
  var result = yield urllib.requestThunk(url + params, {
    method: 'POST',
    data,
    timeout: [5000, 15000]
  });
  const jsonRes = JSON.parse(result.data.toString());
  return jsonRes;
}

function* addMember(data) {
  var url = 'https://mocks.alibaba-inc.com/openapi/addMember.json'
  var result = yield urllib.requestThunk(url + params, {
    method: 'POST',
    data
  });
  const jsonRes = JSON.parse(result.data.toString())
  return jsonRes
}

// function addQingkui(params) {
//   co.wrap(addMember)({
//     product: "e-digital-teacher",
//     nickName: 'yanyue.wyy',
//     realName: 'yanyue.wyy',
//     workId: 112159,
//     depDesc: '钉钉-前端',
//     email: 'yanyue.wyy@alibaba-inc.com',
//     loginId: 'yanyue.wyy',
//     userType: 'admin'
//   }).then((res) => {
//     console.log(JSON.stringify(res))
//   }, (err) => {
//     console.log(JSON.stringify(err))
//   })
// }

function* saveComment() {
  var url = 'https://mocks.alibaba-inc.com/openapi/saveComment.json'
  var result = yield urllib.requestThunk(url + params, {
    method: 'POST',
    data: {
      product: 'test1234',
      api: 'aaa',
      comment: 'nihao lianmin'
    }
  });
  console.log(result.data.toString())
}

function* forkProduct() {
  var url = 'https://mocks.alibaba-inc.com/openapi/forkProduct.json'
  var result = yield urllib.requestThunk(url + params, {
    method: 'POST',
    data: {
      forkProductCode: 'test1234',
      productCode: 'human_2222',
      productName: '虎曼2号'
    }
  });
  console.log(result.data.toString())
}

module.exports = {
  create: co.wrap(createProduct),
  importApiList: co.wrap(importApiList),
  addMember: co.wrap(addMember)
}