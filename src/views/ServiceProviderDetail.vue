<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />

    <!-- Header Section -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-4 md:py-8">
        <div class="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
          <div class="flex gap-4 w-full md:w-auto">
            <div class="w-20 h-20 md:w-24 md:h-24 rounded-xl border border-gray-200 p-2 bg-white shadow-sm flex-shrink-0">
              <img :src="provider?.logo" class="w-full h-full object-contain rounded-lg" />
            </div>
            <div class="flex-grow md:hidden">
               <h1 class="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{{ provider?.name }}</h1>
               <span v-if="provider?.verified" class="inline-flex bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium border border-blue-100 items-center gap-1">
                <el-icon><Medal /></el-icon> 官方认证
              </span>
            </div>
          </div>
          
          <div class="flex-grow w-full">
            <div class="hidden md:flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-gray-900">{{ provider?.name }}</h1>
              <span v-if="provider?.verified" class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium border border-blue-100 flex items-center gap-1">
                <el-icon><Medal /></el-icon> 官方认证
              </span>
            </div>
            
            <p class="text-gray-500 text-sm mb-3 md:mb-4 max-w-3xl line-clamp-2 md:line-clamp-none">{{ provider?.desc }}</p>
            
            <div class="flex items-center gap-3 md:gap-6 text-xs md:text-sm bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg justify-between md:justify-start">
              <div class="flex items-center gap-1.5">
                <el-icon class="text-yellow-500 text-lg"><StarFilled /></el-icon>
                <span class="font-bold text-gray-900">{{ provider?.rating }}</span>
                <span class="text-gray-400">评分</span>
              </div>
              <div class="w-px h-3 md:h-4 bg-gray-200"></div>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-gray-900">{{ provider?.deals }}</span>
                <span class="text-gray-400">成交</span>
              </div>
              <div class="w-px h-3 md:h-4 bg-gray-200"></div>
              <div class="flex items-center gap-1.5 truncate max-w-[120px] md:max-w-none">
                <el-icon class="text-gray-400"><Location /></el-icon>
                <span class="text-gray-600 truncate">{{ provider?.location }}</span>
              </div>
            </div>
          </div>

          <div class="hidden md:flex flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
            <el-button type="primary" size="large" class="w-full md:w-32">立即沟通</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-4 md:py-8 flex-grow pb-24 md:pb-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        
        <!-- Left Content -->
        <div class="lg:col-span-2 space-y-4 md:space-y-6">
          <!-- Tabs -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <el-tabs v-model="activeTab" class="px-3 md:px-6 pt-2">
              <el-tab-pane label="服务概览" name="overview">
                <div class="py-4 md:py-6 space-y-6 md:space-y-8">
                  <!-- Service Areas -->
                  <section>
                    <h3 class="text-lg font-bold text-gray-900 mb-4">主营业务</h3>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="tag in provider?.tags" :key="tag" class="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-100">
                        {{ tag }}
                      </span>
                    </div>
                  </section>

                  <!-- Introduction -->
                  <section>
                    <h3 class="text-lg font-bold text-gray-900 mb-4">企业介绍</h3>
                    <div class="text-gray-600 leading-relaxed text-sm space-y-4">
                      <p>{{ provider?.desc }}</p>
                      <p>我们拥有专业的飞行团队和先进的无人机设备，致力于为客户提供高质量的低空服务。无论是航拍测绘、农林植保还是应急救援，我们都能提供定制化的解决方案。</p>
                    </div>
                  </section>
                  
                  <!-- Capabilities -->
                  <section>
                     <h3 class="text-lg font-bold text-gray-900 mb-4">设备实力</h3>
                     <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div class="border border-gray-100 rounded-lg p-4 text-center hover:shadow-sm transition">
                           <div class="text-gray-900 font-bold mb-1">DJI M300 RTK</div>
                           <div class="text-xs text-gray-500">旗舰级行业无人机</div>
                        </div>
                         <div class="border border-gray-100 rounded-lg p-4 text-center hover:shadow-sm transition">
                           <div class="text-gray-900 font-bold mb-1">DJI Mavic 3E</div>
                           <div class="text-xs text-gray-500">轻量化测绘无人机</div>
                        </div>
                         <div class="border border-gray-100 rounded-lg p-4 text-center hover:shadow-sm transition">
                           <div class="text-gray-900 font-bold mb-1">JOUAV CW-15</div>
                           <div class="text-xs text-gray-500">大载重长航时固定翼</div>
                        </div>
                     </div>
                  </section>
                </div>
              </el-tab-pane>

              <el-tab-pane label="服务产品" name="products">
                <div class="py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="(service, idx) in (provider?.services?.length ? provider.services : defaultServices)" :key="idx" class="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition group cursor-pointer">
                     <div class="flex justify-between items-start mb-3">
                        <h4 class="font-bold text-gray-900 group-hover:text-blue-600 transition">{{ service.name }}</h4>
                        <span class="text-orange-600 font-bold">{{ service.price }}</span>
                     </div>
                     <p class="text-gray-500 text-sm mb-4 line-clamp-2">{{ service.desc }}</p>
                     <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-400">已售 32</span>
                        <el-button size="small" plain>查看详情</el-button>
                     </div>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="成功案例" name="cases">
                 <div class="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="(cse, idx) in (provider?.cases?.length ? provider.cases : defaultCases)" :key="idx" class="group cursor-pointer">
                       <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
                          <img :src="cse.image" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                       </div>
                       <h4 class="font-bold text-gray-900 group-hover:text-blue-600 transition">{{ cse.title }}</h4>
                    </div>
                 </div>
              </el-tab-pane>
              
              <el-tab-pane label="用户评价 (128)" name="reviews">
                <div class="py-6 space-y-6">
                   <div v-for="i in 3" :key="i" class="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div class="flex items-center justify-between mb-2">
                         <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full bg-gray-200"></div>
                            <span class="text-sm font-medium text-gray-700">用户882***</span>
                         </div>
                         <span class="text-xs text-gray-400">2026-01-10</span>
                      </div>
                      <el-rate v-model="rating" disabled size="small" class="mb-2" />
                      <p class="text-sm text-gray-600">服务非常专业，响应速度快，交付的成果完全符合我们的要求，期待下次合作！</p>
                   </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="space-y-6">
          <!-- Company Info -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
             <h3 class="font-bold text-gray-900 mb-4">企业档案</h3>
             <div class="space-y-4 text-sm">
                <div class="flex justify-between">
                   <span class="text-gray-500">成立时间</span>
                   <span class="text-gray-900">2018年</span>
                </div>
                <div class="flex justify-between">
                   <span class="text-gray-500">注册资本</span>
                   <span class="text-gray-900">5000万人民币</span>
                </div>
                <div class="flex justify-between">
                   <span class="text-gray-500">团队规模</span>
                   <span class="text-gray-900">100-499人</span>
                </div>
                <div class="border-t border-gray-100 my-4"></div>
                 <div>
                   <span class="text-gray-500 block mb-2">资质证书</span>
                   <div class="flex gap-2">
                      <span class="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-100">民航局经营许可</span>
                      <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">AOPA会员</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Mobile Bottom Action Bar -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 z-50 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
       <el-button class="flex-1" size="large" icon="Share">分享</el-button>
       <el-button type="primary" class="flex-[2]" size="large">立即沟通</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { StarFilled, Location, Medal, Share } from '@element-plus/icons-vue'
import Navbar from '../components/Navbar.vue'
import { useMockData } from '../composables/useMockData.js'

const route = useRoute()
const { state } = useMockData()
const activeTab = ref('overview')
const rating = ref(5)

const provider = computed(() => {
  const id = parseInt(route.params.id)
  return state.value.providers?.find(p => p.id === id) || state.value.providers?.[0]
})

const defaultServices = [
  { name: '标准航拍服务', price: '¥3000起', desc: '提供4K高清航拍视频与照片拍摄，适用于活动记录、企业宣传。' },
  { name: '倾斜摄影建模', price: '¥5000/km²', desc: '高精度实景三维建模，输出OSGB/OBJ格式，适用于规划设计。' }
]

const defaultCases = [
  { title: '某大型商业综合体全景展示', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { title: '高速公路建设进度巡查', image: 'https://images.unsplash.com/photo-1545156526-905431569424?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
]
</script>