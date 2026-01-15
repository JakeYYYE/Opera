<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-800">B端用户管理</h1>
        <p class="text-gray-500 text-xs md:text-sm mt-1">管理B端用户信息与展示标签</p>
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <el-button type="primary" class="flex-1 md:flex-none" @click="openCreate">新增服务商</el-button>
        <el-button type="primary" plain class="flex-1 md:flex-none" @click="router.push('/service-providers')">前台服务商库</el-button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5">
      <div class="flex flex-col md:flex-row gap-3">
        <div class="flex-1 min-w-0">
          <el-input v-model="filters.keyword" placeholder="搜索服务商名称/标签/区域" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="grid grid-cols-2 md:flex md:items-center gap-3">
          <div class="w-full md:w-44">
            <el-select v-model="filters.category" placeholder="标签" clearable class="w-full">
              <el-option v-for="t in allTags" :key="t" :label="t" :value="t" />
            </el-select>
          </div>
          <div class="w-full md:w-44">
            <el-select v-model="filters.city" placeholder="区域" clearable class="w-full">
              <el-option v-for="c in cities" :key="c" :label="c" :value="c" />
            </el-select>
          </div>
          <div class="w-full md:w-44 col-span-2 md:col-auto">
            <el-select v-model="filters.status" placeholder="状态" clearable class="w-full">
              <el-option label="上架" value="上架" />
              <el-option label="下架" value="下架" />
            </el-select>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
      <!-- Desktop Table -->
      <el-table :data="pagedProviders" stripe style="width: 100%" class="hidden md:block">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="服务商" min-width="260">
          <template #default="{ row }">
            <div class="flex items-center gap-3 min-w-0">
              <img :src="row.logo" class="w-10 h-10 rounded-lg bg-white border border-gray-200 object-contain flex-shrink-0" />
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                    <div class="font-medium text-gray-800 truncate">{{ row.name }}</div>
                    <el-tag v-if="row.isVerified" type="success" size="small" effect="plain" round>官方认证</el-tag>
                </div>
                <div class="text-xs text-gray-500 truncate">{{ row.location }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="评分" width="110">
          <template #default="{ row }">
            <div class="flex items-center gap-1 text-yellow-500 font-bold">
              <el-icon><StarFilled /></el-icon>
              <span class="text-gray-800">{{ row.rating }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deals" label="成交量" width="110" />
        <el-table-column label="标签" min-width="200">
          <template #default="{ row }">
            <div class="flex flex-wrap gap-1">
              <el-tag v-for="t in row.tags" :key="t" size="small" type="info">{{ t }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="联系人" width="150">
          <template #default="{ row }">
            <div class="text-sm">{{ row.contactPerson }}</div>
            <div class="text-xs text-gray-400">{{ row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.active ? 'success' : 'info'" size="small">{{ row.active ? '上架' : '下架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Mobile Card List -->
      <div class="md:hidden space-y-4 p-4">
        <div v-for="row in pagedProviders" :key="row.id" class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div class="flex items-start gap-3 mb-3">
            <img :src="row.logo" class="w-12 h-12 rounded-lg bg-white border border-gray-200 object-contain flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <div class="font-medium text-gray-900 truncate">{{ row.name }}</div>
                <el-tag v-if="row.isVerified" type="success" size="small" effect="plain" round>官方</el-tag>
              </div>
              <div class="text-xs text-gray-500 mt-1">{{ row.location }}</div>
            </div>
             <el-tag :type="row.active ? 'success' : 'info'" size="small">{{ row.active ? '上架' : '下架' }}</el-tag>
          </div>
          
          <div class="flex items-center gap-4 text-sm mb-3 bg-gray-50 p-2 rounded-lg">
             <div class="flex items-center gap-1">
                <span class="text-gray-500">评分</span>
                <div class="flex items-center gap-1 text-yellow-500 font-bold">
                  <el-icon><StarFilled /></el-icon>
                  <span class="text-gray-800">{{ row.rating }}</span>
                </div>
             </div>
             <div class="flex items-center gap-1">
                <span class="text-gray-500">成交</span>
                <span class="font-medium">{{ row.deals }}</span>
             </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-3">
            <el-tag v-for="t in row.tags" :key="t" size="small" type="info">{{ t }}</el-tag>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
             <div>联系人: <span class="text-gray-800">{{ row.contactPerson }}</span></div>
             <div>电话: <span class="text-gray-800">{{ row.phone }}</span></div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-gray-50">
             <el-button size="small" type="primary" link @click="openEdit(row)">编辑</el-button>
             <el-button size="small" type="danger" link>删除</el-button>
          </div>
        </div>
      </div>
      
      <div class="p-4 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="filteredProviders.length"
          layout="total, prev, pager, next"
        />
      </div>
    </div>

    <el-dialog v-model="dialog.visible" :title="dialog.mode === 'create' ? '新增服务商' : '编辑服务商'" width="720px">
      <el-form :model="form" label-width="96px">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="名称" class="col-span-2">
              <el-input v-model="form.name" placeholder="请输入服务商名称" />
            </el-form-item>
            <el-form-item label="Logo" class="col-span-2">
              <el-input v-model="form.logo" placeholder="请输入图片链接" />
            </el-form-item>
            <el-form-item label="区域">
              <el-input v-model="form.location" placeholder="例如：北京 · 朝阳" />
            </el-form-item>
             <el-form-item label="官方认证">
              <el-switch v-model="form.isVerified" active-text="是" inactive-text="否" />
            </el-form-item>
             <el-form-item label="评分">
              <el-input-number v-model="form.rating" :min="0" :max="5" :step="0.1" class="w-full" />
            </el-form-item>
            <el-form-item label="成交量">
              <el-input-number v-model="form.deals" :min="0" :step="1" class="w-full" />
            </el-form-item>
            <el-form-item label="标签" class="col-span-2">
              <el-select v-model="form.tags" multiple filterable allow-create default-first-option class="w-full" placeholder="请选择或输入标签">
                <el-option v-for="t in allTags" :key="t" :label="t" :value="t" />
              </el-select>
            </el-form-item>
        </div>

        <el-divider content-position="left">详细信息</el-divider>

        <el-form-item label="简介">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="服务商简介" />
        </el-form-item>

        <el-divider content-position="left">联系信息</el-divider>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="联系人">
              <el-input v-model="form.contactPerson" placeholder="姓名" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="form.phone" placeholder="电话号码" />
            </el-form-item>
         </div>

        <el-divider content-position="left">服务能力</el-divider>
        <div class="space-y-3">
          <div
            v-for="(service, index) in form.services"
            :key="index"
            class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
          >
            <el-form-item label="名称" class="md:col-span-4">
              <el-input v-model="service.name" placeholder="如：低空物流配送方案" />
            </el-form-item>
            <el-form-item label="价格" class="md:col-span-3">
              <el-input v-model="service.price" placeholder="如：¥5000起 / ¥8000/天" />
            </el-form-item>
            <el-form-item label="描述" class="md:col-span-4">
              <el-input v-model="service.desc" placeholder="简要说明服务内容" />
            </el-form-item>
            <div class="md:col-span-1 flex justify-end">
              <el-button type="danger" text @click="removeService(index)">删除</el-button>
            </div>
          </div>
          <el-button type="primary" link @click="addService">+ 新增服务能力</el-button>
        </div>

        <el-divider />

        <el-form-item label="状态">
          <el-switch v-model="form.active" active-text="上架" inactive-text="下架" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button type="primary" @click="submit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, StarFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useMockData } from '../composables/useMockData'

const router = useRouter()
const { state } = useMockData()

const filters = reactive({
  keyword: '',
  category: '',
  city: '',
  status: ''
})

const providersState = computed(() => state.value.providers || [])

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const allTags = computed(() => Array.from(new Set(providersState.value.flatMap((p) => p.tags || []))).filter(Boolean))

const cities = computed(() => Array.from(new Set(providersState.value.map((p) => String(p.location || '').split('·')[0].trim()))).filter(Boolean))

const filteredProviders = computed(() => {
  const kw = filters.keyword.trim().toLowerCase()
  return providersState.value.filter((p) => {
    const tags = p.tags || []
    const hitKw = !kw || [p.name, p.location, ...tags].some((v) => String(v).toLowerCase().includes(kw))
    const hitTag = !filters.category || tags.includes(filters.category)
    const city = String(p.location || '').split('·')[0].trim()
    const hitCity = !filters.city || city === filters.city
    const hitStatus = !filters.status || (filters.status === '上架' ? !!p.active : !p.active)
    return hitKw && hitTag && hitCity && hitStatus
  })
})

const pagedProviders = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredProviders.value.slice(start, start + pagination.pageSize)
})

watch(
  () => [filters.keyword, filters.category, filters.city, filters.status],
  () => {
    pagination.page = 1
  }
)

const dialog = reactive({
  visible: false,
  mode: 'create'
})

const form = reactive({
  id: null,
  name: '',
  logo: '',
  rating: 5,
  deals: 0,
  tags: [],
  location: '',
  desc: '',
  isVerified: false,
  contactPerson: '',
  phone: '',
  active: true,
  services: []
})

const resetForm = () => {
  form.id = null
  form.name = ''
  form.logo = ''
  form.rating = 5
  form.deals = 0
  form.tags = []
  form.location = ''
  form.desc = ''
  form.isVerified = false
  form.contactPerson = ''
  form.phone = ''
  form.active = true
  form.services = []
}

const openCreate = () => {
  dialog.mode = 'create'
  resetForm()
  dialog.visible = true
}

const openEdit = (row) => {
  dialog.mode = 'edit'
  form.id = row.id
  form.name = row.name
  form.logo = row.logo
  form.rating = Number(row.rating) || 0
  form.deals = Number(row.deals) || 0
  form.tags = Array.isArray(row.tags) ? [...row.tags] : []
  form.location = row.location
  form.desc = row.desc || ''
  form.isVerified = !!(row.verified ?? row.isVerified)
  form.contactPerson = row.contactPerson || ''
  form.phone = row.phone || ''
  form.active = row.active === undefined ? true : !!row.active
  form.services = Array.isArray(row.services) ? row.services.map((s) => ({ ...s })) : []
  dialog.visible = true
}

const submit = () => {
  const name = form.name.trim()
  const logo = form.logo.trim()
  
  if (!name) {
    ElMessage.error('请输入服务商名称')
    return
  }

  if (dialog.mode === 'create') {
    const newId = Math.max(...providersState.value.map(p => p.id), 0) + 1
    if (!Array.isArray(state.value.providers)) {
      state.value.providers = []
    }
    state.value.providers.unshift({
      id: newId,
      name,
      logo,
      rating: form.rating,
      deals: form.deals,
      tags: [...form.tags],
      location: form.location,
      desc: form.desc,
      verified: form.isVerified,
      contactPerson: form.contactPerson,
      phone: form.phone,
      active: form.active,
      services: form.services.map((s) => ({ ...s })),
      cases: []
    })
    ElMessage.success('服务商创建成功')
  } else {
    const index = (state.value.providers || []).findIndex(p => p.id === form.id)
    if (index > -1) {
      const prev = state.value.providers[index] || {}
      state.value.providers[index] = {
        ...prev,
        name,
        logo,
        rating: form.rating,
        deals: form.deals,
        tags: [...form.tags],
        location: form.location,
        desc: form.desc,
        verified: form.isVerified,
        contactPerson: form.contactPerson,
        phone: form.phone,
        active: form.active,
        services: form.services.map((s) => ({ ...s })),
        cases: prev.cases || []
      }
      ElMessage.success('服务商信息已更新')
    }
  }
  dialog.visible = false
}

const addService = () => {
  form.services.push({
    name: '',
    price: '',
    desc: ''
  })
}

const removeService = (index) => {
  if (index < 0 || index >= form.services.length) return
  form.services.splice(index, 1)
}
</script>
