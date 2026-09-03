<template>
  <div class="page-container">
    <div class="page-header">
      <h2>最新动态</h2>
      <el-button type="primary" @click="handleAdd" style="margin-bottom: 20px">
        <el-icon><Plus /></el-icon> 添加动态
      </el-button>
    </div>

    <el-table :data="news" style="width: 100%">
      <el-table-column label="类型" width="80">
        <template #default="{ row }">
          <el-tag :type="getTypeTag(row.type)" size="small">{{ getTypeLabel(row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="content" label="内容" min-width="260" show-overflow-tooltip />
      <el-table-column prop="date" label="日期" width="110" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio-button value="article">📰 文章</el-radio-button>
            <el-radio-button value="video">🎬 视频</el-radio-button>
            <el-radio-button value="device">🤖 设备</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入内容描述" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.cover" placeholder="图片URL（可选）" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { api } from '../api'

const news = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加动态')
const editingId = ref(null)
const saving = ref(false)

const form = ref({
  type: 'article',
  title: '',
  content: '',
  cover: '',
  date: ''
})

onMounted(async () => {
  news.value = await api.getNews()
})

const getTypeLabel = (type) => {
  const map = { article: '文章', video: '视频', device: '设备' }
  return map[type] || type
}

const getTypeTag = (type) => {
  const map = { article: '', video: 'danger', device: 'success' }
  return map[type] || ''
}

const handleAdd = () => {
  editingId.value = null
  dialogTitle.value = '添加动态'
  form.value = { type: 'article', title: '', content: '', cover: '', date: '' }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editingId.value = row._id
  dialogTitle.value = '编辑动态'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该动态吗？', '提示', { type: 'warning' })
    await api.deleteNews(id)
    news.value = await api.getNews()
    ElMessage.success('删除成功')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSave = async () => {
  if (!form.value.title) {
    ElMessage.warning('请输入标题')
    return
  }
  saving.value = true
  try {
    const data = { ...form.value }
    if (!data.date) data.date = new Date().toISOString().split('T')[0]
    if (editingId.value) data._id = editingId.value
    await api.saveNews(data)
    news.value = await api.getNews()
    dialogVisible.value = false
    ElMessage.success('保存成功')
  } catch (err) {
    ElMessage.error('保存失败: ' + err.message)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
}
.page-header {
  margin-bottom: 20px;
}
.page-header h2 {
  color: #333;
}
</style>
