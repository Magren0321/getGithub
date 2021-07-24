import axios from 'axios'

const showStatus = (status) => {
  let message = ''
  switch (status) {
    case 400:
      message = '请求错误(400)'
      break
    case 401:
      message = '未授权，请重新登录(401)'
      break
    case 403:
      message = '拒绝访问(403)'
      break
    case 404:
      message = '请求出错(404)'
      break
    case 408:
      message = '请求超时(408)'
      break
    case 500:
      message = '服务器错误(500)'
      break
    case 501:
      message = '服务未实现(501)'
      break
    case 502:
      message = '网络错误(502)'
      break
    case 503:
      message = '服务不可用(503)'
      break
    case 504:
      message = '网络超时(504)'
      break
    case 505:
      message = 'HTTP版本不受支持(505)'
      break
    default:
      message = `连接出错(${status})!`
  }
  return `${message}`
}

const service = axios.create({
  withCredentials: false,
  baseURL:'https://api.github.com',
  timeout: 30000, //超时时间
  headers: {
    get: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Authorization':"token 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"
    },
    post: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  },
  transformRequest: [(data) => {
    data = JSON.stringify(data)
    return data
  }],
  validateStatus () {
    // 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
    return true
  },
  transformResponse: [(data) => {
    if (typeof data === 'string' && data.startsWith('{')) {
      data = JSON.parse(data)
    }
    return data
  }]
})

// 请求拦截器
service.interceptors.request.use((config) => {
    return config
}, (error) => {
    // 错误抛到业务代码
    error.data = {}
    error.data.msg = '服务器异常'
    return Promise.resolve(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
    const status = response.status
    let msg = ''
    if (status < 200 || status >= 300) {
        msg = showStatus(status)
        if (typeof response.data === 'string') {
            response.data = {msg}
        } else {
            response.data.msg = msg
        }
    }
    return response
}, (error) => {
    error.data = {}
    error.data.msg = '请求超时或服务器异常'
    return Promise.reject(error)
})

export default service