<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <section class="relative h-[420px] md:h-[520px] bg-gradient-to-r from-blue-900 to-blue-700 text-white flex flex-col items-center justify-center overflow-hidden">
      <!-- Background Abstract -->
      <div class="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center"></div>
      
      <div class="relative z-10 text-center space-y-6 max-w-4xl px-4">
        <h1 class="text-3xl md:text-5xl font-bold tracking-wide leading-snug md:leading-tight">低空场景智慧飞滴</h1>
        <p class="text-base md:text-xl opacity-90">可视化流程 · 规范化 · 提高效率 · 降低成本</p>
        
        <!-- Search Box -->
        <div class="bg-white/10 backdrop-blur-md p-2 rounded-lg mt-8 max-w-2xl mx-auto w-full border border-white/20">
          <div class="flex gap-2 mb-2 px-2">
            <span class="cursor-pointer text-sm font-medium border-b-2 border-white pb-1">找服务商</span>
            <span class="cursor-pointer text-sm font-medium text-gray-300 hover:text-white pb-1">找任务</span>
          </div>
          <div class="flex">
            <input type="text" placeholder="大家在搜：中科低空+城市治理..." class="flex-1 bg-white text-gray-800 px-4 py-3 rounded-l-md focus:outline-none" />
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-r-md font-medium transition">
              搜索
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto px-4 py-12 space-y-16">
      
      <!-- Split Layout: Service Requirements (Left) + Service Providers (Right) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Service Requirements (Priority) -->
        <section class="lg:col-span-2">
          <div class="flex justify-between items-end mb-8">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">低空服务需求</h2>
              <p class="text-gray-500 mt-1">全方位覆盖各行业低空应用需求，高效匹配供需</p>
            </div>
            <router-link to="/service-needs" class="text-blue-600 hover:underline flex items-center gap-1">
              发布需求 <el-icon><Plus /></el-icon>
            </router-link>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <!-- Item 1: Medical -->
            <div @click="$router.push('/service-needs?category=medical')" class="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col items-center text-center group">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition">
                <el-icon :size="20" class="md:hidden"><FirstAidKit /></el-icon>
                <el-icon :size="24" class="hidden md:block"><FirstAidKit /></el-icon>
              </div>
              <h3 class="font-bold text-gray-800 mb-1 text-sm md:text-base">医疗急救</h3>
              <p class="text-xs text-gray-500 hidden md:block">血液运输、器官转运</p>
            </div>
            
            <!-- Item 2: Logistics -->
            <div @click="$router.push('/service-needs?category=logistics')" class="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col items-center text-center group">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition">
                <el-icon :size="20" class="md:hidden"><Box /></el-icon>
                <el-icon :size="24" class="hidden md:block"><Box /></el-icon>
              </div>
              <h3 class="font-bold text-gray-800 mb-1 text-sm md:text-base">即时配送</h3>
              <p class="text-xs text-gray-500 hidden md:block">外卖配送、同城急送</p>
            </div>

            <!-- Item 3: Inspection -->
            <div @click="$router.push('/service-needs?category=inspection')" class="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col items-center text-center group">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition">
                <el-icon :size="20" class="md:hidden"><Aim /></el-icon>
                <el-icon :size="24" class="hidden md:block"><Aim /></el-icon>
              </div>
              <h3 class="font-bold text-gray-800 mb-1 text-sm md:text-base">巡检监测</h3>
              <p class="text-xs text-gray-500 hidden md:block">电力巡检、管道监测</p>
            </div>

            <!-- Item 4: Emergency -->
            <div @click="$router.push('/service-needs?category=emergency')" class="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col items-center text-center group">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-yellow-50 text-yellow-500 rounded-lg flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition">
                <el-icon :size="20" class="md:hidden"><Warning /></el-icon>
                <el-icon :size="24" class="hidden md:block"><Warning /></el-icon>
              </div>
              <h3 class="font-bold text-gray-800 mb-1 text-sm md:text-base">应急救援</h3>
              <p class="text-xs text-gray-500 hidden md:block">山地搜救、水上救援</p>
            </div>

            <!-- Item 5: Mapping -->
            <div @click="$router.push('/service-needs?category=mapping')" class="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col items-center text-center group">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-50 text-purple-500 rounded-lg flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition">
                <el-icon :size="20" class="md:hidden"><MapLocation /></el-icon>
                <el-icon :size="24" class="hidden md:block"><MapLocation /></el-icon>
              </div>
              <h3 class="font-bold text-gray-800 mb-1 text-sm md:text-base">地理测绘</h3>
              <p class="text-xs text-gray-500 hidden md:block">实景三维、工程测量</p>
            </div>

            <!-- Item 6: Agriculture -->
            <div @click="$router.push('/service-needs?category=agriculture')" class="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col items-center text-center group">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-500 rounded-lg flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition">
                <el-icon :size="20" class="md:hidden"><Apple /></el-icon>
                <el-icon :size="24" class="hidden md:block"><Apple /></el-icon>
              </div>
              <h3 class="font-bold text-gray-800 mb-1 text-sm md:text-base">农林植保</h3>
              <p class="text-xs text-gray-500 hidden md:block">农药喷洒、播种施肥</p>
            </div>

            <!-- Item 7: Security -->
            <div @click="$router.push('/service-needs?category=security')" class="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col items-center text-center group">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 text-indigo-500 rounded-lg flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition">
                <el-icon :size="20" class="md:hidden"><Lock /></el-icon>
                <el-icon :size="24" class="hidden md:block"><Lock /></el-icon>
              </div>
              <h3 class="font-bold text-gray-800 mb-1 text-sm md:text-base">低空安防</h3>
              <p class="text-xs text-gray-500 hidden md:block">大型活动保障</p>
            </div>

            <!-- Item 8: Tourism -->
            <div @click="$router.push('/service-needs?category=tourism')" class="bg-white p-3 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer flex flex-col items-center text-center group">
              <div class="w-10 h-10 md:w-12 md:h-12 bg-pink-50 text-pink-500 rounded-lg flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition">
                <el-icon :size="20" class="md:hidden"><Camera /></el-icon>
                <el-icon :size="24" class="hidden md:block"><Camera /></el-icon>
              </div>
              <h3 class="font-bold text-gray-800 mb-1 text-sm md:text-base">文旅体验</h3>
              <p class="text-xs text-gray-500 hidden md:block">景区航拍、空中游览</p>
            </div>
          </div>
        </section>

        <!-- Right Column: Recommended Service Providers -->
        <section class="lg:col-span-1">
          <div class="flex justify-between items-end mb-8">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">优质服务商</h2>
              <p class="text-gray-500 mt-1">来自平台认证服务商库</p>
            </div>
            <router-link to="/service-providers" class="text-blue-600 hover:underline flex items-center gap-1 text-sm">
              全部 <el-icon><ArrowRight /></el-icon>
            </router-link>
          </div>
          
          <div class="flex flex-col gap-4">
            <div
              v-for="provider in featuredProviders"
              :key="provider.id"
              @click="router.push('/service-providers/' + provider.id)"
              class="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 border border-gray-100 group flex items-center gap-4 cursor-pointer"
            >
              <div class="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center group-hover:bg-blue-50 transition overflow-hidden">
                <img :src="provider.logo" :alt="provider.name" class="w-12 h-12 object-contain" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-800 truncate group-hover:text-blue-600 transition">{{ provider.name }}</h3>
                <div class="hidden md:flex gap-2 my-1">
                  <span
                    v-for="tag in provider.tags.slice(0, 2)"
                    :key="tag"
                    class="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded"
                  >
                    {{ tag }}
                  </span>
                </div>
                <div class="flex justify-between items-center text-xs text-gray-500 mt-1 md:mt-0">
                  <div class="flex items-center text-yellow-500">
                    <el-icon><StarFilled /></el-icon>
                    <span class="ml-1 text-gray-600">{{ provider.rating }}</span>
                  </div>
                  <span class="hidden md:inline">已服务 {{ provider.deals }} 单</span>
                  <span class="md:hidden text-[10px] bg-gray-50 px-1 rounded">{{ provider.deals }}单</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- News Information -->
      <section>
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">新闻资讯</h2>
            <p class="text-gray-500 mt-1">了解最新低空经济动态</p>
          </div>
          <router-link to="/news" class="text-blue-600 hover:underline flex items-center gap-1">
            查看更多 <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div 
            v-for="(news, index) in newsList" 
            :key="index" 
            class="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group cursor-pointer border border-gray-100 flex md:block"
            @click="router.push('/news/' + news.id)"
          >
             <!-- Image -->
            <div class="w-32 md:w-full h-24 md:h-48 relative overflow-hidden flex-shrink-0">
               <img :src="news.image" :alt="news.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div class="p-3 md:p-5 flex flex-col justify-center">
              <div class="flex items-center gap-2 mb-1 md:mb-3">
                <span class="bg-blue-50 text-blue-600 text-[10px] md:text-xs font-medium px-2 py-0.5 md:py-1 rounded">{{ news.category }}</span>
                <span class="text-gray-400 text-[10px] md:text-xs">{{ news.publishTime }}</span>
              </div>
              <h3 class="font-bold text-sm md:text-lg mb-1 md:mb-2 group-hover:text-blue-600 transition line-clamp-2">{{ news.title }}</h3>
              <p class="text-gray-500 text-sm line-clamp-2 hidden md:block">{{ news.summary }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Feature Grid (Bottom) -->
      <section class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-blue-50 to-white p-4 md:p-6 rounded-xl border border-blue-100 hover:shadow-lg transition">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-3 md:mb-4">
            <el-icon :size="20" class="md:hidden"><MapLocation /></el-icon>
            <el-icon :size="24" class="hidden md:block"><MapLocation /></el-icon>
          </div>
          <h3 class="font-bold text-sm md:text-lg mb-1 md:mb-2">专业航图中心</h3>
          <p class="text-xs md:text-sm text-gray-500 hidden md:block">一个集成了海量关键信息动态的空中交通蓝图</p>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-white p-4 md:p-6 rounded-xl border border-purple-100 hover:shadow-lg transition">
          <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white mb-3 md:mb-4">
            <el-icon :size="20" class="md:hidden"><DataLine /></el-icon>
            <el-icon :size="24" class="hidden md:block"><DataLine /></el-icon>
          </div>
          <h3 class="font-bold text-sm md:text-lg mb-1 md:mb-2">飞行成果AI分析</h3>
          <p class="text-xs md:text-sm text-gray-500 hidden md:block">基于高精度城市白膜数据，实现航路自动规划增值分析报告</p>
        </div>
        <div class="bg-gradient-to-br from-indigo-50 to-white p-4 md:p-6 rounded-xl border border-indigo-100 hover:shadow-lg transition">
           <div class="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white mb-3 md:mb-4">
            <el-icon :size="20" class="md:hidden"><View /></el-icon>
            <el-icon :size="24" class="hidden md:block"><View /></el-icon>
          </div>
          <h3 class="font-bold text-sm md:text-lg mb-1 md:mb-2">任务全程监管</h3>
          <p class="text-xs md:text-sm text-gray-500 hidden md:block">实时气象数据/精细化网格数据/可视化图层</p>
        </div>
        <div class="bg-gradient-to-br from-green-50 to-white p-4 md:p-6 rounded-xl border border-green-100 hover:shadow-lg transition">
           <div class="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-lg flex items-center justify-center text-white mb-3 md:mb-4">
            <el-icon :size="20" class="md:hidden"><CircleCheck /></el-icon>
            <el-icon :size="24" class="hidden md:block"><CircleCheck /></el-icon>
          </div>
          <h3 class="font-bold text-sm md:text-lg mb-1 md:mb-2">合作合规保障</h3>
          <p class="text-xs md:text-sm text-gray-500 hidden md:block">完善的合规体系，保障每一次飞行的合法安全</p>
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-400 py-8">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2026 低空物流运营平台. All rights reserved.</p>
        <p class="text-xs mt-2">中科星图股份有限公司</p>
      </div>
    </footer>

    <LoginModal v-model="showLoginModal" />

    <!-- Right Sidebar -->
    <div class="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 flex-col gap-2 p-2">
      <!-- Profile -->
      <div class="bg-white p-3 rounded-l-xl shadow-lg border border-r-0 border-gray-100 hover:bg-blue-50 cursor-pointer transition group relative" @click="isAuthenticated ? router.push('/admin/users/c') : showLoginModal = true">
        <el-icon :size="24" class="text-gray-600 group-hover:text-blue-600"><UserFilled /></el-icon>
        <span class="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">个人中心</span>
      </div>
      
      <!-- Messages -->
      <div class="bg-white p-3 rounded-l-xl shadow-lg border border-r-0 border-gray-100 hover:bg-blue-50 cursor-pointer transition group relative" @click="router.push('/messages')">
        <el-badge :value="3" class="flex items-center justify-center">
          <el-icon :size="24" class="text-gray-600 group-hover:text-blue-600"><ChatDotRound /></el-icon>
        </el-badge>
        <span class="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">消息通知</span>
      </div>

      <!-- Scroll Top -->
      <div class="bg-white p-3 rounded-l-xl shadow-lg border border-r-0 border-gray-100 hover:bg-blue-50 cursor-pointer transition group relative" @click="scrollToTop">
        <el-icon :size="24" class="text-gray-600 group-hover:text-blue-600"><CaretTop /></el-icon>
        <span class="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">回到顶部</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import LoginModal from '../components/LoginModal.vue'
import Navbar from '../components/Navbar.vue'
import { ArrowRight, Van, Goods, OfficeBuilding, Picture, FirstAidKit, Search, Plus, Box, Aim, Warning, MapLocation, Apple, Lock, Camera, DataLine, View, CircleCheck, StarFilled, ArrowDown, Menu, ChatDotRound, CaretTop, UserFilled } from '@element-plus/icons-vue'
import { useAuth } from '../composables/useAuth'
import { useMockData } from '../composables/useMockData.js'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const { user, isAuthenticated, logout, applyToProvider, applyToRequester, activeIdentity, switchIdentity } = useAuth()
const { state } = useMockData()

const showLoginModal = ref(false)
const identityDialogVisible = ref(false)
const identityMode = ref('provider')
const isApplicationOnly = ref(false)
const identityForm = reactive({
  realName: '',
  flightHours: '',
  pilotLicense: false,
  insuranceActive: false,
  requesterType: 'personal',
  orgName: '',
  contactName: '',
  contactPhone: ''
})

const newsList = computed(() => {
  const allNews = state.value.news || []
  // Sort by date desc and take top 3
  return [...allNews]
    .sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
    .slice(0, 3)
})

const featuredProviders = computed(() => {
  const providers = state.value.providers || []
  return [...providers].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4)
})

