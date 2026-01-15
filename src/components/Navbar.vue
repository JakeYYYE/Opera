<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <!-- Logo & Quick Nav -->
        <div class="flex items-center gap-2">
           <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer" @click="router.push('/')">L</div>
           
           <!-- Site Map Dropdown (Dev Tool) -->
           <el-dropdown trigger="click">
             <el-button link>
               <el-icon :size="20" class="text-gray-400 hover:text-blue-600"><Menu /></el-icon>
             </el-button>
             <template #dropdown>
               <el-dropdown-menu class="w-48">
                 <el-dropdown-item disabled>前台业务</el-dropdown-item>
                 <el-dropdown-item @click="router.push('/')">首页</el-dropdown-item>
                 <el-dropdown-item @click="router.push('/service-needs')">需求大厅</el-dropdown-item>
                 <el-dropdown-item @click="router.push('/service-providers')">服务商库</el-dropdown-item>
                 <el-dropdown-item @click="router.push('/find-spot')">飞行地图</el-dropdown-item>
                 <el-dropdown-item divided disabled>后台管理</el-dropdown-item>
                 <el-dropdown-item @click="router.push('/admin/dashboard')">后台总览</el-dropdown-item>
                 <el-dropdown-item @click="router.push('/admin/needs')">需求管理</el-dropdown-item>
                 <el-dropdown-item @click="router.push('/admin/providers')">服务商管理</el-dropdown-item>
                 <el-dropdown-item @click="router.push('/admin/news')">文章管理</el-dropdown-item>
                <el-dropdown-item @click="router.push('/admin/news/featured')">首页推荐</el-dropdown-item>
                <el-dropdown-item @click="router.push('/admin/category')">栏目管理</el-dropdown-item>
                <el-dropdown-item @click="router.push('/admin/audit')">审核管理</el-dropdown-item>
                <el-dropdown-item @click="router.push('/admin/users/c')">C端用户管理</el-dropdown-item>
               </el-dropdown-menu>
             </template>
           </el-dropdown>
        </div>
        
        <!-- Platform Switcher Tabs -->
        <div class="bg-gray-100 p-1 rounded-lg flex text-sm font-medium">
           <component 
             :is="isMapPlatform ? 'router-link' : 'div'" 
             to="/"
             class="px-4 py-1.5 rounded-md transition-all"
             :class="!isMapPlatform ? 'bg-white text-blue-600 shadow-sm cursor-default' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'"
           >
             智慧飞滴
           </component>
           <component 
             :is="!isMapPlatform ? 'router-link' : 'div'"
             to="/find-spot" 
             class="px-4 py-1.5 rounded-md transition-all"
             :class="isMapPlatform ? 'bg-white text-blue-600 shadow-sm cursor-default' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'"
           >
             飞行地图
           </component>
        </div>
      </div>

      <!-- Main Navigation -->
      <nav class="hidden md:flex items-center gap-8 text-gray-600">
        <router-link to="/" class="hover:text-blue-600 transition" :class="{'text-blue-600 font-medium': isActive('/')}">首页</router-link>
        <router-link to="/news" class="hover:text-blue-600 transition" :class="{'text-blue-600 font-medium': isActive('/news')}">行业资讯</router-link>
        <router-link to="/service-needs" class="hover:text-blue-600 transition" :class="{'text-blue-600 font-medium': isActive('/service-needs')}">需求大厅</router-link>
        <router-link to="/service-providers" class="hover:text-blue-600 transition" :class="{'text-blue-600 font-medium': isActive('/service-providers')}">服务商库</router-link>
      </nav>

      <!-- Mobile Hamburger -->
      <button class="md:hidden p-2 text-gray-600" @click="mobileMenuOpen = true">
        <el-icon :size="24"><Expand /></el-icon>
      </button>

      <!-- Auth Buttons (Desktop) -->
      <div class="hidden md:flex items-center gap-4">
        <template v-if="isAuthenticated && user">
          <el-dropdown trigger="click">
              <div class="flex items-center gap-3 cursor-pointer text-gray-700 hover:text-blue-600 transition-colors">
                <el-avatar :size="36" :src="user.avatar" class="border-2 border-gray-100" />
                <div class="flex flex-col items-start">
                  <div class="flex items-baseline gap-1 mb-1">
                    <span class="text-sm font-bold leading-none">{{ user.nickname || user.username }}</span>
                    <span class="text-[10px] text-gray-400 font-mono">ID:{{ user.id }}</span>
                  </div>
                  <el-tag size="small" effect="dark" :type="identityBadgeType" class="h-5 px-1.5 text-[10px] border-none">{{ currentIdentityName }}</el-tag>
                </div>
                <el-icon class="opacity-70"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item v-if="user.role === 'admin'" @click="router.push('/admin')">管理后台</el-dropdown-item>
                  <el-dropdown-item v-else-if="user.role === 'b-user' || activeIdentity === 'provider'" @click="router.push('/admin/provider/dashboard')">商户中心</el-dropdown-item>
                  <el-dropdown-item v-else @click="router.push('/admin/requester/dashboard')">个人中心</el-dropdown-item>
                  <el-dropdown-item v-if="user.role !== 'admin'" divided @click="handleSmartSwitch">
                    {{ switchButtonText }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
          </el-dropdown>
        </template>
        <template v-else>
          <button
            type="button"
            @click="showLoginModal = true"
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-cyan-500/30 hover:from-blue-500 hover:to-cyan-400 active:scale-[0.97] transition-all"
          >
            <span>登录 / 注册</span>
          </button>
        </template>
      </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <el-drawer
      v-model="mobileMenuOpen"
      direction="rtl"
      size="80%"
      :with-header="false"
      class="mobile-menu-drawer"
    >
      <div class="flex flex-col h-full py-6 px-4 space-y-6">
        <!-- Mobile Header -->
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-gray-800">菜单</span>
          <button @click="mobileMenuOpen = false" class="p-2 text-gray-500">
            <el-icon :size="24"><Close /></el-icon>
          </button>
        </div>

        <!-- Mobile Auth Section -->
        <div class="pb-6 border-b border-gray-100">
          <template v-if="isAuthenticated && user">
            <div class="flex items-center gap-3 mb-4">
              <el-avatar :size="48" :src="user.avatar" />
              <div>
                <div class="font-bold text-gray-800">{{ user.nickname || user.username }}</div>
                <div class="text-xs text-gray-500">ID: {{ user.id }}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <el-button v-if="user.role === 'admin'" @click="router.push('/admin'); mobileMenuOpen = false">管理后台</el-button>
              <el-button v-else-if="user.role === 'b-user' || activeIdentity === 'provider'" @click="router.push('/admin/provider/dashboard'); mobileMenuOpen = false">商户中心</el-button>
              <el-button v-else @click="router.push('/admin/requester/dashboard'); mobileMenuOpen = false">个人中心</el-button>
              <el-button type="info" plain @click="handleLogout">退出</el-button>
            </div>
            <div class="mt-2">
               <el-button v-if="user.role !== 'admin'" text class="w-full justify-start" @click="handleSmartSwitch">
                  <el-icon class="mr-1"><Refresh /></el-icon> {{ switchButtonText }}
               </el-button>
            </div>
          </template>
          <template v-else>
            <el-button type="primary" class="w-full" @click="showLoginModal = true; mobileMenuOpen = false">
              登录 / 注册
            </el-button>
          </template>
        </div>

        <!-- Mobile Navigation Links -->
        <nav class="flex flex-col space-y-2">
          <router-link to="/" class="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-between" @click="mobileMenuOpen = false">
            <span>首页</span>
            <el-icon><ArrowRight /></el-icon>
          </router-link>
          <router-link to="/news" class="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-between" @click="mobileMenuOpen = false">
            <span>行业资讯</span>
            <el-icon><ArrowRight /></el-icon>
          </router-link>
          <router-link to="/service-needs" class="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-between" @click="mobileMenuOpen = false">
            <span>需求大厅</span>
            <el-icon><ArrowRight /></el-icon>
          </router-link>
          <router-link to="/service-providers" class="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-between" @click="mobileMenuOpen = false">
            <span>服务商库</span>
            <el-icon><ArrowRight /></el-icon>
          </router-link>
          <router-link v-if="isAuthenticated" to="/messages" class="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-between" @click="mobileMenuOpen = false">
            <span>消息中心</span>
            <el-icon><ArrowRight /></el-icon>
          </router-link>
        </nav>

        <!-- Platform Switcher (Mobile) -->
        <div class="mt-auto pt-6 border-t border-gray-100">
          <div class="text-xs text-gray-400 mb-2">切换平台视图</div>
          <div class="grid grid-cols-2 gap-2">
            <component 
              :is="isMapPlatform ? 'router-link' : 'div'" 
              to="/"
              class="px-3 py-2 text-center rounded-lg border text-sm"
              :class="!isMapPlatform ? 'bg-blue-50 border-blue-200 text-blue-600 font-medium' : 'border-gray-200 text-gray-600'"
              @click="mobileMenuOpen = false"
            >
              智慧飞滴
            </component>
            <component 
              :is="!isMapPlatform ? 'router-link' : 'div'"
              to="/find-spot" 
              class="px-3 py-2 text-center rounded-lg border text-sm"
              :class="isMapPlatform ? 'bg-blue-50 border-blue-200 text-blue-600 font-medium' : 'border-gray-200 text-gray-600'"
              @click="mobileMenuOpen = false"
            >
              飞行地图
            </component>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- Components -->
    <LoginModal v-model="showLoginModal" />
    <IdentityDialog 
      v-model="identityDialogVisible" 
      :is-application-only="isApplicationOnly" 
      :default-mode="identityMode" 
    />
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Menu, ArrowDown, Expand, Fold, Close, Refresh, ArrowRight } from '@element-plus/icons-vue'
import { useAuth } from '../composables/useAuth'
import { ElMessage, ElMessageBox, ElDrawer } from 'element-plus'
import LoginModal from './LoginModal.vue'
import IdentityDialog from './IdentityDialog.vue'

