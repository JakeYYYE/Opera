<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-800">后台总览</h1>
        <p class="text-gray-500 text-sm mt-1">快速查看平台运营数据与待处理事项</p>
      </div>
      <div class="flex items-center gap-2 w-full md:w-auto">
        <el-button class="flex-1 md:flex-none" type="primary" plain @click="router.push('/service-needs')">查看需求</el-button>
        <el-button class="flex-1 md:flex-none" type="primary" plain @click="router.push('/service-providers')">查看服务商</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="dashboard-tabs">
      <!-- Tab 1: 平台运营 (Platform/User) -->
      <el-tab-pane label="平台运营" name="platform">
        <div class="space-y-6 pt-2">
          <!-- General Platform Overview -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs text-gray-500">需求总数</div>
                  <div class="text-2xl font-bold text-gray-800 mt-2">{{ metrics.needsTotal }}</div>
                </div>
                <div class="w-11 h-11 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <el-icon :size="20"><Document /></el-icon>
                </div>
              </div>
              <div class="text-xs text-gray-400 mt-4">今日新增 {{ metrics.needsToday }}</div>
            </div>

            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs text-gray-500">服务商数量</div>
                  <div class="text-2xl font-bold text-gray-800 mt-2">{{ metrics.providersTotal }}</div>
                </div>
                <div class="w-11 h-11 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <el-icon :size="20"><OfficeBuilding /></el-icon>
                </div>
              </div>
              <div class="text-xs text-gray-400 mt-4">本周新增 {{ metrics.providersWeek }}</div>
            </div>

            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs text-gray-500">内容更新</div>
                  <div class="text-2xl font-bold text-gray-800 mt-2">{{ metrics.newsTotal }}</div>
                </div>
                <div class="w-11 h-11 rounded-lg bg-amber-500 text-white flex items-center justify-center">
                  <el-icon :size="20"><BellFilled /></el-icon>
                </div>
              </div>
              <div class="text-xs text-gray-400 mt-4">最近更新 {{ metrics.newsRecent }}</div>
            </div>

            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-xs text-gray-500">运行状态</div>
                  <div class="text-2xl font-bold text-gray-800 mt-2">正常</div>
                </div>
                <div class="w-11 h-11 rounded-lg bg-green-600 text-white flex items-center justify-center">
                  <el-icon :size="20"><CircleCheckFilled /></el-icon>
                </div>
              </div>
              <div class="text-xs text-gray-400 mt-4">最近 24 小时无异常</div>
            </div>
          </div>

          <!-- Shortcuts -->
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div class="p-5 border-b border-gray-100 flex items-center justify-between">
              <div class="font-bold text-gray-800">快捷入口</div>
            </div>
            <div class="p-5 grid grid-cols-2 gap-3">
              <button class="bg-gray-50 rounded-lg p-4 text-left hover:bg-gray-100 transition" @click="router.push('/admin/needs')">
                <div class="text-sm font-bold text-gray-800">需求管理</div>
                <div class="text-xs text-gray-500 mt-1">查看与维护需求</div>
              </button>
              <button class="bg-gray-50 rounded-lg p-4 text-left hover:bg-gray-100 transition" @click="router.push('/admin/providers')">
                <div class="text-sm font-bold text-gray-800">B端用户管理</div>
                <div class="text-xs text-gray-500 mt-1">管理B端用户信息</div>
              </button>
              <button class="bg-gray-50 rounded-lg p-4 text-left hover:bg-gray-100 transition" @click="router.push('/admin/news')">
                <div class="text-sm font-bold text-gray-800">新闻管理</div>
                <div class="text-xs text-gray-500 mt-1">发布行业资讯</div>
              </button>
              <button class="bg-gray-50 rounded-lg p-4 text-left hover:bg-gray-100 transition" @click="router.push('/')">
                <div class="text-sm font-bold text-gray-800">前台首页</div>
                <div class="text-xs text-gray-500 mt-1">查看展示效果</div>
              </button>
              <button class="bg-gray-50 rounded-lg p-4 text-left hover:bg-gray-100 transition" @click="router.push('/find-spot')">
                <div class="text-sm font-bold text-gray-800">飞行地图</div>
                <div class="text-xs text-gray-500 mt-1">地图模块</div>
              </button>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- Tab 2: 新闻运营 (News/Content) -->
      <el-tab-pane label="新闻运营" name="news">
        <div class="space-y-6 pt-2">
          <!-- Operation Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs text-gray-500">内容总数</div>
                  <div class="flex items-baseline gap-2 mt-2">
                    <span class="text-2xl font-bold text-gray-800">1,286</span>
                    <span class="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">↑ 12.5%</span>
                  </div>
                  <div class="text-xs text-gray-400 mt-1">较上月增长</div>
                </div>
                <div class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <el-icon><DocumentCopy /></el-icon>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs text-gray-500">待审核内容</div>
                  <div class="flex items-baseline gap-2 mt-2">
                    <span class="text-2xl font-bold text-gray-800">24</span>
                    <span class="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded">↑ 8</span>
                  </div>
                  <div class="text-xs text-gray-400 mt-1">较昨日新增</div>
                </div>
                <div class="w-8 h-8 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center">
                  <el-icon><Timer /></el-icon>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs text-gray-500">今日发布</div>
                  <div class="flex items-baseline gap-2 mt-2">
                    <span class="text-2xl font-bold text-gray-800">16</span>
                    <span class="text-xs text-gray-400">/ 20篇</span>
                  </div>
                  <div class="text-xs text-gray-400 mt-1">完成率 80%</div>
                </div>
                <div class="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                  <el-icon><Select /></el-icon>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-xs text-gray-500">线索转化率</div>
                  <div class="flex items-baseline gap-2 mt-2">
                    <span class="text-2xl font-bold text-gray-800">3.8%</span>
                    <span class="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">↑ 0.5%</span>
                  </div>
                  <div class="text-xs text-gray-400 mt-1">较上周提升</div>
                </div>
                <div class="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                  <el-icon><TrendCharts /></el-icon>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Line Chart -->
            <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-800">内容发布趋势</h3>
                <div class="flex gap-2">
                  <span class="text-xs px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">周</span>
                  <span class="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded cursor-pointer font-medium">月</span>
                  <span class="text-xs px-2 py-1 bg-gray-100 rounded cursor-pointer hover:bg-gray-200">季</span>
                </div>
              </div>
              <div ref="trendChartRef" class="w-full h-[300px]"></div>
            </div>
            
            <!-- Pie Chart -->
            <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 class="font-bold text-gray-800 mb-4">内容分类占比</h3>
              <div ref="categoryChartRef" class="w-full h-[300px]"></div>
            </div>
          </div>

          <!-- Bottom Lists -->
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <!-- Tasks (News/Operations Focused) -->
            <div class="xl:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div class="p-5 border-b border-gray-100 flex items-center justify-between">
                <div class="font-bold text-gray-800">待办任务</div>
                <el-button text type="primary" size="small" @click="router.push('/admin/needs')">查看全部</el-button>
              </div>
              <div class="p-5 space-y-4">
                <div v-for="task in tasks" :key="task.id" class="flex items-start gap-3">
                  <el-checkbox v-model="task.checked" />
                  <div class="min-w-0 flex-1">
                    <div class="text-sm font-medium text-gray-800 truncate" :class="{'line-through text-gray-400': task.checked}">{{ task.title }}</div>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-xs px-1.5 py-0.5 rounded" :class="getPriorityClass(task.level)">{{ task.level }}优先级</span>
                      <span class="text-xs text-gray-400">{{ task.deadline }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Popular Content Ranking -->
            <div class="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div class="p-5 border-b border-gray-100 flex items-center justify-between">
                <div class="font-bold text-gray-800">热门内容排行</div>
                <div class="flex gap-2 text-xs">
                  <span class="cursor-pointer text-blue-600 font-medium">全部</span>
                  <span class="cursor-pointer text-gray-400 hover:text-gray-600">新闻</span>
                  <span class="cursor-pointer text-gray-400 hover:text-gray-600">政策</span>
                </div>
              </div>
              <div class="p-5 space-y-4">
                <div v-for="(item, index) in popularContent" :key="index" class="flex items-center gap-3">
                  <div class="w-5 h-5 rounded flex items-center justify-center text-xs font-bold" :class="index < 3 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'">{{ index + 1 }}</div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm text-gray-800 truncate hover:text-blue-600 cursor-pointer">{{ item.title }}</div>
                    <div class="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span class="flex items-center gap-1"><el-icon><View /></el-icon> {{ item.views }}</span>
                      <span class="flex items-center gap-1"><el-icon><Share /></el-icon> {{ item.shares }}</span>
                    </div>
                  </div>
                  <span class="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{{ item.rate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Document, OfficeBuilding, CircleCheckFilled, BellFilled, DataAnalysis, DocumentCopy, Timer, Select, TrendCharts, View, Share } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const router = useRouter()
const activeTab = ref('platform')

const metrics = reactive({
  needsTotal: 128,
  needsToday: 6,
  providersTotal: 36,
  providersWeek: 2,
  newsTotal: 12,
  newsRecent: '2026-01-11'
})

const tasks = reactive([
  { id: 1, title: '审核"安徽省合肥市无人机物流招标公告"', deadline: '今天 18:00前', level: '高', checked: false },
  { id: 2, title: '清洗RPA抓取的50条招标线索', deadline: '明天 12:00前', level: '中', checked: false },
  { id: 3, title: '更新首页轮播Banner图（3张）', deadline: '周五 18:00前', level: '低', checked: false },
  { id: 4, title: '撰写"无人机物流行业政策解读"专题文章', deadline: '下周一 10:00前', level: '中', checked: false }
])

const popularContent = [
  { title: '2025年中国无人机物流行业发展白皮书发布', views: '12,586', shares: 248, rate: '转化率 5.2%' },
  { title: '深圳市无人机物流配送试点区域扩展至全城', views: '9,842', shares: 186, rate: '转化率 4.8%' },
  { title: '京东物流无人机配送中心落户武汉，覆盖半径30公里', views: '8,563', shares: 152, rate: '转化率 3.9%' },
  { title: '2025年无人机物流设备采购招标公告汇总', views: '7,951', shares: 132, rate: '转化率 8.7%' },
  { title: '无人机物流航线审批流程简化政策解读', views: '6,842', shares: 98, rate: '转化率 2.3%' }
]

const getPriorityClass = (level) => {
  const map = {
    '高': 'bg-red-50 text-red-600',
    '中': 'bg-amber-50 text-amber-600',
    '低': 'bg-blue-50 text-blue-600'
  }
  return map[level] || 'bg-gray-50 text-gray-600'
}

// Charts
const trendChartRef = ref(null)
const categoryChartRef = ref(null)
let trendChart = null
let categoryChart = null

const initCharts = () => {
  if (trendChartRef.value) {
    if (!trendChart) {
      trendChart = echarts.init(trendChartRef.value)
      trendChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
          axisLine: { lineStyle: { color: '#E5E7EB' } },
          axisLabel: { color: '#6B7280' }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { lineStyle: { type: 'dashed', color: '#E5E7EB' } }
        },
        series: [
          {
            name: '发布量',
            type: 'line',
            smooth: true,
            itemStyle: { color: '#3B82F6' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0)' }
              ])
            },
            data: [68, 88, 56, 108, 136, 116, 168, 186]
          }
        ]
      })
    } else {
      trendChart.resize()
    }
  }

  if (categoryChartRef.value) {
    if (!categoryChart) {
      categoryChart = echarts.init(categoryChartRef.value)
      categoryChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: '0%',
          left: 'center',
          icon: 'circle'
        },
        series: [
          {
            name: '内容分类',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 514, name: '新闻', itemStyle: { color: '#3B82F6' } },
              { value: 386, name: '招标', itemStyle: { color: '#10B981' } },
              { value: 257, name: '政策', itemStyle: { color: '#F59E0B' } },
              { value: 129, name: '其他', itemStyle: { color: '#8B5CF6' } }
            ]
          }
        ]
      })
    } else {
      categoryChart.resize()
    }
  }
}

const handleResize = () => {
  trendChart?.resize()
  categoryChart?.resize()
}

watch(activeTab, (newVal) => {
  if (newVal === 'news') {
    nextTick(() => {
      initCharts()
      handleResize()
    })
  }
})

onMounted(() => {
  if (activeTab.value === 'news') {
    initCharts()
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  trendChart?.dispose()
  categoryChart?.dispose()
})
</script>
