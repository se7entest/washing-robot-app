<template>
  <div class="page-container">
    <h2>设备管理</h2>
    <el-button type="primary" @click="handleAdd" style="margin-bottom: 20px">
      <el-icon><Plus /></el-icon> 添加设备
    </el-button>
    <el-table :data="devices" style="width: 100%">
      <el-table-column prop="category" label="分类" width="90">
        <template #default="{ row }">
          <el-tag :type="row.category === '飞行器' ? 'warning' : 'primary'" size="small">{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="设备名称" width="180" />
      <el-table-column label="主图" width="100">
        <template #default="{ row }">
          <el-image v-if="row.image" :src="row.image" style="width: 60px; height: 60px" fit="cover" />
          <span v-else>-</span>
        </template>
      </el-table-column>
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
        <el-form-item label="设备名称">
          <el-input v-model="form.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="主图">
          <el-upload action="#" :auto-upload="false" :on-change="handleImageChange">
            <el-button type="primary">上传图片</el-button>
          </el-upload>
          <div v-if="form.image" style="margin-top: 10px">
            <el-image :src="form.image" style="width: 100px; height: 100px" fit="cover" />
          </div>
        </el-form-item>
        <el-form-item label="分类">
          <el-radio-group v-model="form.category">
            <el-radio label="机器人">机器人</el-radio>
            <el-radio label="飞行器">飞行器</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="技术参数">
          <div class="specs-editor">
            <div class="spec-row" v-for="(spec, index) in form.specs" :key="index">
              <el-input v-model="spec.name" placeholder="参数名" style="width: 150px" />
              <el-input v-model="spec.value" placeholder="参数值" style="flex: 1; margin: 0 10px" />
              <el-button type="danger" circle @click="removeSpec(index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button type="primary" plain size="small" @click="addSpec">+ 添加参数</el-button>
          </div>
        </el-form-item>
        <el-form-item label="功能特点">
          <el-input v-model="featureInput" placeholder="输入特点后按回车添加" @keyup.enter="addFeature" />
          <div class="tags" v-if="form.features && form.features.length > 0">
            <el-tag v-for="(feat, index) in form.features" :key="index" closable @close="removeFeature(index)">
              {{ feat }}
            </el-tag>
          </div>
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
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { api } from '../api'

const devices = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加设备')
const editingId = ref(null)
const featureInput = ref('')

const form = ref({
  name: '',
  category: '机器人',
  image: '',
  specs: [],
  features: [],
  scenes: [],
  sort: 0
})

onMounted(async () => {
  devices.value = await api.getDevices()
})

const handleAdd = () => {
  editingId.value = null
  dialogTitle.value = '添加设备'
  form.value = { name: '', category: '机器人', image: '', specs: [], features: [], scenes: [], sort: 0 }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editingId.value = row._id
  dialogTitle.value = '编辑设备'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该设备吗？', '提示', { type: 'warning' })
    await api.deleteDevice(id)
    devices.value = await api.getDevices()
    ElMessage.success('删除成功')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSave = async () => {
  try {
    await api.saveDevice(form.value)
    devices.value = await api.getDevices()
    dialogVisible.value = false
    ElMessage.success('保存成功')
  } catch (err) {
    ElMessage.error('保存失败: ' + err.message)
  }
}

const addSpec = () => {
  form.value.specs.push({ name: '', value: '' })
}

const removeSpec = (index) => {
  form.value.specs.splice(index, 1)
}

const addFeature = () => {
  if (featureInput.value.trim()) {
    form.value.features.push(featureInput.value.trim())
    featureInput.value = ''
  }
}

const removeFeature = (index) => {
  form.value.features.splice(index, 1)
}

const handleImageChange = async (file, fileList) => {
  const uploadFile = file.raw || file
  if (!uploadFile) return
  try {
    const url = await api.uploadImage(uploadFile)
    form.value.image = url
    ElMessage.success('上传成功')
  } catch (err) {
    ElMessage.error('上传失败: ' + (err.message || '未知错误'))
  }
}
</script>

<style scoped>
.page-container h2 {
  margin-bottom: 20px;
  color: #333;
}
.specs-editor {
  width: 100%;
}
.spec-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.tags {
  margin-top: 10px;
}
</style>
