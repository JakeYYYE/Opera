<template>
  <div class="max-w-4xl">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-xl font-bold text-gray-800">账号设置</h2>
        <p class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <div v-if="identityTag" :class="identityTagClass">
        <span class="text-xs font-medium">{{ identityTag }}</span>
      </div>
    </div>
    
    <el-card shadow="never">
      <el-form label-position="top">
        <el-form-item label="头像">
          <div class="flex items-center gap-4">
             <el-avatar :size="64" :src="avatarUrl" />
             <el-button size="small">更换头像</el-button>
          </div>
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="昵称">
              <el-input v-model="form.nickname" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="手机号">
              <el-input v-model="form.phone" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="个人简介">
          <el-input v-model="form.bio" type="textarea" rows="3" />
        </el-form-item>

        <template v-if="isBProvider">
          <el-divider>公司信息</el-divider>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="公司名称">
                <el-input v-model="form.companyName" placeholder="如：某某航拍科技有限公司" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="公司类型">
                <el-select v-model="form.companyType" placeholder="选择主营类型">
                  <el-option label="航拍服务商" value="photography" />
                  <el-option label="保险机构" value="insurance" />
                  <el-option label="综合解决方案" value="general" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="联系人">
                <el-input v-model="form.contactPerson" placeholder="联系人姓名" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="联系电话">
                <el-input v-model="form.companyPhone" placeholder="手机号或座机" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="公司简介">
            <el-input v-model="form.companyDesc" type="textarea" rows="3" placeholder="简要介绍业务与优势" />
          </el-form-item>

          <el-divider>服务能力</el-divider>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <el-card
              v-for="(service, index) in form.services"
              :key="index"
              class="border border-blue-100"
              shadow="never"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-800">服务 {{ index + 1 }}</span>
                <el-button type="danger" text size="small" @click="removeService(index)">删除</el-button>
              </div>
              <el-form-item label="服务名称">
                <el-input v-model="service.name" placeholder="如：低空物流配送方案" />
              </el-form-item>
              <el-form-item label="价格">
                <el-input v-model="service.price" placeholder="如：¥5000起 / ¥8000/天" />
              </el-form-item>
              <el-form-item label="服务描述">
                <el-input v-model="service.desc" type="textarea" rows="2" placeholder="简要说明服务内容和适用场景" />
              </el-form-item>
            </el-card>
            <div
              class="border border-dashed border-blue-200 rounded-xl flex items-center justify-center text-blue-500 cursor-pointer hover:bg-blue-50 transition"
              @click="addService"
            >
              <div class="text-center px-4 py-8">
                <div class="text-sm font-medium mb-1">新增服务卡片</div>
                <div class="text-xs text-blue-400">为需求方展示更多业务能力</div>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <el-divider>飞手认证状态</el-divider>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <el-card class="border border-orange-100" shadow="never">
              <div class="text-xs text-gray-500 mb-1">当前等级</div>
              <div class="text-base font-semibold text-gray-800 mb-1">{{ providerLevelText }}</div>
              <div class="text-[11px]" :class="certStatusTagClass">
                {{ certStatusText }}
              </div>
            </el-card>
            <el-card class="border border-green-100" shadow="never">
              <div class="text-xs text-gray-500 mb-1">飞手资质</div>
              <div class="space-y-1 text-xs">
                <div :class="user && user.idVerified ? 'text-green-600' : 'text-gray-400'">
                  {{ user && user.idVerified ? '已完成实名认证' : '未实名' }}
                </div>
                <div :class="user && user.pilotLicense ? 'text-green-600' : 'text-red-500'">
                  {{ user && user.pilotLicense ? '已上传飞手证书' : '暂未上传飞手证书' }}
                </div>
                <div :class="user && user.insuranceActive ? 'text-green-600' : 'text-red-500'">
                  {{ user && user.insuranceActive ? '已配置飞手保险' : '尚未配置飞手保险' }}
                </div>
              </div>
            </el-card>
            <el-card class="border border-blue-100" shadow="never">
              <div class="text-xs text-gray-500 mb-1">累计表现</div>
              <div class="space-y-1 text-xs text-gray-700">
                <div>飞行时长：<span class="font-semibold text-gray-900">{{ user && user.flightHours || 0 }}</span> 小时</div>
                <div>接单次数：<span class="font-semibold text-gray-900">{{ user && user.ordersCount || 0 }}</span> 次</div>
                <div>信用分：<span class="font-semibold text-gray-900">{{ user && user.creditScore || 0 }}</span></div>
              </div>
            </el-card>
          </div>

          <div class="mb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="text-sm font-medium text-gray-800">身份与升级</div>
              <span class="text-[11px] text-gray-400" v-if="certStatusRaw === 'none'">完成飞手认证后可解锁更多任务和权益</span>
              <span class="text-[11px] text-gray-400" v-else-if="certStatusRaw === 'pending'">认证审核通过后，将提升为认证飞手等级</span>
              <span class="text-[11px] text-gray-400" v-else-if="certStatusRaw === 'approved'">已认证，可继续完善资料和申请B端升级</span>
              <span class="text-[11px] text-gray-400" v-else-if="certStatusRaw === 'rejected'">认证被驳回，可重新提交补充资料</span>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
              <div>
                <div class="text-sm font-medium text-orange-700">认证飞手</div>
                <div class="text-xs text-orange-500">提升信用，解锁更多接单机会</div>
              </div>
              <el-button size="small" type="warning" plain @click="goToIdentity('provider')">
                {{ certStatusRaw === 'approved' ? '已认证' : '去升级' }}
              </el-button>
            </div>
            <div class="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <div>
                <div class="text-sm font-medium text-blue-700">升级为B端服务商</div>
                <div class="text-xs text-blue-500">
                  <span v-if="upgradeStatus === 'pending'">申请已提交，等待管理端审核</span>
                  <span v-else-if="upgradeStatus === 'approved'">已通过审核，可使用服务方身份接入B端工作台</span>
                  <span v-else-if="upgradeStatus === 'rejected'">上次申请已被驳回，可重新提交完善资料</span>
                  <span v-else>成为企业服务方，拥有专属工作台</span>
                </div>
              </div>
              <el-button
                size="small"
                type="primary"
                plain
                @click="openUpgradeDialog"
                :disabled="upgradeStatus === 'pending'"
              >
                <span v-if="upgradeStatus === 'pending'">审核中</span>
                <span v-else-if="upgradeStatus === 'approved'">已升级</span>
                <span v-else>申请升级</span>
              </el-button>
            </div>
          </div>
        </template>
        
        <el-divider>最近接单记录</el-divider>

        <div v-if="recentTasks.length" class="mb-4">
          <div class="hidden md:block">
            <el-table :data="recentTasks" size="small" class="w-full">
              <el-table-column prop="title" label="任务名称" min-width="180" />
              <el-table-column prop="requester" label="需求方" width="150" />
              <el-table-column prop="price" label="成交价" width="120" />
              <el-table-column prop="status" label="状态" width="120">
                <template #default="{ row }">
                  <el-tag :type="getTaskStatusType(row.status)" size="small">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="deadline" label="截止日期" width="150" />
            </el-table>
          </div>
          <div class="md:hidden space-y-3">
            <div
              v-for="task in recentTasks"
              :key="task.id"
              class="bg-gray-50 rounded-xl p-3 border border-gray-100"
            >
              <div class="flex justify-between items-start mb-1">
                <div class="font-medium text-gray-900 text-xs line-clamp-2">
                  {{ task.title }}
                </div>
                <el-tag :type="getTaskStatusType(task.status)" size="small">
                  {{ task.status }}
                </el-tag>
              </div>
              <div class="text-[11px] text-gray-500 mb-1">
                需求方：{{ task.requester }}
              </div>
              <div class="flex justify-between items-center text-[11px] text-gray-500">
                <span>成交价：{{ task.price }}</span>
                <span>截止：{{ task.deadline }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-xs text-gray-400 mb-4">
          暂无接单记录，可前往任务大厅开始接单。
        </div>

        <el-divider>安全设置</el-divider>
        
        <div class="flex justify-between items-center py-2">
           <div>
             <div class="font-medium text-gray-700">登录密码</div>
             <div class="text-xs text-gray-400">定期修改密码可以保护账号安全</div>
           </div>
           <el-button link type="primary">修改</el-button>
        </div>
        
        <div class="flex justify-between items-center py-2">
           <div>
             <div class="font-medium text-gray-700">实名认证</div>
             <div class="text-xs text-gray-400">认证信息仅用于保障账号安全</div>
           </div>
           <el-tag type="success" size="small" v-if="isVerified">已认证</el-tag>
           <el-tag type="info" size="small" v-else>未认证</el-tag>
        </div>

        <div class="mt-6 flex justify-end">
          <el-button type="primary" @click="handleSave">保存修改</el-button>
        </div>
      </el-form>
    </el-card>

    <el-dialog v-model="upgradeDialogVisible" title="申请升级为B端服务商" width="480px">
      <el-form :model="upgradeForm" label-width="90px">
        <el-form-item label="公司名称">
          <el-input v-model="upgradeForm.companyName" placeholder="如：某某科技有限公司" />
        </el-form-item>
        <el-form-item label="主营类型">
          <el-select v-model="upgradeForm.type" placeholder="选择企业类型">
            <el-option label="航拍服务商" value="photography" />
            <el-option label="保险机构" value="insurance" />
            <el-option label="综合解决方案" value="general" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="upgradeForm.contactName" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="upgradeForm.contactPhone" />
        </el-form-item>
        <el-form-item label="飞手证书">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="2"
            v-model:file-list="upgradeLicenseFiles"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="保险凭证">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="2"
            v-model:file-list="upgradeInsuranceFiles"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="补充说明">
          <el-input v-model="upgradeForm.remark" type="textarea" rows="3" placeholder="可简单说明业务场景与优势" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="upgradeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUpgrade">提交申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, computed, watch, ref } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useMockData } from '../composables/useMockData'