const router = useRouter()
const route = useRoute()
const { user, isAuthenticated, logout, activeIdentity } = useAuth()

const showLoginModal = ref(false)
const identityDialogVisible = ref(false)
const isApplicationOnly = ref(false)
const identityMode = ref('provider')
const mobileMenuOpen = ref(false)

const handleOpenLoginModal = () => {
  showLoginModal.value = true
}

const handleOpenIdentityDialog = (event) => {
  if (!user.value) {
    ElMessage.warning('请先登录')
    return
  }
  const detail = event && event.detail ? event.detail : {}
  isApplicationOnly.value = !!detail.applicationOnly
  identityMode.value = detail.mode === 'requester' ? 'requester' : 'provider'
  identityDialogVisible.value = true
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('open-login-modal', handleOpenLoginModal)
    window.addEventListener('open-identity-dialog', handleOpenIdentityDialog)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('open-login-modal', handleOpenLoginModal)
    window.removeEventListener('open-identity-dialog', handleOpenIdentityDialog)
  }
})

const isMapPlatform = computed(() => {
  return route.path.startsWith('/find-spot')
})

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const identityBadgeType = computed(() => {
  if (!user.value) return 'info'
  const u = user.value
  const hasProvider = !!u.providerLevel
  const hasRequester = u.requesterPersonal || u.requesterEnterprise
  if (hasProvider && hasRequester) return 'warning'
  if (hasProvider) return 'success'
  if (hasRequester) return 'primary'
  return 'info'
})

