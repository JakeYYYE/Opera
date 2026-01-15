<template>
  <div class="min-h-screen bg-gray-50">
    <el-container class="min-h-screen">
      <!-- Desktop Sidebar -->
      <el-aside :width="isCollapse ? '64px' : '240px'" class="bg-white border-r border-gray-100 hidden md:block transition-all duration-300">
        <div class="h-16 px-4 flex items-center gap-3 border-b border-gray-100">
          <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">L</div>
          <div v-if="!isCollapse" class="min-w-0">
            <div class="font-bold text-gray-800 truncate">后台管理</div>
            <div class="text-xs text-gray-400 truncate">低空场景智慧飞滴</div>
          </div>
        </div>

        <AdminSideMenu :is-collapse="isCollapse" />
      </el-aside>

      <!-- Mobile Sidebar (Drawer) -->
      <el-drawer
        v-model="showMobileMenu"
        direction="ltr"
        size="240px"
        :with-header="false"
        class="md:hidden"
      >
        <div class="h-16 px-4 flex items-center gap-3 border-b border-gray-100">
          <div class="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">L</div>
          <div class="min-w-0">
            <div class="font-bold text-gray-800 truncate">后台管理</div>
            <div class="text-xs text-gray-400 truncate">低空场景智慧飞滴</div>
          </div>
        </div>
        <AdminSideMenu :is-collapse="false" @select="showMobileMenu = false" />
      </el-drawer>

      <el-container>
        <el-header class="bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 h-16">
          <div class="flex items-center gap-4 text-gray-500">
             <!-- Mobile Toggle -->
             <el-icon class="cursor-pointer hover:text-blue-600 md:hidden text-xl" @click="showMobileMenu = true"><Expand /></el-icon>
             
             <!-- Desktop Toggle -->
             <el-icon class="cursor-pointer hover:text-blue-600 hidden md:block text-xl" @click="isCollapse = !isCollapse">
               <component :is="isCollapse ? 'Expand' : 'Fold'" />
             </el-icon>
             
             <!-- Breadcrumb (Optional, can be added later) -->
            <span class="text-sm text-gray-400 hidden sm:block">{{ currentTitle }}</span>
          </div>
          
          <div class="flex items-center gap-2 md:gap-4">
            <el-button link type="primary" @click="router.push('/')" class="hidden sm:flex">返回首页</el-button>
            <div class="h-4 w-px bg-gray-200 hidden sm:block"></div>
            <template v-if="user">
              <el-dropdown trigger="click">
                <div class="flex items-center gap-2 cursor-pointer">
                  <el-avatar :size="32" :src="user.avatar" />
                  <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ user.nickname || user.username }}</span>
                  <el-tag v-if="user.role === 'admin'" size="small" type="danger" effect="dark" class="hidden sm:flex">管理员</el-tag>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="user.role !== 'admin'" @click="handleSmartSwitch">
                      {{ switchButtonText }}
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
            <template v-else>
              <el-button type="primary" size="small" @click="router.push('/')">请登录</el-button>
            </template>
          </div>
        </el-header>

        <el-main class="bg-gray-50 p-4 md:p-6">
          <router-view />
        </el-main>

        <IdentityDialog 
          v-model="identityDialogVisible" 
          :is-application-only="isApplicationOnly" 
          :default-mode="identityMode" 
        />
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useAuth } from '../composables/useAuth'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminSideMenu from '../components/AdminSideMenu.vue'
import IdentityDialog from '../components/IdentityDialog.vue'

const route = useRoute()
const router = useRouter()
const { user, logout, activeIdentity } = useAuth()
const isCollapse = ref(false)
const showMobileMenu = ref(false)

const identityDialogVisible = ref(false)
const isApplicationOnly = ref(false)
const identityMode = ref('provider')

const isAdmin = computed(() => user.value?.role === 'admin')
const isRequester = computed(() => activeIdentity.value && activeIdentity.value.startsWith('requester'))
const isProvider = computed(() => activeIdentity.value === 'provider')

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
  router.push('/')
  ElMessage.success('已退出')
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
      router.push('/')
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('open-login-modal'))
      }
    } catch (e) {
    }
  } else {
    isApplicationOnly.value = true
    identityMode.value = target === 'provider' ? 'provider' : 'requester'
    identityDialogVisible.value = true
  }
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
    window.addEventListener('open-identity-dialog', handleOpenIdentityDialog)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('open-identity-dialog', handleOpenIdentityDialog)
  }
})

const titleMap = {
  '/admin/dashboard': '总览',
  '/admin/needs': '需求管理',
  '/admin/providers': 'B端用户管理',
  '/admin/news': '文章管理',
  '/admin/news/featured': '首页推荐',
  '/admin/category': '栏目管理',
  '/admin/audit': '审核管理',
  '/admin/users/c': 'C端用户管理',
  '/admin/requester/dashboard': '个人工作台',
  '/admin/requester/publish': '发布需求',
  '/admin/provider/dashboard': '工作台',
  '/admin/market': '任务大厅',
  '/admin/provider/services': '服务能力',
  '/admin/profile': '账号设置',
  '/service-needs': '需求大厅',
  '/messages': '消息中心',
  '/admin/messages': '消息中心'
}

const currentTitle = computed(() => titleMap[route.path] || '工作台')
</script>