import { ElMessage } from 'element-plus'

const { user, activeIdentity, updateProfile, applyToBProvider } = useAuth()
const { state } = useMockData()

const form = reactive({
  nickname: '',
  phone: '',
  bio: '',
  companyName: '',
  companyType: '',
  contactPerson: '',
  companyPhone: '',
  companyDesc: '',
  services: []
})

const upgradeDialogVisible = ref(false)
const upgradeForm = reactive({
  companyName: '',
  type: '',
  contactName: '',
  contactPhone: '',
  remark: ''
})

const upgradeLicenseFiles = ref([])
const upgradeInsuranceFiles = ref([])

const isBProvider = computed(() => activeIdentity.value === 'provider' && user.value?.role === 'b-user')
const isCProvider = computed(() => activeIdentity.value === 'provider' && user.value?.role === 'c-user')

const subtitle = computed(() => {
  if (isBProvider.value) return '管理企业信息与服务能力'
  if (isCProvider.value) return '管理个人资料与飞手认证状态'
  return '管理个人资料与安全设置'
})

const upgradeStatus = computed(() => {
  if (!user.value || !user.value.upgradeToB) return ''
  return user.value.upgradeToB.status || ''
})

const certStatusRaw = computed(() => {
  if (!user.value) return 'none'
  return user.value.certificationStatus || 'none'
})

