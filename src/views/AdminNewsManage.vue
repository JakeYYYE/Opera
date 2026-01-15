<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900">文章管理</h1>
        <p class="text-gray-500 text-xs md:text-sm mt-1">管理平台所有文章内容，包括创建、编辑、发布和下架</p>
      </div>
      <div class="flex items-center gap-3 self-end md:self-auto">
        <span class="text-sm text-gray-700">张编辑</span>
        <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white rounded-xl border border-gray-100 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div class="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
        <el-checkbox v-model="selectionState.all" :indeterminate="selectionState.indeterminate" @change="handleSelectAll" />
        <el-dropdown trigger="click" :disabled="selectionState.count === 0">
          <el-button>
            批量操作 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>批量发布</el-dropdown-item>
              <el-dropdown-item>批量下架</el-dropdown-item>
              <el-dropdown-item divided type="danger">批量删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span class="text-gray-500 text-sm whitespace-nowrap">已选中 {{ selectionState.count }} 项</span>
      </div>
      <div class="flex gap-2 w-full md:w-auto">
        <el-button icon="Upload" class="flex-1 md:flex-none">导入</el-button>
        <el-button icon="Download" class="flex-1 md:flex-none">导出</el-button>
        <el-button type="primary" icon="Plus" @click="openCreate" class="flex-1 md:flex-none">新建文章</el-button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-gray-100 p-4 md:p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-medium text-gray-900">内容筛选</h3>
        <el-button link type="primary" @click="resetFilters">重置筛选条件</el-button>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div class="col-span-2 md:col-span-1">
          <label class="block text-xs text-gray-500 mb-1">标题</label>
          <el-input v-model="filters.keyword" placeholder="请输入标题关键词" prefix-icon="Search" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">栏目</label>
          <el-select v-model="filters.category" placeholder="全部栏目" class="w-full" clearable>
            <el-option label="行业资讯" value="行业资讯" />
            <el-option label="政策法规" value="政策法规" />
            <el-option label="行业动态" value="行业动态" />
            <el-option label="企业动态" value="企业动态" />
            <el-option label="招标信息" value="招标信息" />
          </el-select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">状态</label>
          <el-select v-model="filters.status" placeholder="全部状态" class="w-full" clearable>
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="待审核" value="pending" />
          </el-select>
        </div>
        <div class="col-span-2 md:col-span-1">
          <label class="block text-xs text-gray-500 mb-1">发布时间</label>
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始"
            end-placeholder="结束"
            class="w-full"
            style="width: 100%"
          />
        </div>
        <!-- Row 2 -->
        <div>
          <label class="block text-xs text-gray-500 mb-1">来源</label>
          <el-select v-model="filters.source" placeholder="全部来源" class="w-full" clearable>
            <el-option label="原创" value="original" />
            <el-option label="转载" value="repost" />
          </el-select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">标签</label>
          <el-select v-model="filters.tag" placeholder="全部标签" class="w-full" clearable>
            <el-option label="推荐" value="recommend" />
            <el-option label="置顶" value="top" />
          </el-select>
        </div>
        <div class="col-span-2 md:col-span-1">
          <label class="block text-xs text-gray-500 mb-1">作者</label>
          <el-input v-model="filters.author" placeholder="请输入作者名称" prefix-icon="User" />
        </div>
        <div class="col-span-2 md:col-span-1 flex items-end">
          <el-button type="primary" class="w-full" @click="applyFilters">查询</el-button>
        </div>
      </div>
    </div>

    <!-- Table List -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <!-- Desktop Table -->
      <el-table 
        :data="pagedNews" 
        style="width: 100%"
        @selection-change="handleSelectionChange"
        class="hidden md:block"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="标题" min-width="400">
          <template #default="{ row }">
            <div class="flex gap-4 py-2">
              <img :src="row.cover" class="w-32 h-20 object-cover rounded-lg border border-gray-100 bg-gray-50 flex-shrink-0" />
              <div class="flex flex-col justify-between py-0.5 min-w-0">
                <div class="font-medium text-gray-900 truncate text-base" :title="row.title">{{ row.title }}</div>
                <div class="flex gap-2 mt-2">
                  <el-tag v-for="tag in (row.tags || [])" :key="tag" size="small" effect="plain" class="!bg-blue-50 !text-blue-600 !border-blue-100">
                    #{{ tag }}
                  </el-tag>
                  <el-tag v-if="!row.tags || row.tags.length === 0" size="small" type="info" effect="plain">无标签</el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="category" label="栏目" width="120">
          <template #default="{ row }">
            <span class="text-gray-600">{{ row.category }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'" effect="light" round>
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="views" label="阅读量" width="100">
          <template #default="{ row }">
             <div class="text-gray-900">{{ row.views.toLocaleString() }}</div>
          </template>
        </el-table-column>

        <el-table-column prop="publishTime" label="发布时间" width="180">
          <template #default="{ row }">
            <div class="text-gray-600 text-sm">{{ row.publishTime }}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-button circle size="small" icon="View" />
              <el-button circle size="small" type="primary" icon="Edit" @click="openEdit(row)" />
              <el-dropdown trigger="click">
                <el-button circle size="small" icon="More" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="removeRow(row)" class="text-red-500">删除</el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'published'">下架</el-dropdown-item>
                    <el-dropdown-item v-else>发布</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- Mobile Card List -->
      <div class="md:hidden space-y-4 p-4">
         <div v-for="row in pagedNews" :key="row.id" class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div class="flex gap-3 mb-3">
               <img :src="row.cover" class="w-24 h-20 object-cover rounded-lg border border-gray-100 bg-gray-50 flex-shrink-0" />
               <div class="flex-1 min-w-0 flex flex-col justify-between">
                  <div class="font-medium text-gray-900 line-clamp-2 leading-snug">{{ row.title }}</div>
                  <div class="flex items-center justify-between mt-1">
                     <span class="text-xs text-gray-500">{{ row.category }}</span>
                     <el-tag :type="row.status === 'published' ? 'success' : 'info'" size="small" effect="light" round>
                       {{ row.status === 'published' ? '已发布' : '草稿' }}
                     </el-tag>
                  </div>
               </div>
            </div>
            
            <div class="flex flex-wrap gap-2 mb-3">
              <el-tag v-for="tag in (row.tags || [])" :key="tag" size="small" effect="plain" class="!bg-blue-50 !text-blue-600 !border-blue-100">
                #{{ tag }}
              </el-tag>
            </div>

            <div class="flex justify-between items-center text-xs text-gray-500 border-t border-gray-50 pt-3">
               <div class="flex gap-3">
                  <span>阅读 {{ row.views }}</span>
                  <span>{{ row.publishTime.split(' ')[0] }}</span>
               </div>
               <div class="flex gap-2">
                  <el-button size="small" icon="Edit" circle @click="openEdit(row)" />
                  <el-button size="small" icon="Delete" circle type="danger" plain @click="removeRow(row)" />
               </div>
            </div>
         </div>
      </div>

      <div class="p-4 flex items-center justify-center md:justify-between border-t border-gray-100">
        <span class="hidden md:inline text-gray-500 text-sm">显示 {{ pagedNews.length }} 条，共 {{ filteredNews.length }} 条</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          background
          layout="prev, pager, next"
          :total="filteredNews.length"
          small
        />
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog v-model="dialog.visible" :title="dialog.mode === 'create' ? '新建文章' : '编辑文章'" width="800px">
      <el-form :model="form" label-width="80px" class="max-h-[600px] overflow-y-auto pr-4">
        <el-form-item label="文章标题">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        
        <div class="grid grid-cols-2 gap-4">
          <el-form-item label="所属栏目">
            <el-select v-model="form.category" class="w-full">
              <el-option label="行业资讯" value="行业资讯" />
              <el-option label="政策法规" value="政策法规" />
              <el-option label="行业动态" value="行业动态" />
              <el-option label="企业动态" value="企业动态" />
              <el-option label="招标信息" value="招标信息" />
            </el-select>
          </el-form-item>
          <el-form-item label="文章来源">
            <el-input v-model="form.author" placeholder="请输入来源" />
          </el-form-item>
        </div>

        <el-form-item label="封面图片">
          <div class="flex gap-4 items-start w-full">
            <el-input v-model="form.cover" placeholder="请输入图片URL" class="flex-1" />
            <img v-if="form.cover" :src="form.cover" class="w-24 h-16 object-cover rounded border border-gray-200" />
          </div>
        </el-form-item>

        <el-form-item label="文章摘要">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="请输入文章摘要" />
        </el-form-item>

        <el-form-item label="文章标签">
           <el-select
              v-model="form.tags"
              multiple
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="输入标签后按回车"
              class="w-full"
            />
        </el-form-item>

        <el-form-item label="发布设置">
          <div class="flex flex-col gap-2">
            <el-radio-group v-model="form.status">
              <el-radio value="published">立即发布</el-radio>
              <el-radio value="draft">存为草稿</el-radio>
              <el-radio value="pending">提交审核</el-radio>
            </el-radio-group>
            <el-date-picker
              v-if="form.status === 'published'"
              v-model="form.publishTime"
              type="datetime"
              placeholder="选择发布时间"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </div>
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
import { Search, Plus, Upload, Download, ArrowDown, User, View, Edit, More } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockNewsList } from '../data/mockNews'

