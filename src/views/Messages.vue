<template>
  <div class="flex flex-col bg-gray-50 h-full" :class="{'min-h-screen': !isEmbedded}">
    <Navbar v-if="!isEmbedded" />

    <main class="flex-grow flex flex-col" :class="isEmbedded ? 'h-full' : 'container mx-auto px-4 py-8 max-w-5xl'">
      <!-- Page Header -->
      <div class="mb-4 md:mb-6 px-4 pt-4 md:pt-0" v-if="!isEmbedded">
        <h1 class="text-xl md:text-2xl font-bold text-gray-800">消息中心</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden flex-col md:flex-row" :class="isEmbedded ? 'h-full rounded-none border-0 shadow-none' : 'h-[calc(100vh-140px)] md:min-h-[600px]'">
        <!-- Message List Sidebar -->
        <div 
          class="w-full md:w-1/3 border-r border-gray-100 flex flex-col bg-white"
          :class="{'hidden md:flex': isMobile && activeMsgId}"
        >
          <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 md:bg-white">
            <h2 class="font-bold text-gray-800">消息列表</h2>
            <el-button link type="primary" size="small">全部已读</el-button>
          </div>
          <div class="overflow-y-auto flex-1">
            <div v-for="msg in messages" :key="msg.id" 
                 class="p-4 hover:bg-gray-50 cursor-pointer transition border-b border-gray-50 relative"
                 :class="{'bg-blue-50/50': activeMsgId === msg.id}"
                 @click="handleMsgClick(msg.id)">
              <div class="flex justify-between items-start mb-1">
                <span class="font-bold text-gray-800 text-sm">{{ msg.sender }}</span>
                <span class="text-xs text-gray-400">{{ msg.time }}</span>
              </div>
              <p class="text-sm text-gray-600 line-clamp-1 pr-4">{{ msg.content }}</p>
              <div v-if="msg.unread" class="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></div>
            </div>
          </div>
        </div>

        <!-- Message Detail -->
        <div 
          class="flex-1 flex flex-col bg-white w-full md:w-auto"
          :class="{'hidden md:flex': isMobile && !activeMsgId}"
        >
          <template v-if="activeMsg">
            <div class="p-4 md:p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div class="flex items-center gap-2 mb-2 md:hidden">
                <el-button icon="ArrowLeft" link @click="activeMsgId = null">返回列表</el-button>
              </div>
              <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0 mr-2">
                  <h2 class="font-bold text-lg md:text-xl text-gray-800 mb-1 truncate">{{ activeMsg.title }}</h2>
                  <div class="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                    <span>{{ activeMsg.sender }}</span>
                    <span>{{ activeMsg.time }}</span>
                  </div>
                </div>
                <el-tag size="small" :type="getMsgTypeTag(activeMsg.type)" class="shrink-0">{{ getMsgTypeText(activeMsg.type) }}</el-tag>
              </div>
            </div>
            
            <!-- Chat View -->
            <div v-if="activeMsg.type === 'chat'" class="flex-1 flex flex-col bg-gray-50 overflow-hidden relative">
              <div class="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
                <div v-for="(chat, index) in activeMsg.history" :key="index" class="flex gap-2 md:gap-3" :class="chat.role === 'me' ? 'flex-row-reverse' : ''">
                  <el-avatar :size="32" :src="chat.role === 'me' ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" class="flex-shrink-0" />
                  <div class="flex flex-col max-w-[80%] md:max-w-[70%]" :class="chat.role === 'me' ? 'items-end' : 'items-start'">
                    
                    <!-- Text Message -->
                    <div v-if="!chat.type || chat.type === 'text'" class="p-2 md:p-3 rounded-lg shadow-sm text-sm break-words" :class="chat.role === 'me' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'">
                      {{ chat.text }}
                    </div>

                    <!-- 方案卡片 -->
                    <div v-else-if="chat.type === 'plan_proposal'" class="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden w-full max-w-xs text-left">
                      <div class="bg-blue-50 px-3 py-2 border-b border-blue-100 flex justify-between items-center">
                        <span class="font-bold text-blue-800 text-sm">{{ chat.isEnterprise ? '专业作业方案' : '接单报价' }}</span>
                        <el-tag size="small" :type="chat.status === 'accepted' ? 'success' : 'warning'">{{ chat.status === 'accepted' ? '已接受' : '待确认' }}</el-tag>
                      </div>
                      <div class="p-3 space-y-2">
                        <div class="flex justify-between items-center">
                          <span class="text-xs text-gray-500">报价金额</span>
                          <span class="text-lg font-bold text-red-500">¥{{ chat.price }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                          <span class="text-xs text-gray-500">预计工期</span>
                          <span class="text-sm text-gray-800">{{ chat.duration }}</span>
                        </div>
                        
                        <!-- B端专属展示 -->
                        <template v-if="chat.isEnterprise">
                           <div class="bg-gray-50 rounded p-2 text-xs text-gray-600">
                              <div class="mb-1"><span class="font-bold">飞手：</span>{{ chat.pilots || '未指定' }}</div>
                              <div><span class="font-bold">设备：</span>{{ chat.drones || '未指定' }}</div>
                           </div>
                        </template>
                        <!-- C端专属展示 -->
                        <template v-else-if="chat.deviceText">
                            <div class="bg-gray-50 rounded p-2 text-xs text-gray-600">
                              <div><span class="font-bold">设备：</span>{{ chat.deviceText }}</div>
                           </div>
                        </template>

                        <div class="text-xs text-gray-600 bg-gray-50 p-2 rounded line-clamp-3">
                          {{ chat.description }}
                        </div>
                        
                        <div v-if="isRequester && chat.status === 'pending'" class="pt-2">
                          <el-button type="primary" size="small" class="w-full" @click="handleAcceptPlan(activeMsg, index)">接受方案并支付</el-button>
                        </div>
                      </div>
                    </div>

                    <span class="text-xs text-gray-400 mt-1">{{ chat.time }}</span>
                  </div>
                </div>
              </div>
              <!-- Input Area -->
              <div class="p-3 md:p-4 bg-white border-t border-gray-100 flex gap-2 items-center safe-area-bottom">
                <el-tooltip content="发起报价方案" placement="top" v-if="isProvider">
                  <el-button type="success" :icon="DocumentAdd" circle class="shrink-0" @click="showPlanDialog" />
                </el-tooltip>
                <el-input v-model="replyText" placeholder="输入消息..." @keyup.enter="sendReply" class="flex-1" />
                <el-button type="primary" @click="sendReply" class="shrink-0">发送</el-button>
              </div>
            </div>

            <!-- Normal View -->
            <div v-else class="p-4 md:p-8 flex-1 overflow-y-auto">
              <div class="prose max-w-none text-gray-700 text-sm md:text-base">
                {{ activeMsg.content }}
              </div>
              
              <div v-if="activeMsg.action" class="mt-6 md:mt-8">
                <el-button type="primary" class="w-full md:w-auto" @click="handleAction(activeMsg.action)">{{ activeMsg.actionText }}</el-button>
              </div>
            </div>
          </template>
          <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400 p-4">
            <el-icon :size="64" class="mb-4 text-gray-200"><Message /></el-icon>
            <p>选择一条消息查看详情</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Plan Dialog -->
    <el-dialog v-model="planDialogVisible" title="发起报价方案" :width="isMobile ? '90%' : '500px'" append-to-body class="rounded-xl">
      <el-form :model="planForm" label-width="80px">
        <el-form-item label="报价金额">
           <el-input v-model="planForm.price" placeholder="例如：¥5,000" />
        </el-form-item>
        <el-form-item label="预计工期">
           <el-input v-model="planForm.duration" placeholder="例如：3天" />
        </el-form-item>
        <el-form-item label="方案说明">
           <el-input v-model="planForm.description" type="textarea" rows="3" placeholder="请简要描述服务内容和交付标准" />
        </el-form-item>
      </el-form>
      <template #footer>
         <el-button @click="planDialogVisible = false">取消</el-button>
         <el-button type="primary" @click="submitPlan">发送方案</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Message, DocumentChecked, Select, DocumentAdd, ArrowLeft } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { useAuth } from '../composables/useAuth'
