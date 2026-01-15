<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">首页推荐管理</h2>
        <p class="text-gray-500 mt-1">管理首页 "新闻资讯" 栏目展示的 3 条置顶内容</p>
      </div>
      <el-button type="primary" @click="saveChanges" :loading="saving">
        <el-icon class="mr-1"><Check /></el-icon> 保存更改
      </el-button>
    </div>

    <!-- Preview Section -->
    <div class="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 class="font-bold text-gray-700 mb-4 flex items-center gap-2">
        <el-icon><Monitor /></el-icon> 首页展示预览
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div 
          v-for="(news, index) in featuredNews" 
          :key="index" 
          class="relative group border-2 border-dashed border-gray-200 rounded-xl p-2 hover:border-blue-400 transition-colors"
        >
          <!-- Slot Label -->
          <div class="absolute -top-3 left-4 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded border border-gray-200 z-10">
            推荐位 #{{ index + 1 }}
          </div>

          <!-- News Card Preview -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
            <div class="h-40 relative bg-gray-100">
              <img v-if="news.cover" :src="news.cover" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <el-icon :size="32"><Picture /></el-icon>
              </div>
              
              <!-- Change Button Overlay -->
              <!-- Desktop: Hover to show button -->
              <div class="hidden md:flex absolute inset-0 bg-black/50 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <el-button type="primary" @click="openSelector(index)">
                  更换内容
                </el-button>
              </div>
              <!-- Mobile: Always visible button or icon -->
              <div class="md:hidden absolute bottom-2 right-2">
                 <el-button type="primary" size="small" circle icon="Edit" @click="openSelector(index)" />
              </div>
            </div>
            
            <div class="p-3 md:p-4 flex-1 flex flex-col">
              <div class="flex items-center gap-2 mb-2">
                <span class="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded">{{ news.category || '未分类' }}</span>
                <span class="text-gray-400 text-xs">{{ news.publishTime || 'YYYY-MM-DD' }}</span>
              </div>
              <h4 class="font-bold text-sm mb-2 line-clamp-2">{{ news.title || '暂无标题' }}</h4>
              <p class="text-gray-500 text-xs line-clamp-2 flex-1">{{ news.desc || '暂无描述...' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selection Dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="选择新闻内容"
      :width="isMobile ? '95%' : '800px'"
      destroy-on-close
      class="rounded-xl"
    >
      <div class="space-y-4">
        <!-- Search & Filter -->
        <div class="flex flex-col md:flex-row gap-2 md:gap-4">
          <el-input v-model="searchQuery" placeholder="搜索标题..." prefix-icon="Search" clearable class="flex-1" />
          <el-select v-model="categoryFilter" placeholder="全部分类" clearable class="w-full md:w-40">
            <el-option label="新品发布" value="新品发布" />
            <el-option label="用户故事" value="用户故事" />
            <el-option label="行业动态" value="行业动态" />
            <el-option label="政策法规" value="政策法规" />
          </el-select>
        </div>

        <!-- News Table (Desktop) -->
        <div class="hidden md:block">
          <el-table 
            :data="filteredNews" 
            height="400" 
            style="width: 100%" 
            highlight-current-row
            @current-change="handleCurrentChange"
          >
            <el-table-column width="80">
              <template #default="{ row }">
                <img :src="row.cover" class="w-10 h-10 rounded object-cover" />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
            <el-table-column prop="category" label="分类" width="100">
              <template #default="{ row }">
                <el-tag size="small">{{ row.category }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="publishTime" label="发布时间" width="120" />
            <el-table-column width="80" align="center">
              <template #default="{ row }">
                <el-button 
                  v-if="currentSelection?.id === row.id" 
                  type="success" 
                  size="small" 
                  circle
                  icon="Check"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- News Card List (Mobile) -->
        <div class="md:hidden space-y-3 max-h-[400px] overflow-y-auto">
          <div 
            v-for="row in filteredNews" 
            :key="row.id" 
            class="bg-gray-50 p-3 rounded-lg border border-gray-100 flex gap-3"
            :class="{'ring-2 ring-blue-500 bg-blue-50': currentSelection?.id === row.id}"
            @click="handleCurrentChange(row)"
          >
             <img :src="row.cover" class="w-16 h-16 object-cover rounded bg-white shrink-0" />
             <div class="flex-1 min-w-0">
               <div class="font-medium text-sm text-gray-900 line-clamp-2 mb-1">{{ row.title }}</div>
               <div class="flex items-center justify-between">
                  <el-tag size="small" effect="plain">{{ row.category }}</el-tag>
                  <span class="text-xs text-gray-400">{{ row.publishTime }}</span>
               </div>
             </div>
             <div v-if="currentSelection?.id === row.id" class="flex items-center justify-center text-blue-600">
                <el-icon><Check /></el-icon>
             </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmSelection" :disabled="!currentSelection">
            确定选择
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Check, Search, Picture, Monitor } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { mockNewsList } from '../data/mockNews'

// Responsive check
const windowWidth = ref(window.innerWidth)
const updateWidth = () => windowWidth.value = window.innerWidth
onMounted(() => window.addEventListener('resize', updateWidth))
onUnmounted(() => window.removeEventListener('resize', updateWidth))
const isMobile = computed(() => windowWidth.value < 768)

// State
const saving = ref(false)
const dialogVisible = ref(false)
const activeSlotIndex = ref(null)
const searchQuery = ref('')
const categoryFilter = ref('')
const currentSelection = ref(null)

// Data
const allNews = ref(mockNewsList)
const featuredNews = ref([{}, {}, {}]) // Initialize with empty objects

// Load data
onMounted(() => {
  const saved = localStorage.getItem('featuredNews')
  if (saved) {
    featuredNews.value = JSON.parse(saved)
  } else {
    // Default to first 3 items
    featuredNews.value = allNews.value.slice(0, 3)
  }
})

// Computed Filter
const filteredNews = computed(() => {
  return allNews.value.filter(item => {
    const matchTitle = item.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = !categoryFilter.value || item.category === categoryFilter.value
    // Filter out items already selected in other slots (optional, but good UX)
    const isAlreadySelected = featuredNews.value.some((n, idx) => idx !== activeSlotIndex.value && n.id === item.id)
    
    return matchTitle && matchCategory && !isAlreadySelected
  })
})

// Actions
const openSelector = (index) => {
  activeSlotIndex.value = index
  currentSelection.value = null // Reset selection
  dialogVisible.value = true
}

const handleCurrentChange = (val) => {
  currentSelection.value = val
}

const confirmSelection = () => {
  if (currentSelection.value) {
    featuredNews.value[activeSlotIndex.value] = { ...currentSelection.value }
    dialogVisible.value = false
    ElMessage.success('已更新推荐位内容，请记得保存！')
  }
}

const saveChanges = () => {
  saving.value = true
  // Simulate API call
  setTimeout(() => {
    localStorage.setItem('featuredNews', JSON.stringify(featuredNews.value))
    saving.value = false
    ElMessage.success('首页推荐内容已保存')
  }, 800)
}
</script>

<style scoped>
/* Custom styling if needed */
</style>
