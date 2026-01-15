  <template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />

    <main class="container mx-auto px-4 py-8 flex-grow">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/news' }">行业资讯</el-breadcrumb-item>
          <el-breadcrumb-item>正文</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
          <div v-if="article">
            <!-- Article Header -->
            <div class="mb-6 md:mb-8 border-b border-gray-100 pb-6 md:pb-8">
              <div class="flex items-center gap-2 mb-4">
                <span class="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded font-medium">{{ article.category }}</span>
              </div>
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{{ article.title }}</h1>
              <div class="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500">
                <span>{{ article.date }}</span>
                <span>作者：{{ article.author }}</span>
                <span>阅读：{{ article.views }}</span>
              </div>
            </div>

            <!-- Article Content -->
            <div class="prose prose-blue max-w-none text-gray-700 leading-relaxed" v-html="article.content"></div>

            <!-- Tags -->
            <div class="mt-8 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <el-icon class="text-gray-400"><CollectionTag /></el-icon>
              <span class="text-sm text-gray-500">关键词：</span>
              <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">低空经济</span>
              <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">无人机</span>
              <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">行业应用</span>
            </div>
          </div>
          
          <div v-else class="text-center py-20 text-gray-500">
            <el-empty description="文章不存在或已被删除" />
            <el-button type="primary" @click="router.push('/news')">返回列表</el-button>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Related News -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 class="font-bold text-gray-900 mb-4">相关阅读</h3>
            <div class="space-y-4">
              <div v-for="item in relatedNews" :key="item.id" class="cursor-pointer group" @click="router.push('/news/' + item.id)">
                <h4 class="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition line-clamp-2 mb-1">{{ item.title }}</h4>
                <span class="text-xs text-gray-400">{{ item.date }}</span>
              </div>
            </div>
          </div>

          <!-- Lead Gen CTA -->
          <div class="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white">
            <h3 class="font-bold text-lg mb-2">获取行业解决方案</h3>
            <p class="text-white/90 text-sm mb-4">想了解更多低空应用落地案例？免费获取专属方案。</p>
            <el-button color="white" class="!text-orange-600 w-full font-bold" @click="router.push('/service-providers')">免费咨询</el-button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CollectionTag } from '@element-plus/icons-vue'
import Navbar from '../components/Navbar.vue'
import { useMockData } from '../composables/useMockData.js'

const route = useRoute()
const router = useRouter()
const { state } = useMockData()

const article = computed(() => {
  const id = parseInt(route.params.id)
  return state.value.news?.find(n => n.id === id)
})

const relatedNews = computed(() => {
  if (!article.value) return []
  return state.value.news?.filter(n => n.id !== article.value.id).slice(0, 4) || []
})

// Scroll to top when route changes
watch(() => route.params.id, () => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
/* Simple typography styles for article content */
:deep(.prose h3) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #111827;
}
:deep(.prose p) {
  margin-bottom: 1rem;
  line-height: 1.75;
}
</style>
