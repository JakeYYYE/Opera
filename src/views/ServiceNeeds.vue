<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar v-if="!isEmbedded" />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 flex-grow" :class="{'max-w-none px-0 py-0': isEmbedded}">
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <div class="flex items-center gap-2">
            <el-icon class="text-blue-600 font-bold text-xl"><List /></el-icon>
            <span class="font-bold text-gray-800 text-lg">需求大厅</span>
         </div>
         <div class="flex items-center gap-4">
            <div class="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              剩余发布配额：<span class="font-bold text-blue-600">{{ postQuota }}</span>
            </div>
            <el-button type="primary" @click="handlePublish">
               <el-icon class="mr-1"><Plus /></el-icon> 发布需求
            </el-button>
         </div>
       </div>

      <div class="flex flex-col md:flex-row gap-8">
        
        <!-- Sidebar Filters -->
        <aside class="hidden md:block w-full md:w-64 flex-shrink-0 space-y-6">
          <!-- Search -->
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索需求关键词..."
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <el-icon class="absolute left-3 top-2.5 text-gray-400"><Search /></el-icon>
          </div>

          <!-- Category Filter -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-3 text-sm">服务类型</h3>
            <div class="space-y-2">
              <label v-for="cat in categories" :key="cat.id" class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                <input type="checkbox" v-model="selectedCategories" :value="cat.id" class="rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                <span class="text-sm text-gray-600">{{ cat.name }}</span>
                <span class="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{{ cat.count }}</span>
              </label>
            </div>
          </div>

          <!-- Status Filter -->
          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-3 text-sm">需求状态</h3>
            <div class="space-y-2">
              <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                <input
                  type="radio"
                  name="status"
                  value="all"
                  v-model="statusFilter"
                  class="text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="text-sm text-gray-600">全部</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                <input
                  type="radio"
                  name="status"
                  value="ongoing"
                  v-model="statusFilter"
                  class="text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="text-sm text-gray-600">进行中</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                <input
                  type="radio"
                  name="status"
                  value="finished"
                  v-model="statusFilter"
                  class="text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span class="text-sm text-gray-600">已结束</span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Needs List -->
        <div class="flex-1">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 md:gap-0">
            <div class="flex flex-wrap items-center gap-3">
              <h2 class="text-xl font-bold text-gray-800">需求大厅</h2>
              <div class="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  :class="activeTab === 'personal' ? 'bg-white text-blue-600 shadow-sm px-3 py-1 rounded' : 'text-gray-600 px-3 py-1 rounded'"
                  @click="switchTab('personal')"
                >个人需求</button>
                <button
                  :class="activeTab === 'enterprise' ? 'bg-white text-blue-600 shadow-sm px-3 py-1 rounded' : 'text-gray-600 px-3 py-1 rounded'"
                  @click="switchTab('enterprise')"
                >企业需求</button>
              </div>
              <span class="text-sm font-normal text-gray-500 ml-2">共 {{ displayNeeds.length }} 条</span>
            </div>
            <div class="flex items-center gap-2 self-end md:self-auto">
              <div class="hidden md:flex items-center gap-2">
                <span class="text-sm text-gray-500">排序：</span>
                <select class="text-sm border-none bg-transparent font-medium text-gray-700 focus:ring-0 cursor-pointer">
                  <option>最新发布</option>
                  <option>预算最高</option>
                  <option>即将截止</option>
                </select>
              </div>
              <el-button
                class="md:hidden flex items-center gap-1"
                size="small"
                :type="hasActiveFilters ? 'primary' : 'default'"
                :plain="!hasActiveFilters"
                @click="showMobileFilter = true"
              >
                <el-icon><Filter /></el-icon>
                <span>筛选</span>
              </el-button>
            </div>
          </div>

          <!-- Mobile Search -->
          <div class="md:hidden mb-4">
            <div class="relative">
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索需求关键词..."
                class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <el-icon class="absolute left-3 top-2.5 text-gray-400"><Search /></el-icon>
            </div>
          </div>

          <div class="space-y-3 md:space-y-4">
            <div v-for="item in displayNeeds" :key="item.id" @click="handleItemClick(item.id)" class="bg-white p-3 md:p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group relative overflow-hidden">
              <div class="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition"></div>
              
              <div class="flex justify-between items-start mb-1 md:mb-2">
                <div class="flex gap-2 mb-1">
                  <span class="bg-blue-50 text-blue-600 text-[10px] md:text-xs px-2 py-0.5 rounded font-medium">{{ item.category }}</span>
                  <span v-if="item.urgent" class="bg-red-50 text-red-600 text-[10px] md:text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1"><el-icon><Warning /></el-icon> 紧急</span>
                </div>
                <span class="text-xs md:text-sm text-gray-400 hidden md:block">{{ item.date }}</span>
              </div>

              <h3 class="text-base md:text-lg font-bold text-gray-800 mb-1 md:mb-2 group-hover:text-blue-600 transition line-clamp-1 md:line-clamp-none">{{ item.title }}</h3>
              
              <p class="hidden md:block text-sm text-gray-600 line-clamp-2 mb-4">{{ item.desc }}</p>

              <div class="flex items-center justify-between border-t border-gray-50 pt-2 md:pt-4 mt-2">
                <div class="flex items-center gap-4 text-xs md:text-sm text-gray-500">
                  <span class="flex items-center gap-1"><el-icon><Location /></el-icon> {{ item.location }}</span>
                  <span class="hidden md:flex items-center gap-1"><el-icon><View /></el-icon> {{ item.views }} 浏览</span>
                </div>
                <div class="text-base md:text-lg font-bold text-orange-500">
                  {{ item.budget }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div class="flex justify-center mt-8">
            <el-pagination background layout="prev, pager, next" :total="displayNeeds.length" />
          </div>
        </div>

      </div>

      <!-- Mobile Filter Drawer -->
      <el-drawer
        v-model="showMobileFilter"
        direction="btt"
        :with-header="false"
        size="70%"
        class="md:hidden"
      >
        <div class="px-4 pt-3 pb-4 flex flex-col h-full">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-semibold text-gray-800">筛选</h3>
            <el-button text @click="showMobileFilter = false">
              关闭
            </el-button>
          </div>
          <div class="flex-1 overflow-y-auto space-y-4">
            <div>
              <h4 class="font-bold text-gray-800 mb-2 text-sm">服务类型</h4>
              <div class="space-y-2">
                <label
                  v-for="cat in categories"
                  :key="cat.id"
                  class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition"
                >
                  <input
                    type="checkbox"
                    v-model="selectedCategories"
                    :value="cat.id"
                    class="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="text-sm text-gray-600">{{ cat.name }}</span>
                  <span class="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    {{ cat.count }}
                  </span>
                </label>
              </div>
            </div>
            <div>
              <h4 class="font-bold text-gray-800 mb-2 text-sm">需求状态</h4>
              <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                  <input
                    type="radio"
                    value="all"
                    v-model="statusFilter"
                    class="text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="text-sm text-gray-600">全部</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                  <input
                    type="radio"
                    value="ongoing"
                    v-model="statusFilter"
                    class="text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="text-sm text-gray-600">进行中</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded transition">
                  <input
                    type="radio"
                    value="finished"
                    v-model="statusFilter"
                    class="text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="text-sm text-gray-600">已结束</span>
                </label>
              </div>
            </div>
          </div>
          <div class="pt-3 border-t border-gray-100 flex justify-between gap-2">
            <el-button class="flex-1" @click="resetFilters">重置</el-button>
            <el-button type="primary" class="flex-1" @click="applyMobileFilter">确定</el-button>
          </div>
        </div>
      </el-drawer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, UserFilled, Location, View, Warning, List, Plus, Filter } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Navbar from '../components/Navbar.vue'