// Enhance mock data with tags if missing
const enhancedMockList = mockNewsList.map(item => ({
  ...item,
  tags: item.tags || ['行业动态', '无人机']
}))

const newsState = ref(enhancedMockList)

const filters = reactive({
  keyword: '',
  category: '',
  status: '',
  source: '',
  author: '',
  tag: '',
  dateRange: null
})

const selectionState = reactive({
  count: 0,
  all: false,
  indeterminate: false,
  rows: []
})

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const filteredNews = computed(() => {
  const kw = filters.keyword.trim().toLowerCase()
  return newsState.value.filter((n) => {
    const hitKw = !kw || [n.title, n.desc].some((v) => String(v).toLowerCase().includes(kw))
    const hitCategory = !filters.category || n.category === filters.category
    const hitStatus = !filters.status || n.status === filters.status
    const hitAuthor = !filters.author || n.author.includes(filters.author)
    // Date range logic could go here
    return hitKw && hitCategory && hitStatus && hitAuthor
  })
})

const pagedNews = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredNews.value.slice(start, start + pagination.pageSize)
})

const handleSelectionChange = (val) => {
  selectionState.rows = val
  selectionState.count = val.length
  selectionState.all = val.length > 0 && val.length === pagedNews.value.length
  selectionState.indeterminate = val.length > 0 && val.length < pagedNews.value.length
}

