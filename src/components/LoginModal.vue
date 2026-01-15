<script setup>
import { ref, computed, reactive } from 'vue'
import { User, Lock, Close, Key, Iphone } from '@element-plus/icons-vue'
import { useAuth } from '../composables/useAuth'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'login-success'])
const router = useRouter()
const { login, register } = useAuth()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const activeTab = ref('login')
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  phone: '',
  registerRole: 'personal', // personal or enterprise
  loginIdentity: 'requester' // requester or provider
})

const handleSubmit = async () => {
  errorMessage.value = ''
  loading.value = true
  
  try {
    if (activeTab.value === 'login') {
      if (!form.username || !form.password) {
        errorMessage.value = '请输入用户名和密码'
        loading.value = false
        return
      }
      
      const res = await login(form.username, form.password, form.loginIdentity)
      if (res.success) {
        ElMessage.success(`欢迎回来，${res.user.nickname || res.user.username}`)
        dialogVisible.value = false
        emit('login-success', res.user)
        
        // Redirect logic based on role
        if (res.user.role === 'admin') {
          router.push('/admin')
        }
      } else {
        errorMessage.value = res.message
      }
    } else {
      // Register
      if (!form.username || !form.password) {
        errorMessage.value = '请填写完整信息'
        loading.value = false
        return
      }
      if (form.password !== form.confirmPassword) {
        errorMessage.value = '两次输入的密码不一致'
        loading.value = false
        return
      }
      
      const res = await register(form)
      if (res.success) {
        ElMessage.success('注册成功')
        dialogVisible.value = false
        emit('login-success', res.user)
      } else {
        errorMessage.value = res.message
      }
    }
  } catch (e) {
    errorMessage.value = '操作失败，请重试'
    console.error(e)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    width="90%"
    :show-close="false"
    class="tech-login-dialog"
    destroy-on-close
    append-to-body
  >
    <div class="relative bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
        <el-icon :size="20"><Close /></el-icon>
      </button>

      <!-- Content -->
      <div class="p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-2">欢迎来到低空智慧飞滴</h2>
          <p class="text-gray-400 text-sm">连接需求与服务，赋能低空经济</p>
        </div>

        <!-- Tabs -->
        <div class="flex p-1 bg-white/5 rounded-lg mb-6">
          <button 
            @click="activeTab = 'login'; errorMessage = ''"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300"
            :class="activeTab === 'login' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white'"
          >
            登录
          </button>
          <button 
            @click="activeTab = 'register'; errorMessage = ''"
            class="flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300"
            :class="activeTab === 'register' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white'"
          >
            注册
          </button>
        </div>

        <!-- Form -->
        <div class="space-y-5" @keydown.enter="handleSubmit">
          <div class="group">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                <el-icon><User /></el-icon>
              </div>
              <input 
                v-model="form.username"
                type="text" 
                placeholder="用户名 / 手机号" 
                class="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder-gray-600"
              />
            </div>
          </div>

          <div class="group">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                <el-icon><Lock /></el-icon>
              </div>
              <input 
                v-model="form.password"
                type="password" 
                placeholder="密码" 
                class="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder-gray-600"
              />
            </div>
          </div>

          <div v-if="activeTab === 'login'" class="space-y-2">
            <div class="flex items-center justify-between text-xs text-gray-400">
              <span>登录身份</span>
              <span class="text-[10px] text-gray-500">请选择本次会话身份</span>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="form.loginIdentity = 'requester'"
                :class="[
                  'w-full text-center px-2 py-2 rounded-lg border transition-all duration-200 text-xs font-medium',
                  form.loginIdentity === 'requester'
                    ? 'border-emerald-400/80 bg-white/10 text-white shadow-md shadow-emerald-500/40'
                    : 'border-white/10 bg-white/0 text-gray-300 hover:border-emerald-400/60 hover:bg-white/5 hover:text-white'
                ]"
              >
                我是需求方
              </button>
              <button
                type="button"
                @click="form.loginIdentity = 'provider'"
                :class="[
                  'w-full text-center px-2 py-2 rounded-lg border transition-all duration-200 text-xs font-medium',
                  form.loginIdentity === 'provider'
                    ? 'border-indigo-400/80 bg-white/10 text-white shadow-md shadow-indigo-500/40'
                    : 'border-white/10 bg-white/0 text-gray-300 hover:border-indigo-400/60 hover:bg-white/5 hover:text-white'
                ]"
              >
                我是服务方
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'register'" class="space-y-5">
             <div class="group">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                    <el-icon><Key /></el-icon>
                  </div>
                  <input 
                    v-model="form.confirmPassword"
                    type="password" 
                    placeholder="确认密码" 
                    class="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder-gray-600"
                  />
                </div>
             </div>
             <div class="space-y-2">
               <div class="flex items-center justify-between text-xs text-gray-400">
                 <span>注册类型</span>
                 <span class="text-[10px] text-gray-500">仅用于初始化账号</span>
               </div>
               <div class="grid grid-cols-2 gap-3">
                 <button
                   type="button"
                   @click="form.registerRole = 'personal'"
                   :class="[
                     'w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 text-xs',
                     form.registerRole === 'personal'
                       ? 'border-cyan-400/80 bg-white/10 text-white shadow-md shadow-cyan-500/30'
                       : 'border-white/10 bg-white/0 text-gray-300 hover:border-cyan-400/60 hover:bg-white/5 hover:text-white'
                   ]"
                 >
                   <div class="flex items-center gap-2 mb-1">
                     <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/80 text-[11px] font-bold text-white">个</span>
                     <span class="font-semibold">个人账号</span>
                   </div>
                   <div class="text-[11px] leading-tight text-gray-400">
                     适用于普通用户、独立飞手
                   </div>
                 </button>
                 <button
                   type="button"
                   @click="form.registerRole = 'enterprise'"
                   :class="[
                     'w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200 text-xs',
                     form.registerRole === 'enterprise'
                       ? 'border-blue-400/80 bg-white/10 text-white shadow-md shadow-blue-500/30'
                       : 'border-white/10 bg-white/0 text-gray-300 hover:border-blue-400/60 hover:bg-white/5 hover:text-white'
                   ]"
                 >
                   <div class="flex items-center gap-2 mb-1">
                     <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/80 text-[11px] font-bold text-white">企</span>
                     <span class="font-semibold">企业账号</span>
                   </div>
                   <div class="text-[11px] leading-tight text-gray-400">
                     适用于企业、机构、团队
                   </div>
                 </button>
               </div>
             </div>

             <div class="space-y-2">
               <div class="flex items-center justify-between text-xs text-gray-400">
                 <span>注册身份</span>
                 <span class="text-[10px] text-gray-500">选择您的主要身份</span>
               </div>
               <div class="grid grid-cols-2 gap-3">
                 <button
                   type="button"
                   @click="form.registerIdentity = 'requester'"
                   :class="[
                     'w-full text-center px-2 py-2 rounded-lg border transition-all duration-200 text-xs font-medium',
                     form.registerIdentity === 'requester'
                       ? 'border-emerald-400/80 bg-white/10 text-white shadow-md shadow-emerald-500/40'
                       : 'border-white/10 bg-white/0 text-gray-300 hover:border-emerald-400/60 hover:bg-white/5 hover:text-white'
                   ]"
                 >
                   我是需求方
                 </button>
                 <button
                   type="button"
                   @click="form.registerIdentity = 'provider'"
                   :class="[
                     'w-full text-center px-2 py-2 rounded-lg border transition-all duration-200 text-xs font-medium',
                     form.registerIdentity === 'provider'
                       ? 'border-indigo-400/80 bg-white/10 text-white shadow-md shadow-indigo-500/40'
                       : 'border-white/10 bg-white/0 text-gray-300 hover:border-indigo-400/60 hover:bg-white/5 hover:text-white'
                   ]"
                 >
                   我是服务方
                 </button>
               </div>
             </div>
             <!-- Optional Phone for register -->
             <!-- <div class="group">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                    <el-icon><Iphone /></el-icon>
                  </div>
                  <input 
                    v-model="form.phone"
                    type="text" 
                    placeholder="手机号 (选填)" 
                    class="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all placeholder-gray-600"
                  />
                </div>
             </div> -->
          </div>
          
          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-400 text-xs text-center bg-red-500/10 py-1 rounded">
            {{ errorMessage }}
          </div>

          <!-- Action Button -->
          <button 
            @click="handleSubmit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white font-semibold py-2.5 rounded-full hover:shadow-lg hover:shadow-cyan-500/40 active:scale-[0.97] transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center tracking-wide"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2"></span>
            <span>{{ activeTab === 'login' ? '立即登录' : '立即注册' }}</span>
          </button>

          <!-- Footer Links -->
          <div class="flex justify-between text-xs text-gray-500 mt-4">
            <a href="#" class="hover:text-cyan-400 transition-colors">忘记密码?</a>
            <span v-if="activeTab === 'login'">还没有账号? <a href="#" @click.prevent="activeTab = 'register'; errorMessage = ''" class="text-cyan-400 hover:text-cyan-300">去注册</a></span>
            <span v-else>已有账号? <a href="#" @click.prevent="activeTab = 'login'; errorMessage = ''" class="text-cyan-400 hover:text-cyan-300">去登录</a></span>
          </div>
          
          <!-- Demo Hints -->
          <div class="mt-4 pt-4 border-t border-white/5 text-xs text-gray-600">
             <p>演示账号:</p>
             <div class="flex gap-2 mt-1">
               <span class="bg-white/5 px-2 py-1 rounded cursor-pointer hover:bg-white/10" @click="form.username='xiaowang';form.password='password'">小白(C端)</span>
               <span class="bg-white/5 px-2 py-1 rounded cursor-pointer hover:bg-white/10" @click="form.username='lantian';form.password='password'">蓝天(B端)</span>
               <span class="bg-white/5 px-2 py-1 rounded cursor-pointer hover:bg-white/10" @click="form.username='admin';form.password='admin'">管理员</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style>
.tech-login-dialog {
  max-width: 400px !important;
}
.tech-login-dialog .el-dialog {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}
.tech-login-dialog .el-dialog__header {
  display: none;
}
.tech-login-dialog .el-dialog__body {
  padding: 0 !important;
  background: transparent !important;
}
</style>
