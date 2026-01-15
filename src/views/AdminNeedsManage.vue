<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-800">需求管理</h1>
        <p class="text-gray-500 text-sm mt-1">维护需求信息，确保前台展示一致</p>
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <el-button class="flex-1 md:flex-none" type="primary" @click="openCreate">新增需求</el-button>
        <el-button class="flex-1 md:flex-none" type="primary" plain @click="router.push('/service-needs')">前台大厅</el-button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div class="flex flex-col lg:flex-row lg:items-center gap-3">
        <div class="flex-1 min-w-0">
          <el-input v-model="filters.keyword" placeholder="搜索标题/区域/分类" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="w-full lg:w-44">
          <el-select v-model="filters.status" placeholder="状态" clearable class="w-full">
            <el-option label="进行中" value="进行中" />
            <el-option label="已结束" value="已结束" />
          </el-select>
        </div>
        <div class="w-full lg:w-44">
          <el-select v-model="filters.category" placeholder="分类" clearable class="w-full">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- Mobile Card List -->
    <div class="md:hidden space-y-4">
      <div v-for="row in pagedNeeds" :key="row.id" class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-start mb-2">
           <div class="font-medium text-gray-800 line-clamp-2 flex-1 mr-2">{{ row.title }}</div>
           <span class="text-xs px-2 py-1 rounded-full whitespace-nowrap" :class="row.status === '进行中' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'">
              {{ row.status }}
           </span>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-3">
          <el-tag size="small" type="info">{{ row.category }}</el-tag>
          <el-tag size="small" type="warning" plain>{{ row.location }}</el-tag>
          <el-tag v-if="row.urgent" type="danger" size="small" effect="dark">紧急</el-tag>
        </div>

        <div class="grid grid-cols-2 gap-2 text-sm mb-3 text-gray-500">
           <div>预算: <span class="text-gray-800 font-medium">{{ row.budget }}</span></div>
           <div>截止: {{ row.deadline }}</div>
           <div class="col-span-2 text-xs truncate">{{ row.owner?.org }} · {{ row.owner?.name }}</div>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-gray-50">
           <el-button size="small" type="primary" link @click="openEdit(row)">编辑</el-button>
           <el-button size="small" type="danger" link @click="removeRow(row)">删除</el-button>
           <el-button size="small" link @click="router.push(`/service-needs/${row.id}`)">前台</el-button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 shadow-sm hidden md:block">
      <el-table :data="pagedNeeds" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="280">
          <template #default="{ row }">
            <div class="flex flex-col gap-1 min-w-0 py-2">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-800 truncate">{{ row.title }}</span>
                <span v-if="row.urgent" class="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded font-medium flex-shrink-0">紧急</span>
              </div>
              <div class="text-xs text-gray-500 truncate">{{ row.owner?.org }} · {{ row.owner?.name }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="location" label="区域" width="140" />
        <el-table-column prop="budget" label="预算" width="140" />
        <el-table-column prop="deadline" label="截止日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <span class="text-xs px-2 py-1 rounded-full" :class="row.status === '进行中' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'">
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openEdit(row)">编辑</el-button>
            <el-button text type="danger" @click="removeRow(row)">删除</el-button>
            <el-button text @click="router.push(`/service-needs/${row.id}`)">前台</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="p-4 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          background
          layout="prev, pager, next"
          :total="filteredNeeds.length"
        />
      </div>
    </div>

    <el-dialog v-model="dialog.visible" :title="dialog.mode === 'create' ? '新增需求' : '编辑需求'" width="800px" top="5vh">
      <el-form :model="form" label-width="96px" class="max-h-[70vh] overflow-y-auto pr-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <el-form-item label="标题" class="col-span-2">
            <el-input v-model="form.title" placeholder="请输入需求标题" />
          </el-form-item>
          
          <el-form-item label="分类">
            <el-select v-model="form.category" filterable allow-create default-first-option class="w-full" placeholder="请选择或输入分类">
              <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="状态">
            <el-select v-model="form.status" class="w-full" placeholder="请选择状态">
              <el-option label="进行中" value="进行中" />
              <el-option label="已结束" value="已结束" />
            </el-select>
          </el-form-item>

          <el-form-item label="区域">
            <el-input v-model="form.location" placeholder="例如：北京市 · 朝阳区" />
          </el-form-item>

          <el-form-item label="预算">
            <el-input v-model="form.budget" placeholder="例如：¥50,000 / 月" />
          </el-form-item>

          <el-form-item label="截止日期">
            <el-date-picker v-model="form.deadline" type="date" value-format="YYYY-MM-DD" class="w-full" />
          </el-form-item>

          <el-form-item label="发布时间">
            <el-date-picker v-model="form.publishTime" type="datetime" value-format="YYYY-MM-DD HH:mm" class="w-full" />
          </el-form-item>

          <el-form-item label="紧急需求">
            <el-switch v-model="form.urgent" />
          </el-form-item>

          <el-form-item label="浏览量">
             <el-input-number v-model="form.views" :min="0" controls-position="right" class="w-full" />
          </el-form-item>
        </div>

        <el-divider content-position="left">需求详情</el-divider>

        <el-form-item label="需求描述">
          <el-input v-model="form.desc" type="textarea" :rows="3" placeholder="简要描述需求背景与核心目标" />
        </el-form-item>

        <el-form-item label="任务要求">
          <el-input v-model="form.requirementsText" type="textarea" :rows="4" placeholder="每行一条任务要求" />
        </el-form-item>

        <el-form-item label="交付成果">
          <el-input v-model="form.deliverablesText" type="textarea" :rows="3" placeholder="格式：成果名称 | 描述 | 格式（每行一条）" />
          <div class="text-xs text-gray-400 mt-1">例如：日运输记录 | 每趟签收、温控曲线 | PDF/Excel</div>
        </el-form-item>

        <el-divider content-position="left">联系人信息</el-divider>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <el-form-item label="单位名称" label-width="80px">
            <el-input v-model="form.owner.org" placeholder="发布单位" />
          </el-form-item>
          <el-form-item label="联系人" label-width="80px">
            <el-input v-model="form.owner.name" placeholder="联系人姓名" />
          </el-form-item>
          <el-form-item label="电话" label-width="80px">
            <el-input v-model="form.owner.phone" placeholder="联系电话" />
          </el-form-item>
        </div>

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
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const filters = reactive({
  keyword: '',
  status: '',
  category: ''
})

// Mock data aligned with ServiceNeedDetail.vue
const needs = [
  {
    id: 1,
    category: '医疗急救',
    title: '市中心医院-分院区紧急血液样本每日往返运输服务',
    desc: '需具备医疗冷链运输资质，每日往返4次，单程距离15km，要求全天候响应能力。需提供符合医疗标准的运输箱及实时温控数据监测。',
    location: '北京市 · 朝阳区',
    budget: '¥50,000 / 月',
    publishTime: '2026-01-12 09:20',
    deadline: '2026-01-20',
    status: '进行中',
    urgent: true,
    views: 128,
    attachments: [
      { name: '运输路线与时段说明.pdf', size: '1.2MB' },
      { name: '温控数据标准.xlsx', size: '320KB' }
    ],
    requirements: [
      '具备医疗冷链运输相关资质与案例，支持全链路温控记录与追溯',
      '每日往返4次，单程约15km，可提供应急增派能力与备用机保障',
      '运输箱具备恒温/保温能力，支持实时温度记录与异常告警',
      '需配合医院取样流程，做到交接签收、时间戳记录与异常处置'
    ],
    deliverables: [
      { name: '日运输记录', desc: '每趟签收、温控曲线、异常记录', format: 'PDF/Excel' },
      { name: '月度服务报告', desc: '准点率、异常处置、优化建议', format: 'PDF' }
    ],
    owner: { org: '市中心医院', name: '张主任', phone: '138****1024' }
  },
  {
    id: 2,
    category: '巡检监测',
    title: '2026年度西山森林防火期无人机常态化巡查项目',
    desc: '覆盖林区面积约3000亩，要求具备红外热成像功能，能识别早期火点并自动报警。需提供每日巡检报告及异常情况实时图传。',
    location: '北京市 · 海淀区',
    budget: '¥280,000',
    publishTime: '2026-01-11 14:05',
    deadline: '2026-01-25',
    status: '进行中',
    urgent: false,
    views: 456,
    attachments: [{ name: '巡检范围示意图.kml', size: '860KB' }],
    requirements: [
      '覆盖巡检范围约3000亩，制定巡检航线与应急航线两套方案',
      '具备红外热成像能力，可识别早期火点并自动告警',
      '支持异常情况实时图传，提供当日巡检报告与问题闭环记录'
    ],
    deliverables: [
      { name: '每日巡检报告', desc: '航线、覆盖率、异常点位与截图', format: 'PDF' },
      { name: '告警处置记录', desc: '告警信息、处置过程、结果归档', format: 'PDF/Excel' }
    ],
    owner: { org: '西山林场管理处', name: '李科长', phone: '139****6630' }
  },
  {
    id: 3,
    category: '地理测绘',
    title: '通州副中心某新建园区高精度倾斜摄影建模',
    desc: '测区面积2平方公里，要求地面分辨率优于3cm，输出OSGB及3DTiles格式模型。工期要求：外业采集3天，内业处理7天。',
    location: '北京市 · 通州区',
    budget: '¥45,000',
    publishTime: '2026-01-11 09:30',
    deadline: '2026-01-22',
    status: '进行中',
    urgent: false,
    views: 89,
    attachments: [{ name: '测区边界.shp', size: '2.4MB' }],
    requirements: [
      '测区面积约2平方公里，GSD优于3cm，满足倾斜摄影采集规范',
      '输出OSGB与3DTiles模型，提供浏览与质检说明',
      '工期：外业3天，内业7天，提交阶段成果与验收材料'
    ],
    deliverables: [
      { name: 'OSGB实景模型', desc: '含纹理、坐标信息与浏览说明', format: 'OSGB' },
      { name: '3DTiles模型', desc: '支持Cesium加载的tileset', format: '3DTiles' }
    ],
    owner: { org: '通州副中心管委会', name: '王工', phone: '136****9081' }
  },
  {
    id: 4,
    category: '农林植保',
    title: '大兴区西瓜种植基地春季病虫害防治飞防服务',
    desc: '作业面积5000亩，主要防治蚜虫、红蜘蛛。要求使用T40或同级别以上机型，需自带药剂配比方案。',
    location: '北京市 · 大兴区',
    budget: '¥15 / 亩',
    publishTime: '2026-01-10 16:45',
    deadline: '2026-01-18',
    status: '进行中',
    urgent: false,
    views: 210,
    attachments: [],
    requirements: [
      '作业面积5000亩，按地块分批次完成，需提供作业计划与人员机组安排',
      '机型要求T40或同级别以上，具备精准喷洒与断点续喷能力',
      '提供药剂配比方案与安全用药说明，作业后提交作业轨迹与面积统计'
    ],
    deliverables: [
      { name: '作业轨迹与面积统计', desc: '含地块、面积、时间与轨迹文件', format: 'PDF/Excel' },
      { name: '作业照片/视频', desc: '关键地块作业留痕与效果证明', format: 'JPG/MP4' }
    ],
    owner: { org: '大兴区农业合作社', name: '赵队长', phone: '137****5512' }
  },
  {
    id: 5,
    category: '文旅体验',
    title: '慕田峪长城春季宣传片航拍素材采集',
    desc: '需要专业的FPV飞手及航拍团队，拍摄日出、云海及长城春色。要求4K 60fps以上画质，需配合地面导演组进行多机位协同。',
    location: '北京市 · 怀柔区',
    budget: '¥12,000 / 天',
    publishTime: '2026-01-09 11:10',
    deadline: '2026-01-16',
    status: '进行中',
    urgent: false,
    views: 340,
    attachments: [{ name: '分镜脚本与景别清单.docx', size: '540KB' }],
    requirements: [
      'FPV飞手与航拍团队具备商业拍摄经验，提供作品集与设备清单',
      '画质要求4K 60fps以上，具备ND镜与夜景拍摄辅助能力',
      '配合地面导演组进行多机位协同，按分镜完成素材交付'
    ],
    deliverables: [
      { name: '原始素材', desc: '按分镜编号整理交付', format: 'MOV/MP4' },
      { name: '航拍数据清单', desc: '含拍摄时间、机位、参数与备注', format: 'Excel' }
    ],
    owner: { org: '慕田峪景区运营中心', name: '刘导演', phone: '135****2209' }
  }
]

const needsState = ref(needs)

const pagination = reactive({
  page: 1,
  pageSize: 10
})

const categories = computed(() => Array.from(new Set(needsState.value.map((n) => n.category))).filter(Boolean))

const filteredNeeds = computed(() => {
  const kw = filters.keyword.trim().toLowerCase()
  return needsState.value.filter((n) => {
    const hitKw = !kw || [n.title, n.location, n.category, n.owner?.org, n.owner?.name].some((v) => String(v).toLowerCase().includes(kw))
    const hitStatus = !filters.status || n.status === filters.status
    const hitCategory = !filters.category || n.category === filters.category
    return hitKw && hitStatus && hitCategory
  })
})

const pagedNeeds = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredNeeds.value.slice(start, start + pagination.pageSize)
})

