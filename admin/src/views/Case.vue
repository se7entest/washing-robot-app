<template>
  <div class="page-container">
    <h2>服务案例管理</h2>
    <el-button type="primary" @click="handleAdd" style="margin-bottom: 20px">
      <el-icon><Plus /></el-icon> 添加案例
    </el-button>
    <el-table :data="cases" style="width: 100%">
      <el-table-column prop="title" label="标题" width="200" />
      <el-table-column label="图片" width="100">
        <template #default="{ row }">
          <el-image v-if="row.image" :src="row.image" style="width: 60px; height: 60px" fit="cover" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="location" label="地点" width="150" />
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="案例标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="案例图片">
          <el-upload action="#" :auto-upload="false" :on-change="handleImageChange">
            <el-button type="primary">上传图片</el-button>
          </el-upload>
          <div v-if="form.image" style="margin-top: 10px">
            <el-image :src="form.image" style="width: 100px; height: 100px" fit="cover" />
          </div>
        </el-form-item>
        <el-form-item label="项目地点">
          <el-input v-model="form.location" placeholder="请输入地点" />
        </el-form-item>
        <el-form-item label="项目日期">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="项目挑战">
          <el-input v-model="form.challenge" type="textarea" :rows="3" placeholder="请输入挑战描述" />
        </el-form-item>
        <el-form-item label="解决方案">
          <el-input v-model="form.solution" type="textarea" :rows="3" placeholder="请输入解决方案" />
        </el-form-item>
        <el-form-item label="客户评价">
          <el-input v-model="form.review" type="textarea" :rows="2" placeholder="请输入客户评价（可选）" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { api } from '../api'

const cases = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加案例')
const editingId = ref(null)

const form = ref({
  title: '',
  image: '',
  location: '',
  date: '',
  challenge: '',
  solution: '',
  review: '',
  sort: 0
})

onMounted(async () => {
  cases.value = await api.getCases()
})

const handleAdd = () => {
  editingId.value = null
  dialogTitle.value = '添加案例'
  form.value = { title: '', image: '', location: '', date: '', challenge: '', solution: '', review: '', sort: 0 }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editingId.value = row._id
  dialogTitle.value = '编辑案例'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该案例吗？', '提示', { type: 'warning' })
    await api.deleteCase(id)
    cases.value = await api.getCases()
    ElMessage.success('删除成功')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSave = async () => {
  try {
    await api.saveCase(form.value)
    cases.value = await api.getCases()
    dialogVisible.value = false
    ElMessage.success('保存成功')
  } catch (err) {
    ElMessage.error('保存失败: ' + err.message)
  }
}

const handleImageChange = (file) => {
  form.value.image = file.url || 'https://placeholder.image/case.png'
}
</script>

<style scoped>
.page-container h2 {
  margin-bottom: 20px;
  color: #333;
}
</style>
