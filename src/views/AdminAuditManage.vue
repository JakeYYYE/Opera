<template>
  <div class="space-y-4 md:space-y-6">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900">审核管理</h1>
        <p class="text-gray-500 text-xs md:text-sm mt-1">审核内容并确保合规性，管理敏感词库</p>
      </div>
      <div class="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
        <el-input
          v-model="searchQuery"
          placeholder="搜索内容..."
          prefix-icon="Search"
          class="w-full md:w-64"
        />
        <div class="flex items-center gap-2 self-end md:self-auto">
          <el-badge :value="3" class="item">
             <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          </el-badge>
          <span class="text-sm text-gray-700">李主编</span>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px]">
      <el-tabs v-model="activeTab" class="px-4 md:px-6 pt-4">
        <el-tab-pane label="审核工作台" name="workbench">
          <div class="py-4">
            <!-- Filter/Tabs within Workbench -->
            <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
              <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
                <el-radio-group v-model="auditStatus" size="small" class="flex-nowrap">
                  <el-radio-button label="all">全部</el-radio-button>
                  <el-radio-button label="pending">待审核</el-radio-button>
                  <el-radio-button label="passed">已通过</el-radio-button>
                  <el-radio-button label="rejected">已驳回</el-radio-button>
                </el-radio-group>
              </div>
              <el-select v-model="sortBy" placeholder="最新提交" size="small" class="w-full md:w-32">
                <el-option label="最新提交" value="newest" />
                <el-option label="最早提交" value="oldest" />
              </el-select>
            </div>

            <!-- Audit List -->
            <div class="space-y-4">
              <div v-for="item in filteredList" :key="item.id" class="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div class="flex gap-3 items-start">
                    <el-tag :type="getTypeTag(item.type)" effect="light" size="small" class="mt-0.5 shrink-0">{{ item.typeLabel }}</el-tag>
                    <h3 class="font-medium text-gray-900 leading-snug">{{ item.title }}</h3>
                  </div>
                  <div class="text-left md:text-right text-xs text-gray-500 pl-[52px] md:pl-0">
                    <div>提交于 {{ item.submitTime }}</div>
                    <div class="mt-1">提交人：{{ item.submitter }}</div>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm mt-3 mb-4 line-clamp-2 pl-0 md:pl-[52px]">
                  {{ item.summary }}
                </p>

                <div v-if="item.type === 'banner'" class="mb-4 pl-0 md:pl-[52px]">
                   <img :src="item.image" class="h-32 w-full md:w-auto rounded object-cover border border-gray-200" />
                </div>

                <div class="flex justify-end gap-3 border-t border-gray-50 pt-3">
                   <el-button v-if="item.status === 'pending'" size="small" @click="handleReject(item)">驳回</el-button>
                   <el-button v-if="item.status === 'pending'" type="primary" size="small" @click="handlePass(item)">通过</el-button>
                   <span v-else class="text-sm px-3 py-1 rounded bg-gray-50 text-gray-500">
                     {{ item.status === 'passed' ? '已通过' : '已驳回' }}
                   </span>
                </div>
              </div>
            </div>
            
            <!-- Pagination -->
             <div class="flex justify-center md:justify-end mt-6">
               <el-pagination background layout="prev, pager, next" :total="filteredList.length" small />
             </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="敏感词库" name="sensitive">
          <div class="py-8 text-center text-gray-500">
            <el-empty description="敏感词库功能开发中..." />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('workbench')
const searchQuery = ref('')
const auditStatus = ref('all')
const sortBy = ref('newest')

const auditList = ref([
  {
    id: 1,
    type: 'article',
    typeLabel: '文章',
    title: '安徽省合肥市无人机物流配送服务项目招标公告',
    summary: '本项目拟采购无人机物流配送服务，服务范围包括合肥市主城区及周边地区，主要服务内容包括：城市中心区域医疗物资紧急配送、偏远地区生活物资配送、特殊情况下应急物资运输...',
    submitTime: '2023-08-18 14:30',
    submitter: '张编辑',
    status: 'pending'
  },
  {
    id: 2,
    type: 'article',
    typeLabel: '文章',
    title: '江苏省南京市无人机物流产业园建设项目招标公告',
    summary: '项目建设地点位于南京市江宁区，规划用地面积约50亩，总建筑面积约30000平方米。主要建设内容包括：无人机停机坪、仓储中心、控制中心、维修中心及配套设施...',
    submitTime: '2023-08-18 11:20',
    submitter: '张编辑',
    status: 'pending'
  },
  {
    id: 3,
    type: 'article',
    typeLabel: '文章',
    title: '2023年无人机物流设备采购项目招标公告',
    summary: '本次采购无人机物流设备包括：多旋翼无人机20架、固定翼无人机10架、地面控制站15套、电池及充电器50套、维修工具5套。项目预算金额为人民币1200万元...',
    submitTime: '2023-08-17 16:45',
    submitter: '张编辑',
    status: 'pending'
  },
  {
    id: 4,
    type: 'banner',
    typeLabel: 'Banner',
    title: '首页轮播Banner图（8月）',
    summary: '无人机物流解决方案全新上线',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2070&auto=format&fit=crop',
    submitTime: '2023-08-17 10:15',
    submitter: '王运营',
    status: 'pending'
  }
])

const getTypeTag = (type) => {
  return type === 'banner' ? 'warning' : 'primary'
}

const filteredList = computed(() => {
  let list = auditList.value
  if (auditStatus.value !== 'all') {
    list = list.filter(item => item.status === auditStatus.value)
  }
  if (searchQuery.value) {
    list = list.filter(item => item.title.includes(searchQuery.value) || item.summary.includes(searchQuery.value))
  }
  return list
})

const handlePass = (item) => {
  ElMessageBox.confirm('确定通过该内容的审核吗？', '提示', {
    confirmButtonText: '通过',
    cancelButtonText: '取消',
    type: 'success'
  }).then(() => {
    item.status = 'passed'
    ElMessage.success('审核通过')
  })
}

const handleReject = (item) => {
  ElMessageBox.prompt('请输入驳回原因', '驳回', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(({ value }) => {
    item.status = 'rejected'
    ElMessage.info('已驳回：' + value)
  })
}
</script>