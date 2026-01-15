<template>
  <div class="space-y-6">
    <div class="flex justify-between items-end">
      <div>
        <h2 class="text-xl font-bold text-gray-800">小B端商户管理</h2>
        <p class="text-sm text-gray-500 mt-1">管理航拍公司、保险机构等商业合作伙伴</p>
      </div>
      <el-button type="primary" icon="Plus">新增商户</el-button>
    </div>

    <div class="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 shadow-sm">
      <el-select v-model="filterType" placeholder="商户类型" clearable class="w-full md:w-40">
        <el-option label="航拍公司" value="photography" />
        <el-option label="保险机构" value="insurance" />
      </el-select>
      <el-input v-model="searchQuery" placeholder="搜索公司名称" prefix-icon="Search" class="w-full md:w-64" />
    </div>

    <!-- Mobile Card List -->
    <div class="md:hidden space-y-4">
      <div v-for="row in filteredList" :key="row.id" class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-3">
           <div class="font-medium text-gray-900 truncate flex-1 mr-2">{{ row.companyName }}</div>
           <el-tag v-if="row.type === 'photography'" type="primary" size="small">航拍</el-tag>
           <el-tag v-else-if="row.type === 'insurance'" type="warning" size="small">保险</el-tag>
        </div>
        
        <div class="grid grid-cols-2 gap-2 text-sm mb-3">
          <div class="text-gray-500">联系人: <span class="text-gray-800">{{ row.contactPerson }}</span></div>
          <div class="text-gray-500">电话: <span class="text-gray-800">{{ row.phone }}</span></div>
          <div class="text-gray-500">资产: <span class="text-gray-800">{{ row.balanceCoins || 0 }} 币</span></div>
          <div class="text-gray-500">信用: <span class="text-gray-800">{{ row.creditScore || 0 }}</span></div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-50">
           <div class="flex gap-2 text-xs">
              <span :class="row.businessLicense ? 'text-green-600' : 'text-gray-400'">{{ row.businessLicense ? '有执照' : '无执照' }}</span>
              <span :class="row.isGold ? 'text-yellow-600 font-bold' : 'text-gray-400'">{{ row.isGold ? '金牌' : '' }}</span>
           </div>
           <div class="flex gap-2">
              <el-button link type="primary" size="small">详情</el-button>
              <el-button link type="primary" size="small" @click="openAsset(row)">资产</el-button>
              <el-button link type="primary" size="small">编辑</el-button>
           </div>
        </div>
      </div>
    </div>

    <el-table :data="filteredList" class="hidden md:block w-full border rounded-xl overflow-hidden shadow-sm" :header-cell-style="{ background: '#f9fafb', color: '#6b7280' }">
      <el-table-column prop="companyName" label="公司名称" min-width="200">
        <template #default="{ row }">
           <span class="font-medium text-gray-800">{{ row.companyName }}</span>
           <div class="text-xs text-gray-400">手机号: {{ (row.phone && (row.phone.slice(0,3) + '****' + row.phone.slice(-4))) || '—' }}</div>
        </template>
      </el-table-column>
      
      <el-table-column label="类型" width="120">
        <template #default="{ row }">
          <el-tag v-if="row.type === 'photography'" type="primary">航拍公司</el-tag>
          <el-tag v-else-if="row.type === 'insurance'" type="warning">保险机构</el-tag>
          <el-tag v-else type="info">其他</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="用户角色" width="120">
        <template #default="{ row }">
          <el-tag type="success">服务商</el-tag>
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

      <el-table-column label="认证/资质" min-width="200">
        <template #default="{ row }">
          <div class="flex items-center gap-2 text-xs">
            <span :class="row.businessLicense ? 'text-green-600' : 'text-red-500'">{{ row.businessLicense ? '✅ 营业执照' : '❌ 营业执照' }}</span>
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
          <div class="text-xs text-gray-700">项目 {{ row.projectsCount || 0 }} / 接单 {{ row.ordersCount || 0 }}</div>
        </template>
      </el-table-column>

      <el-table-column label="注册/登录" width="200">
        <template #default="{ row }">
          <div class="text-xs text-gray-700">注册 {{ row.registerDate }} / 登录 {{ row.lastLogin || '—' }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="contactPerson" label="联系人" width="120" />
      <el-table-column prop="phone" label="联系电话" width="150" />
      <el-table-column label="身份标签" min-width="240">
        <template #default="{ row }">
          <div class="flex flex-wrap items-center gap-2">
            <el-tag v-if="row.requesterEnterprise" type="warning">需求方</el-tag>
            <el-tag v-if="row.providerLevel" type="success">服务方</el-tag>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="row.status === 'active' ? 'bg-green-500' : 'bg-gray-300'"></div>
            <span class="text-sm">{{ row.status === 'active' ? '正常' : '待审核' }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small">详情</el-button>
          <el-button link type="primary" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
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
import { Search, Plus } from '@element-plus/icons-vue'
import { bUsers } from '../data/mockUsers'
import { ElMessage } from 'element-plus'

const list = ref(bUsers)
const searchQuery = ref('')
const filterType = ref('')

const filteredList = computed(() => {
  return list.value.filter(item => {
    const matchSearch = item.companyName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchType = !filterType.value || item.type === filterType.value
    return matchSearch && matchType
  })
})

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
</script>