const providerLevelText = computed(() => {
  if (!user.value || !user.value.providerLevel) return '未开通服务方'
  if (user.value.providerLevel === 'lv2') return '认证飞手'
  if (user.value.providerLevel === 'lv3' || user.value.providerLevel === 'lv4') return '专业服务商'
  return '基础飞手'
})

const certStatusText = computed(() => {
  if (certStatusRaw.value === 'pending') return '认证审核中'
  if (certStatusRaw.value === 'approved') return '已通过飞手认证'
  if (certStatusRaw.value === 'rejected') return '认证被驳回，待重新提交'
  return '尚未发起飞手认证'
})

const certStatusTagClass = computed(() => {
  if (certStatusRaw.value === 'approved') return 'text-green-600'
  if (certStatusRaw.value === 'pending') return 'text-orange-500'
  if (certStatusRaw.value === 'rejected') return 'text-red-500'
  return 'text-gray-400'
})

const identityTag = computed(() => {
  if (!user.value) return ''
  if (isBProvider.value) return '服务方 · B端后台'
  if (isCProvider.value) return '服务方 · C端后台'
  if (activeIdentity.value && activeIdentity.value.startsWith('requester')) return '需求方 · C端后台'
  return ''
})

const identityTagClass = computed(() => {
  if (isBProvider.value) {
    return 'inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-50 text-blue-600 border border-blue-100'
  }
  if (isCProvider.value) {
    return 'inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-50 text-green-600 border border-green-100'
  }
  if (activeIdentity.value && activeIdentity.value.startsWith('requester')) {
    return 'inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-50 text-orange-600 border border-orange-100'
  }
  return 'inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-50 text-gray-500 border border-gray-100'
})

