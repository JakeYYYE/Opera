<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-xl font-bold text-gray-800">需求方控制台</h2>
        <p class="text-sm text-gray-500 mt-1">管理您的需求发布、订单进度与账户资金</p>
      </div>
      <el-button type="primary" icon="Plus" @click="$router.push('/admin/requester/publish')">发布新需求</el-button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <el-icon :size="20"><Document /></el-icon>
        </div>
        <div>
          <div class="text-xs md:text-sm text-gray-500">进行中需求</div>
          <div class="text-lg md:text-2xl font-bold text-gray-800">3</div>
        </div>
      </div>
      <div class="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <el-icon :size="20"><ChatDotRound /></el-icon>
        </div>
        <div>
          <div class="text-xs md:text-sm text-gray-500">待确认报价</div>
          <div class="text-lg md:text-2xl font-bold text-gray-800">2</div>
        </div>
      </div>
      <div class="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <el-icon :size="20"><Wallet /></el-icon>
        </div>
        <div>
          <div class="text-xs md:text-sm text-gray-500">累计支出</div>
          <div class="text-lg md:text-2xl font-bold text-gray-800">¥12,400</div>
        </div>
      </div>
      <div class="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <el-icon :size="20"><Star /></el-icon>
        </div>
        <div>
          <div class="text-xs md:text-sm text-gray-500">信用评分</div>
          <div class="text-lg md:text-2xl font-bold text-gray-800">98</div>
        </div>
      </div>
    </div>

    <!-- Needs List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <h3 class="font-bold text-gray-800 flex-shrink-0">我的需求</h3>
        <el-tabs v-model="activeTab" class="w-full dashboard-tabs">
          <el-tab-pane label="全部" name="all" />
          <el-tab-pane label="审核中" name="auditing" />
          <el-tab-pane label="竞标中" name="bidding" />
          <el-tab-pane label="执行中" name="progress" />
          <el-tab-pane label="已完成" name="completed" />
        </el-tabs>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block">
        <el-table :data="filteredNeeds" style="width: 100%">
          <el-table-column prop="title" label="需求标题" min-width="200">
            <template #default="{ row }">
              <div class="font-medium text-gray-800 hover:text-blue-600 cursor-pointer">{{ row.title }}</div>
              <div class="text-xs text-gray-400 mt-1">{{ row.createTime }} 发布</div>
            </template>
          </el-table-column>
          <el-table-column prop="budget" label="预算" width="140">
            <template #default="{ row }">
              <span class="text-orange-500 font-bold">{{ row.budget }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bids" label="投标数" width="100" align="center">
            <template #default="{ row }">
              <span class="text-blue-600 font-medium cursor-pointer hover:underline" @click="handleViewBids(row)">{{ row.bids }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <div class="flex gap-2">
                <el-button v-if="row.status === 'bidding'" type="primary" link size="small" @click="handleViewBids(row)">查看报价</el-button>
                <el-button v-if="row.status === 'progress'" type="success" link size="small">验收成果</el-button>
                <el-button v-if="row.status === 'completed'" type="info" link size="small">评价</el-button>
                <el-button v-if="row.status === 'auditing'" type="danger" link size="small">撤回</el-button>
                <el-button type="primary" link size="small">详情</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Mobile Card List -->
      <div class="md:hidden">
        <div v-for="row in filteredNeeds" :key="row.id" class="p-4 border-b border-gray-100 last:border-0">
          <div class="flex justify-between items-start mb-2">
            <div class="font-medium text-gray-800 line-clamp-2 flex-1 mr-2">{{ row.title }}</div>
            <el-tag size="small" :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </div>
          <div class="flex justify-between items-center text-sm mb-3">
             <span class="text-orange-500 font-bold">{{ row.budget }}</span>
             <span class="text-gray-400 text-xs">{{ row.createTime.split(' ')[0] }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded cursor-pointer" @click="handleViewBids(row)">
              {{ row.bids }} 个投标
            </div>
            <div class="flex gap-2">
              <el-button v-if="row.status === 'bidding'" type="primary" link size="small" @click="handleViewBids(row)">报价</el-button>
              <el-button v-if="row.status === 'progress'" type="success" link size="small">验收</el-button>
              <el-button v-if="row.status === 'auditing'" type="danger" link size="small">撤回</el-button>
              <el-button type="primary" link size="small">详情</el-button>
            </div>
          </div>
        </div>
        <div v-if="filteredNeeds.length === 0" class="p-8 text-center text-gray-400 text-sm">暂无数据</div>
      </div>
      
      <div class="p-4 flex justify-center md:justify-end">
        <el-pagination background small layout="prev, pager, next" :total="10" />
      </div>
    </div>

    <!-- Bids Dialog -->
    <el-dialog v-model="bidsDialogVisible" title="报价列表" width="600px">
      <div v-if="currentNeed" class="mb-4 p-3 bg-gray-50 rounded text-sm">
        <span class="font-bold text-gray-700">需求：</span>{{ currentNeed.title }}
        <span class="ml-4 font-bold text-gray-700">预算：</span><span class="text-orange-500">{{ currentNeed.budget }}</span>
      </div>
      <div class="space-y-3">
        <div v-for="bid in mockBids" :key="bid.id" class="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition flex justify-between items-center">
          <div>
            <div class="font-bold text-gray-800">{{ bid.provider }}</div>
            <div class="text-sm text-gray-500 mt-1">{{ bid.desc }}</div>
            <div class="flex gap-2 mt-2">
              <el-tag size="small" type="success">已认证</el-tag>
              <el-tag size="small" type="info">成交 {{ bid.deals }} 单</el-tag>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xl font-bold text-orange-600">{{ bid.price }}</div>
            <div class="mt-2 space-x-2">
              <el-button size="small" @click="contactProvider(bid)">联系</el-button>
              <el-button type="primary" size="small">选标</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Document, ChatDotRound, Wallet, Star, Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('all')
const bidsDialogVisible = ref(false)
const currentNeed = ref(null)

const needs = ref([
  {
    id: 1,
    title: '慕田峪长城春季宣传片航拍',
    budget: '¥12,000',
    createTime: '2026-01-12 09:30',
    bids: 5,
    status: 'bidding'
  },
  {
    id: 2,
    title: '海淀区建筑工地土方测量',
    budget: '¥8,000',
    createTime: '2026-01-10 14:20',
    bids: 3,
    status: 'progress'
  },
  {
    id: 3,
    title: '婚礼车队全程跟拍',
    budget: '¥3,500',
    createTime: '2026-01-13 10:00',
    bids: 0,
    status: 'auditing'
  },
  {
    id: 4,
    title: '奥林匹克公园全景VR制作',
    budget: '¥15,000',
    createTime: '2025-12-28 11:00',
    bids: 8,
    status: 'completed'
  }
])

const mockBids = ref([
  { id: 101, provider: '北京天空之眼航拍工作室', price: '¥11,500', desc: '拥有5年航拍经验，使用Inspire 3拍摄', deals: 128 },
  { id: 102, provider: '飞影科技传媒', price: '¥10,800', desc: '专业团队，提供后期剪辑服务', deals: 85 },
  { id: 103, provider: '独立飞手-张明', price: '¥9,500', desc: '个人飞手，响应快，性价比高', deals: 42 }
])

const filteredNeeds = computed(() => {
  if (activeTab.value === 'all') return needs.value
  return needs.value.filter(n => n.status === activeTab.value)
})

const getStatusType = (status) => {
  const map = {
    auditing: 'info',
    bidding: 'warning',
    progress: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return map[status]
}

const getStatusText = (status) => {
  const map = {
    auditing: '审核中',
    bidding: '竞标中',
    progress: '执行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status]
}

const handleViewBids = (row) => {
  currentNeed.value = row
  bidsDialogVisible.value = true
}

const contactProvider = (bid) => {
  // Simulate opening chat with this provider
  // Using ID 4 as a placeholder for "demo chat" since we only have mock messages
  router.push({ path: '/messages', query: { id: 4 } })
}
</script>
