import Vue from 'vue'
import Router from 'vue-router'
// import ShoppingMall from '@/components/pages/ShoppingMall'
// import Main from '@/components/pages/Main'
// import Register from '@/components/pages/Register'
// import Login from '@/components/pages/Login'
// import Goods from '@/components/pages/Goods'
// import CategoryList from '@/components/pages/CategoryList'
// import Cart from '@/components/pages/Cart'
import Member from '@/components/pages/Member'
Vue.use(Router)

const Main = r => require.ensure([], () => r(require('@/components/pages/Main')), 'Main')
const ShoppingMall= r => require.ensure([],() => r(require('@/components/pages/ShoppingMall')),'ShoppingMall')
const Register = r => require.ensure([], () => r(require('@/components/pages/Register')),'Register')
const Login = r => require.ensure([], () => r(require('@/components/pages/Login')),'Login')
const  Goods = r => require.ensure([], () => r(require('@/components/pages/Goods')),'Goods')
const  CategoryList = r => require.ensure([], () => r(require('@/components/pages/CategoryList')),'CategoryList')
const  Cart = r => require.ensure([], () => r(require('@/components/pages/Cart')),'Cart')
const  Member = r => require.ensure([], () => r(require('@/components/pages/Member')),'Member')

export default new Router({
  routes: [
   {path:'/main',name:'Main',component:Main,
      children:[
        {path:'/',name:'ShoppingMall',component:ShoppingMall},
        {path:'/CategoryList',name:'CategoryList',component:CategoryList},
        {path:'/Cart',name:'Cart',component:Cart},
        {path:'/Member',name:'Member',component:Member},
      ]
   },
  {path:'/register',name:'Register',component:Register},
  {path:'/login',name:'Login',component:Login},
  {path:'/goods',name:'Goods',component:Goods}
  ]
})
