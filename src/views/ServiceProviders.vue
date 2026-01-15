<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar />

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 flex-grow">
      
      <!-- Top Filter Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">优质服务商库</h1>
            <p class="text-gray-500 text-sm mt-1">严选 {{ state?.providers?.length || 0 }} 家认证服务商，为您提供专业低空服务</p>
          </div>
          
          <div class="flex items-center gap-4 w-full md:w-auto">
             <!-- Search Box -->
             <div class="relative w-full md:w-96">
               <input
                 v-model="searchKeyword"
                 type="text"
                 placeholder="搜索服务商名称、业务类型..."
                 class="w-full pl-10 pr-24 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition"
               />
               <el-icon class="absolute left-3 top-3.5 text-gray-400"><Search /></el-icon>
               <button class="absolute right-1 top-1 bottom-1 bg-blue-600 text-white px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition">搜索</button>
             </div>
             
             <!-- Join Button -->
             <el-button
               type="primary"
               size="large"
               class="hidden md:inline-flex flex-shrink-0"
               @click="router.push('/login')"
             >
               入驻平台
             </el-button>
             <el-button
               type="primary"
               icon="Filter"
               class="md:hidden flex items-center justify-center flex-shrink-0"
               size="small"
               :plain="!hasActiveFilters"
               @click="showMobileFilter = true"
             />
          </div>
        </div>

        <!-- Filters (Desktop) -->
        <div class="space-y-4 border-t border-gray-100 pt-6 hidden md:block">
          <!-- Service Category -->
          <div class="flex items-start gap-4">
            <span class="text-gray-500 text-sm font-medium whitespace-nowrap mt-1">服务类型：</span>
            <div class="flex flex-wrap gap-2">
              <span
                class="px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition"
                :class="activeCategory === '全部' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
                @click="activeCategory = '全部'"
              >
                全部
              </span>
              <span
                v-for="cat in categories"
                :key="cat"
                class="px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition"
                :class="activeCategory === cat ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
                @click="activeCategory = cat"
              >
                {{ cat }}
              </span>
            </div>
          </div>

          <!-- Service Area -->
          <div class="flex items-start gap-4">
            <span class="text-gray-500 text-sm font-medium whitespace-nowrap mt-1">服务区域：</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="area in areas"
                :key="area"
                class="px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition"
                :class="activeArea === area ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
                @click="activeArea = area"
              >
                {{ area }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Providers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="provider in filteredProviders"
          :key="provider.id"
          @click="router.push('/service-providers/' + provider.id)"
          class="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition cursor-pointer group flex flex-col h-full overflow-hidden"
        >
          
          <!-- Cover/Header -->
          <div class="h-16 md:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
             <div class="absolute -bottom-6 left-4 md:-bottom-8 md:left-6">
                <div class="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl shadow-md p-1">
                   <img :src="provider.logo" :alt="provider.name" class="w-full h-full object-contain rounded-lg bg-gray-50" />
                </div>
             </div>
             <div class="absolute top-2 right-2 md:top-3 md:right-3">
                <span class="bg-black/20 backdrop-blur text-white text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full flex items-center gap-1">
                   <el-icon><Medal /></el-icon> <span class="hidden md:inline">官方认证</span><span class="md:hidden">认证</span>
                </span>
             </div>
          </div>

          <div class="pt-8 px-4 pb-4 md:pt-10 md:px-6 md:pb-6 flex-grow flex flex-col">
             <div class="flex justify-between items-start mb-1 md:mb-2">
                <h3 class="font-bold text-base md:text-lg text-gray-800 group-hover:text-blue-600 transition line-clamp-1">{{ provider.name }}</h3>
             </div>
             
             <!-- Ratings -->
             <div class="flex items-center gap-2 md:gap-3 text-xs md:text-sm mb-2 md:mb-4">
                <div class="flex items-center text-yellow-500 font-bold">
                   <el-icon><StarFilled /></el-icon>
                   <span class="ml-1">{{ provider.rating }}</span>
                </div>
                <span class="text-gray-400">|</span>
                <span class="text-gray-500">已成交 {{ provider.deals }} 单</span>
             </div>

             <!-- Tags -->
             <div class="hidden md:flex flex-wrap gap-2 mb-4">
                <span v-for="tag in provider.tags" :key="tag" class="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded border border-gray-100">{{ tag }}</span>
             </div>

             <!-- Description -->
             <p class="hidden md:block text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">{{ provider.desc }}</p>

             <!-- Footer -->
             <div class="border-t border-gray-50 pt-3 md:pt-4 mt-auto flex items-center justify-between">
                <span class="text-xs text-gray-400 flex items-center gap-1">
                   <el-icon><Location /></el-icon> {{ provider.location }}
                </span>
                <button class="text-blue-600 text-xs md:text-sm font-medium hover:underline">查看详情</button>
             </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="flex justify-center mt-12">
        <el-pagination background layout="prev, pager, next" :total="filteredProviders.length" />
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
            <h3 class="text-base font-semibold text-gray-800">筛选服务商</h3>
            <el-button text @click="showMobileFilter = false">
              关闭
            </el-button>
          </div>
          <div class="flex-1 overflow-y-auto space-y-4">
            <div>
              <h4 class="font-bold text-gray-800 mb-2 text-sm">服务类型</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  class="px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition"
                  :class="activeCategory === '全部' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
                  @click="activeCategory = '全部'"
                >
                  全部
                </span>
                <span
                  v-for="cat in categories"
                  :key="cat"
                  class="px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition"
                  :class="activeCategory === cat ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
                  @click="activeCategory = cat"
                >
                  {{ cat }}
                </span>
              </div>
            </div>
            <div>
              <h4 class="font-bold text-gray-800 mb-2 text-sm">服务区域</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="area in areas"
                  :key="area"
                  class="px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition"
                  :class="activeArea === area ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
                  @click="activeArea = area"
                >
                  {{ area }}
                </span>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, UserFilled, Location, StarFilled, Medal, Filter } from '@element-plus/icons-vue'
import Navbar from '../components/Navbar.vue'
import { useMockData } from '../composables/useMockData.js'

const router = useRouter()
const { state } = useMockData()

const showMobileFilter = ref(false)
const searchKeyword = ref('')
const categories = ['物流配送', '航拍测绘', '农林植保', '安防巡检', '应急救援', '载人交通', '无人机培训']
const areas = ['全国', '北京', '上海', '广州', '深圳', '成都']
const activeCategory = ref('全部')
const activeArea = ref('全国')

const filteredProviders = computed(() => {
  const list = state.value?.providers || []
  const keyword = searchKeyword.value.trim().toLowerCase()
  return list.filter((p) => {
    if (keyword) {
      const text = `${p.name || ''} ${p.desc || ''} ${(p.tags || []).join(' ')}`.toLowerCase()
      if (!text.includes(keyword)) return false
    }
    if (activeCategory.value !== '全部') {
      if (!p.tags || !p.tags.includes(activeCategory.value)) return false
    }
    if (activeArea.value !== '全国') {
      if (!p.location || !p.location.includes(activeArea.value)) return false
    }
    return true
  })
})

const hasActiveFilters = computed(() => {
  if (searchKeyword.value.trim()) return true
  if (activeCategory.value !== '全部') return true
  if (activeArea.value !== '全国') return true
  return false
})

const resetFilters = () => {
  searchKeyword.value = ''
  activeCategory.value = '全部'
  activeArea.value = '全国'
}

const applyMobileFilter = () => {
  showMobileFilter.value = false
}
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
