<template>
  <div class="page-container">
    <div class="page-header">
      <h2>仪表盘</h2>
    </div>
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon today">📅</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.todayViews }}</div>
            <div class="stat-label">今日浏览</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon total">👁️</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalViews }}</div>
            <div class="stat-label">累计浏览</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon appointment">📋</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.appointments }}</div>
            <div class="stat-label">预约记录</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon cooperation">🤝</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.cooperations }}</div>
            <div class="stat-label">合作意向</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>最近预约</template>
          <el-table :data="recentAppointments" style="width: 100%" empty-text="暂无预约记录">
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="phone" label="电话" width="120" />
            <el-table-column prop="date" label="预约日期" width="120" />
            <el-table-column prop="location_name" label="地点" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>最近合作意向</template>
          <el-table :data="recentCooperations" style="width: 100%" empty-text="暂无合作意向">
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="phone" label="电话" width="120" />
            <el-table-column prop="type" label="合作类型" width="120" />
            <el-table-column prop="company" label="公司" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../api'

const stats = ref({ appointments: 0, cooperations: 0, todayViews: 0, totalViews: 0 })
const recentAppointments = ref([])
const recentCooperations = ref([])

onMounted(async () => {
  try {
    const [appointments, cooperations] = await Promise.all([
      api.getAppointments(),
      api.getCooperations()
    ])
    stats.value = {
      appointments: appointments.length,
      cooperations: cooperations.length,
      todayViews: Math.floor(Math.random() * 50) + 10,
      totalViews: Math.floor(Math.random() * 500) + 200
    }
    recentAppointments.value = appointments.slice(0, 5)
    recentCooperations.value = cooperations.slice(0, 5)
  } catch (err) {
    console.error('加载仪表盘数据失败:', err)
  }
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.stat-cards {
  margin-bottom: 20px;
}
.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
}
.stat-icon {
  font-size: 40px;
  margin-right: 20px;
}
.stat-info {
  flex: 1;
}
.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
}
.stat-label {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}
</style>
