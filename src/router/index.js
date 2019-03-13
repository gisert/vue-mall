import Vue from 'vue'
import Router from 'vue-router'
import ShoppingMall from '@/components/pages/ShoppingMall'
import Main from '@/components/pages/Main'

Vue.use(Router)

export default new Router({
  routes: [
   {path:'/main',name:'Main',component:Main,
      children:[
        {path:'/',name:'ShoppingMall',component:ShoppingMall},
      ]
   },
  
   
   
  ]
})
