import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/config/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/entreprises/:siren',
      name: 'entreprise',
      component: () => import('@/views/EntrepriseView.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { public: true },
    },
  ],
})

// Guard global : toute route non marquée `public` nécessite une session
// Supabase active. Sans session, on redirige vers /login en conservant la
// destination initiale dans ?redirect=.
router.beforeEach(async (to) => {
  if (to.meta.public) return true

  const { data } = await supabase.auth.getSession()
  if (data.session) return true

  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router