const identityLabelType = computed(() => {
  if (!user || !user.value) return 'info'
  const u = user.value
  const hasProvider = !!u.providerLevel
  const hasRequester = u.requesterPersonal || u.requesterEnterprise
  if (hasProvider && hasRequester) return 'warning'
  if (hasProvider) return 'success'
  if (hasRequester) return 'primary'
  return 'info'
})

const identityLabel = computed(() => {
  if (!user || !user.value) return '未登录'
  const u = user.value
  const hasProvider = !!u.providerLevel
  const hasRequester = u.requesterPersonal || u.requesterEnterprise
  if (hasProvider && hasRequester) return '双身份用户'
  if (hasProvider) return '服务商'
  if (hasRequester) return '需求方'
  return '未认证'
})

const currentIdentityName = computed(() => {
  if (!activeIdentity.value) return '访客'
  if (activeIdentity.value === 'provider') return '服务方'
  if (activeIdentity.value.startsWith('requester')) return '需求方'
  return '未知'
})

const switchButtonText = computed(() => {
  if (activeIdentity.value === 'provider') return '切换为需求方'
  if (activeIdentity.value && activeIdentity.value.startsWith('requester')) return '切换为服务方'
  return '切换 / 申请身份'
})

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSwitchIdentity = (targetIdentity) => {
  const res = switchIdentity(targetIdentity)
  if (res.success) {
    ElMessage.success(`已切换为${targetIdentity === 'provider' ? '服务方' : '需求方'}身份`)
    window.location.reload() // Reload to reflect changes globally if needed
  } else {
    // If switch failed (likely due to missing capability), guide user to apply
    if (res.message === '您尚未开通该身份权限') {
       const mode = targetIdentity === 'provider' ? 'provider' : 'requester'
       openIdentityDialog(mode, true)
       ElMessage.info('请先完善资料以开通该身份')
    } else {
       ElMessage.error(res.message)
    }
  }
}

