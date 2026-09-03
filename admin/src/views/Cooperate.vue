<template>
  <div class="page-container">
    <div class="page-header">
      <h2>合作意向管理</h2>
      <el-button type="success" @click="handleExport" :disabled="cooperations.length === 0">
        <el-icon><Download /></el-icon> 导出 CSV
      </el-button>
    </div>
    <el-table :data="cooperations" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column prop="company" label="公司" width="150" />
      <el-table-column prop="type" label="合作类型" width="120" />
      <el-table-column prop="description" label="意向描述" />
      <el-table-column prop="created_at" label="提交时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.created_at) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { api } from '../api'

const cooperations = ref([])

onMounted(async () => {
  cooperations.value = await api.getCooperations()
})

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN')
}

const handleExport = () => {
  if (cooperations.value.length === 0) {
    ElMessage.warning('暂无数据可导出')
    return
  }

  const headers = ['姓名', '电话', '公司', '合作类型', '意向描述', '提交时间']
  const rows = cooperations.value.map(c => [
    c.name || '',
    c.phone || '',
    c.company || '',
    c.type || '',
    c.description || '',
    c.created_at ? new Date(c.created_at).toLocaleString('zh-CN') : ''
  ])

  downloadCSV(headers, rows, '合作意向')
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
</style>
