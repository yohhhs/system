import axios from 'axios'

axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://192.168.3.144/box-education'

axios.interceptors.request.use()