const handleSmartSwitch = async () => {
  if (!user.value) {
    ElMessage.warning('请先登录')
    return
  }
  
  let target = 'provider'
  if (activeIdentity.value === 'provider') {
    target = user.value.requesterEnterprise ? 'requester_enterprise' : 'requester_personal'
  }

  // Check capability
  let hasCapability = false
  if (target === 'provider') hasCapability = !!user.value.providerLevel
  else if (target === 'requester_enterprise') hasCapability = user.value.requesterEnterprise
  else hasCapability = user.value.requesterPersonal

  if (hasCapability) {
    try {
      await ElMessageBox.confirm(
        `确认切换为${target === 'provider' ? '服务方' : '需求方'}身份吗？`,
        '切换身份',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'info' }
      )
      const res = switchIdentity(target)
      if (res.success) {
        ElMessage.success(`已切换为${target === 'provider' ? '服务方' : '需求方'}身份`)
        window.location.reload()
      }
    } catch (e) {
      // Cancelled
    }
  } else {
    openIdentityDialog(target === 'provider' ? 'provider' : 'requester', true)
  }
}



const handleLogout = () => {
  logout()
  ElMessage.success('已退出登录')
  router.push('/')
}

const openIdentityDialog = (mode = null, appOnly = false) => {
  if (!user || !user.value) {
    ElMessage.warning('请先登录')
    return
  }
  const u = user.value
  
  isApplicationOnly.value = appOnly
  
  if (mode) {
    identityMode.value = mode
  } else {
    const hasProvider = !!u.providerLevel
    const hasRequester = u.requesterPersonal || u.requesterEnterprise
    identityMode.value = hasProvider && !hasRequester ? 'requester' : 'provider'
  }

  identityForm.realName = u.realName || ''
  identityForm.flightHours = u.flightHours != null ? String(u.flightHours) : ''
  identityForm.pilotLicense = !!u.pilotLicense
  identityForm.insuranceActive = !!u.insuranceActive
  if (u.requesterEnterprise) {
    identityForm.requesterType = 'enterprise'
  } else {
    identityForm.requesterType = 'personal'
  }
  identityForm.orgName = u.requesterOrg || ''
  identityForm.contactName = u.requesterContact || ''
  identityForm.contactPhone = u.requesterPhone || u.phone || ''
  identityDialogVisible.value = true
}