const handleSelectAll = (val) => {
  // Logic to toggle all current page selection
  // Note: element table requires ref to toggle selection programmatically
}

const resetFilters = () => {
  filters.keyword = ''
  filters.category = ''
  filters.status = ''
  filters.source = ''
  filters.author = ''
  filters.tag = ''
  filters.dateRange = null
}

const applyFilters = () => {
  pagination.page = 1
}

const dialog = reactive({
  visible: false,
  mode: 'create'
})

const form = reactive({
  id: null,
  title: '',
  category: '',
  cover: '',
  desc: '',
  author: '',
  status: 'published',
  tags: [],
  publishTime: ''
})

const resetForm = () => {
  form.id = null
  form.title = ''
  form.category = '行业资讯'
  form.cover = ''
  form.desc = ''
  form.author = ''
  form.status = 'published'
  form.tags = []
  form.publishTime = new Date().toISOString().slice(0, 19).replace('T', ' ')
}

const openCreate = () => {
  dialog.mode = 'create'
  resetForm()
  dialog.visible = true
}

const openEdit = (row) => {
  dialog.mode = 'edit'
  Object.assign(form, row)
  form.tags = row.tags ? [...row.tags] : []
  dialog.visible = true
}

const submit = () => {
  if (!form.title) return ElMessage.warning('请填写标题')
  
  const payload = { ...form }
  
  if (dialog.mode === 'create') {
    payload.id = Date.now()
    payload.views = 0
    newsState.value.unshift(payload)
    ElMessage.success('已创建')
  } else {
    const idx = newsState.value.findIndex(n => n.id === form.id)
    if (idx > -1) {
      newsState.value[idx] = { ...newsState.value[idx], ...payload }
      ElMessage.success('已更新')
    }
  }
  dialog.visible = false
}

const removeRow = (row) => {
  ElMessageBox.confirm(`确认删除文章「${row.title}」？`, '提示', {
    type: 'warning'
  }).then(() => {
    newsState.value = newsState.value.filter(n => n.id !== row.id)
    ElMessage.success('已删除')
  })
}
</script>