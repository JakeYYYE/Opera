<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-xl font-bold text-gray-800">服务商工作台</h2>
        <p class="text-sm text-gray-500 mt-1">查看任务进度，管理服务产品，提升接单效率</p>
      </div>
      <div class="flex gap-2">
        <el-button type="success" plain @click="goToMarket">需求大厅</el-button>
        <el-button type="primary" icon="Plus" @click="goToProfile">管理服务能力</el-button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <el-icon :size="20"><Briefcase /></el-icon>
        </div>
        <div>
          <div class="text-xs md:text-sm text-gray-500">执行中任务</div>
          <div class="text-lg md:text-2xl font-bold text-gray-800">2</div>
        </div>
      </div>
      <div class="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <el-icon :size="20"><Money /></el-icon>
        </div>
        <div>
          <div class="text-xs md:text-sm text-gray-500">本月收益</div>
          <div class="text-lg md:text-2xl font-bold text-gray-800">¥28,500</div>
        </div>
      </div>
      <div class="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <el-icon :size="20"><Timer /></el-icon>
        </div>
        <div>
          <div class="text-xs md:text-sm text-gray-500">累计飞行时长</div>
          <div class="text-lg md:text-2xl font-bold text-gray-800">1,240h</div>
        </div>
      </div>
      <div class="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <el-icon :size="20"><Trophy /></el-icon>
        </div>
        <div>
          <div class="text-xs md:text-sm text-gray-500">服务评分</div>
          <div class="text-lg md:text-2xl font-bold text-gray-800">4.9</div>
        </div>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <h3 class="font-bold text-gray-800 flex-shrink-0">任务管理</h3>
        <el-tabs v-model="activeTab" class="w-full dashboard-tabs">
          <el-tab-pane label="全部" name="all" />
          <el-tab-pane label="竞标中" name="bidding" />
          <el-tab-pane label="执行中" name="executing" />
          <el-tab-pane label="验收中" name="reviewing" />
          <el-tab-pane label="已完成" name="completed" />
        </el-tabs>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block">
        <el-table :data="filteredTasks" style="width: 100%">
          <el-table-column prop="title" label="任务名称" min-width="200">
            <template #default="{ row }">
              <div class="font-medium text-gray-800 hover:text-blue-600 cursor-pointer">{{ row.title }}</div>
              <div class="text-xs text-gray-400 mt-1">需求方: {{ row.requester }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="成交价/报价" width="140">
            <template #default="{ row }">
              <span class="text-green-600 font-bold">{{ row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deadline" label="截止日期" width="140" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="{ row }">
              <div class="flex gap-2">
                <el-button type="info" link size="small" icon="Message" @click="contactRequester(row)">联系</el-button>
                <el-button v-if="row.status === 'executing'" type="primary" link size="small">提交成果</el-button>
                <el-button v-if="row.status === 'executing'" type="warning" link size="small">申请延期</el-button>
                <el-button v-if="row.status === 'bidding'" type="danger" link size="small">取消投标</el-button>
                <el-button v-if="row.status === 'completed'" type="info" link size="small">查看评价</el-button>
                <el-button type="primary" link size="small">详情</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Mobile Card List -->
      <div class="md:hidden">
        <div v-for="row in filteredTasks" :key="row.id" class="p-4 border-b border-gray-100 last:border-0">
          <div class="flex justify-between items-start mb-2">
            <div class="font-medium text-gray-800 line-clamp-2 flex-1 mr-2">{{ row.title }}</div>
            <el-tag size="small" :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </div>
          <div class="flex justify-between items-center text-sm mb-3">
             <div class="text-xs text-gray-500">需求方: {{ row.requester }}</div>
             <span class="text-green-600 font-bold">{{ row.price }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-400">截止: {{ row.deadline }}</div>
            <div class="flex gap-2">
              <el-button type="info" link size="small" icon="Message" @click="contactRequester(row)">联系</el-button>
              <el-button v-if="row.status === 'executing'" type="primary" link size="small">提交</el-button>
              <el-button v-if="row.status === 'bidding'" type="danger" link size="small">取消</el-button>
              <el-button type="primary" link size="small">详情</el-button>
            </div>
          </div>
        </div>
        <div v-if="filteredTasks.length === 0" class="p-8 text-center text-gray-400 text-sm">暂无数据</div>
      </div>
      
      <div class="p-4 flex justify-center md:justify-end">
        <el-pagination background small layout="prev, pager, next" :total="8" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Briefcase, Money, Timer, Trophy, Plus, Message } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('all')

const tasks = ref([
  {
    id: 1,
    title: '西山森林防火常态化巡查',
    requester: '海淀区应急管理局',
    price: '¥280,000',
    deadline: '2026-02-15',
    status: 'executing'
  },
  {
    id: 2,
    title: '某楼盘开盘仪式无人机表演',
    requester: '万科地产',
    price: '¥50,000',
    deadline: '2026-01-20',
    status: 'bidding'
  },
  {
    id: 3,
    title: '京津高速路况巡查（第3期）',
    requester: '交通路政',
    price: '¥15,000',
    deadline: '2026-01-18',
    status: 'reviewing'
  },
  {
    id: 4,
    title: '果园农药喷洒服务',
    requester: '平谷果农合作社',
    price: '¥4,500',
    deadline: '2025-12-20',
    status: 'completed'
  }
])

const filteredTasks = computed(() => {
  if (activeTab.value === 'all') return tasks.value
  return tasks.value.filter(t => t.status === activeTab.value)
})

const getStatusType = (status) => {
  const map = {
    bidding: 'warning',
    executing: 'primary',
    reviewing: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return map[status]
}

const getStatusText = (status) => {
  const map = {
    bidding: '竞标中',
    executing: '执行中',
    reviewing: '验收中',
    completed: '已完成',
    failed: '竞标失败'
  }
  return map[status]
}

const contactRequester = (row) => {
  // Simulate opening chat with this requester
  // Using ID 5 as a placeholder for another demo chat
  router.push({ path: '/messages', query: { id: 5 } })
}

const goToMarket = () => {
  router.push('/service-needs')
}

const goToProfile = () => {
  router.push('/admin/profile')
}
</script>