import { useMockData } from '../composables/useMockData'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const { activeIdentity, user } = useAuth()
const { state, addTask, updateNeedStatus, acceptPlan } = useMockData()

// Responsive check
const windowWidth = ref(window.innerWidth)
const updateWidth = () => windowWidth.value = window.innerWidth
onMounted(() => window.addEventListener('resize', updateWidth))
onUnmounted(() => window.removeEventListener('resize', updateWidth))
const isMobile = computed(() => windowWidth.value < 768)

// Determine if running in embedded mode (inside AdminLayout)
const isEmbedded = computed(() => route.path.startsWith('/admin'))

const isProvider = computed(() => activeIdentity.value === 'provider')
const isRequester = computed(() => activeIdentity.value.startsWith('requester'))

const activeMsgId = ref(null) // Default to null, set to 4 or query id in onMounted
const replyText = ref('')
const planDialogVisible = ref(false)
const planForm = ref({ price: '', duration: '', description: '' })

onMounted(() => {
  if (route.query.id) {
    activeMsgId.value = Number(route.query.id)
  } else if (!isMobile.value) {
    // Desktop: Select first message by default if exists
    activeMsgId.value = 4 // Default mock ID or logic to select first
  }
})

const handleMsgClick = (id) => {
  activeMsgId.value = id
}

// Use shared state messages
const messages = computed(() => state.value.messages)

const activeMsg = computed(() => messages.value.find(m => m.id === activeMsgId.value))

const getMsgTypeTag = (type) => {
  switch (type) {
    case 'system': return 'info'
    case 'transaction': return 'warning'
    case 'chat': return 'success'
    default: return 'info'
  }
}

const getMsgTypeText = (type) => {
  switch (type) {
    case 'system': return '系统通知'
    case 'transaction': return '交易提醒'
    case 'chat': return '沟通消息'
    default: return '通知'
  }
}

const handleAction = (path) => {
  if (path) router.push(path)
}

const sendReply = () => {
  if (!replyText.value.trim() || !activeMsg.value) return
  
  if (activeMsg.value.type === 'chat') {
    activeMsg.value.history.push({
      role: 'me',
      text: replyText.value,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    })
    // Update preview content
    activeMsg.value.content = replyText.value
    replyText.value = ''
  }
}

const showPlanDialog = () => {
  planForm.value = { price: '', duration: '', description: '' }
  planDialogVisible.value = true
}

const submitPlan = () => {
  if (!planForm.value.price || !planForm.value.duration) {
    ElMessage.warning('请填写完整的报价信息')
    return
  }

  activeMsg.value.history.push({
    role: 'me',
    type: 'plan_proposal',
    price: planForm.value.price,
    duration: planForm.value.duration,
    description: planForm.value.description,
    status: 'pending',
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  })
  
  activeMsg.value.content = `[报价方案] ${planForm.value.price}`
  planDialogVisible.value = false
  ElMessage.success('方案已发送')
}

const handleAcceptPlan = (msg, index) => {
  acceptPlan(msg.id, index)
  ElMessage.success('已接受方案，任务状态更新为“已通过”！')
}

const getDateAfterDays = (days) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}
</script>
