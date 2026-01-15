import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import FindSpot from '../views/FindSpot.vue'
import FindSpotDetail from '../views/FindSpotDetail.vue'
import ServiceNeeds from '../views/ServiceNeeds.vue'
import ServiceNeedDetail from '../views/ServiceNeedDetail.vue'
import ServiceProviders from '../views/ServiceProviders.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../views/Messages.vue')
  },
  {
    path: '/service-needs',
    name: 'ServiceNeeds',
    component: ServiceNeeds
  },
  {
    path: '/service-needs/:id',
    name: 'ServiceNeedDetail',
    component: ServiceNeedDetail
  },
  {
    path: '/news',
    name: 'NewsList',
    component: () => import('../views/NewsList.vue')
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('../views/NewsDetail.vue')
  },
  {
    path: '/service-providers',
    name: 'ServiceProviders',
    component: ServiceProviders
  },
  {
    path: '/service-providers/:id',
    name: 'ServiceProviderDetail',
    component: () => import('../views/ServiceProviderDetail.vue')
  },
  {
    path: '/find-spot',
    name: 'FindSpot',
    component: FindSpot
  },
  {
    path: '/find-spot/:id',
    name: 'FindSpotDetail',
    component: FindSpotDetail
  },
  {
    path: '/admin',
    component: () => import('../views/AdminLayout.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('../views/AdminDashboard.vue') },
      { path: 'needs', name: 'AdminNeedsManage', component: () => import('../views/AdminNeedsManage.vue') },
      { path: 'providers', name: 'AdminProvidersManage', component: () => import('../views/AdminUserSmallBManage.vue') },
      { path: 'news', name: 'AdminNewsManage', component: () => import('../views/AdminNewsManage.vue') },
      { path: 'news/featured', name: 'AdminNewsFeatured', component: () => import('../views/AdminNewsFeatured.vue') },
      { path: 'category', name: 'AdminCategoryManage', component: () => import('../views/AdminCategoryManage.vue') },
      { path: 'audit', name: 'AdminAuditManage', component: () => import('../views/AdminAuditManage.vue') },
      { path: 'users/c', name: 'AdminUserCManage', component: () => import('../views/AdminUserCManage.vue') },
      
      // Requester (C-end) Routes
      { path: 'requester/dashboard', name: 'RequesterDashboard', component: () => import('../views/RequesterDashboard.vue') },
      { path: 'requester/publish', name: 'PublishNeed', component: () => import('../views/PublishNeed.vue') },
      
      // Provider (B-end) Routes
      { path: 'provider/dashboard', name: 'ProviderDashboard', component: () => import('../views/ProviderDashboard.vue') },
      { path: 'profile', name: 'UserProfile', component: () => import('../views/UserProfile.vue') },
      { path: 'messages', name: 'AdminMessages', component: () => import('../views/Messages.vue') },
      
      // Embedded Market
      { path: 'market', name: 'AdminMarket', component: ServiceNeeds },
      { path: 'market/:id', name: 'AdminMarketDetail', component: ServiceNeedDetail }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