watch(
  () => [filters.keyword, filters.status, filters.category],
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
  title: '',
  category: '',
  location: '',
  budget: '',
  deadline: '',
  status: '进行中',
  urgent: false,
  publishTime: '',
  views: 0,
  desc: '',
  requirementsText: '',
  deliverablesText: '',
  owner: {
    org: '',
    name: '',
    phone: ''
  }
})

const resetForm = () => {
  form.id = null
  form.title = ''
  form.category = ''
  form.location = ''
  form.budget = ''
  form.deadline = ''
  form.status = '进行中'
  form.urgent = false
  form.publishTime = new Date().toISOString().slice(0, 16).replace('T', ' ')
  form.views = 0
  form.desc = ''
  form.requirementsText = ''
  form.deliverablesText = ''
  form.owner = { org: '', name: '', phone: '' }
}

const openCreate = () => {
  dialog.mode = 'create'
  resetForm()
  dialog.visible = true
}

const openEdit = (row) => {
  dialog.mode = 'edit'
  form.id = row.id
  form.title = row.title
  form.category = row.category
  form.location = row.location
  form.budget = row.budget
  form.deadline = row.deadline
  form.status = row.status
  form.urgent = !!row.urgent
  form.publishTime = row.publishTime
  form.views = row.views
  form.desc = row.desc
  form.requirementsText = (row.requirements || []).join('\n')
  form.deliverablesText = (row.deliverables || []).map(d => `${d.name} | ${d.desc} | ${d.format}`).join('\n')
  form.owner = { ...row.owner }
  dialog.visible = true
}

