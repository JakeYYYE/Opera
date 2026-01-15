<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />

    <main class="container mx-auto px-4 py-8 flex-grow">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">行业资讯</h1>
        <p class="text-gray-500 mt-2">洞察低空经济发展趋势，把握行业前沿动态</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Main Content (News List) -->
        <div class="lg:col-span-3 space-y-6">
          
          <!-- Mobile Search (Visible on mobile only) -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:hidden">
            <div class="relative">
              <input type="text" placeholder="搜索资讯..." class="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
              <el-icon class="absolute right-3 top-2.5 text-gray-400"><Search /></el-icon>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-2">
            <span 
              v-for="cat in categories" 
              :key="cat"
              @click="activeCategory = cat"
              class="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              :class="activeCategory === cat ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
            >
              {{ cat }}
            </span>
          </div>

          <!-- Article List -->
          <div class="space-y-6">
            <div 
              v-for="article in filteredNews" 
              :key="article.id" 
              @click="router.push('/news/' + article.id)"
              class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 hover:shadow-md transition cursor-pointer group"
            >
              <!-- Thumbnail -->
              <div class="w-full md:w-48 h-48 md:h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <img :src="article.image" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>

              <!-- Content -->
              <div class="flex-grow flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded font-medium">{{ article.category }}</span>
                    <span class="text-gray-400 text-xs">{{ article.date }}</span>
                  </div>
                  <h3 class="text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 md:line-clamp-1 mb-2">{{ article.title }}</h3>
                  <p class="text-gray-500 text-sm line-clamp-2 leading-relaxed">{{ article.summary }}</p>
                </div>
                
                <div class="flex items-center justify-between mt-4">
                  <div class="flex items-center gap-2 text-xs text-gray-400">
                    <span>{{ article.author }}</span>
                    <span class="hidden md:inline">·</span>
                    <span class="hidden md:inline">{{ article.views }} 阅读</span>
                  </div>
                  <span class="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition">
                    阅读全文 <el-icon><ArrowRight /></el-icon>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination (Mock) -->
          <div class="flex justify-center mt-8">
            <el-pagination background layout="prev, pager, next" :total="filteredNews.length" :page-size="10" />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Search (Hidden on mobile, since we added one at top) -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hidden md:block">
            <h3 class="font-bold text-gray-900 mb-4">搜索资讯</h3>
            <div class="relative">
              <input type="text" placeholder="请输入关键词..." class="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" />
              <el-icon class="absolute right-3 top-2.5 text-gray-400"><Search /></el-icon>
            </div>
          </div>

          <!-- Hot Topics -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <el-icon class="text-red-500"><Trophy /></el-icon> 热门推荐
            </h3>
            <div class="space-y-4">
              <div v-for="(item, index) in hotNews" :key="item.id" class="flex gap-3 cursor-pointer group" @click="router.push('/news/' + item.id)">
                <span class="text-lg font-bold w-4 text-center" :class="index < 3 ? 'text-orange-500' : 'text-gray-300'">{{ index + 1 }}</span>
                <div>
                  <h4 class="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition line-clamp-2">{{ item.title }}</h4>
                  <span class="text-xs text-gray-400 mt-1 block">{{ item.views }} 阅读</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Banner/Ad -->
          <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white text-center">
            <h3 class="font-bold text-lg mb-2">低空经济 招商入驻</h3>
            <p class="text-blue-100 text-sm mb-4">诚邀优质服务商入驻平台，共享万亿市场红利</p>
            <el-button color="white" class="!text-blue-600 w-full" @click="router.push('/service-providers')">立即入驻</el-button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ArrowRight, Trophy } from '@element-plus/icons-vue'
import Navbar from '../components/Navbar.vue'
import { useMockData } from '../composables/useMockData.js'

const router = useRouter()
const { state } = useMockData()

const activeCategory = ref('全部')
const categories = ['全部', '政策解读', '行业资讯', '应用案例', '技术前沿']

const filteredNews = computed(() => {
  let list = state.value.news || []
  if (activeCategory.value !== '全部') {
    list = list.filter(item => item.category === activeCategory.value)
  }
  // Sort by date desc
  return [...list].sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime))
})

const hotNews = computed(() => {
  return [...(state.value.news || [])].sort((a, b) => b.views - a.views).slice(0, 5)
})
</script>
