import axios from 'axios'

axios.defaults.timeout = 5000
axios.defaults.baseURL = 'https://api.github.com'

axios.interceptors.request.use()