const submit = () => {
  const title = form.title.trim()
  const category = form.category.trim()
  const location = form.location.trim()
  const budget = form.budget.trim()
  const deadline = form.deadline
  const status = form.status

  if (!title) return ElMessage.warning('请填写标题')
  if (!category) return ElMessage.warning('请填写分类')
  if (!location) return ElMessage.warning('请填写区域')
  if (!budget) return ElMessage.warning('请填写预算')
  if (!deadline) return ElMessage.warning('请选择截止日期')

  const requirements = form.requirementsText.split('\n').map(line => line.trim()).filter(Boolean)
  const deliverables = form.deliverablesText.split('\n').map(line => {
    const parts = line.split('|').map(p => p.trim())
    return {
      name: parts[0] || '',
      desc: parts[1] || '',
      format: parts[2] || ''
    }
  }).filter(d => d.name)

  const payload = {
    title,
    category,
    location,
    budget,
    deadline,
    status,
    urgent: !!form.urgent,
    publishTime: form.publishTime,
    views: form.views,
    desc: form.desc,
    requirements,
    deliverables,
    owner: { ...form.owner },
    attachments: [] // Simplify for now
  }

  if (dialog.mode === 'create') {
    const nextId = Math.max(0, ...needsState.value.map((n) => Number(n.id) || 0)) + 1
    needsState.value = [
      {
        id: nextId,
        ...payload
      },
      ...needsState.value
    ]
    ElMessage.success('已新增需求')
  } else {
    const idx = needsState.value.findIndex((n) => n.id === form.id)
    if (idx >= 0) {
      needsState.value.splice(idx, 1, {
        ...needsState.value[idx],
        ...payload
      })
      ElMessage.success('已保存修改')
    }
  }

  dialog.visible = false
}

const removeRow = async (row) => {
  try {
    await ElMessageBox.confirm(`确认删除「${row.title}」？`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    needsState.value = needsState.value.filter((n) => n.id !== row.id)
    ElMessage.success('已删除')
  } catch {
    return
  }
}
</script>