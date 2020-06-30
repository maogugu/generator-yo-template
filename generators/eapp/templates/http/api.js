import {
  get,
  post
} from '/http/request'

/**
 * get | post 跟url
 */
export default {
  testPost: post('/test/post'),
  testGet: get('/test/get')
}
