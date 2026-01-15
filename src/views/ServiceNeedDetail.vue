<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Navbar v-if="!isEmbedded" />

    <main class="container mx-auto px-4 py-8 flex-grow" :class="{'max-w-none px-0 py-0': isEmbedded}">
      <div v-if="need" class="space-y-4 md:space-y-6 pb-20 md:pb-0">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div class="flex items-center gap-2 md:gap-3 min-w-0">
            <el-button text @click="router.push('/service-needs')" class="text-gray-600 !px-2 md:!px-4">
              <el-icon class="md:mr-1"><ArrowLeft /></el-icon>
              <span class="hidden md:inline">返回需求大厅</span>
            </el-button>
            <div class="h-5 w-px bg-gray-200 hidden md:block"></div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded font-medium">{{ need.category }}</span>
                <span v-if="need.urgent" class="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <el-icon><Warning /></el-icon>
                  紧急
                </span>
                <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-medium">{{ need.status }}</span>
              </div>
              <h1 class="text-lg md:text-2xl font-bold text-gray-800 truncate">{{ need.title }}</h1>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0 self-end md:self-auto px-2 md:px-0">
            <el-button plain size="small" md:size="default">
              <el-icon class="mr-1"><Star /></el-icon>
              收藏
            </el-button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-start">
          <div class="lg:col-span-2 space-y-4 md:space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 class="text-lg font-bold text-gray-800 mb-4">需求概述</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-3 md:p-4">
                  <div class="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <el-icon :size="20"><Money /></el-icon>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">预算</div>
                    <div class="font-bold text-gray-800">{{ need.budget }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <div class="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                    <el-icon :size="20"><Location /></el-icon>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">作业区域</div>
                    <div class="font-bold text-gray-800">{{ need.location }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <div class="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                    <el-icon :size="20"><Timer /></el-icon>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">截止日期</div>
                    <div class="font-bold text-gray-800">{{ need.deadline }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <div class="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center">
                    <el-icon :size="20"><Calendar /></el-icon>
                  </div>
                  <div>
                    <div class="text-xs text-gray-500">发布时间</div>
                    <div class="font-bold text-gray-800">{{ need.publishTime }}</div>
                  </div>
                </div>
              </div>
              <div class="mt-5 text-gray-600 text-sm leading-relaxed">
                {{ need.desc }}
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 class="text-lg font-bold text-gray-800 mb-4">任务要求</h2>
              <div class="space-y-3">
                <div v-for="(req, idx) in need.requirements" :key="idx" class="flex items-start gap-3 bg-gray-50 rounded-lg p-4">
                  <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                    {{ idx + 1 }}
                  </div>
                  <div class="text-sm text-gray-700 leading-relaxed">{{ req }}</div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 class="text-lg font-bold text-gray-800 mb-4">交付成果</h2>
              <div class="space-y-3">
                <div v-for="(d, idx) in need.deliverables" :key="idx" class="flex items-center justify-between gap-4 bg-gray-50 rounded-lg p-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                      <el-icon :size="18"><Document /></el-icon>
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-gray-800 text-sm truncate">{{ d.name }}</div>
                      <div class="text-xs text-gray-500 truncate">{{ d.desc }}</div>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500 flex-shrink-0">{{ d.format }}</span>
                </div>
              </div>
            </div>

          </div>

          <aside class="space-y-6 lg:sticky lg:top-24">
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-3">
                <div class="text-sm text-gray-500">预算</div>
                <span class="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded font-medium">进行中</span>
              </div>
              <div class="text-3xl font-bold text-orange-500 mb-4">{{ need.budget }}</div>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="text-xs text-gray-500 mb-1">截止日期</div>
                  <div class="font-bold text-gray-800">{{ need.deadline }}</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="text-xs text-gray-500 mb-1">发布来源</div>
                  <div class="font-bold text-gray-800">平台发布</div>
                </div>
              </div>
              <div class="mt-5 hidden md:flex flex-col gap-2">
                <el-button type="primary" size="large" @click="openProposalDialog">
                  <el-icon class="mr-2"><Tickets /></el-icon>
                  {{ isEnterprise ? '投递方案' : '立即接单' }}
                </el-button>
                <el-button plain size="large" @click="handleContact">
                  <el-icon class="mr-2"><ChatDotRound /></el-icon>
                  立即沟通
                </el-button>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 class="text-sm font-bold text-gray-800 mb-4">需求方信息</h3>
              <div class="space-y-3 text-sm">
                <div class="flex items-center justify-between gap-3">
                  <span class="text-gray-500">单位</span>
                  <span class="text-gray-800 font-medium truncate">{{ need.owner.org }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <span class="text-gray-500">联系人</span>
                  <span class="text-gray-800 font-medium truncate">{{ need.owner.name }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                  <span class="text-gray-500">电话</span>
                  <span class="text-gray-800 font-medium truncate">{{ need.owner.phone }}</span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 class="text-sm font-bold text-gray-800 mb-4">附件材料</h3>
              <div v-if="need.attachments.length" class="space-y-2">
                <div v-for="att in need.attachments" :key="att.name" class="flex items-center justify-between gap-3 bg-gray-50 rounded-lg px-3 py-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <el-icon class="text-gray-500"><Upload /></el-icon>
                    <span class="text-sm text-gray-700 truncate">{{ att.name }}</span>
                  </div>
                  <span class="text-xs text-gray-400 flex-shrink-0">{{ att.size }}</span>
                </div>
              </div>
              <el-empty v-else description="暂无附件" :image-size="70" />
            </div>
          </aside>
        </div>

        <!-- Mobile Bottom Action Bar -->
        <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <el-button plain class="flex-1" size="large" @click="handleContact">
              <el-icon class="mr-1"><ChatDotRound /></el-icon> 沟通
            </el-button>
            <el-button type="primary" class="flex-1" size="large" @click="openProposalDialog">
              <el-icon class="mr-1"><Tickets /></el-icon> {{ isEnterprise ? '投递方案' : '立即接单' }}
            </el-button>
        </div>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-10">
        <el-empty description="未找到该需求" />
        <div class="flex justify-center mt-4">
          <el-button type="primary" @click="handleBack">返回需求大厅</el-button>
        </div>
      </div>
    </main>

    <!-- 方案投递弹窗 -->
    <el-dialog
      v-model="proposalDialogVisible"
      :title="isProfessionalMode ? '投递专业作业方案' : '快速接单报价'"
      width="90%"
      style="max-width: 600px;"
      class="rounded-xl"
    >
      <div class="mb-4 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
        <span class="text-xs text-gray-500">根据您的身份，已自动选择{{ isProfessionalMode ? '专业' : '快捷' }}投递模式。</span>
      </div>

      <el-form :model="proposalForm" label-width="100px" class="py-2">
        <!-- 公共字段 -->
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="报价金额" required>
            <el-input v-model="proposalForm.price" placeholder="请输入总价">
              <template #prefix>¥</template>
            </el-input>
          </el-form-item>
          <el-form-item label="预计工期" required>
            <el-input v-model="proposalForm.duration" placeholder="例如：3天" />
          </el-form-item>
        </div>

        <!-- B端专属：复杂配置 -->
        <template v-if="isProfessionalMode">
          <el-form-item label="执行飞手" required>
            <el-select v-model="proposalForm.pilots" multiple placeholder="请选择持证飞手">
              <el-option
                v-for="pilot in state.myPilots"
                :key="pilot.id"
                :label="pilot.name + ' (' + pilot.cert + ')'"
                :value="pilot.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="作业设备" required>
            <el-select v-model="proposalForm.drones" multiple placeholder="请选择作业设备">
              <el-option
                v-for="drone in state.myDrones"
                :key="drone.id"
                :label="drone.model + ' (' + drone.payload + ')'"
                :value="drone.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="方案文档">
            <el-upload
              action="#"
              :auto-upload="false"
              :limit="1"
            >
              <el-button type="primary" link>点击上传详细作业方案 (PDF/Word)</el-button>
            </el-upload>
          </el-form-item>
        </template>

        <!-- C端专属：简易配置 -->
        <template v-else>
          <el-form-item label="可用设备">
            <el-input v-model="proposalForm.deviceText" placeholder="例如：DJI Mavic 3 Cine" />
          </el-form-item>
        </template>

        <el-form-item label="方案说明" required>
          <el-input
            v-model="proposalForm.description"
            type="textarea"
            :rows="4"
            :placeholder="isProfessionalMode ? '请简述作业思路、保障措施及交付标准...' : '请简述您的接单优势、空闲时间等...'"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="proposalDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitProposal">
            {{ isProfessionalMode ? '提交正式方案' : '立即接单' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UserFilled, ArrowLeft, Warning, Location, Money, Timer, Calendar, Document, Upload, Phone, Star, ChatDotRound, Tickets } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Navbar from '../components/Navbar.vue'
import { useMockData } from '../composables/useMockData'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { state, addMessage, addProposal } = useMockData()
const { isAuthenticated, user } = useAuth()

// Determine if running in embedded mode (inside AdminLayout)
const isEmbedded = computed(() => route.path.startsWith('/admin'))

const proposalDialogVisible = ref(false)
const proposalForm = reactive({
  price: '',
  duration: '',
  description: '',
  pilots: [],
  drones: [],
  deviceText: ''
})

// 判断是否为企业用户 (B端) - for main page display
const isEnterprise = computed(() => {
  return user.value?.role === 'b-user'
})

const need = computed(() => {
  const id = Number(route.params.id)
  return state.value.needs.find((n) => n.id === id) || null
})

const handleBack = () => {
  if (isEmbedded.value) {
    router.push('/admin/market')
  } else {
    router.push('/service-needs')
  }
}

const handleContact = () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  
  // 仅发起聊天，不提交方案
  if (!need.value) return

  let chat = state.value.messages.find(m => m.needId === need.value.id)
  
  if (!chat) {
     // Create Task First (Communicating)
     const newTaskId = Date.now()
     const task = {
         id: newTaskId,
         title: need.value.title,
         requester: need.value.requester || need.value.owner?.org || '需求方',
         price: '待报价',
         status: '沟通中',
         deadline: need.value.deadline,
         needId: need.value.id
     }
     state.value.tasks.unshift(task) 

     // Create new chat
     const newId = Date.now() + 1
     const chatTitle = `关于“${need.value.title.length > 10 ? need.value.title.substring(0, 10) + '...' : need.value.title}”的沟通`
     
     addMessage({
       id: newId,
       taskId: newTaskId, 
       sender: need.value.requester || need.value.owner?.org || '需求方',
       title: chatTitle,
       needId: need.value.id,
       content: '您好，我对这个需求很感兴趣...',
       type: 'chat',
       history: [
         { role: 'me', text: '您好，我对这个需求很感兴趣，希望能进一步沟通。', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
       ]
     })
     chat = { id: newId }
     ElMessage.success('已发起沟通，任务已加入“沟通中”列表')
   }
   
   router.push({ path: '/admin/messages', query: { id: chat.id } })
}

const isProfessionalMode = ref(true)

// Initialize mode based on user level when dialog opens
const openProposalDialog = () => {
  if (!isAuthenticated.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  if (!user.value) return

  const u = user.value

  const isCertifiedCUser = u.role === 'c-user' && u.certificationStatus === 'approved'
  const isBProvider = u.role === 'b-user'

  if (!isCertifiedCUser && !isBProvider) {
    ElMessage.warning('当前账号暂不支持接单，请完成认证或升级为服务商')
    return
  }

  proposalForm.price = ''
  proposalForm.duration = ''
  proposalForm.description = ''
  proposalForm.pilots = []
  proposalForm.drones = []
  proposalForm.deviceText = ''
  
  isProfessionalMode.value = isBProvider
  
  proposalDialogVisible.value = true
}

const submitProposal = () => {
  if (!proposalForm.price || !proposalForm.duration || !proposalForm.description) {
    ElMessage.warning('请填写完整的方案信息')
    return
  }

  // B-end validation
  if (isProfessionalMode.value && (!proposalForm.pilots || !proposalForm.drones)) {
    ElMessage.warning('请配置飞手和设备信息')
    return
  }

  const proposalData = {
    price: proposalForm.price,
    duration: proposalForm.duration,
    description: proposalForm.description,
    pilots: isProfessionalMode.value ? proposalForm.pilots : '',
    drones: isProfessionalMode.value ? proposalForm.drones : '',
    deviceText: !isProfessionalMode.value ? proposalForm.deviceText : '',
    isEnterprise: isProfessionalMode.value
  }

  const chatId = addProposal(need.value, proposalData)
  
  proposalDialogVisible.value = false
  ElMessage.success('方案已投递！')
  router.push({ path: '/admin/messages', query: { id: chatId } })
}

</script>
