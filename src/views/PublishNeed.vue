<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
    <div class="mb-6 border-b border-gray-100 pb-4">
      <h1 class="text-xl md:text-2xl font-bold text-gray-800">发布新需求</h1>
      <p class="text-sm text-gray-500 mt-1">填写详细的需求信息，以便服务商更准确地为您报价</p>
    </div>

    <el-form :model="form" label-position="top" class="max-w-3xl">
      <el-form-item label="需求标题" required>
        <el-input v-model="form.title" placeholder="例如：某某公园全景航拍" />
      </el-form-item>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="服务类型" required>
          <el-select v-model="form.category" placeholder="请选择服务类型" class="w-full">
            <el-option label="摄影摄像" value="摄影摄像" />
            <el-option label="农林植保" value="农林植保" />
            <el-option label="电力巡检" value="电力巡检" />
            <el-option label="地理测绘" value="地理测绘" />
            <el-option label="安防监控" value="安防监控" />
            <el-option label="物流运输" value="物流运输" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>

        <el-form-item label="预算金额" required>
          <el-input v-model="form.budget" placeholder="例如：5000">
            <template #prefix>¥</template>
          </el-input>
        </el-form-item>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-form-item label="作业地点" required>
          <el-input v-model="form.location" placeholder="例如：北京市海淀区..." />
        </el-form-item>

        <el-form-item label="截止日期" required>
          <el-date-picker
            v-model="form.deadline"
            type="date"
            placeholder="选择日期"
            class="w-full"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </div>

      <el-form-item label="需求描述" required>
        <el-input
          v-model="form.desc"
          type="textarea"
          rows="6"
          placeholder="请详细描述您的需求，包括作业范围、交付标准、特殊要求等..."
        />
      </el-form-item>
      
      <el-form-item label="附件上传">
        <el-upload
          class="upload-demo"
          action="#"
          :auto-upload="false"
          drag
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            拖拽文件到此处或 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 PDF/Word/Excel/图片 等格式，单个文件不超过 10MB
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="large" @click="submitForm">立即发布</el-button>
        <el-button size="large" @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const router = useRouter()
const form = ref({
  title: '',
  category: '',
  budget: '',
  location: '',
  deadline: '',
  desc: ''
})

const submitForm = () => {
  if (!form.value.title || !form.value.category || !form.value.budget) {
    ElMessage.warning('请完善必填信息')
    return
  }

  // Here you would typically call an API to save the need
  // For now we just show success and redirect
  ElMessage.success('需求发布成功！正在审核中...')
  
  // Update mock data (optional, or rely on store if using one)
  // For simplicity, we assume success and go to list
  router.push('/admin/requester/needs')
}
</script>
