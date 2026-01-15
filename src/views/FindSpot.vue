<template>
  <div class="h-screen w-full flex flex-col bg-gray-50">
    <Navbar />

    <!-- Main Map Container -->
    <div class="flex-grow relative w-full overflow-hidden">
      <!-- Map Controls Overlay -->
      <div class="absolute top-4 left-0 right-0 z-[400] pointer-events-none px-4">
        <div class="max-w-7xl mx-auto flex justify-between items-start pointer-events-auto">
          <!-- Left: Search -->
          <div class="relative group shadow-lg rounded-full flex-1 md:flex-none md:w-auto mr-4 md:mr-0">
            <input type="text" placeholder="搜索地点..." class="bg-white rounded-full pl-10 pr-4 py-2 text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 transition border border-gray-100" />
            <el-icon class="absolute left-3 top-2.5 text-gray-400"><Search /></el-icon>
          </div>

          <div class="flex items-center gap-3 flex-shrink-0">
            <el-button type="primary" round @click="jumpToNeeds" class="shadow-md">看任务</el-button>
          </div>
        </div>
      </div>

      <div id="map" class="w-full h-full z-0"></div>

      <!-- Right Toolbar -->
      <div class="absolute bottom-32 right-4 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-[400] flex flex-col gap-3">
        <div class="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-2">
          <button 
            @click="createSpotMode = !createSpotMode; measureMode = false; areaMode = false; showLowTools = false" 
            class="w-12 h-12 md:w-auto md:h-auto md:px-3 md:py-2 rounded-xl text-xs font-medium transition flex items-center justify-center md:justify-start gap-1 whitespace-nowrap shadow-sm"
            :class="createSpotMode ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'"
          >
            <el-icon :size="24"><Camera /></el-icon> <span class="hidden md:inline">创建航拍点</span>
          </button>
          <button 
            @click="showLowTools = !showLowTools"
            class="w-12 h-12 md:w-auto md:h-auto md:px-3 md:py-2 rounded-xl text-xs font-medium transition flex items-center justify-center md:justify-start gap-1 whitespace-nowrap shadow-sm"
            :class="showLowTools ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'"
          >
            <el-icon :size="24"><Tools /></el-icon> <span class="hidden md:inline">低空工具</span>
          </button>
        </div>
      </div>

      <!-- Low Altitude Tools Panel -->
      <div v-if="showLowTools" class="absolute bottom-0 left-0 right-0 md:bottom-24 md:right-4 md:left-auto z-[450] flex justify-center md:block">
        <div class="bg-slate-900/95 backdrop-blur-md text-slate-50 rounded-t-2xl md:rounded-2xl shadow-2xl border-t md:border border-cyan-500/50 w-full md:w-[420px] overflow-hidden max-h-[60vh] md:max-h-none flex flex-col animate-slide-up">
          <div class="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0 cursor-pointer" @click="showLowTools = false">
            <div class="flex items-center gap-2">
              <div class="w-1 h-4 bg-cyan-500 rounded-full"></div>
              <span class="text-sm font-semibold">低空工具箱</span>
            </div>
            <div class="md:hidden">
              <el-icon><ArrowDown /></el-icon>
            </div>
            <div class="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
              <span class="inline-flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                实验功能
              </span>
              <button
                class="w-6 h-6 rounded-full bg-slate-800/70 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition"
                @click="showLowTools = false"
              >
                <el-icon :size="14"><Close /></el-icon>
              </button>
            </div>
          </div>
          <div class="px-3 pt-3">
            <div class="grid grid-cols-4 gap-1 bg-slate-800/80 rounded-full p-1 text-[11px]">
              <button
                v-for="item in toolTabs"
                :key="item.value"
                @click="activeToolTab = item.value"
                class="px-2 py-1 rounded-full transition"
                :class="activeToolTab === item.value ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm' : 'text-slate-300 hover:bg-slate-700'"
              >
                {{ item.label }}
              </button>
            </div>
          </div>
          <div class="px-4 py-3 max-h-[320px] overflow-y-auto text-xs space-y-3">
            <!-- 图层管理 -->
            <template v-if="activeToolTab === 'layers'">
              <div>
                <div class="text-[11px] text-slate-400 mb-1">地理信息图层</div>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('terrain', '全国地形')"
                  >
                    <div class="text-[11px] text-slate-100">全国地形</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('airspace', '空域图层')"
                  >
                    <div class="text-[11px] text-slate-100">空域图层</div>
                  </button>
                </div>
              </div>
              <div>
                <div class="text-[11px] text-slate-400 mb-1">适飞 / 限飞 / 禁飞区</div>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('suitable', '适飞区')"
                  >
                    <div class="flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span class="text-[11px] text-slate-100">适飞区</span>
                    </div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-amber-400/70 transition"
                    @click="toggleLayer('warning', '限飞区')"
                  >
                    <div class="flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                      <span class="text-[11px] text-slate-100">限飞区</span>
                    </div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-red-400/70 transition"
                    @click="toggleLayer('forbidden', '禁飞区')"
                  >
                    <div class="flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full bg-red-500"></span>
                      <span class="text-[11px] text-slate-100">禁飞区</span>
                    </div>
                  </button>
                </div>
              </div>
              <div>
                <div class="text-[11px] text-slate-400 mb-1">气象环境图层</div>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherWind10', '十米风速图')"
                  >
                    <div class="text-[11px] text-slate-100">十米风速图</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherWind100', '百米风速图')"
                  >
                    <div class="text-[11px] text-slate-100">百米风速图</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherRainNow', '分钟级降水预测')"
                  >
                    <div class="text-[11px] text-slate-100">分钟级降水预测</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherRainIntensity', '降水强度图层')"
                  >
                    <div class="text-[11px] text-slate-100">降水强度图层</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherEcho', '回波强度图层')"
                  >
                    <div class="text-[11px] text-slate-100">回波强度图层</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherGust', '阵风风速')"
                  >
                    <div class="text-[11px] text-slate-100">阵风风速</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherSnow', '降雪量')"
                  >
                    <div class="text-[11px] text-slate-100">降雪量</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherHumidity', '相对湿度')"
                  >
                    <div class="text-[11px] text-slate-100">相对湿度</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherVisibility', '可见度')"
                  >
                    <div class="text-[11px] text-slate-100">可见度</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherPressure', '气压')"
                  >
                    <div class="text-[11px] text-slate-100">气压</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherIR', '红外图层')"
                  >
                    <div class="text-[11px] text-slate-100">红外图层</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherWaterVapour', '水汽图层')"
                  >
                    <div class="text-[11px] text-slate-100">水汽图层</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('weatherVisibleLight', '可见光图层')"
                  >
                    <div class="text-[11px] text-slate-100">可见光图层</div>
                  </button>
                  <button
                    class="px-2 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:border-cyan-500/70 transition"
                    @click="toggleLayer('temp2m', '2米温度')"
                  >
                    <div class="text-[11px] text-slate-100">2米温度</div>
                  </button>
                </div>
              </div>
            </template>

            <!-- 测量分析 -->
            <template v-else-if="activeToolTab === 'measure'">
              <div class="grid grid-cols-2 gap-2">
                <button
                  class="px-3 py-2 rounded-lg border text-left transition"
                  :class="activeMeasureTool === 'distance' ? 'border-cyan-400 bg-slate-800/80 text-slate-50' : 'border-slate-700 bg-slate-900/40 text-slate-200 hover:border-cyan-500/60'"
                  @click="startDistanceMeasure"
                >
                  <div class="text-xs font-semibold mb-0.5">测量距离</div>
                  <div class="text-[11px] text-slate-400">点击地图依次标点</div>
                  <div v-if="measureMode" class="mt-1 text-[11px] text-cyan-300">总距：{{ formatDistance(totalDistance) }}</div>
                </button>
                <button
                  class="px-3 py-2 rounded-lg border text-left transition"
                  :class="activeMeasureTool === 'area' ? 'border-cyan-400 bg-slate-800/80 text-slate-50' : 'border-slate-700 bg-slate-900/40 text-slate-200 hover:border-cyan-500/60'"
                  @click="startAreaMeasure"
                >
                  <div class="text-xs font-semibold mb-0.5">测量面积</div>
                  <div class="text-[11px] text-slate-400">闭合多边形获取面积</div>
                  <div v-if="areaMode" class="mt-1 text-[11px] text-cyan-300">总面积：{{ formatArea(totalArea) }}</div>
                </button>
              </div>
              <div class="mt-2 grid grid-cols-2 gap-2">
                <button
                  class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/40 text-left text-slate-300 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('方位角测量')"
                >
                  <div class="text-xs font-semibold mb-0.5">方位角</div>
                  <div class="text-[11px] text-slate-400">两点间方位角</div>
                </button>
                <button
                  class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/40 text-left text-slate-300 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('坡度坡向分析')"
                >
                  <div class="text-xs font-semibold mb-0.5">坡度坡向</div>
                  <div class="text-[11px] text-slate-400">地形坡度分析</div>
                </button>
                <button
                  class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/40 text-left text-slate-300 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('地貌分析')"
                >
                  <div class="text-xs font-semibold mb-0.5">地貌分析</div>
                  <div class="text-[11px] text-slate-400">系数与分级</div>
                </button>
                <button
                  class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/40 text-left text-slate-300 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('可视域分析')"
                >
                  <div class="text-xs font-semibold mb-0.5">可视域分析</div>
                  <div class="text-[11px] text-slate-400">站位视通范围</div>
                </button>
                <button
                  class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/40 text-left text-slate-300 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('天际线描边')"
                >
                  <div class="text-xs font-semibold mb-0.5">天际线描边</div>
                  <div class="text-[11px] text-slate-400">城市轮廓线</div>
                </button>
                <button
                  class="px-3 py-2 rounded-lg border border-slate-700 bg-slate-900/40 text-left text-slate-300 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('超高分析')"
                >
                  <div class="text-xs font-semibold mb-0.5">超高分析</div>
                  <div class="text-[11px] text-slate-400">高度合规性</div>
                </button>
              </div>
              <div class="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <div class="flex gap-2">
                  <button class="px-2 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200" @click="clearMeasure">清除距离</button>
                  <button class="px-2 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200" @click="clearArea">清除面积</button>
                </div>
                <div class="flex gap-2">
                  <button class="px-2 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200" @click="undoMeasurePoint">撤销距离点</button>
                  <button class="px-2 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200" @click="undoAreaPoint">撤销面积点</button>
                </div>
              </div>
            </template>

            <!-- 矢量标绘 -->
            <template v-else-if="activeToolTab === 'vector'">
              <div class="flex items-center justify-between mb-2">
                <div class="flex gap-2 text-[11px]">
                  <span class="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200">矢量标绘</span>
                  <span class="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400">文本标注</span>
                </div>
                <span class="text-[11px] text-slate-500">参考现网工具布局</span>
              </div>
              <div class="grid grid-cols-3 md:grid-cols-4 gap-2">
                <button
                  class="px-2 py-1.5 rounded-lg border text-center transition"
                  :class="activeVectorTool === 'point' ? 'border-cyan-400 bg-slate-800/80 text-slate-50' : 'border-slate-700 bg-slate-900/40 text-slate-200 hover:border-cyan-500/60'"
                  @click="startVectorPoint"
                >
                  普通点
                </button>
                <button
                  class="px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-center text-slate-200 hover:border-cyan-500/60 transition"
                  @click="startVectorPoint"
                >
                  位置点
                </button>
                <button
                  class="px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-center text-slate-200 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('折线标绘')"
                >
                  折线
                </button>
                <button
                  class="px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-center text-slate-200 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('曲线标绘')"
                >
                  曲线
                </button>
                <button
                  class="px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-center text-slate-200 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('多边形标绘')"
                >
                  多边形
                </button>
                <button
                  class="px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-center text-slate-200 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('自由多边形')"
                >
                  自由多边形
                </button>
                <button
                  class="px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-center text-slate-200 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('正多边形')"
                >
                  正多边形
                </button>
                <button
                  class="px-2 py-1.5 rounded-lg border border-slate-700 bg-slate-900/40 text-center text-slate-200 hover:border-cyan-500/60 transition"
                  @click="showComingSoon('圆形')"
                >
                  圆形
                </button>
              </div>
              <div class="mt-3 text-[11px] text-slate-400">
                当前支持在地图上点击创建“普通点 / 位置点”，会走航拍点上传流程，其余矢量符号作为占位，后续接入三维地理底座后实现。
              </div>
            </template>

            <!-- 分享 / 下载 -->
            <template v-else>
              <div class="space-y-3">
                <!-- Share Link -->
                <div>
                  <div class="text-[11px] text-slate-400 mb-2">分享地图视图</div>
                  <button
                    class="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/30 transition flex items-center justify-center gap-2"
                    @click="copyShareLink"
                  >
                    <el-icon><Share /></el-icon> 复制分享链接
                  </button>
                  <div class="text-[10px] text-slate-500 mt-1">
                    生成包含当前视角、缩放及图层开关状态的链接
                  </div>
                </div>

                <!-- Export / Import -->
                <div class="pt-2 border-t border-slate-700/50">
                  <div class="text-[11px] text-slate-400 mb-2">配置导入导出</div>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      class="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-medium transition flex items-center justify-center gap-1"
                      @click="triggerImport"
                    >
                      <el-icon><Upload /></el-icon> 导入配置
                    </button>
                    <button
                      class="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/30 transition flex items-center justify-center gap-1"
                      @click="downloadCurrentMap"
                    >
                      <el-icon><Download /></el-icon> 导出配置
                    </button>
                  </div>
                  <input type="file" ref="fileInput" class="hidden" accept=".json" @change="handleImportFile" />
                  <div class="text-[10px] text-slate-500 mt-2 leading-relaxed">
                    可导出当前地图配置（含禁飞区、测距数据）为 JSON 文件，或导入他人分享的配置文件。
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <!-- Sidebar Toggle Handle (standalone) -->
      <div class="absolute top-24 left-4 z-[401] pointer-events-auto">
        <div 
          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[12px] text-gray-700 shadow-lg border border-gray-200/50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition cursor-pointer whitespace-nowrap"
          @click="showRecommendations = !showRecommendations"
          title="切换列表显示"
        >
          <el-icon :size="14" class="text-gray-500">
            <CaretBottom v-if="!showRecommendations" />
            <CaretTop v-else />
          </el-icon>
          <span class="font-medium">推荐航拍点</span>
        </div>
      </div>
      
      <!-- Recommendations Panel (Desktop: Floating, Mobile: Bottom Sheet) -->
      <div v-if="showRecommendations" class="fixed inset-0 z-[400] bg-black/20 backdrop-blur-sm md:hidden" @click="showRecommendations = false"></div>
      
      <div 
        v-if="showRecommendations" 
        class="absolute md:top-36 md:left-4 md:right-auto z-[402] pointer-events-auto
               fixed bottom-0 left-0 right-0 top-auto md:bottom-auto
               w-full md:w-96"
      >
        <div class="bg-white md:rounded-xl rounded-t-2xl shadow-2xl border border-gray-100 max-h-[70vh] md:max-h-[60vh] flex flex-col animate-slide-up">
          <div class="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0 cursor-pointer md:cursor-default" @click="showRecommendations = false">
            <div class="flex items-center gap-2">
              <div class="w-1 h-4 bg-blue-600 rounded-full md:hidden"></div>
              <h2 class="font-bold text-gray-800 text-lg">推荐航拍点</h2>
            </div>
            <div class="md:hidden text-gray-400">
              <el-icon><ArrowDown /></el-icon>
            </div>
            <el-button link class="hidden md:block" @click.stop="showRecommendations = false">关闭</el-button>
          </div>
          <div class="p-3 overflow-y-auto">
            <div class="grid grid-cols-3 gap-2">
              <div 
                v-for="(loc, index) in publicLocations" 
                :key="index" 
                @click="openPublicSpotFromList(loc, index)" 
                class="relative rounded-lg bg-gray-100 overflow-hidden group cursor-pointer"
              >
                <div class="w-full pb-[100%]"></div>
                <img 
                  :src="`https://picsum.photos/seed/spot_${index}/200/200`" 
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
                <div class="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[11px] px-2 py-1 truncate">
                  {{ loc.title }}
                </div>
              </div>
            </div>
            <div class="mt-3 pt-3 border-t border-gray-100">
              <h3 class="font-bold text-gray-800 text-sm mb-2">我的航拍点</h3>
              <div v-if="userSpots.length === 0" class="text-xs text-gray-400">暂无上传，可在地图上“标点”后上传照片</div>
              <div v-else class="space-y-2">
                <div v-for="spot in userSpots" :key="spot.id" class="flex gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition" @click="() => { selectedFootprint = spot; showDetailModal = true }">
                  <div class="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img :src="spot.imageUrl" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-800 text-sm truncate">{{ spot.title }}</h3>
                    <div class="text-xs text-gray-400 mt-1">{{ spot.description || '未填写描述' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  
    <!-- Detail Modal (Responsive Bottom Sheet) -->
    <div v-if="showDetailModal && selectedFootprint" class="fixed inset-0 z-[1000] flex items-end md:items-center justify-center md:p-4 bg-black/60 backdrop-blur-sm transition-opacity" @click.self="closeDetailModal">
       <div class="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-md overflow-hidden transform transition-all animate-slide-up md:animate-scale-in flex flex-col h-[85vh] md:h-auto md:max-h-[90vh]">
         <!-- Header Image -->
          <div class="relative h-56 md:h-56 flex-shrink-0 bg-gray-100 group">
             <img :src="selectedFootprint.imageUrl" class="w-full h-full object-cover" alt="Shot" />
             <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
             
             <!-- Drag Handle for Mobile -->
             <div class="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full md:hidden"></div>
             
             <button @click="closeDetailModal" class="absolute top-3 right-3 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur transition z-10">
                <el-icon><Close /></el-icon>
             </button>
             <div class="absolute bottom-4 left-4 text-white w-full pr-8">
                <h2 class="text-xl md:text-2xl font-bold mb-1 shadow-sm truncate">{{ selectedFootprint.title }}</h2>
                <div class="flex items-center gap-2 text-xs opacity-90">
                   <span class="bg-blue-500/80 px-2 py-0.5 rounded text-[10px] backdrop-blur-sm">Lv.{{ selectedFootprint.level }}</span>
                   <span class="font-mono">{{ selectedFootprint.time || '2024-01-15' }}</span>
                </div>
             </div>
          </div>


          <!-- Content Scrollable -->
          <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
             <!-- User Info -->
             <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                   <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=me" class="w-full h-full object-cover" />
                   </div>
                   <span class="text-sm font-medium text-gray-700">我 (飞行员)</span>
                </div>
                <button 
                  @click="handleLike(selectedFootprint)"
                  :class="[
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                    justLiked ? 'bg-pink-100 text-pink-600 scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  ]"
                >
                   <el-icon :class="{'text-pink-500': justLiked}"><StarFilled /></el-icon>
                   {{ selectedFootprint.likes }} 赞
                </button>
             </div>

             <!-- Description -->
             <p class="text-gray-600 text-sm leading-relaxed mb-6">
                {{ selectedFootprint.description }}
             </p>

             <!-- Comments Section -->
             <div class="border-t border-gray-100 pt-4">
                <h3 class="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                   评论 <span class="text-xs font-normal text-gray-400">({{ selectedFootprint.comments?.length || 0 }})</span>
                </h3>
                
                <div class="space-y-4">
                   <div v-for="comment in (selectedFootprint.comments || [])" :key="comment.id" class="flex gap-3">
                      <img :src="comment.avatar" class="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-gray-100" />
                      <div class="flex-1">
                         <div class="flex items-center justify-between mb-0.5">
                            <span class="text-xs font-bold text-gray-700">{{ comment.user }}</span>
                            <span class="text-[10px] text-gray-400">{{ comment.time }}</span>
                         </div>
                         <p class="text-xs text-gray-600 leading-normal">{{ comment.text }}</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <!-- Footer Input -->
          <div class="p-3 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
             <input type="text" placeholder="写下你的评论..." class="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition" />
             <button class="bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition">
                <el-icon><Promotion /></el-icon>
             </button>
          </div>
       </div>
    </div>

    <el-dialog
      v-model="uploadVisible"
      title="上传航拍点"
      :width="isMobile ? '92%' : '520px'"
      :fullscreen="isMobile"
      top="5vh"
    >
      <div class="space-y-4 max-h-[60vh] overflow-y-auto">
        <el-input v-model="uploadForm.title" placeholder="请输入标题" />
        <el-input type="textarea" v-model="uploadForm.description" placeholder="请输入描述" />
        <div>
          <div class="text-xs text-gray-500 mb-2">上传图片或填写图片地址</div>
          <el-upload
            :limit="1"
            :auto-upload="false"
            list-type="picture-card"
            :on-change="handleUpload"
          >
            <el-icon><Upload /></el-icon>
          </el-upload>
          <el-input v-model="uploadForm.imageUrl" placeholder="或粘贴图片URL" class="mt-2" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <el-button @click="uploadVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUserSpot">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Bottom Legend / Disclaimer -->
    <div class="hidden md:block absolute bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg shadow-lg p-3 z-40 text-xs text-gray-500 max-w-xs">
       <div class="flex items-center gap-2 mb-2">
          <span class="w-3 h-3 rounded-full bg-green-500"></span> 适宜飞行
          <span class="w-3 h-3 rounded-full bg-yellow-500"></span> 警告区域
          <span class="w-3 h-3 rounded-full bg-red-500"></span> 禁飞区
       </div>
       <p class="leading-relaxed scale-90 origin-bottom-right">
          注：地图数据仅供参考，实际飞行请严格遵守当地法律法规。请勿在禁飞区起飞。
       </p>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import { Search, Upload, UserFilled, Camera, Picture, StarFilled, Location, MapLocation, Trophy, Close, Promotion, ArrowLeft, ArrowRight, CaretTop, CaretBottom, Tools, Share, Download } from '@element-plus/icons-vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ElMessage } from 'element-plus'

const router = useRouter()
const windowWidth = ref(window.innerWidth)
const updateWidth = () => {
  windowWidth.value = window.innerWidth
}
const isMobile = computed(() => windowWidth.value < 768)
const jumpToNeeds = () => {
  const identity = localStorage.getItem('activeIdentity') || 'provider'
  const level = localStorage.getItem('providerLevel') || 'lv1'
  let type = 'personal'
  if (identity === 'requester_enterprise') type = 'enterprise'
  else if (level === 'lv3' || level === 'lv4') type = 'enterprise'
  router.push({ path: '/service-needs', query: { source: 'qunapai', type } })
}
const isSidebarOpen = ref(true)
const createSpotMode = ref(false)
const measureMode = ref(false)
const areaMode = ref(false)
const showRecommendations = ref(false)
const showLowTools = ref(false)
const activeToolTab = ref('measure')
const toolTabs = [
  { value: 'layers', label: '图层管理' },
  { value: 'measure', label: '测量分析' },
  { value: 'vector', label: '矢量标绘' },
  { value: 'share', label: '分享与下载' }
]
const activeMeasureTool = ref(null)
const activeVectorTool = ref(null)
const layerVisibility = reactive({
  terrain: true,
  airspace: true,
  suitable: true,
  warning: true,
  forbidden: true,
  weatherWind10: false,
  weatherWind100: false,
  weatherRainNow: false,
  weatherRainIntensity: false,
  weatherEcho: false,
  weatherGust: false,
  weatherSnow: false,
  weatherHumidity: false,
  weatherVisibility: false,
  weatherPressure: false,
  weatherIR: false,
  weatherWaterVapour: false,
  weatherVisibleLight: false,
  temp2m: false
})
const measurePoints = ref([])
let measureLine = null
let measureTempLine = null
let segmentLabels = []
const areaPoints = ref([])
let areaPolygon = null
let areaTempLine = null
let areaLabelMarker = null
const userMarkers = ref([])
const userSpots = ref(JSON.parse(localStorage.getItem('userSpots') || '[]'))
const uploadVisible = ref(false)
const pendingLatLng = ref(null)
const uploadForm = ref({ title: '', description: '', imageUrl: '' })
const totalDistance = computed(() => {
  if (measurePoints.value.length < 2) return 0
  let sum = 0
  for (let i = 1; i < measurePoints.value.length; i++) {
    const a = L.latLng(measurePoints.value[i - 1].lat, measurePoints.value[i - 1].lng)
    const b = L.latLng(measurePoints.value[i].lat, measurePoints.value[i].lng)
    sum += a.distanceTo(b)
  }
  return sum
})
const formatDistance = (d) => {
  if (d < 1000) return `${Math.round(d)} m`
  return `${(d / 1000).toFixed(2)} km`
}
const formatArea = (a) => {
  if (a < 1_000_000) return `${Math.round(a)} m²`
  return `${(a / 1_000_000).toFixed(2)} km²`
}
const totalArea = computed(() => {
  if (areaPoints.value.length < 3) return 0
  const R = 6378137
  const lat0 = areaPoints.value.reduce((acc, p) => acc + p.lat, 0) / areaPoints.value.length
  const cosLat0 = Math.cos(lat0 * Math.PI / 180)
  const pts = areaPoints.value.map(p => {
    const x = R * (p.lng * Math.PI / 180) * cosLat0
    const y = R * (p.lat * Math.PI / 180)
    return [x, y]
  })
  let area = 0
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    area += (pts[j][0] * pts[i][1]) - (pts[i][0] * pts[j][1])
  }
  return Math.abs(area) / 2
})
const showComingSoon = (name) => {
  ElMessage.info(`${name} 暂未接入，后续版本支持`)
}
onMounted(() => {
  window.addEventListener('resize', updateWidth)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
const clearMeasure = () => {
  measurePoints.value = []
  if (measureLine && map) {
    map.removeLayer(measureLine)
    measureLine = null
  }
  if (measureTempLine && map) {
    map.removeLayer(measureTempLine)
    measureTempLine = null
  }
  segmentLabels.forEach(l => map.removeLayer(l))
  segmentLabels = []
}
const clearArea = () => {
  areaPoints.value = []
  if (areaPolygon && map) {
    map.removeLayer(areaPolygon)
    areaPolygon = null
  }
  if (areaTempLine && map) {
    map.removeLayer(areaTempLine)
    areaTempLine = null
  }
  if (areaLabelMarker && map) {
    map.removeLayer(areaLabelMarker)
    areaLabelMarker = null
  }
}
const clearMarkers = () => {
  if (!map) return
  userMarkers.value.forEach(m => map.removeLayer(m))
  userMarkers.value = []
}
const finishMeasure = () => {
  measureMode.value = false
}
const finishArea = () => {
  if (areaPoints.value.length >= 3) {
    if (areaPolygon) {
      areaPolygon.setLatLngs(areaPoints.value.map(p => [p.lat, p.lng]))
    } else {
      areaPolygon = L.polygon(areaPoints.value.map(p => [p.lat, p.lng]), { color: '#2563eb', weight: 2, fillColor: '#60a5fa', fillOpacity: 0.2 }).addTo(map)
    }
    if (areaTempLine) {
      map.removeLayer(areaTempLine)
      areaTempLine = null
    }
    const center = areaPolygon.getBounds().getCenter()
    const labelHtml = `<div class="px-2 py-1 rounded-full bg-white shadow text-xs text-gray-700 border border-gray-100">${formatArea(totalArea.value)}</div>`
    if (areaLabelMarker) {
      areaLabelMarker.setLatLng(center)
    } else {
      areaLabelMarker = L.marker(center, { icon: L.divIcon({ className: 'area-label', html: labelHtml }) }).addTo(map)
    }
  }
  areaMode.value = false
}
const undoMeasurePoint = () => {
  if (measurePoints.value.length === 0) return
  measurePoints.value.pop()
  if (measureLine) {
    if (measurePoints.value.length >= 2) {
      measureLine.setLatLngs(measurePoints.value.map(p => [p.lat, p.lng]))
    } else {
      map.removeLayer(measureLine)
      measureLine = null
    }
  }
  if (segmentLabels.length > 0) {
    const l = segmentLabels.pop()
    map.removeLayer(l)
  }
}
const undoAreaPoint = () => {
  if (areaPoints.value.length === 0) return
  areaPoints.value.pop()
  if (areaPolygon) {
    if (areaPoints.value.length >= 3) {
      areaPolygon.setLatLngs(areaPoints.value.map(p => [p.lat, p.lng]))
    } else {
      map.removeLayer(areaPolygon)
      areaPolygon = null
    }
  }
}
const startDistanceMeasure = () => {
  clearMeasure()
  clearArea()
  measureMode.value = true
  areaMode.value = false
  createSpotMode.value = false
  activeMeasureTool.value = 'distance'
  showLowTools.value = true
  activeToolTab.value = 'measure'
}
const startAreaMeasure = () => {
  clearMeasure()
  clearArea()
  measureMode.value = false
  areaMode.value = true
  createSpotMode.value = false
  activeMeasureTool.value = 'area'
  showLowTools.value = true
  activeToolTab.value = 'measure'
}
const startVectorPoint = () => {
  createSpotMode.value = true
  measureMode.value = false
  areaMode.value = false
  activeVectorTool.value = 'point'
  showLowTools.value = true
  activeToolTab.value = 'vector'
}
const saveUserSpot = () => {
  if (!pendingLatLng.value) return
  const spot = {
    id: Date.now(),
    lat: pendingLatLng.value.lat,
    lng: pendingLatLng.value.lng,
    title: uploadForm.value.title || '我的航拍点',
    imageUrl: uploadForm.value.imageUrl || 'https://picsum.photos/seed/myspot/300/200',
    description: uploadForm.value.description || '',
    likes: 0,
    level: 1,
    comments: []
  }
  userSpots.value.unshift(spot)
  localStorage.setItem('userSpots', JSON.stringify(userSpots.value))
  const m = L.marker([spot.lat, spot.lng], { icon: getSpotThumbnailIcon(spot.imageUrl) }).addTo(map)
  const content = document.createElement('div')
  content.className = 'text-center'
  content.innerHTML = `
    <div class="font-bold text-gray-800 mb-1">${spot.title}</div>
    <img src="${spot.imageUrl}" class="w-32 h-20 object-cover rounded-lg mx-auto mb-2" />
    <button class="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition w-full">查看详情</button>
  `
  const btn = content.querySelector('button')
  btn.onclick = () => {
    selectedFootprint.value = spot
    showDetailModal.value = true
  }
  m.bindPopup(content)
  userMarkers.value.push(m)
  uploadVisible.value = false
  pendingLatLng.value = null
  uploadForm.value = { title: '', description: '', imageUrl: '' }
}
const handleUpload = (file) => {
  const reader = new FileReader()
  reader.onload = () => {
    uploadForm.value.imageUrl = reader.result
  }
  reader.readAsDataURL(file.raw)
}

// State for Modal
const selectedFootprint = ref(null)
const showDetailModal = ref(false)
const justLiked = ref(false)

// Mock Data for User's "World Fog"
const myFootprints = ref([
  { 
    id: 101, lat: 39.9163447, lng: 116.3971546, title: "故宫·角楼", likes: 12, level: 2,
    imageUrl: "https://images.unsplash.com/photo-1548622150-1dd018335416?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "夕阳下的角楼，金碧辉煌，倒影如画。拍摄于2024年秋。",
    comments: [
      { id: 1, user: "飞友小张", avatar: "https://i.pravatar.cc/150?u=1", text: "光影太棒了！求参数！", time: "10分钟前" },
      { id: 2, user: "DroneMaster", avatar: "https://i.pravatar.cc/150?u=2", text: "构图很经典。", time: "2小时前" }
    ]
  },
  { 
    id: 102, lat: 39.999, lng: 116.388, title: "奥林匹克塔", likes: 5, level: 1,
    imageUrl: "https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "俯瞰奥森公园，五环塔灯光璀璨。",
    comments: [
      { id: 1, user: "User888", avatar: "https://i.pravatar.cc/150?u=3", text: "这里可以飞吗？", time: "昨天" }
    ]
  },
  { 
    id: 103, lat: 39.95, lng: 116.46, title: "朝阳公园", likes: 88, level: 4,
    imageUrl: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    description: "城市绿肺，周末航拍好去处。",
    comments: [
      { id: 1, user: "Lucy", avatar: "https://i.pravatar.cc/150?u=4", text: "太美了！", time: "5小时前" },
      { id: 2, user: "Tom", avatar: "https://i.pravatar.cc/150?u=5", text: "我也想去拍。", time: "1天前" }
    ]
  }
])

const totalLikes = computed(() => myFootprints.value.reduce((acc, cur) => acc + cur.likes, 0))
const playerLevel = computed(() => Math.floor(totalLikes.value / 10) + 1)

const openDetail = (fp) => {
  selectedFootprint.value = fp
  showDetailModal.value = true
  justLiked.value = false
}

const closeDetailModal = () => {
  showDetailModal.value = false
}

const handleLike = (fp) => {
  if (justLiked.value) return
  fp.likes++
  justLiked.value = true
  
  if (fp.likes % 5 === 0) {
    fp.level++
    updateMapLayers()
  }
}

const openPublicSpotFromList = (loc, index) => {
  openDetail(buildPublicFootprint(loc, index))
}


let map = null
let droneMarkers = []
let standardMarkers = []
let noFlyLayers = []

// Standard public locations
const publicLocations = [
    { lat: 39.9163447, lng: 116.3971546, title: "故宫博物院" },
    { lat: 39.999, lng: 116.388, title: "奥林匹克公园" },
    { lat: 39.9042, lng: 116.4074, title: "北京站" },
    { lat: 39.93, lng: 116.35, title: "动物园" },
    { lat: 39.88, lng: 116.45, title: "欢乐谷" }
]

const buildPublicFootprint = (loc, index) => ({
  id: index + 1,
  lat: loc.lat,
  lng: loc.lng,
  title: loc.title,
  imageUrl: `https://picsum.photos/seed/spot_${index}/800/600`,
  description: '热门航拍点示例',
  likes: 0,
  level: 1,
  comments: [],
  time: '2024-01-15'
})

// Mock No-Fly Zones
const noFlyZones = [
  { lat: 39.9163447, lng: 116.3971546, radius: 1500, title: "首都核心禁飞区" }, // Forbidden City
  { lat: 40.079, lng: 116.603, radius: 4000, title: "首都国际机场" }, // PEK Airport
  { lat: 39.79, lng: 116.39, radius: 3000, title: "南苑机场旧址" } // Nanyuan
]

// Fix Leaflet's default icon path issues in bundlers
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Drone Icon Generator
const getDroneIcon = (level) => {
  const size = 40 + (level * 5); // Grow with level
  // Custom SVG based on user provided image (Blue Quadcopter)
  const svgContent = `
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
      <!-- Arms -->
      <path d="M20 20 L80 80 M80 20 L20 80" stroke="#0066FF" stroke-width="8" stroke-linecap="round" />
      <!-- Center -->
      <circle cx="50" cy="50" r="12" fill="#FFFFFF" stroke="#0066FF" stroke-width="4" />
      <circle cx="50" cy="50" r="4" fill="#0066FF" />
      <!-- Rotors -->
      <circle cx="20" cy="20" r="18" fill="#E6F0FF" stroke="#0066FF" stroke-width="4" />
      <circle cx="80" cy="20" r="18" fill="#E6F0FF" stroke="#0066FF" stroke-width="4" />
      <circle cx="20" cy="80" r="18" fill="#E6F0FF" stroke="#0066FF" stroke-width="4" />
      <circle cx="80" cy="80" r="18" fill="#E6F0FF" stroke="#0066FF" stroke-width="4" />
      <!-- Level Badge -->
      <g transform="translate(60, 60)">
         <circle cx="15" cy="15" r="12" fill="${level >= 5 ? '#FFD700' : '#0066FF'}" />
         <text x="15" y="19" text-anchor="middle" fill="white" font-weight="bold" font-size="14" font-family="Arial">${level}</text>
      </g>
    </svg>
  `

  return L.divIcon({
    className: 'custom-drone-icon',
    html: `
      <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
        <!-- Dynamic Ripple Effect -->
        <div class="absolute inset-0 bg-blue-500 rounded-full opacity-0 animate-ping-slow"></div>
        <div class="absolute inset-[-50%] border-2 border-blue-400/30 rounded-full animate-pulse-ring"></div>
        <div class="absolute inset-[-100%] border border-blue-300/10 rounded-full animate-pulse-ring delay-75"></div>
        
        <!-- Drone Icon -->
        <div class="relative z-10 w-full h-full transition-transform duration-500 hover:scale-110">
           ${svgContent}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
}

const getSpotThumbnailIcon = (imageUrl) => {
  const size = 32
  const safeUrl = imageUrl || icon
  return L.divIcon({
    className: 'spot-thumbnail-icon',
    html: `
      <div style="width:${size}px;height:${size}px;border-radius:999px;overflow:hidden;border:2px solid #ffffff;box-shadow:0 4px 8px rgba(15,23,42,0.35);background:#e5e7eb;">
        <img src="${safeUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size]
  })
}

const updateMapLayers = () => {
  if (!map) return

  // Clear everything first
  standardMarkers.forEach(m => map.removeLayer(m))
  standardMarkers = []
  droneMarkers.forEach(m => map.removeLayer(m))
  droneMarkers = []
  
  // Clear No-Fly Zones
  noFlyLayers.forEach(l => map.removeLayer(l))
  noFlyLayers = []

  if (layerVisibility.forbidden) {
    noFlyZones.forEach(zone => {
       const circle = L.circle([zone.lat, zone.lng], {
          color: '#ef4444',
          fillColor: '#ef4444',
          fillOpacity: 0.2,
          radius: zone.radius,
          weight: 1,
          dashArray: '5, 5'
       }).addTo(map)
       
       circle.bindPopup(`
          <div class="text-center">
             <div class="font-bold text-red-600 mb-1">🚫 禁飞区</div>
             <div class="text-xs text-gray-600">${zone.title}</div>
          </div>
       `)
       
       noFlyLayers.push(circle)
    })
  }

  publicLocations.forEach((loc, index) => {
      const thumbUrl = `https://picsum.photos/seed/spot_${index}/200/200`
      const marker = L.marker([loc.lat, loc.lng], { icon: getSpotThumbnailIcon(thumbUrl) }).addTo(map)
      const footprint = buildPublicFootprint(loc, index)
      const content = document.createElement('div')
      content.className = 'text-center'
      content.innerHTML = `
        <div class="font-bold text-gray-800 mb-1">${loc.title}</div>
        <div class="text-xs text-gray-500 mb-2">热门航拍点</div>
        <button class="bg-blue-600 text-white text-xs px-3 py-1 rounded-full hover:bg-blue-700 transition w-full">查看详情</button>
      `
      const btn = content.querySelector('button')
      btn.onclick = () => {
        openDetail(footprint)
      }
      marker.on('click', () => {
        openDetail(footprint)
      })
      marker.bindPopup(content)
      standardMarkers.push(marker)
  })
  map.setView([39.9042, 116.4074], 13)
}

const toggleLayer = (key, label) => {
  layerVisibility[key] = !layerVisibility[key]
  if (key === 'forbidden') {
    updateMapLayers()
  } else {
    showComingSoon(label)
  }
}

const downloadCurrentMap = () => {
  if (!map) return
  const payload = {
    center: map.getCenter(),
    zoom: map.getZoom(),
    publicLocations,
    userSpots: userSpots.value,
    noFlyZones,
    measurePoints: measurePoints.value,
    areaPoints: areaPoints.value,
    timestamp: new Date().toISOString()
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `low-altitude-map-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success('已导出当前地图配置 JSON')
}

// Share & Import Logic
const copyShareLink = () => {
  if (!map) return
  const state = {
    center: map.getCenter(),
    zoom: map.getZoom(),
    layers: layerVisibility
  }
  const stateStr = encodeURIComponent(JSON.stringify(state))
  const url = `${window.location.origin}${window.location.pathname}?share=${stateStr}`
  
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success('链接已复制，可分享给他人')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

const fileInput = ref(null)
const triggerImport = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const restoreMapState = (config) => {
  if (!map || !config) return
  
  if (config.center && config.zoom) {
    map.setView(config.center, config.zoom)
  }
  
  if (config.layers) {
    Object.keys(config.layers).forEach(key => {
      if (layerVisibility[key] !== config.layers[key]) {
        layerVisibility[key] = config.layers[key]
        if (key === 'forbidden') {
          updateMapLayers()
        }
      }
    })
  }
}

const handleImportFile = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const config = JSON.parse(e.target.result)
      restoreMapState(config)
      ElMessage.success('地图配置已导入')
    } catch (err) {
      ElMessage.error('解析文件失败')
    }
    event.target.value = ''
  }
  reader.readAsText(file)
}

const checkShareLink = () => {
  const query = new URLSearchParams(window.location.search)
  const shareData = query.get('share')
  if (shareData) {
    try {
      const config = JSON.parse(decodeURIComponent(shareData))
      restoreMapState(config)
      ElMessage.success('已加载分享的地图视图')
      const newUrl = window.location.origin + window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    } catch (e) {
      console.error('Share link parse error', e)
    }
  }
}

onMounted(() => {
  // Initialize map centered on Beijing
  map = L.map('map', {
      zoomControl: false // Hide default zoom controls for cleaner look
  }).setView([39.9042, 116.4074], 13)

  // Use CartoDB Positron tiles for a bright, clean look (Free!)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
  }).addTo(map)

  // Add Zoom Control to bottom right
  L.control.zoom({
      position: 'bottomright'
  }).addTo(map)

  map.on('mousemove', (e) => {
    if (measureMode.value && measurePoints.value.length > 0) {
      const pts = [...measurePoints.value.map(p => [p.lat, p.lng]), [e.latlng.lat, e.latlng.lng]]
      if (measureTempLine) {
        measureTempLine.setLatLngs(pts)
      } else {
        measureTempLine = L.polyline(pts, { color: '#60a5fa', weight: 2, dashArray: '4,4' }).addTo(map)
      }
    } else if (areaMode.value && areaPoints.value.length > 0) {
      const pts = [...areaPoints.value.map(p => [p.lat, p.lng]), [e.latlng.lat, e.latlng.lng]]
      if (areaTempLine) {
        areaTempLine.setLatLngs(pts)
      } else {
        areaTempLine = L.polyline(pts, { color: '#60a5fa', weight: 2, dashArray: '4,4' }).addTo(map)
      }
    } else {
      if (measureTempLine) {
        map.removeLayer(measureTempLine)
        measureTempLine = null
      }
      if (areaTempLine) {
        map.removeLayer(areaTempLine)
        areaTempLine = null
      }
    }
  })
  map.on('dblclick', () => {
    if (measureMode.value) finishMeasure()
    if (areaMode.value) finishArea()
  })
  map.on('contextmenu', (e) => {
    if (measureMode.value) {
      finishMeasure()
    } else if (areaMode.value) {
      finishArea()
    } else if (createSpotMode.value) {
      createSpotMode.value = false
    }
  })
  map.on('click', (e) => {
    const { latlng } = e
    if (measureMode.value) {
      measurePoints.value.push({ lat: latlng.lat, lng: latlng.lng })
      if (measureLine) {
        measureLine.setLatLngs(measurePoints.value.map(p => [p.lat, p.lng]))
      } else {
        measureLine = L.polyline(measurePoints.value.map(p => [p.lat, p.lng]), { color: '#2563eb', weight: 3 }).addTo(map)
      }
      if (measurePoints.value.length >= 2) {
        const a = measurePoints.value[measurePoints.value.length - 2]
        const b = measurePoints.value[measurePoints.value.length - 1]
        const mid = [(a.lat + b.lat) / 2, (a.lng + b.lng) / 2]
        const dist = L.latLng(a.lat, a.lng).distanceTo(L.latLng(b.lat, b.lng))
        const label = L.marker(mid, {
          icon: L.divIcon({
            className: 'segment-label',
            html: `<div class="px-2 py-1 rounded-full bg-white shadow text-xs text-gray-700 border border-gray-100">${formatDistance(dist)}</div>`
          })
        }).addTo(map)
        segmentLabels.push(label)
      }
  } else if (areaMode.value) {
      areaPoints.value.push({ lat: latlng.lat, lng: latlng.lng })
      if (areaPolygon) {
        areaPolygon.setLatLngs(areaPoints.value.map(p => [p.lat, p.lng]))
      } else {
        areaPolygon = L.polygon(areaPoints.value.map(p => [p.lat, p.lng]), { color: '#2563eb', weight: 2, fillColor: '#60a5fa', fillOpacity: 0.2 }).addTo(map)
      }
      if (areaLabelMarker) {
        const center = areaPolygon.getBounds().getCenter()
        areaLabelMarker.setLatLng(center)
      }
  } else if (createSpotMode.value) {
      pendingLatLng.value = latlng
      uploadVisible.value = true
    }
  })

  // Initial Load
  updateMapLayers()
  
  // Check for shared state
  checkShareLink()
})

watch([createSpotMode, measureMode], () => {
  if (!map) return
  if (createSpotMode.value) {
    map.getContainer().style.cursor = `url(${icon}) 12 41, pointer`
  } else if (measureMode.value || areaMode.value) {
    map.getContainer().style.cursor = 'crosshair'
  } else {
    map.getContainer().style.cursor = ''
  }
})

onUnmounted(() => {
    if (map) {
        map.remove()
        map = null
    }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

@keyframes ping-slow {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
.animate-ping-slow {
  animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(2.5); opacity: 0; }
}
.animate-pulse-ring {
  animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes slide-in-left {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-out forwards;
}

@keyframes scale-in {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}
</style>
