import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import routes from './routes';
import store from './store/index';
import Notifications from 'vue-notification'
import DatetimePicker from 'vuetify-datetime-picker'
import VueHorizontalTimeline from "vue-horizontal-timeline"

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Notifications)
Vue.use(DatetimePicker)
Vue.use(VueHorizontalTimeline);

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (store.state.auth.Authorization == "") {
    store.dispatch("getAPIKey").then(res => {
      
      // get notification history
      store.dispatch("getNotificationHistory");

      // route to destination
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!store.getters.loggedIn) {
          next({
            name: 'Login',
          })
        } else {
          next()
        }
      } else if (to.matched.some(record => record.meta.requiresVisitor)) {
        if (store.getters.loggedIn) {
          next({
            name: 'Dashboard',
          })
        } else {
          next()
        }
      } else {
        next()
      }
    });
  } else {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!store.getters.loggedIn) {
        next({
          name: 'Login',
        })
      } else {
        next()
      }
    } else if (to.matched.some(record => record.meta.requiresVisitor)) {
      if (store.getters.loggedIn) {
        next({
          name: 'Dashboard',
        })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
