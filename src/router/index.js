import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Runner from '../components/runner/Runner.vue'
import TwoHand from '../components/twohand/TwoHand.vue'
import Change from '../components/change/Change.vue'
import PushRunner from '../components/runner/PushRunner.vue'
import PushChange from '../components/change/PushChange.vue'
import PushTwoHand from '../components/twohand/PushTwoHand.vue'
import Welcom from '../components/Welcom.vue'
import GoodsDetail from '../components/twohand/GoodsDetail.vue'
import UserDetail from '../components/user/userDetail.vue'
import ModifyUser from '../components/user/ModifyUser.vue'
import ModifyPassword from '../components/user/ModifyPassword.vue'
import MyBought from '../components/user/MyBought.vue'
import MyGoods from '../components/user/MyGoods.vue'
import MySell from '../components/user/MySell.vue'
import ChangeGoodsDetail from '../components/change/ChangeGoodsDetail.vue'
import MyChangeGoods from '../components/user/MyChangeGoods.vue'
import MyChange from '../components/user/MyChange.vue'
import RunnerDetail from '../components/runner/RunnerDetail.vue'
import MyRunner from '../components/user/MyRunner.vue'
import MyAcRunner from '../components/user/MyAcceptRunner.vue'
import AllUser from '../components/manager/AllUser.vue'
import TwoHandJudgingGoods from '../components/manager/judging/twoHandJudgingGoods.vue'
import TwoHandJudgingDetail from '../components/manager/judging/twohandjudging.vue'
import RunnerJudging from '../components/manager/judging/runnerjudging.vue'
import RunnerJudgingDetail from '../components/manager/judging/runnerjudgingdetail.vue'
Vue.use(VueRouter)

const routes = [
  {path:'/' ,redirect:'/login'},
  {path:'/login',component: Login},
  {path:'/home',component: Home,redirect:'/welcom',children:[
    {path:'/welcom',component:Welcom},
    {path:'/runner',component:Runner},
    {path:'/pushrunner',component:PushRunner},
    {path:'/twohand',component:TwoHand},
    {path:'/pushtwohand',component:PushTwoHand},
    {path:'/change',component:Change},
    {path:'/pushchange',component:PushChange},
    {path:'/goodsdetail',component:GoodsDetail},
    {path:'/mydetail',component:UserDetail},
    {path:'/modifyuser',component:ModifyUser},
    {path:'/modifypassword',component:ModifyPassword},
    {path:'/mybought',component:MyBought},
    {path:'/mygoods',component: MyGoods},
    {path:'/mysell',component: MySell},
    {path:'/changegoodsdetail',component: ChangeGoodsDetail},
    {path:'/mychangegoods',component: MyChangeGoods},
    {path:'/mychange',component: MyChange},
    {path:'/runnerdetail',component: RunnerDetail},
    {path:'/myrunner',component: MyRunner},
    {path:'/myacrunner',component: MyAcRunner},
    {path:'/alluser',component: AllUser},
    {path:'/twohandjudging',component: TwoHandJudgingGoods},
    {path:'/twohandjudgingdetail',component: TwoHandJudgingDetail},
    {path:'/runnerjudgingdetail',component: RunnerJudgingDetail},
    {path:'/runnerjudging',component: RunnerJudging},
  ]},
  

]

const router = new VueRouter({
  routes
})

//全局前置路由守卫————初始化的时候被调用、每次路由切换之前被调用
router.beforeEach((to, from, next) => {
 if(to.path==='/login'){
  return next();
 }
 const token=window.sessionStorage.getItem('token');

  //普通用户路由守卫
  if(!token){
    return next('/login');
  }else{
    return next();
  }
 
})

export default router
