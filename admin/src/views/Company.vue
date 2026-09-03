<template>
  <div class="page-container">
    <h2>公司简介管理</h2>
    <el-form :model="form" label-width="120px" class="form-container">
      <el-form-item label="公司名称">
        <el-input v-model="form.name" placeholder="请输入公司名称" />
      </el-form-item>
      <el-form-item label="公司介绍">
        <el-input v-model="form.content" type="textarea" :rows="6" placeholder="请输入公司介绍" />
      </el-form-item>
      <el-form-item label="发展历程">
        <div class="timeline-editor">
          <div class="timeline-item" v-for="(item, index) in form.history" :key="index">
            <el-input v-model="item.year" placeholder="年份" style="width: 120px" />
            <el-input v-model="item.event" placeholder="事件描述" style="flex: 1; margin: 0 10px" />
            <el-button type="danger" circle @click="removeHistory(index)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <el-button type="primary" plain @click="addHistory">+ 添加时间节点</el-button>
        </div>
      </el-form-item>
      <el-form-item label="企业文化标题">
        <el-input v-model="form.culture_title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="企业文化内容">
        <el-input v-model="form.culture_content" type="textarea" :rows="4" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="资质证书">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="handleCertificateChange"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
        <div class="certificate-list" v-if="form.certificates.length > 0">
          <div v-for="(cert, index) in form.certificates" :key="index" class="certificate-item">
            <img :src="cert" class="certificate-preview" />
            <el-button type="danger" size="small" @click="removeCertificate(index)">删除</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { api } from '../api'

const form = ref({
  name: '',
  content: '',
  history: [],
  culture_title: '',
  culture_content: '',
  certificates: []
})

onMounted(async () => {
  const data = await api.getCompany()
  if (data) {
    // 只更新表单可编辑字段，保留原始结构
    form.value = {
      name: data.name || '',
      content: data.content || '',
      history: data.history || [],
      culture_title: data.culture_title || '',
      culture_content: data.culture_content || '',
      certificates: data.certificates || []
    }
  }
})

const addHistory = () => {
  form.value.history.push({ year: '', event: '' })
}

const removeHistory = (index) => {
  form.value.history.splice(index, 1)
}

const handleCertificateChange = async (file, fileList) => {
  const uploadFile = file.raw || file
  if (!uploadFile) return
  try {
    const url = await api.uploadImage(uploadFile)
    form.value.certificates.push(url)
    ElMessage.success('上传成功')
  } catch (err) {
    ElMessage.error('上传失败: ' + (err.message || '未知错误'))
  }
}

const removeCertificate = (index) => {
  form.value.certificates.splice(index, 1)
}

const handleSave = async () => {
  try {
    // 检查是否有Token
    const token = localStorage.getItem('github_token')
    if (!token) {
      ElMessage.error('请先在"系统设置"中配置 GitHub Token')
      return
    }

    // 构建完整数据，保留 updated_at 以外的原始字段
    const currentData = await api.getCompany()
    const saveData = {
      ...currentData,
      name: form.value.name,
      content: form.value.content,
      history: form.value.history,
      culture_title: form.value.culture_title,
      culture_content: form.value.culture_content,
      certificates: form.value.certificates,
      updated_at: new Date().toISOString()
    }
    await api.saveCompany(saveData)
    ElMessage.success('保存成功')
  } catch (err) {
    console.error('保存失败:', err)
    ElMessage.error('保存失败: ' + (err.message || '请检查网络或Token配置'))
  }
}
</script>

<style scoped>
.page-container h2 {
  margin-bottom: 20px;
  color: #333;
}
.form-container {
  max-width: 800px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
.timeline-editor {
  width: 100%;
}
.timeline-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.certificate-list {
  margin-top: 10px;
}
.certificate-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.certificate-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
}
</style>