const currentIdentityName = computed(() => {
  if (!activeIdentity.value || !user.value) return '访客'
  const isBUser = user.value.role === 'b-user'
  const isCUser = user.value.role === 'c-user'

  if (activeIdentity.value === 'provider') {
    if (isBUser) return '企业服务方'
    if (isCUser) return '个人服务方'
    return '服务方'
  }
  if (activeIdentity.value === 'requester_enterprise') return '企业需求方'
  if (activeIdentity.value === 'requester_personal') return '个人需求方'
  return '需求方'
})

const switchButtonText = computed(() => {
  if (!user.value) return '切换 / 申请身份'
  const isBUser = user.value.role === 'b-user'
  const isCUser = user.value.role === 'c-user'

  if (activeIdentity.value === 'provider') {
    if (isBUser) return '切换为企业需求方'
    if (isCUser) return '切换为个人需求方'
    return '切换为需求方'
  }
  if (activeIdentity.value && activeIdentity.value.startsWith('requester')) {
    if (isBUser) return '切换为企业服务方'
    if (isCUser) return '切换为个人服务方'
    return '切换为服务方'
  }
  return '切换 / 申请身份'
})

const handleLogout = () => {
  logout()
  ElMessage.success('已退出登录')
  router.push('/')
}

const handleSmartSwitch = async () => {
  if (!user.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  let target = 'provider'
  const isBUser = user.value.role === 'b-user'
  const isCUser = user.value.role === 'c-user'

  if (activeIdentity.value === 'provider') {
    if (isBUser) {
      target = 'requester_enterprise'
    } else if (isCUser) {
      target = 'requester_personal'
    } else {
      target = user.value.requesterEnterprise ? 'requester_enterprise' : 'requester_personal'
    }
  } else if (activeIdentity.value.startsWith('requester')) {
    target = 'provider'
  }

  // Check capability（同端内校验）
  let hasCapability = false
  if (target === 'provider') hasCapability = !!user.value.providerLevel
  else if (target === 'requester_enterprise') hasCapability = user.value.requesterEnterprise
  else hasCapability = user.value.requesterPersonal

  if (hasCapability) {
    try {
      await ElMessageBox.confirm(
        `切换身份需要重新登录，确认要切换为${target === 'provider' ? '服务方' : '需求方'}身份吗？`,
        '切换身份',
        { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'info' }
      )
      logout()
      showLoginModal.value = true
    } catch (e) {
    }
  } else {
    // Open Dialog for Application
    isApplicationOnly.value = true
    identityMode.value = target === 'provider' ? 'provider' : 'requester'
    identityDialogVisible.value = true
  }
}
</script>
