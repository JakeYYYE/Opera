<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900">栏目管理</h1>
        <p class="text-gray-500 text-xs md:text-sm mt-1">管理内容分类体系，支持二级分类结构</p>
      </div>
      <div class="flex flex-col md:flex-row gap-4">
        <el-input
          v-model="searchQuery"
          placeholder="搜索栏目..."
          prefix-icon="Search"
          class="w-full md:w-64"
        />
        <el-button type="primary" icon="Plus" @click="handleAddRoot" class="w-full md:w-auto">添加栏目</el-button>
      </div>
    </div>

    <!-- Desktop Table -->
    <div class="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div class="flex items-center gap-4">
          <el-checkbox 
            v-model="isAllSelected" 
            :indeterminate="isIndeterminate"
            @change="handleSelectAll"
          />
          <el-dropdown trigger="click" :disabled="selectedCount === 0">
            <el-button :disabled="selectedCount === 0">
              批量操作 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>启用</el-dropdown-item>
                <el-dropdown-item>禁用</el-dropdown-item>
                <el-dropdown-item divided type="danger">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span class="text-gray-500 text-sm">已选中 {{ selectedCount }} 项</span>
        </div>
      </div>

      <el-table
        :data="categoryData"
        row-key="id"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
        class="w-full"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="栏目名称" min-width="300">
          <template #default="{ row }">
            <div class="flex items-center gap-2 group">
              <span class="font-medium text-gray-700">{{ row.name }}</span>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-4">
                <el-button link type="primary" icon="Edit" @click="handleEdit(row)" />
                <el-button link type="success" icon="Plus" @click="handleAddSub(row)" v-if="!row.parentId" />
                <el-button link type="danger" icon="Delete" @click="handleDelete(row)" />
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="排序" width="150" align="center">
          <template #default="{ row }">
            <el-input-number 
              v-model="row.sort" 
              controls-position="right" 
              size="small" 
              class="w-24"
            />
          </template>
        </el-table-column>

        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
              :active-value="true"
              :inactive-value="false"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Mobile Card List -->
    <div class="md:hidden space-y-4">
      <div v-for="parent in categoryData" :key="parent.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <!-- Parent Header -->
        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="font-bold text-gray-900 text-lg flex items-center gap-2">
               {{ parent.name }}
               <el-tag v-if="!parent.status" type="info" size="small" effect="plain">禁用</el-tag>
            </div>
            <div class="text-xs text-gray-500 mt-1">排序: {{ parent.sort }}</div>
          </div>
          <div class="flex gap-2">
            <el-button size="small" circle icon="Plus" type="success" plain @click="handleAddSub(parent)" />
            <el-button size="small" circle icon="Edit" type="primary" plain @click="handleEdit(parent)" />
            <el-button size="small" circle icon="Delete" type="danger" plain @click="handleDelete(parent)" />
          </div>
        </div>

        <!-- Sub Categories -->
        <div v-if="parent.children && parent.children.length > 0" class="pl-4 border-l-2 border-gray-100 space-y-3">
           <div v-for="child in parent.children" :key="child.id" class="bg-gray-50 rounded-lg p-3">
              <div class="flex justify-between items-center">
                 <div class="font-medium text-gray-700">{{ child.name }}</div>
                 <div class="flex items-center gap-1">
                    <el-button link size="small" icon="Edit" @click="handleEdit(child)" />
                    <el-button link size="small" icon="Delete" type="danger" @click="handleDelete(child)" />
                 </div>
              </div>
              <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
                 <span>排序: {{ child.sort }}</span>
                 <el-switch v-model="child.status" size="small" inline-prompt active-text="开" inactive-text="关" />
              </div>
           </div>
        </div>
        <div v-else class="text-xs text-gray-400 pl-4 py-2 italic">暂无子栏目</div>
      </div>
    </div>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加栏目' : '编辑栏目'"
      width="500px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="上级栏目">
          <el-select v-model="form.parentId" class="w-full" :disabled="!!form.parentId && dialogType === 'add-sub'">
            <el-option label="顶级栏目" :value="null" />
            <el-option 
              v-for="item in rootCategories" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="栏目名称">
          <el-input v-model="form.name" placeholder="请输入栏目名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Plus, Edit, Delete, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchQuery = ref('')
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add', 'edit', 'add-sub'
const selectedRows = ref([])

