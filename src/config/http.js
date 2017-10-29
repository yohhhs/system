import axios from 'axios'
import qs from 'qs'

let lpUrl = 'http://192.168.3.156:8080/box-education'
let testUrl = 'http://192.168.3.144/box-education'
let hdUrl = 'http://192.168.3.94:8080/box-education'

axios.defaults.timeout = 10000
axios.defaults.baseURL = testUrl

axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  config => {
    config.data = qs.stringify(config.data)
    return config
  }
)
export default axios