const submitIdentityChange = () => {
  if (!user || !user.value) {
    ElMessage.warning('请先登录')
    return
  }
  if (identityMode.value === 'provider') {
    if (!identityForm.realName) {
      ElMessage.error('请输入真实姓名')
      return
    }
    const res = applyToProvider({
      realName: identityForm.realName,
      flightHours: identityForm.flightHours,
      pilotLicense: identityForm.pilotLicense,
      insuranceActive: identityForm.insuranceActive
    })
    if (!res.success) {
      ElMessage.error(res.message || '申请失败')
      return
    }
    ElMessage.success('已提交成为服务方的申请')
  } else {
    if (!identityForm.contactName || !identityForm.contactPhone) {
      ElMessage.error('请输入联系人和联系电话')
      return
    }
    if (identityForm.requesterType === 'enterprise' && !identityForm.orgName) {
      ElMessage.error('请输入单位名称')
      return
    }
    const res = applyToRequester({
      requesterType: identityForm.requesterType,
      orgName: identityForm.orgName,
      contactName: identityForm.contactName,
      contactPhone: identityForm.contactPhone
    })
    if (!res.success) {
      ElMessage.error(res.message || '开通失败')
      return
    }
    ElMessage.success('需求方身份已更新')
  }
  identityDialogVisible.value = false
}
</script>

<style>
/* Custom tweaks if needed */
</style>
