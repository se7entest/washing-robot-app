<template>
  <div class="page-container">
    <div class="page-header">
      <h2>预约记录管理</h2>
      <el-button type="success" @click="handleExport" :disabled="appointments.length === 0">
        <el-icon><Download /></el-icon> 导出 CSV
      </el-button>
    </div>
    <el-table :data="appointments" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column prop="company" label="公司" width="150" />
      <el-table-column prop="date" label="预约日期" width="120" />
      <el-table-column prop="time" label="预约时间" width="150" />
      <el-table-column prop="location_name" label="地点" width="200" />
      <el-table-column label="照片" width="100">
        <template #default="{ row }">
          <span v-if="row.photos && row.photos.length > 0">{{ row.photos.length }}张</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="提交时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleView(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="预约详情" width="500px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="姓名">{{ currentAppointment?.name }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ currentAppointment?.phone }}</el-descriptions-item>
        <el-descriptions-item label="公司">{{ currentAppointment?.company || '未填写' }}</el-descriptions-item>
        <el-descriptions-item label="预约日期">{{ currentAppointment?.date }}</el-descriptions-item>
        <el-descriptions-item label="预约时间">{{ currentAppointment?.time }}</el-descriptions-item>
        <el-descriptions-item label="预约地点">{{ currentAppointment?.location_name }}</el-descriptions-item>
        <el-descriptions-item label="照片">
          <div v-if="currentAppointment?.photos?.length > 0" class="photo-grid">
            <el-image
              v-for="(photo, index) in currentAppointment.photos"
              :key="index"
              :src="photo"
              style="width: 80px; height: 80px; margin-right: 8px"
              fit="cover"
            />
          </div>
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ formatDate(currentAppointment?.created_at) }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { api } from '../api'

const appointments = ref([])
const detailVisible = ref(false)
const currentAppointment = ref(null)

onMounted(async () => {
  appointments.value = await api.getAppointments()
})

const handleView = (row) => {
  currentAppointment.value = row
  detailVisible.value = true
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const handleExport = () => {
  if (appointments.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const headers = ['姓名', '电话', '公司', '预约日期', '预约时间', '地点', '照片数量', '提交时间']
  const rows = appointments.value.map(a => [
    a.name || '',
    a.phone || '',
    a.company || '',
    a.date || '',
    a.time || '',
    a.location_name || '',
    a.photos?.length || 0,
    a.created_at ? new Date(a.created_at).toLocaleString('zh-CN') : ''
  ])

  downloadCSV(headers, rows, '预约记录')
}

const downloadCSV = (headers, rows, filename) => {
  const BOM = '﻿'
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.page-container h2 {
  margin-bottom: 20px;
  color: #333;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.page-header h2 {
  margin-bottom: 0;
}
.photo-grid {
  display: flex;
  flex-wrap: wrap;
}
</style>
