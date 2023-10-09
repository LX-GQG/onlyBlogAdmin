import axios from "axios"
// import { useUserStoreHook } from "@/store/modules/user"
import { ElMessage } from "element-plus"
import { get } from "lodash-es"
import { useUserStore } from '../store/modules/user';
import { storeToRefs } from 'pinia'
import { Local } from '@/cache/index'
import router from '@/router'

const userStore = useUserStore()
const { token } = storeToRefs(userStore);
// axios.defaults.withCredentials = true; // true允许跨域

/** 创建请求实例 */
function createService() {
  // 创建一个 Axios 实例
  const service = axios.create()
  // 请求拦截
  service.interceptors.request.use(
    (config) => config,
    // 发送失败
    (error) => Promise.reject(error)
  )
  // 响应拦截（可根据具体业务作出相应的调整）
  service.interceptors.response.use(
    (response) => {
      // apiData 是 API 返回的数据
      const apiData = response.data
      // 这个 Code 是和后端约定的业务 Code
      const code = apiData.code
      // 如果没有 Code, 代表这不是项目后端开发的 API
      if (code === undefined) {
        ElMessage.error("非本系统的接口")
        return Promise.reject(new Error("非本系统的接口"))
      } else {
        switch (code) {
          case 200:
            // code === 0 代表没有错误
            return apiData
          case 401:
            // 回到登录页
            userStore.setToken();
            userStore.setUserInfo();
            Local.set("userinfo",'');
            Local.set("token",'');
            router.push({ path: '/login' })
            return Promise.reject(new Error("登录过期"))
          default:
            // 不是正确的 Code
            ElMessage.error(apiData.msg || "Error")
            // return Promise.reject(new Error(apiData.msg || "Error"))
        }
      }
    },
    (error) => {
      // Status 是 HTTP 状态码
      const status = get(error, "error.status")
      let errorMessage = get(error, "message")
      switch (status) {
        case "ERR_NETWORK":
          errorMessage = "网络错误"
          break
        case 400:
          errorMessage = "请求错误"
          break
        case 401:
          location.reload()
          break
        case 403:
          errorMessage = "拒绝访问"
          break
        case 404:
          errorMessage = "请求地址出错"
          break
        case 408:
          errorMessage = "请求超时"
          break
        case 500:
          errorMessage = "服务器内部错误"
          break
        case 501:
          errorMessage = "服务未实现"
          break
        case 502:
          errorMessage = "网关错误"
          break
        case 503:
          errorMessage = "服务不可用"
          break
        case 504:
          errorMessage = "网关超时"
          break
        case 505:
          errorMessage = "HTTP 版本不受支持"
          break
        default:
          break
      }
      // 回到登录页
      userStore.setToken();
      userStore.setUserInfo();
      Local.set("userinfo",'');
      Local.set("token",'');
      router.push({ path: '/login' })
      ElMessage.error(errorMessage)
      return Promise.reject(error)
    }
  )
  return service
}

/** 创建请求方法 */
function createRequestFunction(service) {
  return function (config) {
    const configDefault = {
      headers: {
        // 携带 Token
        // Authorization: token,
        "Content-Type": get(config, "headers.Content-Type", "application/json")
      },
      timeout: 8000,
      baseURL: import.meta.env.VITE_BASE_API,
      data: {}
    }
    if (token.value) {
      configDefault.headers['Authorization'] = "Bearer " + token.value // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // console.log(configDefault)
    return service(Object.assign(configDefault, config))
  }
}

/** 用于网络请求的实例 */
export const service = createService()
/** 用于网络请求的方法 */
export const request = createRequestFunction(service)