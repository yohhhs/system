import Vue from 'vue';
import App from './App';
import router from './router';
import axios from './config/http.js'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import 'babel-polyfill';
import VueParticles from 'vue-particles'

import './common/less/theme.less';

Vue.config.productionTip = false

Vue.use(iView)
Vue.use(VueParticles)

Vue.prototype.$http = axios
Vue.prototype.userInfo = {}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