const isVerified = computed(() => {
  if (!user.value) return false
  return !!user.value.idVerified
})

const recentTasks = computed(() => {
  if (!state.value || !Array.isArray(state.value.tasks)) return []
  return state.value.tasks.slice(0, 3)
})

const getTaskStatusType = (status) => {
  const map = {
    '沟通中': 'info',
    '已通过': 'success',
    '已拒绝': 'danger',
    '已取消': 'info',
    '已完成': 'success'
  }
  return map[status] || 'info'
}

const avatarUrl = computed(() => {
  if (user.value && user.value.avatar) return user.value.avatar
  return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
})

const fillFormFromUser = () => {
  if (!user.value) return
  form.nickname = user.value.nickname || user.value.username || ''
  form.phone = user.value.phone || ''
  form.bio = user.value.bio || ''
  form.companyName = user.value.companyName || ''
  form.companyType = user.value.type || ''
  form.contactPerson = user.value.contactPerson || ''
  form.companyPhone = user.value.phone || ''
  form.companyDesc = user.value.companyDesc || ''
  form.services = Array.isArray(user.value.services) ? user.value.services.map(s => ({ ...s })) : []
}

watch(user, () => {
  fillFormFromUser()
}, { immediate: true })

const addService = () => {
  form.services.push({
    name: '',
    price: '',
    desc: ''
  })
}

const removeService = (index) => {
  form.services.splice(index, 1)
}

const handleSave = () => {
  if (!user.value) {
    ElMessage.error('请先登录')
    return
  }
  const payload = {
    nickname: form.nickname,
    bio: form.bio
  }
  if (isBProvider.value) {
    payload.companyName = form.companyName
    payload.type = form.companyType
    payload.contactPerson = form.contactPerson
    payload.phone = form.companyPhone
    payload.companyDesc = form.companyDesc
    payload.services = form.services.map(s => ({ ...s }))
  }
  const res = updateProfile(payload)
  if (!res.success) {
    ElMessage.error(res.message || '保存失败')
    return
  }
  ElMessage.success('已保存账号设置')
}

const goToIdentity = (mode) => {
  if (typeof window === 'undefined') return
  const event = new CustomEvent('open-identity-dialog', { detail: { mode, applicationOnly: true } })
  window.dispatchEvent(event)
}

const openUpgradeDialog = () => {
  if (!user.value) {
    ElMessage.error('请先登录')
    return
  }
  if (upgradeStatus.value === 'pending') {
    ElMessage.info('升级申请审核中，请耐心等待')
    return
  }
  upgradeForm.companyName = form.companyName || ''
  upgradeForm.type = form.companyType || ''
  upgradeForm.contactName = form.contactPerson || ''
  upgradeForm.contactPhone = form.companyPhone || ''
  upgradeForm.remark = ''
  upgradeLicenseFiles.value = []
  upgradeInsuranceFiles.value = []
  upgradeDialogVisible.value = true
}

const submitUpgrade = () => {
  if (!upgradeForm.companyName || !upgradeForm.contactName || !upgradeForm.contactPhone) {
    ElMessage.error('请填写完整公司信息')
    return
  }
  if (!upgradeLicenseFiles.value || upgradeLicenseFiles.value.length < 2) {
    ElMessage.error('请上传飞手证书正反面')
    return
  }
  if (!upgradeInsuranceFiles.value || upgradeInsuranceFiles.value.length < 2) {
    ElMessage.error('请上传保险凭证正反面')
    return
  }
  const res = applyToBProvider({
    companyName: upgradeForm.companyName,
    type: upgradeForm.type,
    contactName: upgradeForm.contactName,
    contactPhone: upgradeForm.contactPhone,
    remark: upgradeForm.remark,
    pilotLicenseDocs: upgradeLicenseFiles.value.map(f => ({ name: f.name, url: f.url || '' })),
    insuranceDocs: upgradeInsuranceFiles.value.map(f => ({ name: f.name, url: f.url || '' }))
  })
  if (!res.success) {
    ElMessage.error(res.message || '提交失败')
    return
  }
  ElMessage.success('已提交升级为B端服务商申请')
  upgradeDialogVisible.value = false
}
</script>
