<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="isApplicationOnly ? '申请开通身份' : '身份中心'"
    width="95%"
    class="max-w-[520px]"
    @open="initForm"
  >
    <div v-if="user" class="space-y-4">
      <!-- Identity Status Card: Always show active status for reference, but simplified in application mode -->
      <div class="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-lg p-4 text-sm text-gray-600">
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-2">
            <span class="font-bold text-gray-800 text-base">{{ user.nickname || user.username }}</span>
            <span class="text-xs text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">ID: {{ user.id }}</span>
            <span v-if="isApplicationOnly" class="text-xs text-gray-500">(当前身份)</span>
          </div>
          <el-tag :type="identityLabelType" effect="dark" size="small">{{ isApplicationOnly ? currentIdentityName : identityLabel }}</el-tag>
        </div>
        
        <!-- Switch Controls: Only visible in normal mode -->
        <div v-if="!isApplicationOnly" class="grid grid-cols-2 gap-2 mt-2">
           <div class="bg-white p-2 rounded border border-gray-100 flex flex-col items-center cursor-pointer hover:border-blue-300 transition"
                :class="{'ring-2 ring-blue-500 ring-offset-1': activeIdentity === 'provider'}"
                @click="handleSwitchIdentity('provider')">
              <div class="text-xs text-gray-400 mb-1">服务方身份</div>
              <div class="font-medium text-gray-800" v-if="user.providerLevel">
                 {{ user.providerLevel === 'lv1' ? '基础飞手' : (user.providerLevel === 'lv2' ? '认证飞手' : '服务商') }}
              </div>
              <div class="text-xs text-gray-400" v-else>未开通</div>
              <div class="text-[10px] text-green-600 mt-1" v-if="activeIdentity === 'provider'">当前使用中</div>
           </div>
           <div class="bg-white p-2 rounded border border-gray-100 flex flex-col items-center cursor-pointer hover:border-blue-300 transition"
                :class="{'ring-2 ring-blue-500 ring-offset-1': activeIdentity.startsWith('requester')}"
                @click="handleSwitchIdentity(user.requesterEnterprise ? 'requester_enterprise' : 'requester_personal')">
              <div class="text-xs text-gray-400 mb-1">需求方身份</div>
              <div class="font-medium text-gray-800" v-if="user.requesterPersonal || user.requesterEnterprise">
                 {{ user.requesterEnterprise ? '企业需求方' : '个人需求方' }}
              </div>
              <div class="text-xs text-gray-400" v-else>未开通</div>
              <div class="text-[10px] text-green-600 mt-1" v-if="activeIdentity.startsWith('requester')">当前使用中</div>
           </div>
        </div>
      </div>

      <el-divider content-position="left">身份申请与完善</el-divider>

      <el-radio-group v-model="identityMode" class="mb-2">
        <el-radio-button label="provider">申请/完善 服务方资料</el-radio-button>
        <el-radio-button label="requester">申请/完善 需求方资料</el-radio-button>
      </el-radio-group>

      <div v-if="identityMode === 'provider'" class="space-y-4">
        <el-form :model="identityForm" label-width="96px">
          <el-form-item label="真实姓名">
            <el-input v-model="identityForm.realName" placeholder="用于飞手认证的实名信息" />
          </el-form-item>
          <el-form-item label="飞行小时数">
            <el-input v-model="identityForm.flightHours" placeholder="例如：50" />
          </el-form-item>
          <el-form-item label="无人机执照">
            <el-switch v-model="identityForm.pilotLicense" active-text="已持证" inactive-text="暂无" />
          </el-form-item>
          <el-form-item label="飞手保险">
            <el-switch v-model="identityForm.insuranceActive" active-text="已投保" inactive-text="未投保" />
          </el-form-item>
          <el-form-item label="飞手证书">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="2"
              v-model:file-list="identityForm.pilotLicenseDocs"
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
              v-model:file-list="identityForm.insuranceDocs"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="text-xs text-gray-500">
          提交后将更新您的服务方资料。如首次申请，需管理员审核通过后方可在需求大厅接单。
        </div>
      </div>

      <div v-else class="space-y-4">
        <el-form :model="identityForm" label-width="96px">
          <el-form-item label="需求方类型">
            <el-radio-group v-model="identityForm.requesterType">
              <el-radio label="personal">个人需求方</el-radio>
              <el-radio label="enterprise">企业需求方</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="identityForm.requesterType === 'enterprise'" label="单位名称">
            <el-input v-model="identityForm.orgName" placeholder="如：某某科技有限公司" />
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="identityForm.contactName" placeholder="联系人姓名" />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="identityForm.contactPhone" placeholder="手机号或座机" />
          </el-form-item>
        </el-form>
        <div class="text-xs text-gray-500">
          个人需求方可发布个人任务，企业需求方适合发布项目级、长期需求。
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:modelValue', false)">关闭</el-button>
        <el-button type="primary" @click="submitIdentityChange">提交变更</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAuth } from '../composables/useAuth'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  isApplicationOnly: Boolean,
  defaultMode: String
})

const emit = defineEmits(['update:modelValue'])

const { user, activeIdentity, logout, applyToProvider, applyToRequester } = useAuth()
const identityMode = ref('provider')

