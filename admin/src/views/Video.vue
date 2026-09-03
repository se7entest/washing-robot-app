<template>
  <div class="page-container">
    <h2>视频管理</h2>
    <el-button type="primary" @click="handleAdd" style="margin-bottom: 20px">
      <el-icon><Plus /></el-icon> 添加视频
    </el-button>
    <el-table :data="videos" style="width: 100%">
      <el-table-column prop="title" label="标题" width="200" />
      <el-table-column prop="description" label="简介" />
      <el-table-column prop="publish_date" label="发布时间" width="120" />
      <el-table-column prop="sort" label="排序" width="80" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="视频标题">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="视频简介">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            ref="uploadRef"
            action="#"
            :auto-upload="false"
            :limit="1"
            :on-change="handleFileChange"
            accept="video/*"
          >
            <el-button type="primary">选择视频文件</el-button>
            <template #tip>
              <div class="el-upload__tip">支持 MP4 格式，上传后自动同步到仓库</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker v-model="form.publish_date" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="视频链接">
          <el-input v-model="form.video_url" placeholder="或手动输入视频链接" />
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

const videos = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('添加视频')
const editingId = ref(null)
const saving = ref(false)
const uploadRef = ref(null)
const selectedFile = ref(null)

const form = ref({
  title: '',
  video_url: '',
  description: '',
  publish_date: '',
  sort: 0
})

onMounted(async () => {
  videos.value = await api.getVideos()
})

const handleAdd = () => {
  editingId.value = null
  dialogTitle.value = '添加视频'
  form.value = { title: '', video_url: '', description: '', publish_date: '', sort: 0 }
  selectedFile.value = null
  dialogVisible.value = true
}

const handleEdit = (row) => {
  editingId.value = row._id
  dialogTitle.value = '编辑视频'
  form.value = { ...row }
  selectedFile.value = null
  dialogVisible.value = true
}

const handleFileChange = (file) => {
  selectedFile.value = file.raw
  form.value.video_url = '' // 清空手动链接，以上传为准
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该视频吗？', '提示', { type: 'warning' })
    await api.deleteVideo(id)
    videos.value = await api.getVideos()
    ElMessage.success('删除成功')
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSave = async () => {
  if (!form.value.title) {
    ElMessage.warning('请输入视频标题')
    return
  }

  saving.value = true
  try {
    let videoData = { ...form.value }

    // 如果有上传文件，先上传到 GitHub
    if (selectedFile.value) {
      const uploadResult = await api.uploadVideo(selectedFile.value)
      const fileName = uploadResult.content?.name || selectedFile.value.name
      videoData.video_url = `https://cdn.jsdelivr.net/gh/${api.GITHUB_REPO}@${api.GITHUB_BRANCH}/miniprogram/assets/videos/${fileName}`
      videoData.thumbnail = videoData.video_url
    }

    if (editingId.value) {
      videoData._id = editingId.value
    }
    videoData.publish_date = videoData.publish_date || new Date().toISOString().split('T')[0]

    await api.saveVideo(videoData)
    videos.value = await api.getVideos()
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
.page-container h2 {
  margin-bottom: 20px;
  color: #333;
}
</style>
