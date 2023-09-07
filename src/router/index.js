import { createRouter, createWebHistory} from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DataView from '../views/DataView.vue'
import PutriView from '../views/PutriView.vue'
import PutraView from '../views/PutraView.vue'
import ReportPutra from '../views/ReportPutra.vue'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/admin',
      name: 'admin',
      component: DataView,
      meta :{
        requiresAuth:true,
      }
    },
    {
      path: '/putra',
      name: 'putra',
      component: PutraView,
      meta :{
        requiresAuth:true,
      }
    },
    {
      path: '/reportputra',
      name: 'reportputra',
      component: ReportPutra,
      meta :{
        requiresAuth:true,
      }
    },
    {
      path: '/putri',
      name: 'putri',
      component: PutriView,
      meta :{
        requiresAuth:true,
      }
    },
    
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta :{
        requiresAuth:true,
      }
    },
  ]
})

const getCurrentUser=()=>{
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user)=> {
        removeListener();
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async(to, from, next) =>{
  if(to.matched.some((record) => record.meta.requiresAuth)){
    if(await getCurrentUser()){
      next()
    } else {
      alert("You Dont Have Access ! Please Log In")
      next("/login")
    }
  }else {
    next()
  }
});

export default router