import { useMockData } from '../composables/useMockData'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const route = useRoute()
const { state } = useMockData()
const { isAuthenticated } = useAuth()

const isEmbedded = computed(() => route.path.startsWith('/admin'))

const showMobileFilter = ref(false)
const selectedCategories = ref([])
const statusFilter = ref('all')
const searchKeyword = ref('')
const activeTab = ref('personal')
const postQuota = ref(999)

const categories = [
  { id: 1, name: '医疗急救', count: 12 },
  { id: 2, name: '即时配送', count: 45 },
  { id: 3, name: '巡检监测', count: 30 },
  { id: 4, name: '应急救援', count: 8 },
  { id: 5, name: '地理测绘', count: 22 },
  { id: 6, name: '农林植保', count: 15 },
  { id: 7, name: '低空安防', count: 18 },
  { id: 8, name: '文旅体验', count: 25 },
]

const personalNeeds = computed(() => state.value.needs.filter(n => n.category === '文旅体验'))
const enterpriseNeeds = computed(() => state.value.needs.filter(n => n.category !== '文旅体验'))
const selectedCategoryNames = computed(() =>
  categories
    .filter(c => selectedCategories.value.includes(c.id))
    .map(c => c.name)
)

const matchStatus = (item) => {
  if (statusFilter.value === 'all') return true
  const value = item.status || ''
  if (statusFilter.value === 'ongoing') {
    if (!value) return true
    return !value.includes('完') && !value.includes('取消')
  }
  if (statusFilter.value === 'finished') {
    return value.includes('完') || value.includes('取消')
  }
  return true
}