const identityForm = reactive({
  realName: '',
  flightHours: '',
  pilotLicense: false,
  insuranceActive: false,
  pilotLicenseDocs: [],
  insuranceDocs: [],
  requesterType: 'personal',
  orgName: '',
  contactName: '',
  contactPhone: ''
})

watch(() => props.defaultMode, (newVal) => {
  if (newVal) {
    identityMode.value = newVal
  }
})

const initForm = () => {
  if (!user.value) return
  
  const u = user.value
  
  if (props.defaultMode) {
    identityMode.value = props.defaultMode
  } else if (!props.isApplicationOnly) {
     // Default logic if not specified
     const hasProvider = !!u.providerLevel
     const hasRequester = u.requesterPersonal || u.requesterEnterprise
     identityMode.value = hasProvider && !hasRequester ? 'requester' : 'provider'
  }

  identityForm.realName = u.realName || ''
  identityForm.flightHours = u.flightHours != null ? String(u.flightHours) : ''
  identityForm.pilotLicense = !!u.pilotLicense
  identityForm.insuranceActive = !!u.insuranceActive
  
  if (u.requesterEnterprise) {
    identityForm.requesterType = 'enterprise'
  } else {
    identityForm.requesterType = 'personal'
  }
  
  identityForm.orgName = u.requesterOrg || ''
  identityForm.contactName = u.requesterContact || ''
  identityForm.contactPhone = u.requesterPhone || u.phone || ''
}

const identityLabelType = computed(() => {
  if (!user.value) return 'info'
  const u = user.value
  const hasProvider = !!u.providerLevel
  const hasRequester = u.requesterPersonal || u.requesterEnterprise
  if (hasProvider && hasRequester) return 'warning'
  if (hasProvider) return 'success'
  if (hasRequester) return 'primary'
  return 'info'
})

const identityLabel = computed(() => {
  if (!user.value) return '未登录'
  const u = user.value
  const hasProvider = !!u.providerLevel
  const hasRequester = u.requesterPersonal || u.requesterEnterprise
  if (hasProvider && hasRequester) return '需求方 + 服务方'
  if (hasProvider) return '服务方'
  if (hasRequester) return '需求方'
  return '访客'
})

const currentIdentityName = computed(() => {
  if (!activeIdentity.value) return '访客'
  if (activeIdentity.value === 'provider') return '服务方'
  if (activeIdentity.value.startsWith('requester')) return '需求方'
  return '未知'
})

const handleSwitchIdentity = async (targetIdentity) => {
  if (props.isApplicationOnly) return
  if (!user.value) {
    ElMessage.error('请先登录')
    return
  }
  const u = user.value
  let hasCapability = false
  if (targetIdentity === 'provider') {
    hasCapability = !!u.providerLevel
  } else if (targetIdentity === 'requester_enterprise') {
    hasCapability = u.requesterEnterprise
  } else {
    hasCapability = u.requesterPersonal
  }
  if (hasCapability) {
    try {
      await ElMessageBox.confirm(
        `切换身份需要重新登录，确认要切换为${targetIdentity === 'provider' ? '服务方' : '需求方'}身份吗？`,
        '切换身份',
        { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'info' }
      )
      logout()
      ElMessage.success('已退出登录，请使用目标身份重新登录')
      emit('update:modelValue', false)
    } catch (e) {
    }
  } else {
    identityMode.value = targetIdentity === 'provider' ? 'provider' : 'requester'
    ElMessage.info('请先完善资料以开通该身份')
  }
}

const submitIdentityChange = () => {
  if (!user.value) return
  
  if (identityMode.value === 'provider') {
    if (!identityForm.realName) {
      ElMessage.error('请输入真实姓名')
      return
    }
    if (identityForm.pilotLicense && (!identityForm.pilotLicenseDocs || identityForm.pilotLicenseDocs.length < 2)) {
      ElMessage.error('请上传飞手证书正反面')
      return
    }
    if (identityForm.insuranceActive && (!identityForm.insuranceDocs || identityForm.insuranceDocs.length < 2)) {
      ElMessage.error('请上传保险凭证正反面')
      return
    }
    const res = applyToProvider({
      realName: identityForm.realName,
      flightHours: identityForm.flightHours,
      pilotLicense: identityForm.pilotLicense,
      insuranceActive: identityForm.insuranceActive,
      pilotLicenseDocs: identityForm.pilotLicenseDocs,
      insuranceDocs: identityForm.insuranceDocs
    })
    if (!res.success) {
      ElMessage.error(res.message || '申请失败')
      return
    }
    ElMessage.success('已提交成为服务方的申请')
  } else {
    if (!identityForm.contactName || !identityForm.contactPhone) {
      ElMessage.error('请输入联系人和联系电话')
      return
    }
    if (identityForm.requesterType === 'enterprise' && !identityForm.orgName) {
      ElMessage.error('请输入单位名称')
      return
    }
    const res = applyToRequester({
      requesterType: identityForm.requesterType,
      orgName: identityForm.orgName,
      contactName: identityForm.contactName,
      contactPhone: identityForm.contactPhone
    })
    if (!res.success) {
      ElMessage.error(res.message || '开通失败')
      return
    }
    ElMessage.success('需求方身份已更新')
  }
  emit('update:modelValue', false)
}
</script>