// Mock Data
const categoryData = ref([
  {
    id: 1,
    name: '行业资讯',
    sort: 1,
    status: true,
    parentId: null,
    children: [
      { id: 11, name: '政策法规', sort: 1, status: true, parentId: 1 },
      { id: 12, name: '行业动态', sort: 2, status: true, parentId: 1 },
      { id: 13, name: '企业动态', sort: 3, status: true, parentId: 1 },
    ]
  },
  {
    id: 2,
    name: '招标信息',
    sort: 2,
    status: true,
    parentId: null,
    children: [
      { id: 21, name: '设备采购', sort: 1, status: true, parentId: 2 },
      { id: 22, name: '服务招标', sort: 2, status: true, parentId: 2 },
    ]
  },
  {
    id: 3,
    name: '政策法规',
    sort: 3,
    status: true,
    parentId: null,
    children: []
  },
  {
    id: 4,
    name: '关于我们',
    sort: 4,
    status: false,
    parentId: null,
    children: []
  }
])

const rootCategories = computed(() => categoryData.value.map(c => ({ id: c.id, name: c.name })))

const form = ref({
  id: null,
  name: '',
  parentId: null,
  sort: 0,
  status: true
})

// Selection Logic
const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const selectedCount = computed(() => selectedRows.value.length)
const isAllSelected = computed(() => selectedRows.value.length > 0 && selectedRows.value.length === flatCategories.value.length)
const isIndeterminate = computed(() => selectedRows.value.length > 0 && selectedRows.value.length < flatCategories.value.length)

// Helper to flatten categories for counting
const flatCategories = computed(() => {
  let flat = []
  const traverse = (nodes) => {
    nodes.forEach(node => {
      flat.push(node)
      if (node.children) traverse(node.children)
    })
  }
  traverse(categoryData.value)
  return flat
})

const handleSelectAll = (val) => {
  // Element table handles "select all" via the checkbox in header usually, 
  // but if we implemented custom header checkbox:
  // This needs ref to table instance to toggleRowSelection
}

// Actions
const handleAddRoot = () => {
  dialogType.value = 'add'
  form.value = { id: null, name: '', parentId: null, sort: 0, status: true }
  dialogVisible.value = true
}

const handleAddSub = (row) => {
  dialogType.value = 'add-sub'
  form.value = { id: null, name: '', parentId: row.id, sort: 0, status: true }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该栏目吗？如果该栏目下有子栏目，将一并删除。',
    '警告',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    deleteCategory(row.id)
    ElMessage.success('删除成功')
  })
}

const deleteCategory = (id) => {
  const remove = (list) => {
    const idx = list.findIndex(item => item.id === id)
    if (idx > -1) {
      list.splice(idx, 1)
      return true
    }
    for (const item of list) {
      if (item.children && remove(item.children)) return true
    }
    return false
  }
  remove(categoryData.value)
}

const handleSave = () => {
  if (!form.value.name) {
    ElMessage.warning('请输入栏目名称')
    return
  }

  if (dialogType.value === 'edit') {
    // Update existing
    updateCategory(form.value)
  } else {
    // Create new
    const newId = Date.now()
    const newItem = { ...form.value, id: newId, children: [] }
    
    if (newItem.parentId) {
      const parent = categoryData.value.find(c => c.id === newItem.parentId)
      if (parent) {
        if (!parent.children) parent.children = []
        parent.children.push(newItem)
      }
    } else {
      categoryData.value.push(newItem)
    }
  }
  
  dialogVisible.value = false
  ElMessage.success('保存成功')
}

const updateCategory = (data) => {
  const update = (list) => {
    for (let item of list) {
      if (item.id === data.id) {
        Object.assign(item, data)
        return true
      }
      if (item.children && update(item.children)) return true
    }
    return false
  }
  update(categoryData.value)
}
</script>

<style scoped>
:deep(.el-table__inner-wrapper::before) {
  display: none;
}
</style>