const filterNeeds = (list) => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  return list.filter(item => {
    if (keyword) {
      const text = `${item.title || ''} ${item.desc || ''}`.toLowerCase()
      if (!text.includes(keyword)) return false
    }
    if (selectedCategoryNames.value.length > 0) {
      if (!selectedCategoryNames.value.includes(item.category)) return false
    }
    if (!matchStatus(item)) return false
    return true
  })
}

const filteredPersonalNeeds = computed(() => filterNeeds(personalNeeds.value))
const filteredEnterpriseNeeds = computed(() => filterNeeds(enterpriseNeeds.value))
const displayNeeds = computed(() => activeTab.value === 'personal' ? filteredPersonalNeeds.value : filteredEnterpriseNeeds.value)

const hasActiveFilters = computed(() => {
  if (searchKeyword.value.trim()) return true
  if (selectedCategories.value.length > 0) return true
  if (statusFilter.value !== 'all') return true
  return false
})

const getProviderLevel = () => localStorage.getItem('providerLevel') || 'lv1'
const getActiveIdentity = () => localStorage.getItem('activeIdentity') || 'provider'

const canViewTab = (tab) => {
  return true // MVP Open Permissions: Allow access to all tabs
  // const identity = getActiveIdentity()
  // const level = getProviderLevel()
  // if (identity.startsWith('requester')) return true
  // if (tab === 'personal') return level === 'lv2'
  // if (tab === 'enterprise') return level === 'lv3' || level === 'lv4'
  // return false
}

const switchTab = (tab) => {
  if (!canViewTab(tab)) {
    ElMessage.warning('当前身份无权查看该类型需求')
    return
  }
  activeTab.value = tab
}

const handlePublish = () => {
  if (!isAuthenticated.value) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-login-modal'))
    }
    return
  }
  const identity = getActiveIdentity()
  if (!identity || !identity.startsWith('requester')) {
    ElMessage.warning('当前身份不是需求方，请切换为需求方后再发布')
    return
  }
  postQuota.value = 999
  localStorage.setItem('postQuota', '999')
  router.push('/admin/requester/publish')
}

const handleItemClick = (id) => {
  if (isEmbedded.value) {
    router.push(`/admin/market/${id}`)
  } else {
    router.push(`/service-needs/${id}`)
  }
}

const resetFilters = () => {
  searchKeyword.value = ''
  selectedCategories.value = []
  statusFilter.value = 'all'
}

const applyMobileFilter = () => {
  showMobileFilter.value = false
}

onMounted(() => {
  const qsType = route.query.type
  if (qsType === 'enterprise' || qsType === 'personal') {
    if (canViewTab(qsType)) {
      activeTab.value = qsType
    }
  }
  postQuota.value = 999
  localStorage.setItem('postQuota', '999')
})
</script>
