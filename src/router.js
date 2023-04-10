import Vue from 'vue'
import Router from 'vue-router'
import SearchTableDialog from './components/SearchTableDialog.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'searchTableDialog',
      component: SearchTableDialog
    },

  ]
})
