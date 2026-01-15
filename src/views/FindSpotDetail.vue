<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />

    <main class="flex-grow container mx-auto px-4 py-8 max-w-6xl">
      <!-- Back Bar -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-100 gap-3 md:gap-0">
        <div class="flex items-center gap-3 md:gap-4">
          <router-link to="/find-spot" class="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-blue-600 transition">
            <el-icon><ArrowLeft /></el-icon>
            <span class="text-sm md:text-base font-medium">返回</span>
          </router-link>
          <div class="h-4 md:h-6 w-px bg-gray-200 mx-1 md:mx-2"></div>
          <h1 class="font-bold text-base md:text-lg text-gray-800 truncate">航拍点详情</h1>
        </div>
        
        <div class="flex items-center gap-2 md:gap-4 w-full md:w-auto">
           <el-button type="primary" plain round icon="Share" class="flex-1 md:flex-none">分享</el-button>
           <el-button type="primary" round icon="Star" class="flex-1 md:flex-none">收藏</el-button>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        
        <!-- Left Column: Gallery & Main Content -->
        <div class="lg:col-span-2 space-y-4 md:space-y-8">
          
          <!-- Image Gallery -->
          <div class="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden border border-gray-100">
             <div class="h-[250px] md:h-[400px] bg-gray-200 relative group cursor-pointer">
                <img src="https://picsum.photos/seed/detail_main/800/600" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
                <div class="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-black/50 backdrop-blur text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs flex items-center gap-1">
                   <el-icon><Picture /></el-icon> 1/12
                </div>
             </div>
             <div class="grid grid-cols-4 gap-2 p-2 bg-white">
                <div v-for="i in 4" :key="i" class="h-14 md:h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition border border-transparent hover:border-blue-500">
                   <img :src="`https://picsum.photos/seed/detail_${i}/200/200`" class="w-full h-full object-cover" />
                </div>
             </div>
          </div>

          <!-- Spot Info -->
          <div class="bg-white rounded-xl md:rounded-2xl shadow-sm p-4 md:p-8 border border-gray-100 space-y-4 md:space-y-6">
             <div>
                <div class="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-0">
                   <h1 class="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{{ spot.title }}</h1>
                   <div class="flex items-center justify-between md:flex-col md:items-end w-full md:w-auto">
                      <div class="flex items-center gap-1 text-yellow-500 text-base md:text-lg font-bold">
                         <el-icon><StarFilled /></el-icon> 4.9
                      </div>
                      <span class="text-gray-400 text-xs">128条评价</span>
                   </div>
                </div>
                <div class="flex gap-2 mt-2">
                   <span class="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">城市地标</span>
                   <span class="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">日落拍摄</span>
                   <span class="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">建筑摄影</span>
                </div>
             </div>

             <div class="border-t border-gray-100 pt-6">
                <h3 class="font-bold text-gray-800 mb-3 text-lg">拍摄建议</h3>
                <p class="text-gray-600 leading-relaxed">
                   此处是拍摄故宫角楼的经典机位，建议在日落时分前往，可以拍摄到夕阳下的角楼倒影。最佳拍摄季节为春秋两季。请注意，该区域属于北京首都核心区，严禁使用无人机升空拍摄，建议使用相机+三脚架进行地面拍摄。
                </p>
                <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mt-4 flex items-start gap-3">
                   <el-icon class="text-yellow-600 mt-1"><Warning /></el-icon>
                   <div>
                      <h4 class="font-bold text-yellow-800 text-sm">限飞提醒</h4>
                      <p class="text-yellow-700 text-xs mt-1">该区域位于首都禁飞区内，严禁无人机飞行。请严格遵守当地法律法规。</p>
                   </div>
                </div>
             </div>

             <div class="border-t border-gray-100 pt-6">
                <h3 class="font-bold text-gray-800 mb-4 text-lg">用户评价 (128)</h3>
                <div class="space-y-6">
                   <div v-for="i in 3" :key="i" class="flex gap-4">
                      <div class="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                         <img :src="`https://i.pravatar.cc/150?u=${i}`" />
                      </div>
                      <div>
                         <div class="flex items-center gap-2 mb-1">
                            <span class="font-bold text-gray-800 text-sm">摄影爱好者_{{i}}</span>
                            <span class="text-gray-400 text-xs">2天前</span>
                         </div>
                         <p class="text-gray-600 text-sm">机位非常棒，建议早点去占位置，人比较多。夕阳真的很美！</p>
                         <div class="flex gap-2 mt-2">
                            <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                               <img :src="`https://picsum.photos/seed/comment_${i}/200/200`" class="w-full h-full object-cover" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
                <div class="mt-6 text-center">
                   <el-button plain class="w-full">查看全部评价</el-button>
                </div>
             </div>
          </div>
        </div>

        <!-- Right Column: Location & Meta -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- Mini Map -->
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
             <div class="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 class="font-bold text-gray-800">位置信息</h3>
                <el-button link type="primary" size="small">导航前往</el-button>
             </div>
             <div class="h-48 bg-gray-100 relative">
                <!-- Static Map Placeholder (would be Leaflet in real app) -->
                <div id="mini-map" class="w-full h-full z-0"></div>
             </div>
             <div class="p-4">
                <div class="flex items-start gap-3 mb-4">
                   <el-icon class="text-gray-400 mt-1"><Location /></el-icon>
                   <div>
                      <p class="text-sm text-gray-600">{{ spot.address }}</p>
                      <p class="text-xs text-gray-400 mt-0.5">距您当前位置 2.3km</p>
                   </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                   <div class="bg-gray-50 rounded-lg p-3 text-center">
                      <div class="text-gray-400 text-xs mb-1">经度</div>
                      <div class="font-mono text-sm font-bold text-gray-700">{{ spot.lng }}</div>
                   </div>
                   <div class="bg-gray-50 rounded-lg p-3 text-center">
                      <div class="text-gray-400 text-xs mb-1">纬度</div>
                      <div class="font-mono text-sm font-bold text-gray-700">{{ spot.lat }}</div>
                   </div>
                </div>
             </div>
          </div>

          <!-- Contributor -->
          <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
             <h3 class="font-bold text-gray-800 mb-4 text-sm">贡献者</h3>
             <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg border-2 border-white shadow-sm">
                   A
                </div>
                <div>
                   <div class="font-bold text-gray-800">Aerial_Master</div>
                   <div class="text-xs text-gray-500">资深飞手 · 贡献 24 个航拍点</div>
                </div>
                <el-button type="primary" plain size="small" round class="ml-auto">关注</el-button>
             </div>
          </div>

          <!-- Nearby Recommendations -->
          <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
             <h3 class="font-bold text-gray-800 mb-4 text-sm">附近推荐</h3>
             <div class="space-y-4">
                <div v-for="i in 3" :key="i" class="flex gap-3 group cursor-pointer">
                   <div class="w-20 h-14 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                      <img :src="`https://picsum.photos/seed/nearby_${i}/200/200`" class="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                   </div>
                   <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-bold text-gray-800 truncate group-hover:text-blue-600 transition">景山公园万春亭</h4>
                      <div class="flex items-center gap-1 text-xs text-gray-400 mt-1">
                         <el-icon><Location /></el-icon> 1.2km
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Share, Star, Picture, StarFilled, Warning, Location } from '@element-plus/icons-vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Navbar from '../components/Navbar.vue'

// Fix Leaflet's default icon path issues
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const route = useRoute()
const spots = [
  { id: 1, title: '故宫博物院', lat: 39.9163447, lng: 116.3971546, address: '北京市东城区景山前街4号' },
  { id: 2, title: '奥林匹克公园', lat: 39.999, lng: 116.388, address: '北京市朝阳区北五环景观大道' },
  { id: 3, title: '北京站', lat: 39.9042, lng: 116.4074, address: '北京市东城区毛家湾胡同甲13号' },
  { id: 4, title: '动物园', lat: 39.93, lng: 116.35, address: '北京市海淀区西直门外大街137号' },
  { id: 5, title: '欢乐谷', lat: 39.88, lng: 116.45, address: '北京市朝阳区东四环小武基北路' }
]
const spot = computed(() => {
  const id = parseInt(route.params.id)
  return spots.find(s => s.id === id) || spots[0]
})

onMounted(() => {
  // Initialize mini map
  const map = L.map('mini-map', {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false
  }).setView([spot.value.lat, spot.value.lng], 14)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20
  }).addTo(map)

  L.marker([spot.value.lat, spot.value.lng]).addTo(map)
})
</script>

<style scoped>
/* Optional styling adjustments */
</style>
