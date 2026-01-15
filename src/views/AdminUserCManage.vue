<template>
  <div class="space-y-6">
    <!-- 头部说明 -->
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-xl font-bold text-gray-800">C端用户管理</h2>
        <p class="text-sm text-gray-500 mt-1">管理个人用户，处理飞手认证申请，促进C端向B端转化</p>
      </div>
    </div>

    <!-- 筛选工具栏 -->
    <div class="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 shadow-sm">
      <el-select v-model="filterLevel" placeholder="用户等级" clearable class="w-40">
        <el-option label="基础飞手" value="novice" />
        <el-option label="认证飞手" value="advanced" />
      </el-select>
      <el-select v-model="filterCert" placeholder="认证状态" clearable class="w-40">
        <el-option label="待审核" value="pending" />
        <el-option label="已认证" value="approved" />
      </el-select>
      <el-input v-model="searchQuery" placeholder="搜索昵称" prefix-icon="Search" class="w-64" />
    </div>

    <!-- 用户列表 -->
    <el-table :data="filteredList" class="w-full border rounded-xl overflow-hidden shadow-sm" :header-cell-style="{ background: '#f9fafb', color: '#6b7280' }">
      <el-table-column label="用户" min-width="180">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <el-avatar :src="row.avatar" :size="40" />
            <div>
              <div class="font-medium text-gray-900">{{ row.nickname }}</div>
              <div class="text-xs text-gray-400">ID: {{ row.id }}</div>
              <div class="text-xs text-gray-400">手机号: {{ row.phoneMasked || '—' }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="会员等级" width="120">
        <template #default="{ row }">
          <el-tag :type="row.membershipLevel === 'vip' ? 'danger' : 'default'">
            {{ row.membershipLevel === 'vip' ? 'VIP' : '普通' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="账户资产" width="140">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-800">{{ row.balanceCoins || 0 }} 币</span>
            <el-button text size="small" @click="openAsset(row)">资产调节</el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="认证状态" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.certificationStatus === 'pending'" type="warning" effect="dark">审核中</el-tag>
          <el-tag v-else-if="row.certificationStatus === 'approved'" type="success" effect="plain">已认证</el-tag>
          <el-tag v-else-if="row.certificationStatus === 'rejected'" type="danger" effect="plain">已驳回</el-tag>
          <span v-else class="text-gray-300">-</span>
        </template>
      </el-table-column>

      <el-table-column label="认证/资质" min-width="200">
        <template #default="{ row }">
          <div class="flex items-center gap-2 text-xs">
            <span :class="row.idVerified ? 'text-green-600' : 'text-gray-400'">{{ row.idVerified ? '🆔 实名' : '🆔 未实名' }}</span>
            <span :class="row.pilotLicense ? 'text-green-600' : 'text-red-500'">{{ row.pilotLicense ? '✅ 飞手证' : '❌ 飞手证' }}</span>
            <span :class="row.insuranceActive ? 'text-green-600' : 'text-red-500'">{{ row.insuranceActive ? '✅ 保险' : '❌ 保险' }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="信用/风控" width="160">
        <template #default="{ row }">
          <div class="text-xs text-gray-700">信用分 {{ row.creditScore || 0 }} / 投诉 {{ row.complaintsCount || 0 }}</div>
        </template>
      </el-table-column>

      <el-table-column label="活跃数据" min-width="220">
        <template #default="{ row }">
          <div class="text-xs text-gray-700">机位 {{ row.spotUploads || 0 }} / 接单 {{ row.ordersCount || 0 }} / 飞行 {{ row.flightHours || 0 }}h</div>
        </template>
      </el-table-column>

      <el-table-column label="注册/登录" width="200">
        <template #default="{ row }">
          <div class="text-xs text-gray-700">注册 {{ row.registerDate }} / 登录 {{ row.lastLogin || '—' }}</div>
        </template>
      </el-table-column>

      <el-table-column prop="flightHours" label="飞行时长(h)" width="120" sortable />
      <el-table-column prop="registerDate" label="注册时间" width="120" />
      <el-table-column label="身份标签" min-width="240">
        <template #default="{ row }">
          <div class="flex flex-wrap items-center gap-2">
            <el-tag v-if="row.requesterPersonal || row.requesterEnterprise" type="warning">需求方</el-tag>
            <el-tag v-if="row.providerLevel" type="success">服务方</el-tag>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.certificationStatus === 'pending'" type="primary" size="small" @click="handleAudit(row)">
            审核认证
          </el-button>
          <el-button v-if="row.status === 'active'" type="danger" link size="small" @click="toggleStatus(row)">
            封禁
          </el-button>
          <el-button v-else type="success" link size="small" @click="toggleStatus(row)">
            解封
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- C端升级为B端服务商申请列表 -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mt-6">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h3 class="text-base font-semibold text-gray-800">C端升级为B端服务商申请</h3>
          <p class="text-xs text-gray-500 mt-1">查看并处理个人用户提交的B端升级申请</p>
        </div>
      </div>
      <el-table :data="upgradeList" v-if="upgradeList.length" size="small">
        <el-table-column label="用户" min-width="180">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <el-avatar :src="row.avatar" :size="32" />
              <div>
                <div class="font-medium text-gray-900 text-sm">{{ row.nickname }}</div>
                <div class="text-[11px] text-gray-400">ID: {{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="申请企业信息" min-width="220">
          <template #default="{ row }">
            <div class="text-xs text-gray-700">
              <div>公司：{{ row.upgradeToB.companyName || '—' }}</div>
              <div class="mt-0.5">联系人：{{ row.upgradeToB.contactName || '—' }} / {{ row.upgradeToB.contactPhone || '—' }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="材料" width="160">
          <template #default="{ row }">
            <div class="text-[11px] text-gray-700 space-y-0.5">
              <div>飞手证书：{{ (row.upgradeToB.pilotLicenseDocs && row.upgradeToB.pilotLicenseDocs.length) || 0 }} 份</div>
              <div>保险凭证：{{ (row.upgradeToB.insuranceDocs && row.upgradeToB.insuranceDocs.length) || 0 }} 份</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.upgradeToB.status === 'pending'" type="warning" size="small">待审核</el-tag>
            <el-tag v-else-if="row.upgradeToB.status === 'approved'" type="success" size="small">已通过</el-tag>
            <el-tag v-else-if="row.upgradeToB.status === 'rejected'" type="danger" size="small">已驳回</el-tag>
            <el-tag v-else size="small">未知</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleViewUpgrade(row)">
              详情
            </el-button>
            <el-button
              v-if="row.upgradeToB.status === 'pending'"
              type="primary"
              size="small"
              @click="handleUpgradeApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.upgradeToB.status === 'pending'"
              type="danger"
              size="small"
              plain
              @click="handleUpgradeReject(row)"
            >
              驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-else class="text-xs text-gray-400">暂无C端升级B端的申请</div>
    </div>

    <!-- 升级申请详情弹窗 -->
    <el-dialog v-model="upgradeDetailVisible" title="升级申请详情" width="600px">
      <div v-if="currentUpgradeRow" class="space-y-6">
        <!-- 企业基本信息 -->
        <div>
          <h4 class="font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-2">企业基本信息</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="bg-gray-50 p-3 rounded-lg">
              <span class="text-gray-500 block mb-1">企业名称</span>
              <span class="font-medium text-gray-900">{{ currentUpgradeRow.upgradeToB.companyName }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <span class="text-gray-500 block mb-1">业务类型</span>
              <span class="font-medium text-gray-900">{{ currentUpgradeRow.upgradeToB.type === 'photography' ? '航拍服务' : '通用服务' }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <span class="text-gray-500 block mb-1">联系人</span>
              <span class="font-medium text-gray-900">{{ currentUpgradeRow.upgradeToB.contactName }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-lg">
              <span class="text-gray-500 block mb-1">联系电话</span>
              <span class="font-medium text-gray-900">{{ currentUpgradeRow.upgradeToB.contactPhone }}</span>
            </div>
          </div>
        </div>
        <!-- 申请材料 -->
        <div>
          <h4 class="font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-2">申请材料</h4>
          <div class="space-y-4">
            <div>
              <div class="text-sm font-medium text-gray-700 mb-2">飞手资质证书</div>
              <div v-if="currentUpgradeRow.upgradeToB.pilotLicenseDocs && currentUpgradeRow.upgradeToB.pilotLicenseDocs.length" class="grid grid-cols-2 gap-3">
                <div v-for="(doc, idx) in currentUpgradeRow.upgradeToB.pilotLicenseDocs" :key="idx" 
                     class="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-white hover:border-blue-300 transition-colors cursor-pointer">
                  <el-icon class="text-blue-500 text-lg"><Document /></el-icon>
                  <span class="text-sm text-gray-600 truncate flex-1">{{ doc }}</span>
                  <el-button link type="primary" size="small">预览</el-button>
                </div>
              </div>
              <div v-else class="text-gray-400 text-xs italic">无文件</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-700 mb-2">保险凭证</div>
              <div v-if="currentUpgradeRow.upgradeToB.insuranceDocs && currentUpgradeRow.upgradeToB.insuranceDocs.length" class="grid grid-cols-2 gap-3">
                <div v-for="(doc, idx) in currentUpgradeRow.upgradeToB.insuranceDocs" :key="idx" 
                     class="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-white hover:border-blue-300 transition-colors cursor-pointer">
                  <el-icon class="text-blue-500 text-lg"><Document /></el-icon>
                  <span class="text-sm text-gray-600 truncate flex-1">{{ doc }}</span>
                  <el-button link type="primary" size="small">预览</el-button>
                </div>
              </div>
              <div v-else class="text-gray-400 text-xs italic">无文件</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3" v-if="currentUpgradeRow && currentUpgradeRow.upgradeToB.status === 'pending'">
          <el-button @click="handleUpgradeReject(currentUpgradeRow); upgradeDetailVisible = false" type="danger" plain>驳回申请</el-button>
          <el-button @click="handleUpgradeApprove(currentUpgradeRow); upgradeDetailVisible = false" type="primary">通过申请</el-button>
        </div>
        <div class="flex justify-end gap-3" v-else>
          <el-button @click="upgradeDetailVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog v-model="dialogVisible" title="飞手认证审核" width="500px">
      <div v-if="currentRow" class="space-y-4">
        <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <el-avatar :src="currentRow.avatar" :size="50" />
          <div>
                <div class="font-bold text-lg text-gray-800">{{ currentRow.nickname }}</div>
            <div class="text-sm text-blue-600 font-medium mt-1">申请升级为：认证飞手</div>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-white p-2">
          <div>当前飞行时长：<span class="font-bold text-gray-900">{{ currentRow.flightHours }} 小时</span></div>
          <div>注册日期：<span class="font-bold text-gray-900">{{ currentRow.registerDate }}</span></div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">审核意见</label>
          <el-input 
            v-model="auditReason" 
            type="textarea" 
            rows="3" 
            placeholder="请输入通过或驳回的理由..."
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="handleReject" type="danger" plain>驳回申请</el-button>
          <el-button @click="handleApprove" type="primary">通过认证</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="assetDialogVisible" title="资产调节" width="420px">
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <el-radio-group v-model="assetMode">
            <el-radio-button label="add">增加</el-radio-button>
            <el-radio-button label="sub">减少</el-radio-button>
          </el-radio-group>
        </div>
        <el-input v-model="assetAmount" type="number" placeholder="请输入调整额度（币）" />
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="assetDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAsset">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Document } from '@element-plus/icons-vue'
import { cUsers } from '../data/mockUsers'
import { ElMessage } from 'element-plus'

const list = ref(cUsers)
const searchQuery = ref('')
const filterLevel = ref('')
const filterCert = ref('')

const upgradeDetailVisible = ref(false)
const currentUpgradeRow = ref(null)

const handleViewUpgrade = (row) => {
  currentUpgradeRow.value = row
  upgradeDetailVisible.value = true
}

// 审核相关逻辑
const dialogVisible = ref(false)
const currentRow = ref(null)
const auditReason = ref('')

const filteredList = computed(() => {
  return list.value.filter(item => {
    const matchSearch = item.nickname.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchLevel = !filterLevel.value || item.level === filterLevel.value
    const matchCert = !filterCert.value || item.certificationStatus === filterCert.value
    return matchSearch && matchLevel && matchCert
  })
})

const upgradeList = computed(() => {
  return list.value.filter(item => item.upgradeToB && item.upgradeToB.status)
})

const getCertText = (status) => {
  const map = { pending: '审核中', approved: '已认证', rejected: '已驳回' }
  return map[status] || '-'
}

const getCertClass = (status) => {
  const map = { pending: 'text-yellow-600', approved: 'text-green-600', rejected: 'text-red-600' }
  return map[status] || 'text-gray-400'
}

const handleAudit = (row) => {
  currentRow.value = row
  auditReason.value = ''
  dialogVisible.value = true
}

const handleApprove = () => {
  if (currentRow.value) {
    currentRow.value.certificationStatus = 'approved'
    currentRow.value.level = 'advanced' // 自动升级用户等级
    currentRow.value.providerLevel = 'lv2'
    ElMessage.success(`已批准 ${currentRow.value.nickname} 的飞手认证`)
    dialogVisible.value = false
  }
}

const handleReject = () => {
  if (currentRow.value) {
    currentRow.value.certificationStatus = 'rejected'
    ElMessage.warning(`已驳回 ${currentRow.value.nickname} 的申请`)
    dialogVisible.value = false
  }
}

const toggleStatus = (row) => {
  row.status = row.status === 'active' ? 'banned' : 'active'
  ElMessage.success('状态已更新')
}

const assetDialogVisible = ref(false)
const assetRow = ref(null)
const assetAmount = ref(0)
const assetMode = ref('add')

const openAsset = (row) => {
  assetRow.value = row
  assetAmount.value = 0
  assetMode.value = 'add'
  assetDialogVisible.value = true
}

const confirmAsset = () => {
  if (!assetRow.value) return
  const amt = Number(assetAmount.value || 0)
  if (amt <= 0) {
    ElMessage.warning('请输入有效额度')
    return
  }
  const sign = assetMode.value === 'add' ? 1 : -1
  assetRow.value.balanceCoins = Math.max(0, (assetRow.value.balanceCoins || 0) + sign * amt)
  ElMessage.success('资产已调整')
  assetDialogVisible.value = false
}

const handleUpgradeApprove = (row) => {
  if (!row.upgradeToB) return
  row.upgradeToB.status = 'approved'
  row.providerLevel = row.providerLevel || 'lv3'
  row.companyName = row.upgradeToB.companyName || row.companyName || row.nickname
  row.type = row.upgradeToB.type || row.type || 'general'
  row.contactPerson = row.upgradeToB.contactName || row.contactPerson
  row.phone = row.upgradeToB.contactPhone || row.phone
  row.requesterEnterprise = true
  ElMessage.success(`已通过 ${row.nickname} 的B端升级申请`)
}

const handleUpgradeReject = (row) => {
  if (!row.upgradeToB) return
  row.upgradeToB.status = 'rejected'
  ElMessage.warning(`已驳回 ${row.nickname} 的B端升级申请`)
}
</script>
