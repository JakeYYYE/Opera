<template>
  <el-menu :default-active="route.path" class="border-0 w-full" router :collapse="isCollapse">
    <!-- Admin Menu -->
    <template v-if="isAdmin">
      <el-menu-item index="/admin/dashboard">
        <el-icon><HomeFilled /></el-icon>
        <template #title>总览</template>
      </el-menu-item>

      <el-sub-menu index="users">
        <template #title>
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/admin/users/c">
            <el-icon><UserFilled /></el-icon>
            <span>C端用户管理</span>
          </el-menu-item>
        <el-menu-item index="/admin/providers">
          <el-icon><OfficeBuilding /></el-icon>
          <span>B端用户管理</span>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="business">
        <template #title>
          <el-icon><Operation /></el-icon>
          <span>业务管理</span>
        </template>
        <el-menu-item index="/admin/needs">
          <el-icon><Document /></el-icon>
          <span>需求管理</span>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="content">
        <template #title>
          <el-icon><Reading /></el-icon>
          <span>内容管理</span>
        </template>
        <el-menu-item index="/admin/news">
          <el-icon><Tickets /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/audit">
          <el-icon><Stamp /></el-icon>
          <span>审核管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/category">
          <el-icon><List /></el-icon>
          <span>栏目管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/news/featured">
          <el-icon><Star /></el-icon>
          <span>首页推荐</span>
        </el-menu-item>
      </el-sub-menu>
    </template>

    <!-- Requester Menu -->
    <template v-else-if="isRequester">
      <el-menu-item index="/admin/requester/dashboard">
        <el-icon><DataBoard /></el-icon>
        <template #title>工作台</template>
      </el-menu-item>
      <el-menu-item index="/admin/messages">
        <el-icon><Message /></el-icon>
        <template #title>消息中心</template>
      </el-menu-item>
      <el-menu-item index="/admin/profile">
        <el-icon><Setting /></el-icon>
        <template #title>账号设置</template>
      </el-menu-item>
    </template>

    <!-- Provider Menu -->
    <template v-else-if="isProvider">
      <el-menu-item index="/admin/provider/dashboard">
        <el-icon><DataBoard /></el-icon>
        <template #title>工作台</template>
      </el-menu-item>
      <el-menu-item index="/admin/messages">
        <el-icon><Message /></el-icon>
        <template #title>消息中心</template>
      </el-menu-item>
      <el-menu-item index="/admin/profile">
        <el-icon><Setting /></el-icon>
        <template #title>账号设置</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Menu, UserFilled, HomeFilled, Document, OfficeBuilding, Operation, 
  Reading, Tickets, Star, List, Stamp, User, Shop, DataBoard, Message, 
  Checked, Suitcase, Setting 
} from '@element-plus/icons-vue'
import { useAuth } from '../composables/useAuth'

const props = defineProps({
  isCollapse: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const { user, activeIdentity } = useAuth()

const isAdmin = computed(() => user.value?.role === 'admin')
const isRequester = computed(() => activeIdentity.value && activeIdentity.value.startsWith('requester'))
const isProvider = computed(() => activeIdentity.value === 'provider')

</script>
